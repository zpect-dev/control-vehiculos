<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Especificacion extends Model
{
    protected $table = 'especificaciones';

    protected $fillable = ['especificacion'];

    public function registros(): HasMany
    {
        return $this->hasMany(VehiculoEspecificaciones::class, 'especificacion_id');
    }
}
