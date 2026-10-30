<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('layers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dataset_id')->nullable()->constrained('datasets')->cascadeOnDelete();
            $table->string('name', 200);
            $table->string('slug', 200)->unique();
            $table->enum('geometry_type', ['Point', 'LineString', 'Polygon', 'MultiPolygon'])->default('Polygon');
            $table->integer('srid')->default(4326);
            $table->integer('feature_count')->default(0);
            $table->boolean('is_reference')->default(false);
            $table->boolean('is_visible_by_default')->default(false);
            $table->integer('sort_order')->default(0);
            $table->jsonb('style')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('layers');
    }
};
