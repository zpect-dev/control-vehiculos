<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Factura extends Model
{
    protected $connection = 'sqlsrv';
    protected $table = 'factura';
    protected $keyType = 'string';
    protected $primaryKey = 'fact_num';

    protected $appends = ['descripcion_limpia', 'comentario_limpio'];
    protected $hidden = ['descrip', 'comentario'];

    public function renglones()
    {
        return $this->hasMany(RenglonFactura::class, 'fact_num', 'fact_num');
    }

    public function getDescripcionLimpiaAttribute()
    {
        return trim(preg_replace('/[\x00-\x1F\x7F].*/u', '', $this->descrip));
    }

    public function getComentarioLimpioAttribute()
    {
        return trim(preg_replace('/[\x00-\x1F\x7F].*/u', '', $this->comentario));
    }
}
