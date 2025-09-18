<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RevisionesSemanales extends Model
{
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    protected $fillable = [
        'vehiculo_id',
        'user_id',
        'observaciones',
        'video',
        'revisado'
    ];
}
