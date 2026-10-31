<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{
    public function index()
    {
        // Mengambil semua pengaturan dan mengubahnya menjadi format key => value
        $settings = DB::table('settings')->pluck('value', 'key');
        return response()->json(['success' => true, 'data' => $settings]);
    }

    public function update(Request $request)
    {
        // Menerima array key => value dari frontend
        $data = $request->except('_token');

        foreach ($data as $key => $value) {
            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'updated_at' => now(), 'created_at' => now()]
            );
        }

        return response()->json(['success' => true, 'message' => 'Pengaturan berhasil disimpan']);
    }
}
