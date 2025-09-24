<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Repuesto extends Model
{
    protected $connection = 'sqlsrv'; // si está en la misma base que factura
    protected $table = 'art';   // o el nombre real de la tabla
    protected $keyType = 'string';
    protected $primaryKey = 'co_art'; // si el código es la clave primaria
}
