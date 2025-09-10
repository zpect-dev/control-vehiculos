<?php

namespace App\Http\Controllers;

use App\Models\RevisionesSemanales;
use Inertia\Inertia;
use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    public function show(Request $request, string $placa)
    {

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

        $videoPath = $request->file('video')->store('uploads/videos-semanales', 'public');
        $extension = "." . pathinfo($videoPath, PATHINFO_EXTENSION);
        $videoName = pathinfo($videoPath, PATHINFO_FILENAME) . $extension;

        RevisionesSemanales::create([
            'vehiculo_id' => $placa,
            'user_id' => $vehiculo->user_id,
            'observaciones' => '',
            'video' => $videoName,
            'revisado' => false
        ]);

        return response()->json(['message' => 'Revision realizada correctamente para el vehiculo con placa: ' . $placa]);
    }
}
