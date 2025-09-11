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
    public function index(Request $request, string $placa)
    {
        $vehiculo = Vehiculo::with('usuario')->where('placa', $placa)->first();
        if (!$vehiculo) {
            return redirect()->route('dashboard')->with('mensaje', 'Placa no encontrada');
        }
<<<<<<< HEAD
        if ($vehiculo->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
=======
        if ($vehiculo->user_id !== Auth::id() && !$request->user()->hasRole('admin')) {
>>>>>>> a3785076cc2bdd97d7a5454f1f6004afab6ef0e8
            abort(403, 'No autorizado');
        }

        $semanaMap = [
            'monday' => 0,
            'tuesday' => 1,
            'Wednesday' => 2,
            'thursday' => 3,
            'friday' => 4,
            'saturday' => 5,
            'sunday' => 6
        ];

        $fechaActual = Carbon::today()->setTime(23, 59)->toImmutable();
        $diaActual = strtolower($fechaActual->isoFormat('dddd'));

        $inicioSemana = $fechaActual->subDays($semanaMap[$diaActual]);
        $finalSemana = $inicioSemana->addDays($semanaMap['friday']);

        $revisionSemanal = RevisionesSemanales::where('vehiculo_id', $placa)
                                            ->whereBetween('fecha_creacion', [$inicioSemana, $fechaActual])
                                            ->first();

        if($revisionSemanal){
            $revisionSemanal->video = asset('storage/uploads/videos-semanales/' . $revisionSemanal->video);

            return Inertia::render('revisionSemanal', [
                'vehiculo' => $vehiculo,
                'revisionSemanal' => $revisionSemanal,
                'inicio' => $inicioSemana->isoFormat('D-M-YYYY'),
                'final' => $finalSemana->isoFormat('D-M-YYYY')
            ]);
        }

        return Inertia::render('revisionSemanal', [
            'vehiculo' => $vehiculo,
            'inicio' => $inicioSemana->isoFormat('D-M-YYYY'),
            'final' => $finalSemana->isoFormat('D-M-YYYY')
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
            'vehiculo' => $vehiculo,
            'flash' => 'Revision semanal cargada correctamente'
        ]);
    }
}