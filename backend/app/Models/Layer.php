<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Layer extends Model
{
    use HasFactory;

    // Tambahkan ini agar Laravel mengizinkan kolom-kolom ini diisi
    protected $fillable = [
        'dataset_id',
        'name',
        'slug',
        'geometry_type',
        'srid',
        'feature_count',
        'is_reference',
        'is_visible_by_default',
        'style',
    ];

    // Cast style menjadi array/json
    protected $casts = [
        'style' => 'array',
    ];

    public function dataset()
    {
        return $this->belongsTo(Dataset::class);
    }

    public function geometries()
    {
        return $this->hasMany(LayerGeometry::class);
    }
}
