<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pieza extends Model
{
    protected $table = 'piezas';
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
     * Relación con los registros de revisión por vehículo.
     */
    public function vehiculos(): HasMany
    {
        return $this->hasMany(VehiculoPiezas::class, 'pieza_id');
    }
}
