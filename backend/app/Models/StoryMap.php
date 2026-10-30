<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class StoryMap extends Model
{
    protected $fillable = ['title', 'slug', 'description', 'cover_url', 'is_published'];

    public function steps()
    {
        return $this->hasMany(StoryMapStep::class)->orderBy('step_order');
    }
}
