<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil skpd_id dari tabel skpd (hasil seeder pertama)
        $skpdId = DB::table('skpd')->first()->id ?? null;

        DB::table('users')->insert([
            'name' => 'Super Admin',
            'email' => 'admin@acehprov.go.id',
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
            'skpd_id' => $skpdId,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
