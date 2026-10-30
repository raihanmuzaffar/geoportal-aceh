<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LayerGeometry extends Model
{
    protected $fillable = ['layer_id', 'properties', 'geom'];

    protected $casts = [
        'properties' => 'array',
    ];
}
