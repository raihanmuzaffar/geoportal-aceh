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
    Schema::create('news', function (Blueprint $table) {
        $table->id();
        $table->string('title', 200);
        $table->string('slug', 200)->unique();
        $table->text('excerpt')->nullable(); // Ringkasan
        $table->longText('content');         // Isi berita
        $table->string('thumbnail_url')->nullable();
        $table->enum('type', ['news', 'agenda'])->default('news');
        $table->date('event_date')->nullable(); // Khusus Agenda
        $table->boolean('is_published')->default(true);
        $table->foreignId('created_by')->constrained('users');
        $table->timestamps();
        $table->softDeletes();
    });
}

public function down(): void
{
    Schema::dropIfExists('news');
}
};
