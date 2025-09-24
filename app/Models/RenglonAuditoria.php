<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RenglonAuditoria extends Model
{
    protected $table = 'auditoria_renglones';
    
    protected $fillable = [
        'fact_num',
        'reng_num',
        'imagen'
    ];

    public function auditoria()
    {
        return $this->belongsTo(FacturaAuditoria::class, 'fact_num', 'fact_num');
    }
}
