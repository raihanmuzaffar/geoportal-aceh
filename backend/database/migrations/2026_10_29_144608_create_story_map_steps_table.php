<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('story_map_steps', function (Blueprint $table) {
        $table->id();
        $table->foreignId('story_map_id')->constrained()->cascadeOnDelete();
        $table->integer('step_order');
        $table->string('title');
        $table->text('content');
        $table->decimal('center_lng', 10, 7); // Koordinat Peta
        $table->decimal('center_lat', 10, 7);
        $table->integer('zoom')->default(10);
        $table->jsonb('layer_ids')->nullable(); // Layer apa saja yang menyala
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('story_map_steps');
    }
};
