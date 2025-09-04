<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    protected $primaryKey = 'placa';
    public $incrementing = false;
    protected $keyType = 'string';

    public function piezas()
    {
        return $this->hasMany(VehiculoPiezas::class, 'vehiculo_id', 'placa');
    }
    public function accesorios()
    {
        return $this->hasMany(VehiculoAccesorios::class, 'vehiculo_id', 'placa');
    }
    public function especificaciones()
    {
        return $this->hasMany(VehiculoEspecificaciones::class, 'vehiculo_id', 'placa');
    }
    public function permisos()
    {
        return $this->hasMany(VehiculoPermisos::class, 'vehiculo_id', 'placa');
    }

    public function getUltimasPiezasAttribute()
    {
        return $this->piezas
            ->sortByDesc('fecha_verificacion')
            ->unique('pieza_id')
            ->values();
    }

    public function getUltimosAccesoriosAttribute()
    {
        return $this->accesorios
            ->sortByDesc('fecha_verificacion')
            ->unique('accesorio_id')
            ->values();
    }

    public function getUltimasEspecificacionesAttribute()
    {
        return $this->especificaciones
            ->sortByDesc('fecha_verificacion')
            ->unique('especificacion_id')
            ->values();
    }
    public function getUltimosPermisosAttribute()
    {
        return $this->permisos
            ->sortByDesc('fecha_verificacion')
            ->unique('permiso_id')
            ->values();
    }
}
