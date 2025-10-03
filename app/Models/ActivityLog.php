<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'accion',
        'modelo',
        'subject_type',
        'subject_id',
        'descripcion'
    ];
}
