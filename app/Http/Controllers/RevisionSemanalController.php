<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RevisionSemanalController extends Controller
{
    public function index(string $placa)
    {
        $vehiculo = Vehiculo::with('usuario')->where('placa', $placa)->first();
        if (!$vehiculo) {
            return redirect()->route('dashboard')->with('mensaje', 'Placa no encontrada');
        }
        if ($vehiculo->user_id !== Auth::id()) {
            abort(403, 'No autorizado');
        }

        return Inertia::render('revisionSemanal', [
            'vehiculo' => $vehiculo,
        ]);
    }

    public function store(Request $request, string $placa)
    {
        $vehiculo = Vehiculo::with('usuario')->where('placa', $placa)->first();
        if(!$vehiculo){
            return redirect()->route('dashboard')->with('mensaje', 'Placa no encontrada');
        }
        if ($vehiculo->user_id !== Auth::id()) {
            abort(403, 'No autorizado');
        }
        if(!$request->hasFile('video')){
            return back()->with('mensaje', 'Debe subir un video a la plataforma');
        }
        $validatedData = $request->validate([
            'video' => 'required|mimes:mp4,ogx,oga,ogv,ogg,webm'
        ]);

        

        return Inertia::render('revisionSemanal', [
            'vehiculo' => $vehiculo,
        ]);
    }
}
