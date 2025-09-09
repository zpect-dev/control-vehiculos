<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RevisionesDiarias extends Model
{
    protected $table = 'revisiones_diarias';
    public $timestamps = false;

    protected $fillable = [
        'vehiculo_id',
        'user_id',
        'nivel_fluido',
        'imagen',
        'revisado',
        'tipo'
    ];
}
