<?php

namespace App\Http\Controllers\FichaTecnica;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AccesorioController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $placa)
    {
        return response()->json(['message' => 'Accesorios almacenados correctamente para el vehiculo con placa: ' . $placa]);
    }
}
