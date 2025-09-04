<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehiculoPermisos extends Model
{
    protected $table = 'vehiculo_permisos';

    public function permiso()
    {
        return $this->belongsTo(Permiso::class, 'permiso_id');
    }
}
