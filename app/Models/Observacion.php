<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Observacion extends Model
{
    protected $table = 'observaciones';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'admin_id',
        'vehiculo_id',
        'observacion',
        'tipo',
        'resuelto',
        'fecha_resolucion'
    ];
}
