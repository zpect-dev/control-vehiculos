<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Vehiculo;

class Observacion extends Model
{
    protected $table = 'observaciones';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'admin_id',
        'vehiculo_id',
        'observacion',
        'tipo',
        'resuelto',
        'fecha_resolucion',
    ];


    protected $casts = [
        'resuelto' => 'boolean',
        'fecha_resolucion' => 'datetime',
    ];

    // Relación con el autor de la observación
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relación con el admin que la resolvió (si aplica)
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    // Relación con el vehículo
    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class, 'vehiculo_id', 'placa', 'placa');
    }
}
