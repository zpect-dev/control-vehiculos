<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FotoRevisionSemanal extends Model
{
    protected $table = 'fotos_revision_semanal';
    protected $fillable = [
        'revision_semanal_id',
        'imagen',
        'tipo',
        'created_at',
        'updated_at'
    ];
}
