<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistorialAsignaciones extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'vehiculo_id',
        'user_id',
        'admin_id',
        'kilometraje',
        'foto_kilometraje'
    ];
}
