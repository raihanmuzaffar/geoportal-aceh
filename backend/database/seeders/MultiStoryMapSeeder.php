<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StoryMap;
use App\Models\StoryMapStep;

class MultiStoryMapSeeder extends Seeder
{
    public function run(): void
    {
        StoryMap::query()->delete();

        // ============================================================
        // STORY MAP 1: SEJARAH KESULTANAN ACEH DARUSSALAM
        // ============================================================
        $story1 = StoryMap::create([
            'title' => 'Sejarah Kesultanan Aceh Darussalam',
            'slug' => 'sejarah-kesultanan-aceh-darussalam',
            'description' => 'Menelusuri kejayaan Kesultanan Aceh Darussalam pada abad ke-16 hingga ke-17, dari pusat pemerintahan di Banda Aceh hingga wilayah kekuasaannya di Selat Malaka.',
            'cover_url' => 'https://images.unsplash.com/photo-1548625149-7d5a57b7c4b2?auto=format&fit=crop&w=800&q=80',
            'video_url' => 'https://www.youtube.com/embed/roiCfl3_HXU', // <-- Diperbaiki ke /embed/
            'is_published' => true,
        ]);

        $steps1 = [
            ['step_order' => 1, 'title' => 'Banda Aceh: Pusat Kesultanan', 'content' => 'Kesultanan Aceh Darussalam berdiri pada awal abad ke-16 di bawah pimpinan Sultan Ali Mughayat Syah. Ibu kotanya, Banda Aceh Darussalam, menjadi pusat perdagangan dan penyebaran agama Islam di kawasan Asia Tenggara.', 'center_lng' => 95.3238, 'center_lat' => 5.5483, 'zoom' => 12],
            ['step_order' => 2, 'title' => 'Samudera Pasai: Cikal Bakal Aceh', 'content' => 'Sebelum Kesultanan Aceh berdiri, Samudera Pasai (di Aceh Utara) telah menjadi kerajaan Islam pertama di Nusantara pada abad ke-13. Letaknya yang strategis di tepi Selat Malaka menjadikannya pelabuhan internasional.', 'center_lng' => 97.2283, 'center_lat' => 5.2167, 'zoom' => 10],
            ['step_order' => 3, 'title' => 'Selat Malaka: Jantung Perdagangan', 'content' => 'Pada masa kejayaan Sultan Iskandar Muda (1607-1636), Kesultanan Aceh menguasai jalur perdagangan Selat Malaka. Wilayah kekuasaannya membentang dari Aceh Besar hingga ke pantai barat Sumatra.', 'center_lng' => 98.6667, 'center_lat' => 3.7833, 'zoom' => 7],
            ['step_order' => 4, 'title' => 'Masjid Raya Baiturrahman', 'content' => 'Masjid Raya Baiturrahman didirikan pada masa Sultan Iskandar Muda dan menjadi ikon kebesaran Islam di Aceh. Masjid ini selamat dari Tsunami 2004 dan menjadi saksi bisu perjalanan panjang Kesultanan.', 'center_lng' => 95.3194, 'center_lat' => 5.5525, 'zoom' => 16],
            ['step_order' => 5, 'title' => 'Keruntuhan Kesultanan Aceh', 'content' => 'Setelah wafatnya Sultan Iskandar Muda, Kesultanan Aceh perlahan melemah akibat konflik internal dan tekanan Belanda. Perang Aceh berlangsung lebih dari 30 tahun hingga akhirnya takluk pada tahun 1903.', 'center_lng' => 95.3238, 'center_lat' => 5.5483, 'zoom' => 11],
        ];
        foreach ($steps1 as $step) { StoryMapStep::create(array_merge($step, ['story_map_id' => $story1->id])); }


        // ============================================================
        // STORY MAP 2: KAWASAN EKOSISTEM LEUSER
        // ============================================================
        $story2 = StoryMap::create([
            'title' => 'Kawasan Ekosistem Leuser: Paru-Paru Sumatra',
            'slug' => 'kawasan-ekosistem-leuser',
            'description' => 'Menjelajahi salah satu hutan tropis terluas di Asia Tenggara, rumah bagi harimau sumatra, orangutan, badak, dan gajah.',
            'cover_url' => 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
            'video_url' => 'https://www.youtube.com/embed/JEWDYs-Pe9U', // <-- Diperbaiki ke /embed/
            'is_published' => true,
        ]);

        $steps2 = [
            ['step_order' => 1, 'title' => 'Luas 2,6 Juta Hektar', 'content' => 'Kawasan Ekosistem Leuser (KEL) memiliki luas lebih dari 2,6 juta hektar. Bersama Taman Nasional Gunung Leuser, kawasan ini ditetapkan sebagai Situs Warisan Dunia UNESCO pada tahun 2004.', 'center_lng' => 97.0, 'center_lat' => 3.9, 'zoom' => 8],
            ['step_order' => 2, 'title' => 'Gunung Leuser: Puncak Tertinggi', 'content' => 'Gunung Leuser (3.404 mdpl) adalah gunung tertinggi di Provinsi Aceh dan menjadi jantung dari Kawasan Ekosistem Leuser, berada di perbatasan Kabupaten Aceh Tenggara dan Gayo Lues.', 'center_lng' => 97.1, 'center_lat' => 3.8, 'zoom' => 11],
            ['step_order' => 3, 'title' => 'Ketambe: Stasiun Penelitian', 'content' => 'Ketambe adalah salah satu stasiun penelitian orangutan tertua di dunia. Sejak 1971, peneliti dari seluruh dunia datang untuk mempelajari primata endemik Sumatra ini.', 'center_lng' => 97.65, 'center_lat' => 3.68, 'zoom' => 12],
            ['step_order' => 4, 'title' => 'Habitat Satwa Langka', 'content' => 'Leuser adalah rumah bagi 4 spesies kunci: Harimau Sumatra, Orangutan Sumatra, Badak Sumatra, dan Gajah Sumatra. Terdapat lebih dari 380 spesies burung dan 8.500 spesies tumbuhan.', 'center_lng' => 97.5, 'center_lat' => 3.5, 'zoom' => 9],
            ['step_order' => 5, 'title' => 'Ancaman dan Perlindungan', 'content' => 'Ancaman utama KEL adalah deforestasi dan pembukaan lahan sawit. Lembaga Leuser International Foundation (LIF) bekerja keras melindungi kawasan ini bersama masyarakat lokal.', 'center_lng' => 97.3, 'center_lat' => 3.7, 'zoom' => 10],
        ];
        foreach ($steps2 as $step) { StoryMapStep::create(array_merge($step, ['story_map_id' => $story2->id])); }


        // ============================================================
        // STORY MAP 3: GEMPA PIDIE JAYA 2016
        // ============================================================
        $story3 = StoryMap::create([
            'title' => 'Gempa Pidie Jaya 2016: Ketika Bumi Berguncang',
            'slug' => 'gempa-pidie-jaya-2016',
            'description' => 'Menelusuri kembali peristiwa gempa bumi 6,5 SR yang mengguncang Pidie Jaya pada 7 Desember 2016, dampaknya, dan bagaimana masyarakat bangkit kembali.',
            'cover_url' => 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80',
            'video_url' => 'https://www.youtube.com/embed/r1u1ET9LcWs', // <-- Diperbaiki ke /embed/
            'is_published' => true,
        ]);

        $steps3 = [
            ['step_order' => 1, 'title' => 'Episentrum: Pidie Jaya', 'content' => 'Pada 7 Desember 2016 pukul 05:03 WIB, gempa berkekuatan 6,5 SR mengguncang Pidie Jaya. Pusat gempa berada di darat dengan kedalaman 10 km, menyebabkan guncangan yang sangat kuat.', 'center_lng' => 96.1850, 'center_lat' => 5.2280, 'zoom' => 11],
            ['step_order' => 2, 'title' => 'Meureudu: Kota Terdampak', 'content' => 'Kecamatan Meureudu adalah wilayah yang paling parah terdampak. Lebih dari 100 orang meninggal, dan 800+ luka-luka. Ribuan rumah, masjid, dan sekolah rata dengan tanah.', 'center_lng' => 96.2340, 'center_lat' => 5.2190, 'zoom' => 13],
            ['step_order' => 3, 'title' => 'Kerusakan Infrastruktur', 'content' => 'Bencana ini menyebabkan lebih dari 11.000 rumah rusak berat. Akses jalan utama Banda Aceh-Meulaboh terputus. Pemerintah menetapkan status tanggap darurat selama 14 hari.', 'center_lng' => 96.2, 'center_lat' => 5.2, 'zoom' => 11],
            ['step_order' => 4, 'title' => 'Respons Cepat Penyelamatan', 'content' => 'BNPB, Basarnas, TNI, Polri, dan ribuan relawan bergerak cepat. Tim penyelamat bekerja 24 jam mengevakuasi korban. Masyarakat Aceh menunjukkan solidaritas luar biasa.', 'center_lng' => 96.2, 'center_lat' => 5.21, 'zoom' => 10],
            ['step_order' => 5, 'title' => 'Rekonstruksi dan Ketangguhan', 'content' => 'Rumah-rumah tahan gempa dibangun kembali, infrastruktur diperbaiki, dan sistem peringatan dini diperkuat. Pidie Jaya menjadi contoh pemulihan bencana yang tangguh.', 'center_lng' => 96.1850, 'center_lat' => 5.2280, 'zoom' => 12],
        ];
        foreach ($steps3 as $step) { StoryMapStep::create(array_merge($step, ['story_map_id' => $story3->id])); }


        // ============================================================
        // STORY MAP 4: JALUR REMPAH SAMUDERA PASAI
        // ============================================================
        $story4 = StoryMap::create([
            'title' => 'Jalur Rempah: Kejayaan Samudera Pasai',
            'slug' => 'jalur-rempah-samudera-pasai',
            'description' => 'Menelusuri rute perdagangan rempah kuno yang menghubungkan Nusantara dengan Timur Tengah, Tiongkok, dan Eropa.',
            'cover_url' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
            'video_url' => 'https://www.youtube.com/embed/fj2xxbx_OHQ', // <-- Diperbaiki ke /embed/
            'is_published' => true,
        ]);

        $steps4 = [
            ['step_order' => 1, 'title' => 'Samudera Pasai: Pelabuhan Rempah', 'content' => 'Samudera Pasai adalah pelabuhan transit rempah paling penting pada abad ke-13 hingga ke-15. Lada dari Aceh dan cengkih dari Maluku dikumpulkan di sini sebelum dikirim ke pasar dunia.', 'center_lng' => 97.2283, 'center_lat' => 5.2167, 'zoom' => 11],
            ['step_order' => 2, 'title' => 'Selat Malaka: Gerbang Rempah', 'content' => 'Selat Malaka adalah jalur pelayaran tersibuk di dunia kuno. Kapal dagang dari Arab, Persia, Gujarat, dan Tiongkok melewati selat ini untuk berdagang rempah dan sutra.', 'center_lng' => 98.0, 'center_lat' => 4.5, 'zoom' => 8],
            ['step_order' => 3, 'title' => 'Lada Aceh: Rempah Hitam Terkenal', 'content' => 'Lada hitam dari Aceh adalah rempah paling dicari di Eropa. Harganya setara dengan emas. Inilah yang memicu bangsa Eropa mencari jalur langsung ke Nusantara.', 'center_lng' => 96.5, 'center_lat' => 5.1, 'zoom' => 9],
            ['step_order' => 4, 'title' => 'Pengaruh Islam dan Budaya', 'content' => 'Bersamaan dengan perdagangan rempah, Islam menyebar ke seluruh Nusantara melalui Samudera Pasai. Aksara Jawi lahir di Aceh, dan tradisi keilmuan Islam berkembang pesat.', 'center_lng' => 97.2283, 'center_lat' => 5.2167, 'zoom' => 12],
            ['step_order' => 5, 'title' => 'Warisan Jalur Rempah Hari Ini', 'content' => 'Hari ini, Jalur Rempah diakui sebagai warisan budaya dunia. Di Aceh, jejaknya masih bisa dilihat di pelabuhan-pelabuhan tua dan tradisi perdagangan yang masih hidup.', 'center_lng' => 97.0, 'center_lat' => 5.1, 'zoom' => 8],
        ];
        foreach ($steps4 as $step) { StoryMapStep::create(array_merge($step, ['story_map_id' => $story4->id])); }


        // ============================================================
        // STORY MAP 5: KOPI GAYO WARISAN DUNIA
        // ============================================================
        $story5 = StoryMap::create([
            'title' => 'Kopi Gayo: Warisan Dunia dari Tanah Rencong',
            'slug' => 'kopi-gayo-warisan-dunia',
            'description' => 'Menjelajahi dataran tinggi Gayo, tempat lahirnya kopi arabika terbaik dunia yang telah menjadi ikon ekonomi dan budaya masyarakat Aceh Tengah.',
            'cover_url' => 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
            'video_url' => 'https://www.youtube.com/embed/WlFvme5swCA', // <-- Diperbaiki ke /embed/
            'is_published' => true,
        ]);

        $steps5 = [
            ['step_order' => 1, 'title' => 'Dataran Tinggi Gayo', 'content' => 'Dataran Tinggi Gayo terletak di ketinggian 1.200-1.500 mdpl. Iklim sejuk dan tanah vulkanik yang subur menjadikan kawasan ini ideal untuk menanam kopi arabika berkualitas tinggi.', 'center_lng' => 96.8447, 'center_lat' => 4.6335, 'zoom' => 11],
            ['step_order' => 2, 'title' => 'Takengon: Ibu Kota Kopi', 'content' => 'Takengon adalah pusat industri kopi Gayo. Hampir 80% penduduknya bergantung pada kopi. Danau Laut Tawar menjadi saksi bagaimana kopi menjadi nadi perekonomian masyarakat Gayo.', 'center_lng' => 96.8447, 'center_lat' => 4.6335, 'zoom' => 13],
            ['step_order' => 3, 'title' => 'Kopi Arabika Terbaik Dunia', 'content' => 'Kopi Arabika Gayo memiliki cita rasa unik: aroma kuat, keasaman medium, dan sentuhan rempah. Kopi ini diekspor ke Amerika Serikat, Jepang, dan Eropa dengan harga premium.', 'center_lng' => 96.8, 'center_lat' => 4.65, 'zoom' => 12],
            ['step_order' => 4, 'title' => 'Bener Meriah: Kabupaten Kopi', 'content' => 'Kabupaten Bener Meriah adalah salah satu daerah penghasil kopi Gayo terbesar. Perkebunan kopi tersebar di lereng-lereng bukit, menciptakan pemandangan hijau yang memukau.', 'center_lng' => 96.85, 'center_lat' => 4.75, 'zoom' => 11],
            ['step_order' => 5, 'title' => 'Kopi untuk Kesejahteraan', 'content' => 'Kopi Gayo telah mengangkat ekonomi ribuan petani Aceh. Melalui koperasi dan Fair Trade, para petani kini mendapatkan harga yang lebih adil. Kopi adalah simbol kebangkitan ekonomi Aceh.', 'center_lng' => 96.85, 'center_lat' => 4.65, 'zoom' => 10],
        ];
        foreach ($steps5 as $step) { StoryMapStep::create(array_merge($step, ['story_map_id' => $story5->id])); }

        $this->command->info('✅ 5 Story Maps beserta videonya berhasil dibuat!');
    }
}
