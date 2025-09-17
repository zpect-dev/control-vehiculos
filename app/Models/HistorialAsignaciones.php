<?php

namespace App\Models;

use App\Models\User;
use App\Models\Vehiculo;
use Illuminate\Database\Eloquent\Model;

class HistorialAsignaciones extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'vehiculo_id',
        'user_id',
        'admin_id',
        'kilometraje',
        'foto_kilometraje'
    ];

    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class, 'vehiculo_id', 'placa');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
