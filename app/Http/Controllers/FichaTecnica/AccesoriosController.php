<?php

namespace App\Http\Controllers\FichaTecnica;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehiculo;
use App\Models\VehiculoAccesorios;

class AccesoriosController extends Controller
{
    public function store(Request $request, string $placa)
    {
        $vehiculo = Vehiculo::where('placa', $placa)->firstOrFail();
        $data = $request->except('vehiculo_id');

        foreach ($data as $accesorioId => $estado) {
            if ($estado === null || $estado === '') continue;

            VehiculoAccesorios::updateOrCreate(
                [
                    'vehiculo_id' => $placa,
                    'accesorio_id' => $accesorioId,
                ],
                [
                    'estado' => $estado,
                    'user_id' => $request->user()->id,
                ]
            );
        }

        return redirect()->back()->with('success', 'Accesorios actualizados correctamente.');

    }
}
