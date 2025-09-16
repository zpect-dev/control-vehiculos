<?php

namespace App\Http\Controllers\FichaTecnica;

use App\Http\Controllers\Controller;
use App\Models\Vehiculo;
use Illuminate\Http\Request;
use App\Models\VehiculoEspecificaciones;

class ExpedienteTecnicoController extends Controller
{
    public function store(Request $request, Vehiculo $vehiculo)
    {
        $campos = $request->except('vehiculo_id');

        foreach ($campos as $especificacionId => $valor) {
            VehiculoEspecificaciones::updateOrCreate(
                [
                    'user_id' => $request->user()->id,
                    'vehiculo_id' => $vehiculo->placa,
                    'especificacion_id' => $especificacionId,
                ],
                [
                    'estado' => $valor,
                    'esta_registrado' => true,
                ]
            );
        }

        return back()->with('success', 'Expediente técnico guardado correctamente.');
    }
}
