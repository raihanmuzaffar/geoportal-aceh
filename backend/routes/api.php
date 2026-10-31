<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DatasetController;
use App\Http\Controllers\Api\SkpdController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\LayerController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\StoryMapController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\JignSimpulController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Http; // <-- Tambahan Import Http

// Route Publik (Bisa diakses tanpa login)
Route::prefix('v1')->group(function () {
    // Auth
    Route::post('/auth/login', [AuthController::class, 'login']);

    // --- RUTE KATEGORI ---
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // --- RUTE DATASET ---
    Route::get('/datasets', [DatasetController::class, 'index']);
    Route::post('/datasets', [DatasetController::class, 'store']);
    Route::get('/datasets/{id}', [DatasetController::class, 'show']);
    Route::put('/datasets/{id}', [DatasetController::class, 'update']);
    Route::delete('/datasets/{id}', [DatasetController::class, 'destroy']);

    // Rute SKPD
    Route::get('/skpd', [SkpdController::class, 'index']);
    Route::post('/skpd', [SkpdController::class, 'store']);
    Route::put('/skpd/{id}', [SkpdController::class, 'update']);
    Route::delete('/skpd/{id}', [SkpdController::class, 'destroy']);

    Route::get('/news', [NewsController::class, 'index']);
    Route::post('/news', [NewsController::class, 'store']);
    Route::put('/news/{id}', [NewsController::class, 'update']);
    Route::delete('/news/{id}', [NewsController::class, 'destroy']);

    // Rute Layer
    Route::get('/layers', [LayerController::class, 'index']);
    Route::post('/layers', [LayerController::class, 'store']);
    Route::get('/layers/{id}/geojson', [LayerController::class, 'showGeojson']);
    Route::delete('/layers/{id}', [LayerController::class, 'destroy']);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::put('/profile/password', [UserController::class, 'updatePassword']);

    Route::get('/story-maps', [StoryMapController::class, 'index']);
    Route::get('/story-maps/{slug}', [StoryMapController::class, 'show']);

    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::get('/jign-simpuls', [JignSimpulController::class, 'index']);

    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'update']);

    // --- TAMBAHAN BARU: RUTE BMKG (PROXY) ---
    Route::get('/bmkg/gempa-terkini', function () {
        try {
            // Mengambil data JSON dari BMKG
            $response = Http::get('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json');

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json(['error' => 'Gagal mengambil data dari BMKG'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Koneksi ke BMKG terputus'], 500);
        }
    });
});

// Route Terproteksi (Harus Login)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', function (\Illuminate\Http\Request $request) {
        return response()->json(['success' => true, 'data' => $request->user()]);
    });
});
