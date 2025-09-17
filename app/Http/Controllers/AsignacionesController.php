<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;
use App\Models\User;
use App\Helpers\NotificacionHelper;
use App\Models\HistorialAsignaciones;
use App\Services\Multimedia;

class AsignacionesController extends Controller
{
    public function index(Request $request, Vehiculo $vehiculo){
        $historial = HistorialAsignaciones::where('vehiculo_id', $vehiculo->placa)->paginate(10);
        return view('nombre_vista', [
            'historial' => $historial
        ]);
    }

    /**
     * Store the newly created resource in storage.
     */
    public function store(Request $request, Vehiculo $vehiculo)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'kilometraje' => 'required|numeric',
            'foto_kilometraje' => 'required|image|file|max:5120'
        ]);

        // Verifica que el nuevo kilometraje no sea menor al anterior
        $registro = HistorialAsignaciones::where('vehiculo_id', $vehiculo->placa)->orderByDesc('fecha_asignacion')->first();
        if ($registro->kilometraje > $validatedData['kilometraje']) return back()->with('fail', 'Kilometraje invalido');
        
        // Verifica que el nuevo usuario existe
        $nuevoUsuario = User::find($request->user_id);
        if (!$nuevoUsuario) return back()->with('fail', 'Usuario no encontrado');

        // Procesa las imagenes
        $multimedia = new Multimedia;
        $nombreImagen = $multimedia->guardarImagen($request->foto_kilometraje, 'asignacion');
        if (!$nombreImagen) return back()->with('fail', 'Error al guardar la imagen');
        
        $admin = $request->user();
        $respuesta = HistorialAsignaciones::create([
            'vehiculo_id' => $vehiculo->placa,
            'user_id' => $nuevoUsuario->id,
            'admin_id' => $admin->id,
            'kilometraje' => $validatedData['kilometraje'],
            'foto_kilometraje' => $nombreImagen
        ]);

        if (!$respuesta) return back()->with('fail', 'Error al realizar el registro');

        $vehiculo->user_id = $nuevoUsuario->id;
        $vehiculo->save();
        
        NotificacionHelper::emitirAsignacionUsuario($vehiculo->placa, $admin->name, $nuevoUsuario->name);
        return back()->with('success', 'Usuario asignado correctamente.');
    }

    /**
     * Display the resource.
     */
    public function show(HistorialAsignaciones $registro)
    {
        return view('nombre_vista', [
            'registro' => $registro
        ]);
    }
}
