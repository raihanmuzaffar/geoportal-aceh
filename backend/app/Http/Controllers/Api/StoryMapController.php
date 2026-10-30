<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\StoryMap;

class StoryMapController extends Controller
{
    public function index()
    {
        $stories = StoryMap::where('is_published', true)->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $stories]);
    }

    public function show($slug)
    {
        $story = StoryMap::with('steps')->where('slug', $slug)->firstOrFail();
        return response()->json(['success' => true, 'data' => $story]);
    }
}
