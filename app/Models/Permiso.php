<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Permiso extends Model
{
    protected $table = 'permisos';

    protected $fillable = [
        'permiso',
    ];

    public $timestamps = false;

    public function vehiculos(): HasMany
    {
        return $this->hasMany(VehiculoPermisos::class, 'permiso_id');
    }
}
