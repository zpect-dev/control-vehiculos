<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehiculoAccesorios extends Model
{
    protected $table = 'vehiculo_accesorios';
    public $timestamps = false;

    public function accesorio()
    {
        return $this->belongsTo(Accesorio::class, 'accesorio_id');
    }
}
