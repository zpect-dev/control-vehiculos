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
    public function index(Request $request, Vehiculo $vehiculo)
    {
        $vehiculo->load('usuario');

        $inicioSemana = Carbon::now()->startOfWeek(Carbon::MONDAY)->toImmutable();
        $finalSemana = Carbon::now()->endOfWeek(Carbon::FRIDAY)->toImmutable();

        $revisionSemanal = RevisionesSemanales::where('vehiculo_id', $vehiculo->placa)
            ->whereBetween('fecha_creacion', [$inicioSemana, $finalSemana])
            ->first();

        if ($revisionSemanal) {
            $revisionSemanal->video = '/storage/uploads/videos-semanales/' . ltrim($revisionSemanal->video, '/');
        }

        return Inertia::render('revisionSemanal', [
            'vehiculo' => $vehiculo,
            'revisionSemanal' => $revisionSemanal,
            'inicio' => $inicioSemana->isoFormat('D-M-YYYY'),
            'final' => $finalSemana->isoFormat('D-M-YYYY'),
            'modo' => Auth::user()->hasRole('admin') ? 'admin' : 'normal'
        ]);
    }

    public function store(Request $request, Vehiculo $vehiculo)
    {
        if (!$request->hasFile('video')) {
            return back()->with('mensaje', 'Debe subir un video a la plataforma');
        }
        $validatedData = $request->validate([
            'video' => 'required|mimes:mp4,ogx,oga,ogv,ogg,webm'
        ]);

        $videoPath = $request->file('video')->store('uploads/videos-semanales', 'public');
        $extension = "." . pathinfo($videoPath, PATHINFO_EXTENSION);
        $videoName = pathinfo($videoPath, PATHINFO_FILENAME) . $extension;

        RevisionesSemanales::create([
            'vehiculo_id' => $vehiculo->placa,
            'user_id' => Auth::id(),
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
