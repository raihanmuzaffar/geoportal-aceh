<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Batas Wilayah', 'slug' => 'batas-wilayah', 'icon' => 'map'],
            ['name' => 'Transportasi', 'slug' => 'transportasi', 'icon' => 'bus'],
            ['name' => 'Hidrografi', 'slug' => 'hidrografi', 'icon' => 'water'],
            ['name' => 'Vegetasi', 'slug' => 'vegetasi', 'icon' => 'tree'],
            ['name' => 'Geologi', 'slug' => 'geologi', 'icon' => 'mountain'],
            ['name' => 'Tanah', 'slug' => 'tanah', 'icon' => 'layers'],
            ['name' => 'Toponimi', 'slug' => 'toponimi', 'icon' => 'map-pin'],
            ['name' => 'Kadaster', 'slug' => 'kadaster', 'icon' => 'building'],
            ['name' => 'Kebencanaan', 'slug' => 'kebencanaan', 'icon' => 'alert-triangle'],
            ['name' => 'Dataset Khusus', 'slug' => 'dataset-khusus', 'icon' => 'pie-chart'],
        ];

        foreach ($categories as $index => $cat) {
            DB::table('categories')->insert([
                'name' => $cat['name'],
                'slug' => $cat['slug'],
                'icon' => $cat['icon'],
                'sort_order' => $index,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
