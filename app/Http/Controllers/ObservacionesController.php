<?php

namespace App\Http\Controllers;

use App\Models\Observacion;
use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ObservacionesController extends Controller
{
    public function index(Vehiculo $vehiculo)
    {
        $observaciones = $vehiculo->observaciones()->get();
        return Inertia::render('nombre_vista', [
            'observaciones' => $observaciones
        ]);
    }

    public function store(Request $request, Vehiculo $vehiculo)
    {
        $validatedData = $request->validate([
            'observacion' => 'required|string'
        ]);

        $respuesta = Observacion::create([
            'user_id' => $request->user()->id,
            'vehiculo_id' => $vehiculo->placa,
            'observacion' => $validatedData['observacion'],
            'resuelto' => false,
        ]);

        if (!$respuesta) return back()->with('fail', 'Error al registrar la observacion');

        return back()->with('success', 'Observacion enviada correctamente');
    }

    public function update(Request $request, Observacion $observacion)
    {
        $this->authorize('update', $observacion);

        $validatedData = $request->validate([
            'resuelto' => 'required|boolean'
        ]);

        $validatedData['fecha_resolucion'] = now();

        if (!$observacion->update($validatedData)) return back()->with('fail', 'Error al resolver la observacion');

        return back()->with('success', 'Observacion resulta correctamente');
    }

    public function show(Observacion $observacion)
    {
        return Inertia::render('nombre_vista', [
            'observacion' => $observacion
        ]);
    }
}
