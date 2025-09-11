<?php

namespace App\Http\Controllers\FichaTecnica;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehiculo;
use App\Models\VehiculoAccesorios;
use App\Helpers\NotificacionHelper;

class AccesoriosController extends Controller
{
    public function store(Request $request, string $placa)
    {
        $vehiculo = Vehiculo::where('placa', $placa)->firstOrFail();
        $data = $request->except('vehiculo_id');
        $userName = $request->user()->name;

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

            if (in_array((int) $estado, [1, 2])) {
                NotificacionHelper::emitirCambioCritico(
                    $accesorioId,
                    (int) $estado,
                    'accesorios',
                    $placa,
                    $userName
                );
            }
        }

        return redirect()->back()->with('success', 'Accesorios actualizados correctamente.');
    }
}
