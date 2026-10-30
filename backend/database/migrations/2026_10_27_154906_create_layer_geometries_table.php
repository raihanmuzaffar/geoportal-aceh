<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Tambahkan baris ini

return new class extends Migration
{
    public function up(): void
    {
        // 1. Aktifkan ekstensi PostGIS di database
        DB::statement('CREATE EXTENSION IF NOT EXISTS postgis;');

        Schema::create('layer_geometries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('layer_id')->constrained('layers')->cascadeOnDelete();
            $table->jsonb('properties')->nullable();

            // Tipe GEOMETRY, SRID 4326 (WGS84 / Koordinat Bumi)
            $table->geometry('geom', 'GEOMETRY', 4326);

            $table->timestamps();
        });

        // 2. Tambahkan Index GIST (Sangat penting agar peta tidak lemot)
        DB::statement('CREATE INDEX layer_geometries_geom_idx ON layer_geometries USING GIST (geom);');
    }

    public function down(): void
    {
        Schema::dropIfExists('layer_geometries');
    }
};
