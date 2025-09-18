<?php

namespace App\Http\Controllers;

use App\Models\Observacion;
use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ObservacionesController extends Controller
{
    public function index(Request $request, Vehiculo $vehiculo)
    {
        $user = $request->user();
        $isAdmin = $user->hasRole('admin');

        $observaciones = $vehiculo->observaciones()
            ->with(['user', 'admin'])
            ->get();

        return Inertia::render('observaciones', [
            'vehiculo' => $vehiculo,
            'observaciones' => $observaciones,
            'isAdmin' => $isAdmin,
            'flash' => [
                'success' => session('success'),
            ],
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

    public function update(Request $request, Vehiculo $vehiculo, Observacion $observacion)
    {
        $validatedData = $request->validate([
            'resuelto' => 'required|boolean',
        ]);

        $validatedData['fecha_resolucion'] = now();
        $validatedData['admin_id'] = $request->user()->id;

        $respuesta = $observacion->update($validatedData);

        if (!$respuesta) return back()->with('fail', 'Error al resolver la observacion');

        return back()->with('success', 'Observacion resuelta');
    }
}
