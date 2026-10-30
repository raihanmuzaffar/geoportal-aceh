<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatasetSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('datasets')->insert([
            [
                'title' => 'Batas Wilayah Administrasi Aceh',
                'slug' => 'batas-wilayah-aceh',
                'description' => 'Peta batas administrasi Provinsi Aceh, Kabupaten/Kota, dan Kecamatan.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80',
                'category_id' => 1,
                'skpd_id' => 1,
                'mode' => 'layers',
                'is_featured' => true,
                'is_published' => true,
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Jaringan Jalan Provinsi Aceh 2025',
                'slug' => 'jaringan-jalan-aceh',
                'description' => 'Data spasial jaringan jalan nasional dan provinsi di Aceh.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80',
                'category_id' => 2,
                'skpd_id' => 1,
                'mode' => 'layers',
                'is_featured' => false,
                'is_published' => true,
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Sebaran Titik Rawan Bencana Aceh',
                'slug' => 'rawan-bencana-aceh',
                'description' => 'Peta kawasan rawan bencana gempa dan tsunami di Provinsi Aceh.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80',
                'category_id' => 9,
                'skpd_id' => 1,
                'mode' => 'layers',
                'is_featured' => true,
                'is_published' => true,
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
