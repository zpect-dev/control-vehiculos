<?php

namespace App\Http\Controllers\FichaTecnica;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VehiculoEspecificaciones;

class ExpedienteTecnicoController extends Controller
{
    public function store(Request $request)
    {
        $vehiculoId = $request->input('vehiculo_id');
        $campos = $request->except('vehiculo_id');

        foreach ($campos as $especificacionId => $valor) {
            VehiculoEspecificaciones::updateOrCreate(
                [
                    'user_id' => $request->user()->id,
                    'vehiculo_id' => $vehiculoId,
                    'especificacion_id' => $especificacionId,
                ],
                [
                    'estado' => $valor,
                    'esta_registrado' => true,
                ]
            );
        }

        return redirect()->back()->with('success', 'Expediente técnico guardado correctamente.');
    }
}
