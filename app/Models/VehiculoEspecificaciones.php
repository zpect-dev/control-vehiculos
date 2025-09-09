<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehiculoEspecificaciones extends Model
{
    protected $table = 'vehiculo_especificaciones';
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'vehiculo_id',
        'especificacion_id',
        'estado',
    ];


}
