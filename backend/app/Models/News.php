<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class News extends Model
{
    use SoftDeletes;
    protected $table = 'news';
    protected $fillable = [
        'title', 'slug', 'excerpt', 'content', 'thumbnail_url',
        'type', 'event_date', 'is_published', 'created_by'
    ];
}
