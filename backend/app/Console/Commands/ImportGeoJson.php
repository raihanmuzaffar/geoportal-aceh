<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use App\Models\Layer;
use Illuminate\Support\Str;
use JsonMachine\Items;
use JsonMachine\JsonDecoder\ExtJsonDecoder; // <-- Tambahan Decoder

class ImportGeoJson extends Command
{
    protected $signature = 'geojson:import';
    protected $description = 'Mengimpor file GeoJSON ke PostGIS';

    public function handle()
    {
        ini_set('memory_limit', '-1');
        set_time_limit(0);

        $path = base_path('data-gis');

        if (!File::exists($path)) {
            $this->error("Folder 'data-gis' tidak ditemukan.");
            return;
        }

        $files = File::files($path);
        $this->info("Ditemukan " . count($files) . " file. Memulai impor...");

        foreach ($files as $file) {
            if ($file->getExtension() !== 'geojson') continue;

            $filename = $file->getFilenameWithoutExtension();

            if (Layer::where('name', $filename)->exists()) {
                $this->warn("  -> Dilewati: '{$filename}' sudah ada.");
                continue;
            }

            $this->info("Memproses: {$filename}...");

            try {
                // 1. Cek tipe geometri dari fitur pertama
                $geomType = 'Polygon';
                $items = Items::fromFile($file->getRealPath(), [
                    'pointer' => '/features',
                    'decoder' => new ExtJsonDecoder(true) // <-- true = Array, false = Object
                ]);

                foreach ($items as $firstFeature) {
                    $geomType = $firstFeature['geometry']['type'] ?? 'Polygon';
                    break;
                }

                $style = ['color' => '#1e40af', 'weight' => 2, 'fillOpacity' => 0.2];
                if (in_array($geomType, ['LineString', 'MultiLineString'])) {
                    $style = ['color' => '#b91c1c', 'weight' => 2, 'fillOpacity' => 0];
                } elseif (in_array($geomType, ['Point', 'MultiPoint'])) {
                    $style = ['color' => '#ea580c', 'weight' => 2, 'fillOpacity' => 1];
                }

                $layer = Layer::create([
                    'dataset_id' => null,
                    'name' => $filename,
                    'slug' => Str::slug($filename) . '-' . Str::random(5),
                    'geometry_type' => $geomType,
                    'srid' => 4326,
                    'feature_count' => 0,
                    'is_reference' => true,
                    'is_visible_by_default' => false,
                    'style' => $style,
                ]);

                $this->info("  -> Membaca dan menyimpan fitur (Streaming)...");

                // 2. Proses Streaming dengan Decoder Array
                $items = Items::fromFile($file->getRealPath(), [
                    'pointer' => '/features',
                    'decoder' => new ExtJsonDecoder(true) // <-- true = Array
                ]);

                $count = 0;
                DB::beginTransaction();

                foreach ($items as $feature) {
                    $geomJson = json_encode($feature['geometry']);
                    $properties = json_encode($feature['properties'] ?? []);

                    DB::statement("
                        INSERT INTO layer_geometries (layer_id, properties, geom, created_at, updated_at)
                        VALUES (?, ?, ST_SetSRID(ST_GeomFromGeoJSON(?), 4326), NOW(), NOW())
                    ", [
                        $layer->id,
                        $properties,
                        $geomJson
                    ]);

                    $count++;

                    if ($count % 1000 == 0) {
                        $this->output->write(".");
                    }

                    if ($count % 5000 == 0) {
                        DB::commit();
                        DB::beginTransaction();
                    }
                }

                DB::commit();
                $layer->update(['feature_count' => $count]);
                $this->info("\n  -> Sukses: {$count} fitur berhasil disimpan.\n");

            } catch (\Exception $e) {
                DB::rollBack();
                $this->error("  -> Gagal memproses {$filename}: " . $e->getMessage());
            }
        }

        $this->info("🎉 Selesai!");
    }
}
