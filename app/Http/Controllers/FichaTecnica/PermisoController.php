<?php

namespace App\Http\Controllers\FichaTecnica;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PermisoController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $placa)
    {
        return response()->json(['message' => 'Permisos almacenados correctamente para el vehiculo con placa: ' . $placa]);
    }
}
