<?php

namespace App\Http\Controllers\FichaTecnica;

use App\Http\Controllers\Controller;
use App\Models\VehiculoEspecificaciones;
use Illuminate\Http\Request;

class ExpedienteController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $placa)
    {
        $validatedData = $request->validate([
            '*.especificacion_id' => [
                'required',
                'integer',
                'exists:especificaciones,id'
            ],
            '*.observaciones' => [
                'required',
                'string',
                'max:255'
            ],
        ]);

        foreach ($validatedData as $item) {
            VehiculoEspecificaciones::create([
                'user_id' => $request->user()->id,
                'vehiculo_id' => $placa,
                'especificacion_id' => $item['especificacion_id'],
                'estado' => $item['observaciones'],
            ]);
        }
        return response()->json(['message' => 'Expediente almacenado correctamente para el vehiculo con placa: ' . $placa]);
    }
}
