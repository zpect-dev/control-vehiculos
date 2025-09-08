<?php

namespace App\Http\Controllers\FichaTecnica;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ExpedienteController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $placa)
    {
        return response()->json(['message' => 'Expediente almacenado correctamente para el vehiculo con placa: ' . $placa]);
    }
}
