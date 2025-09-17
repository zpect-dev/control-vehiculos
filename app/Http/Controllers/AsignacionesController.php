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
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'kilometraje' => 'required|numeric',
            'foto_kilometraje' => 'required|image|file|max:5120'
        ]);

        $nuevoUsuario = User::find($request->user_id);

        if(!$nuevoUsuario){
            dd('usuario no encontrado');
            return back()->with('fail', 'Usuario no encontrado');
        }

        $admin = $request->user();
        
        $multimedia = new Multimedia;
        $respuesta = $multimedia->guardarImagen($request->foto_kilometraje, 'asignacion');

        if(!$respuesta){
            dd('error al guardar la imagen');
            return back()->with('fail', 'Error al guardar la imagen');
        }
        
        HistorialAsignaciones::create([
            'vehiculo_id' => $vehiculo->placa,
            'user_id' => $nuevoUsuario->id,
            'admin_id' => $admin->id,
            'kilometraje' => $request->kilometraje,
            'foto_kilometraje' => $respuesta
        ]);

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
        
    }
}
