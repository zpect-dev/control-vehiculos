<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vehiculo extends Model
{
    use HasFactory;

    protected $primaryKey = 'placa';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'placa',
        'modelo',
        'marca',
        'user_id',
    ];

    /**
     * Relación con el usuario propietario.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relación con las especificaciones técnicas.
     */
    public function especificaciones(): HasMany
    {
        return $this->hasMany(VehiculoEspecificaciones::class, 'vehiculo_id', 'placa');
    }

    /**
     * Relación con los permisos del vehículo.
     */
    public function permisos(): HasMany
    {
        return $this->hasMany(VehiculoPermisos::class, 'vehiculo_id', 'placa');
    }

    /**
     * Relación con los accesorios del vehículo.
     */
    public function accesorios(): HasMany
    {
        return $this->hasMany(VehiculoAccesorios::class, 'vehiculo_id', 'placa');
    }

    /**
     * Relación con las piezas revisadas (si tienes esa tabla).
     */
    public function piezas(): HasMany
    {
        return $this->hasMany(VehiculoPiezas::class, 'vehiculo_id', 'placa');
    }
}
