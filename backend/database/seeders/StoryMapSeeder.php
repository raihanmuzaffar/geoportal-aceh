<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\StoryMap;
use App\Models\StoryMapStep;
use Illuminate\Support\Str;

class StoryMapSeeder extends Seeder
{
    public function run(): void
    {
        $story = StoryMap::create([
            'title' => 'Jejak Sejarah Tsunami Aceh',
            'slug' => 'jejak-sejarah-tsunami-aceh',
            'description' => 'Menelusuri kembali peristiwa tsunami 2004 dan bagaimana Aceh bangkit membangun kembali wilayahnya.',
            'cover_url' => 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
            'is_published' => true,
        ]);

        $steps = [
            [
                'step_order' => 1,
                'title' => 'Pusat Gempa Megathrust',
                'content' => 'Pada 26 Desember 2004, gempa berkekuatan 9.1 SR mengguncang dasar Samudra Hindia, tepat di lepas pantai barat Sumatera. Peta ini menunjukkan pusat gempa yang memicu gelombang raksasa.',
                'center_lng' => 95.854,
                'center_lat' => 3.316,
                'zoom' => 6,
            ],
            [
                'step_order' => 2,
                'title' => 'Banda Aceh Luluh Lantak',
                'content' => 'Gelombang tsunami setinggi 30 meter menghantam Kota Banda Aceh hanya dalam waktu 30 menit. Kawasan pesisir mengalami kerusakan paling parah.',
                'center_lng' => 95.3238,
                'center_lat' => 5.5483,
                'zoom' => 11,
            ],
            [
                'step_order' => 3,
                'title' => 'Kebangkitan Kota Meulaboh',
                'content' => 'Meulaboh adalah salah satu kota yang paling dekat dengan pusat gempa. Hari ini, kota ini menjadi simbol kebangkitan dan ketangguhan masyarakat Aceh.',
                'center_lng' => 96.1285,
                'center_lat' => 4.1363,
                'zoom' => 12,
            ]
        ];

        foreach ($steps as $step) {
            StoryMapStep::create(array_merge($step, ['story_map_id' => $story->id]));
        }
    }
}
