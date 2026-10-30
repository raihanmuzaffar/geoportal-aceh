<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StoryMap;
use App\Models\StoryMapStep;
use Illuminate\Support\Str;

class StoryMapTsunamiSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus data story map lama agar tidak duplikat
        StoryMap::where('slug', 'jejak-sejarah-tsunami-aceh')->delete();

        $story = StoryMap::create([
            'title' => 'Jejak Sejarah Tsunami Aceh 2004',
            'slug' => 'jejak-sejarah-tsunami-aceh',
            'description' => 'Menelusuri kembali peristiwa gempa dan tsunami Samudra Hindia 2004, dari pusat gempa di lepas pantai hingga bagaimana Aceh bangkit membangun kembali wilayahnya.',
            'cover_url' => 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',

            // TAMBAHAN: Link video dokumenter (Ganti dengan link YouTube favorit Anda)
            'video_url' => 'https://www.youtube.com/embed/JLGT8pa8t-I',

            'is_published' => true,
        ]);

        $steps = [
            [
                'step_order' => 1,
                'title' => 'Episentrum: Gempa Megathrust 9,1 SR',
                'content' => 'Pada 26 Desember 2004, pukul 07:58 WIB, gempa bumi berkekuatan 9,1 Skala Richter mengguncang dasar Samudra Hindia. Pusat gempa berada pada koordinat 3,316° Lintang Utara dan 95,854° Bujur Timur, sekitar 250 km sebelah selatan Banda Aceh. Pergeseran lempeng India dan Myanmar sepanjang 1.200 km memicu patahan besar yang menggetarkan bumi dan memicu gelombang tsunami raksasa.',
                'center_lng' => 95.854,
                'center_lat' => 3.316,
                'zoom' => 6,
            ],
            [
                'step_order' => 2,
                'title' => 'Banda Aceh: Gelombang Setinggi 30 Meter',
                'content' => 'Hanya dalam waktu 15-30 menit setelah gempa, gelombang tsunami setinggi 15 hingga 30 meter menghantam pesisir Banda Aceh. Air laut yang sempat surut hingga 200 meter dari garis pantai tiba-tiba menggulung daratan dengan kecepatan sekitar 500 km/jam. Kawasan pesisir hancur total, ribuan bangunan rata dengan tanah, dan sekitar sepertiga populasi kota kehilangan nyawa.',
                'center_lng' => 95.3238,
                'center_lat' => 5.5483,
                'zoom' => 11,
            ],
            [
                'step_order' => 3,
                'title' => 'Meulaboh: Kota yang Tertimbun Lumpur',
                'content' => 'Meulaboh, ibu kota Kabupaten Aceh Barat, adalah salah satu kota terdekat dengan episentrum. Gelombang tsunami menghantam kota ini dengan sangat dahsyat, menghancurkan permukiman, pasar, dan infrastruktur jalan. Ribuan jiwa melayang, dan sebagian besar bangunan di kawasan pesisir tidak tersisa. Hingga kini, Meulaboh menjadi simbol ketangguhan masyarakat pesisir barat Aceh.',
                'center_lng' => 96.1285,
                'center_lat' => 4.1363,
                'zoom' => 12,
            ],
            [
                'step_order' => 4,
                'title' => 'Calang: 70% Penduduk Hilang',
                'content' => 'Di Kabupaten Aceh Jaya, tepatnya di Kota Calang, dampak tsunami terasa begitu mengerikan. Diperkirakan 70% populasi Calang meninggal dunia saat gelombang menerjang. Seluruh infrastruktur kota hancur, dan akses jalan pesisir dari Banda Aceh menuju Calang benar-benar terputus. Hanya sekitar 18% penduduk yang tersisa dua minggu setelah bencana.',
                'center_lng' => 95.6833,
                'center_lat' => 4.6333,
                'zoom' => 12,
            ],
            [
                'step_order' => 5,
                'title' => 'Skala Kerusakan: 800 Kilometer Pesisir',
                'content' => 'Tsunami tidak hanya menghantam satu titik, tetapi merusak sekitar 800 kilometer garis pantai Aceh—setara dengan jarak Jakarta ke Surabaya. Kerusakan menjangkau hingga 6 kilometer ke arah daratan. Sekitar 139.000 rumah rusak, 2.618 km jalan mengalami kerusakan, 3.415 sekolah hancur, dan lebih dari 200 fasilitas kesehatan tidak bisa digunakan. Bencana ini menewaskan lebih dari 220.000 jiwa di berbagai negara.',
                'center_lng' => 96.0,
                'center_lat' => 4.5,
                'zoom' => 8,
            ],
            [
                'step_order' => 6,
                'title' => 'Kebangkitan: BRR dan Rekonstruksi Aceh',
                'content' => 'Pemerintah membentuk Badan Rehabilitasi dan Rekonstruksi (BRR) NAD-Nias untuk mengoordinasikan pemulihan. Selama beberapa tahun, ratusan ribu rumah dibangun kembali, jalan dan jembatan diperbaiki, serta sekolah dan rumah sakit dipulihkan. Aceh tidak hanya bangkit, tetapi juga menata kembali kotanya dengan lebih baik—sebuah bukti ketangguhan dan gotong royong luar biasa.',
                'center_lng' => 95.3238,
                'center_lat' => 5.5483,
                'zoom' => 10,
            ],
        ];

        foreach ($steps as $step) {
            StoryMapStep::create(array_merge($step, ['story_map_id' => $story->id]));
        }
    }
}
