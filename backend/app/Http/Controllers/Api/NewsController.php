<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $news]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:200',
            'content' => 'required|string',
            'type' => 'required|in:news,agenda',
            'event_date' => 'nullable|date',
        ]);

        $news = News::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . Str::random(5),
            'excerpt' => Str::limit(strip_tags($request->content), 150),
            'content' => $request->content,
            'type' => $request->type,
            'event_date' => $request->event_date,
            'is_published' => true,
            'created_by' => Auth::id() ?? 1,
        ]);

        return response()->json(['success' => true, 'data' => $news, 'message' => 'Berita berhasil ditambahkan'], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:200',
            'content' => 'required|string',
            'type' => 'required|in:news,agenda',
            'event_date' => 'nullable|date',
        ]);

        $news = News::findOrFail($id);
        $news->update([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . Str::random(5),
            'excerpt' => Str::limit(strip_tags($request->content), 150),
            'content' => $request->content,
            'type' => $request->type,
            'event_date' => $request->event_date,
        ]);

        return response()->json(['success' => true, 'data' => $news, 'message' => 'Berita berhasil diupdate']);
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);
        $news->delete();
        return response()->json(['success' => true, 'message' => 'Berita berhasil dihapus']);
    }
}
