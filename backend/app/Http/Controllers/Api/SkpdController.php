<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skpd;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SkpdController extends Controller
{
    public function index()
    {
        $skpd = Skpd::withCount('datasets')->get();
        return response()->json(['success' => true, 'data' => $skpd]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:150',
            'short_name' => 'required|string|max:50',
            'logo_url' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:150',
        ]);

        $skpd = Skpd::create($request->all());

        return response()->json(['success' => true, 'data' => $skpd, 'message' => 'Instansi berhasil ditambahkan'], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:150',
            'short_name' => 'required|string|max:50',
            'logo_url' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:150',
        ]);

        $skpd = Skpd::findOrFail($id);
        $skpd->update($request->all());

        return response()->json(['success' => true, 'data' => $skpd, 'message' => 'Instansi berhasil diupdate']);
    }

    public function destroy($id)
    {
        $skpd = Skpd::findOrFail($id);

        // Cek jika SKPD masih memiliki dataset
        if ($skpd->datasets()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Instansi tidak bisa dihapus karena masih memiliki dataset.'
            ], 400);
        }

        $skpd->delete();
        return response()->json(['success' => true, 'message' => 'Instansi berhasil dihapus']);
    }
}
