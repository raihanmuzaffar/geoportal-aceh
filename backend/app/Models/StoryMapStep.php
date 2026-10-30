<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class StoryMapStep extends Model
{
    protected $fillable = [
        'story_map_id', 'step_order', 'title', 'content',
        'center_lng', 'center_lat', 'zoom', 'layer_ids'
    ];

    protected $casts = ['layer_ids' => 'array'];
}
