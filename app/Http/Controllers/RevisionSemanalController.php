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

        if ($vehiculo->user_id !== Auth::id() && !$request->user()->hasRole('admin')) {
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

        $fechaActual = Carbon::today()->toImmutable();
        $diaActual = strtolower($fechaActual->isoFormat('dddd'));

        $inicioSemana = $fechaActual->subDays($semanaMap[$diaActual])->setTime(00, 00);
        $finalSemana = $inicioSemana->addDays($semanaMap['friday'])->setTime(23, 59);

        $revisionSemanal = RevisionesSemanales::where('vehiculo_id', $placa)
            ->whereBetween('fecha_creacion', [$inicioSemana, $finalSemana])
            ->first();

        if ($revisionSemanal) {
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

        return back()->with([
            'vehiculo' => $vehiculo,
            'flash' => 'Revision semanal cargada correctamente'
        ]);
    }
}
