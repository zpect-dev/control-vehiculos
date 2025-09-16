<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notificacion extends Model
{
    protected $table = 'notificaciones';

    protected $fillable = [
        'titulo',
        'descripcion',
        'tipo',
        'usuario_id',
        'vehiculo_id',
        'solo_admin',
        'leida',
    ];

    protected $casts = [
        'leida' => 'boolean',
        'solo_admin' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function vehiculo(): BelongsTo
    {
        return $this->belongsTo(Vehiculo::class);
    }
}
