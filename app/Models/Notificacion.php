<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{

    protected $table = 'notificaciones';
    protected $fillable = [
        'titulo',
        'descripcion',
        'tipo',
        'usuario_id',
        'solo_admin',
        'leida'
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class);
    }
}
