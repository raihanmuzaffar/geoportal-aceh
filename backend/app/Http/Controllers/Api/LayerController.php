<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dataset;
use App\Models\Layer;
use App\Models\LayerGeometry;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class LayerController extends Controller
{
    // Rute untuk mengambil semua layer
    public function index()
    {
        $layers = Layer::with(['dataset.category', 'dataset.skpd'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['success' => true, 'data' => $layers]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'dataset_id' => 'nullable|exists:datasets,id',
            'name' => 'required|string|max:200',
            'geojson_file' => 'required|file|mimes:json,geojson,txt|max:51200', // Max 50MB
        ]);

        $file = $request->file('geojson_file');
        $jsonContent = file_get_contents($file->getRealPath());
        $geojson = json_decode($jsonContent, true);

        if (!$geojson || !isset($geojson['features'])) {
            return response()->json(['success' => false, 'message' => 'Format file GeoJSON tidak valid.'], 422);
        }

        $features = $geojson['features'];
        $featureCount = count($features);
        $geomType = $features[0]['geometry']['type'] ?? 'Polygon';

        $style = ['color' => '#1e40af', 'weight' => 2, 'fillOpacity' => 0.2];
        if ($geomType === 'LineString' || $geomType === 'MultiLineString') {
            $style = ['color' => '#b91c1c', 'weight' => 3, 'fillOpacity' => 0];
        } elseif ($geomType === 'Point' || $geomType === 'MultiPoint') {
            $style = ['color' => '#ea580c', 'weight' => 2, 'fillOpacity' => 1];
        }

        $layer = Layer::create([
            'dataset_id' => $request->dataset_id,
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(5),
            'geometry_type' => $geomType,
            'srid' => 4326,
            'feature_count' => $featureCount,
            'is_reference' => true,
            'is_visible_by_default' => false,
            'style' => $style,
        ]);

        foreach ($features as $feature) {
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
        }

        return response()->json([
            'success' => true,
            'data' => $layer,
            'message' => "Berhasil mengimpor {$featureCount} fitur spasial."
        ], 201);
    }

    // Rute untuk mengambil data GeoJSON yang akan dirender di Peta
    public function showGeojson($id)
    {
        // 1. Naikkan limit memori sebagai jaring pengaman
        ini_set('memory_limit', '-1');
        set_time_limit(0);

        $layer = Layer::findOrFail($id);

        // 2. Gunakan fitur jsonb_agg dari PostgreSQL untuk merakit JSON secara langsung.
        // Ini jauh lebih cepat dan hemat RAM dibandingkan merakit array di PHP.
        $result = DB::selectOne("
            SELECT jsonb_agg(
                jsonb_build_object(
                    'type', 'Feature',
                    'geometry', ST_AsGeoJSON(geom)::jsonb,
                    'properties', COALESCE(properties, '{}'::jsonb)
                )
            ) as features
            FROM layer_geometries
            WHERE layer_id = ?
        ", [$id]);

        // 3. Decode hasil dari PostgreSQL (jika kosong, jadikan array kosong)
        $features = json_decode($result->features ?? '[]');

        return response()->json([
            'type' => 'FeatureCollection',
            'name' => $layer->name,
            'features' => $features,
            'style' => $layer->style
        ]);
    }

    public function destroy($id)
    {
        $layer = Layer::findOrFail($id);
        $layer->delete();
        return response()->json(['success' => true, 'message' => 'Layer berhasil dihapus']);
    }
}
