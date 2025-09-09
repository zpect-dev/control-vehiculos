<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Permiso extends Model
{
    protected $table = 'permisos';
    public $timestamps = false;

    protected $fillable = [
        'permiso',
        'tipo',
        'descripcion',
    ];

    protected $casts = [
        'permiso' => 'string',
        'tipo' => 'string',
        'descripcion' => 'string',
    ];

    /**
     * Relación con los registros de permisos asignados a vehículos.
     */
    public function vehiculos(): HasMany
    {
        return $this->hasMany(VehiculoPermisos::class, 'permiso_id');
    }

    /**
     * Devuelve el nombre plano usado en el frontend.
     */
    public function getNombrePlanoAttribute(): string
    {
        return str($this->permiso)->snake()->lower();
    }

    /**
     * Scope para filtrar por tipo de permiso.
     */
    public function scopeDeTipo($query, string $tipo)
    {
        return $query->where('tipo', $tipo);
    }
}
