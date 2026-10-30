<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\JignSimpul;

class JignSimpulController extends Controller
{
    public function index()
    {
        $simpuls = JignSimpul::orderBy('id', 'asc')->get();
        return response()->json(['success' => true, 'data' => $simpuls]);
    }
}
