<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehiculoPermisos extends Model
{
    protected $table = 'vehiculo_permisos';
        public $timestamps = false;

    protected $fillable = [
        'user_id',
        'vehiculo_id',
        'permiso_id',
        'fecha_expedicion',
        'fecha_vencimiento',
        'observaciones',
    ];



    /**
     * Asigna automáticamente el estado según la fecha de vencimiento.
     */
    protected static function booted()
    {
        static::saving(function ($permiso) {
            if ($permiso->fecha_vencimiento) {
                $permiso->estado = now()->lt($permiso->fecha_vencimiento);
            }
        });
    }

    /**
     * Relación con el permiso.
     */
    public function permiso(): BelongsTo
    {
        return $this->belongsTo(Permiso::class, 'permiso_id');
    }

    /**
     * Relación con el vehículo (por placa).
     */
    public function vehiculo(): BelongsTo
    {
        return $this->belongsTo(Vehiculo::class, 'vehiculo_id', 'placa');
    }

    /**
     * Etiqueta visual del estado.
     */
    public function getEstadoLabelAttribute(): string
    {
        return match (true) {
            now()->gt($this->fecha_vencimiento) => 'Vencido',
            now()->diffInDays($this->fecha_vencimiento) <= 30 => 'Por vencer',
            default => 'Vigente',
        };
    }
}
