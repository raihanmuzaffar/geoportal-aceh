<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('datasets', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('slug', 200)->unique();
            $table->text('description');
            $table->text('abstract')->nullable();
            $table->text('thumbnail_url')->nullable();
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('skpd_id')->constrained('skpd');
            $table->enum('mode', ['layers', 'dashboard', 'cartography'])->default('layers');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes(); // Menambahkan deleted_at untuk soft delete
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('datasets');
    }
};
