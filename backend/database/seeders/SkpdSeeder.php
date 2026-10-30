<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkpdSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('skpd')->insert([
            'name' => 'Dinas Komunikasi, Informatika dan Persandian Aceh',
            'short_name' => 'Diskominfo Aceh',
            'email' => 'diskominfo@acehprov.go.id',
            'phone' => '(0651) 4789937',
            'address' => 'Jl. Tgk. H. M. Daud Beureueh No. 25, Banda Aceh',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
