<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehiculoPiezas extends Model
{
    protected $table = 'vehiculo_piezas';

    public function pieza()
    {
        return $this->belongsTo(Pieza::class, 'pieza_id');
    }
}
