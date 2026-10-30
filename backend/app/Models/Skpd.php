<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skpd extends Model
{
    protected $table = 'skpd';
    protected $fillable = ['name', 'short_name', 'logo_url', 'address', 'phone', 'email'];

    public function datasets() {
        return $this->hasMany(Dataset::class);
    }
}
