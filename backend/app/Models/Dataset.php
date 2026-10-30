<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dataset extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'slug', 'description', 'abstract', 'thumbnail_url',
        'category_id', 'skpd_id', 'mode', 'is_featured', 'is_published',
        'published_at', 'created_by'
    ];

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function skpd() {
        return $this->belongsTo(Skpd::class);
    }
}
