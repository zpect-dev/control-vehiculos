<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vehiculo extends Model
{
    use HasFactory;

    protected $primaryKey = 'placa';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    public function usuario()
    {
    return $this->belongsTo(User::class, 'user_id');
    }
}
