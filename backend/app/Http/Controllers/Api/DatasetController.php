<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dataset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class DatasetController extends Controller
{
    public function index(Request $request)
    {
        $query = Dataset::with(['category', 'skpd'])->where('is_published', true);

        // ============================================================
        // ROLE MANAGEMENT: Filter Dataset untuk Operator
        // ============================================================
        // Jika yang request adalah operator, batasi hanya dataset SKPD-nya
        if (auth('sanctum')->check() && auth('sanctum')->user()->role === 'operator') {
            $query->where('skpd_id', auth('sanctum')->user()->skpd_id);
        }

        // Fitur Pencarian
        if ($request->filled('search')) {
            $query->where('title', 'ilike', '%' . $request->search . '%');
        }

        // Fitur Filter Kategori
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Fitur Filter SKPD (Manual dari Frontend)
        if ($request->filled('skpd_id')) {
            $query->where('skpd_id', $request->skpd_id);
        }

        // Pagination (12 data per halaman)
        $datasets = $query->orderBy('created_at', 'desc')->paginate(12);

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $datasets->items(),
            'meta' => [
                'current_page' => $datasets->currentPage(),
                'per_page' => $datasets->perPage(),
                'total' => $datasets->total(),
                'last_page' => $datasets->lastPage(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'skpd_id' => 'required|exists:skpd,id',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $thumbnailUrl = null;

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $thumbnailUrl = url('storage/' . $path);
        }

        // ============================================================
        // ROLE MANAGEMENT: Paksa SKPD ID untuk Operator
        // ============================================================
        $finalSkpdId = $request->skpd_id;
        if (auth('sanctum')->check() && auth('sanctum')->user()->role === 'operator') {
            $finalSkpdId = auth('sanctum')->user()->skpd_id;
        }

        $dataset = Dataset::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . Str::random(5),
            'description' => $request->description,
            'thumbnail_url' => $thumbnailUrl,
            'category_id' => $request->category_id,
            'skpd_id' => $finalSkpdId, // Gunakan ID yang sudah divalidasi
            'mode' => 'layers',
            'is_published' => true,
            'created_by' => Auth::id() ?? 1,
        ]);

        return response()->json([
            'success' => true,
            'data' => $dataset,
            'message' => 'Dataset berhasil ditambahkan'
        ], 201);
    }

    // Menampilkan detail satu dataset
    public function show($id)
    {
        $dataset = Dataset::with(['category', 'skpd'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $dataset]);
    }

    // Mengupdate dataset
    public function update(Request $request, $id)
    {
        $dataset = Dataset::findOrFail($id);

        // ============================================================
        // ROLE MANAGEMENT: Cegah Operator Edit Dataset SKPD Lain
        // ============================================================
        if (auth('sanctum')->check() && auth('sanctum')->user()->role === 'operator') {
            if ($dataset->skpd_id !== auth('sanctum')->user()->skpd_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak berhak mengedit dataset milik instansi lain.'
                ], 403);
            }
        }

        $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'skpd_id' => 'required|exists:skpd,id',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = [
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . Str::random(5),
            'description' => $request->description,
            'category_id' => $request->category_id,
            'skpd_id' => $request->skpd_id,
        ];

        // Jika ada upload gambar baru
        if ($request->hasFile('thumbnail')) {
            // Hapus gambar lama jika ada
            if ($dataset->thumbnail_url) {
                $oldPath = str_replace(url('storage/'), '', $dataset->thumbnail_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $data['thumbnail_url'] = url('storage/' . $path);
        }

        $dataset->update($data);

        return response()->json([
            'success' => true,
            'data' => $dataset,
            'message' => 'Dataset berhasil diperbarui'
        ]);
    }

    // Menghapus dataset
    public function destroy($id)
    {
        $dataset = Dataset::findOrFail($id);

        // ============================================================
        // ROLE MANAGEMENT: Cegah Operator Hapus Dataset SKPD Lain
        // ============================================================
        if (auth('sanctum')->check() && auth('sanctum')->user()->role === 'operator') {
            if ($dataset->skpd_id !== auth('sanctum')->user()->skpd_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak berhak menghapus dataset milik instansi lain.'
                ], 403);
            }
        }

        // Hapus file gambar dari storage
        if ($dataset->thumbnail_url) {
            $oldPath = str_replace(url('storage/'), '', $dataset->thumbnail_url);
            Storage::disk('public')->delete($oldPath);
        }

        $dataset->delete();

        return response()->json(['success' => true, 'message' => 'Dataset berhasil dihapus']);
    }
}
