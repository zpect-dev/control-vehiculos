<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RevisionesSemanales extends Model
{
    public $timestamps = false;

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_revision' => 'datetime',
    ];

    
    protected $fillable = [
        'vehiculo_id',
        'user_id',
        'observaciones',
        'video',
        'revisado'
    ];
}
