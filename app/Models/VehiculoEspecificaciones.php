<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehiculoEspecificaciones extends Model
{
    protected $table = 'vehiculo_especificaciones';

    public function especificacion()
    {
        return $this->belongsTo(Especificacione::class, 'especificacion_id');
    }
}
