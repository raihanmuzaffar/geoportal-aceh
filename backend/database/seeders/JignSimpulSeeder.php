<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\JignSimpul;

class JignSimpulSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['name' => 'Badan Informasi Geospasial', 'type' => 'Kementerian / Lembaga', 'description' => 'Simpul Penghubung Jaringan Informasi Geospasial Nasional', 'technology' => 'ArcGIS REST'],
            ['name' => 'Provinsi Aceh', 'type' => 'Provinsi', 'description' => 'Simpul Jaringan Pemerintah Provinsi Aceh', 'technology' => 'GeoServer - CSW'],
            ['name' => 'Kementerian Dalam Negeri', 'type' => 'Kementerian / Lembaga', 'description' => 'Simpul Jaringan Kementerian Dalam Negeri Republik Indonesia', 'technology' => 'ArcGIS REST'],
            ['name' => 'Lembaga Penerbangan dan Antariksa Nasional', 'type' => 'Kementerian / Lembaga', 'description' => 'Simpul Jaringan Lembaga Penerbangan dan Antariksa Nasional', 'technology' => 'ArcGIS REST'],
            ['name' => 'Badan Nasional Penanggulangan Bencana', 'type' => 'Kementerian / Lembaga', 'description' => 'Simpul Jaringan Badan Nasional Penanggulangan Bencana', 'technology' => 'ArcGIS REST'],
            ['name' => 'Kota Banda Aceh', 'type' => 'Kabupaten / Kota', 'description' => 'Simpul Jaringan Pemerintah Kota Banda Aceh', 'technology' => 'ArcGIS REST'],
            ['name' => 'Kabupaten Aceh Besar', 'type' => 'Kabupaten / Kota', 'description' => 'Simpul Jaringan Pemerintah Kabupaten Aceh Besar', 'technology' => 'GeoServer'],
            ['name' => 'Kementerian PUPR', 'type' => 'Kementerian / Lembaga', 'description' => 'Simpul Jaringan Kementerian Pekerjaan Umum dan Perumahan Rakyat', 'technology' => 'ArcGIS REST'],
        ];

        foreach ($data as $item) {
            JignSimpul::create($item);
        }
    }
}
