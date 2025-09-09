<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Accesorio extends Model
{
    protected $table = 'accesorios';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'descripcion',
        'tipo',
    ];

    protected $casts = [
        'nombre' => 'string',
        'descripcion' => 'string',
        'tipo' => 'string',
    ];

    /**
     * Relación con los registros de accesorios asignados a vehículos.
     */
    public function vehiculos(): HasMany
    {
        return $this->hasMany(VehiculoAccesorios::class, 'accesorio_id');
    }
}
