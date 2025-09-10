<?php

namespace App\Http\Controllers\FichaTecnica;

use App\Models\VehiculoPieza;
use App\Models\VehiculoPiezas;
use Illuminate\Http\Request;

class PiezasController
{
    public function store(Request $request, string $placa)
    {
        $data = $request->except('vehiculo_id');

        foreach ($data as $pieza_id => $estado) {
            if ($estado !== null && $estado !== '') {
                VehiculoPiezas::updateOrCreate(
                    [
                        'vehiculo_id' => $placa,
                        'pieza_id' => $pieza_id,
                    ],
                    [
                        'estado' => $estado,
                        'user_id' => $request->user()->id,
                    ]
                );
            }
        }

        return redirect()->back()->with('success', 'Piezas actualizadas correctamente.');
    }
}
