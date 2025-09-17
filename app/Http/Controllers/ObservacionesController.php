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
            ->with(['user', 'admin']) // ← para mostrar quién resolvió
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

    public function update(Request $request, Observacion $observacion)
{
    if (!$request->user()->hasRole('admin')) {
        abort(403);
    }

    $validatedData = $request->validate([
        'resuelto' => 'required|boolean',
    ]);
// dd($validatedData);

    $validatedData['fecha_resolucion'] = now();
    $validatedData['admin_id'] = $request->user()->id;

    $res = $observacion->update($validatedData);
    dd($res);

    return response()->json(['success' => true]);
}


    public function show(Request $request, Observacion $observacion)
    {
        $user = $request->user();
        $isAdmin = $user->hasRole('admin');

        return Inertia::render('observaciones', [
            'observacion' => $observacion->load(['user', 'admin']),
            'isAdmin' => $isAdmin,
        ]);
    }
}
