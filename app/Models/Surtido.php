<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Surtido extends Model
{
    protected $table = 'surtidos';

    protected $fillable = [
        'vehiculo_id',
        'user_id',
        'tipo_surtido',
        'cant_litros',
        'kilometraje',
        'surtido_ideal',
        'observaciones',
        'precio',
        'fact_num',
        'diferencia'
    ];
}