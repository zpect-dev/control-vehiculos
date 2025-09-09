<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Vehículos registrados por el usuario.
     */
    public function vehiculos(): HasMany
    {
        return $this->hasMany(Vehiculo::class, 'user_id');
    }

    /**
     * Permisos registrados por el usuario.
     */
    public function permisos(): HasMany
    {
        return $this->hasMany(VehiculoPermisos::class, 'user_id');
    }

    /**
     * Especificaciones técnicas registradas por el usuario.
     */
    public function especificaciones(): HasMany
    {
        return $this->hasMany(VehiculoEspecificaciones::class, 'user_id');
    }

    /**
     * Accesorios registrados por el usuario.
     */
    public function accesorios(): HasMany
    {
        return $this->hasMany(VehiculoAccesorios::class, 'user_id');
    }
}
