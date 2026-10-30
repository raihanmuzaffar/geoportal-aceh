<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dataset;
use App\Models\Skpd;
use App\Models\User;
use App\Models\Category;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_datasets' => Dataset::count(),
                'total_skpd' => Skpd::count(),
                'total_users' => User::count(),
                'total_categories' => Category::count(),
            ]
        ]);
    }
}
