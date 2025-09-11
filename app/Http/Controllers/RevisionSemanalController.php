<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Vehiculo;
use Illuminate\Http\Request;
use App\Models\RevisionesSemanales;
use Illuminate\Support\Facades\Auth;

class RevisionSemanalController extends Controller
{
    public function index(string $placa)
    {
        $vehiculo = Vehiculo::with('usuario')->where('placa', $placa)->first();
        if (!$vehiculo) {
            return redirect()->route('dashboard')->with('mensaje', 'Placa no encontrada');
        }
        if ($vehiculo->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
            abort(403, 'No autorizado');
        }

        $semanaSiguiente = new Carbon('next monday');
        dd($semanaSiguiente);

        return Inertia::render('revisionSemanal', [
            'vehiculo' => $vehiculo,
        ]);
    }

    public function store(Request $request, string $placa)
    {
        $vehiculo = Vehiculo::with('usuario')->where('placa', $placa)->first();
        if (!$vehiculo) {
            return redirect()->route('dashboard')->with('mensaje', 'Placa no encontrada');
        }
        if ($vehiculo->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
            abort(403, 'No autorizado');
        }
        if (!$request->hasFile('video')) {
            return back()->with('mensaje', 'Debe subir un video a la plataforma');
        }
        $validatedData = $request->validate([
            'video' => 'required|mimes:mp4,ogx,oga,ogv,ogg,webm'
        ]);


        RevisionesSemanales::create([
            'vehiculo_id' => $placa,
            'user_id' => $vehiculo->user_id,
            'observaciones' => '',
            'video' => $videoName,
            'revisado' => false
        ]);

        return back()->with([
            'vehiculoId' => $placa,
            'flash' => 'Revision semanal cargada correctamente'
        ]);
    }
}
