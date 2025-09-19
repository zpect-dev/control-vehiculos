<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Vehiculo;
use Illuminate\Http\Request;
use App\Models\RevisionesSemanales;
use Illuminate\Support\Facades\Auth;
use App\Helpers\FlashHelper;

class RevisionSemanalController extends Controller
{
    public function index(Request $request, Vehiculo $vehiculo)
    {
        $vehiculo->load('usuario');

        $inicioSemana = Carbon::now()->startOfWeek(Carbon::MONDAY)->toImmutable();
        $finalSemana = Carbon::now()->endOfWeek(Carbon::SUNDAY)->toImmutable();

        $revisionSemanal = RevisionesSemanales::where('vehiculo_id', $vehiculo->placa)
            ->whereBetween('created_at', [$inicioSemana, $finalSemana])
            ->first();

        if ($revisionSemanal) {
            $basePath = '/storage/uploads/videos-semanales/';
            $revisionSemanal->video_inicial = $basePath . ltrim($revisionSemanal->video_inicial, '/');

            if ($revisionSemanal->video_final) {
                $revisionSemanal->video_final = $basePath . ltrim($revisionSemanal->video_final, '/');
            }
        }

        return Inertia::render('revisionSemanal', [
            'vehiculo' => $vehiculo,
            'revisionSemanal' => $revisionSemanal,
            'inicio' => $inicioSemana->isoFormat('D-M-YYYY'),
            'final' => $finalSemana->isoFormat('D-M-YYYY'),
            'modo' => Auth::user()->hasRole('admin') ? 'admin' : 'normal',
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function store(Request $request, Vehiculo $vehiculo)
    {
        return FlashHelper::try(function () use ($request, $vehiculo) {
            $hoy = Carbon::now();
            if (!$hoy->isFriday() && !$hoy->isSaturday() && !$hoy->isSunday()) {
                throw new \Exception('Solo puede subir el video inicial entre viernes y domingo.');
            }

            if (!$request->hasFile('video_inicial')) {
                throw new \Exception('Debe subir un video a la plataforma.');
            }

            $validatedData = $request->validate([
                'video_inicial' => 'required|mimes:mp4,ogx,oga,ogv,ogg,webm',
                'kilometraje_inicial' => 'required|numeric',
            ]);

            $inicioSemana = Carbon::now()->startOfWeek(Carbon::MONDAY);
            $finalSemana = Carbon::now()->endOfWeek(Carbon::SUNDAY);

            $yaExiste = RevisionesSemanales::where('vehiculo_id', $vehiculo->placa)
                ->whereBetween('created_at', [$inicioSemana, $finalSemana])
                ->exists();

            if ($yaExiste) {
                throw new \Exception('Ya existe una revisión semanal registrada para esta semana.');
            }

            $ultimaRevision = RevisionesSemanales::where('vehiculo_id', $vehiculo->placa)
                ->orderByDesc('created_at')
                ->first();

            if (
                $ultimaRevision && $ultimaRevision->kilometraje_final !== null &&
                $validatedData['kilometraje_inicial'] !== $ultimaRevision->kilometraje_final
            ) {
                throw new \Exception('El kilometraje no concuerda con el de la semana pasada. Comuníquese con un administrador.');
            }

            $videoPath = $request->file('video_inicial')->store('uploads/videos-semanales', 'public');
            $videoName = pathinfo($videoPath, PATHINFO_FILENAME) . '.' . pathinfo($videoPath, PATHINFO_EXTENSION);

            $respuesta = RevisionesSemanales::create([
                'vehiculo_id' => $vehiculo->placa,
                'user_id' => Auth::id(),
                'video_inicial' => $videoName,
                'kilometraje_inicial' => $validatedData['kilometraje_inicial'],
            ]);

            dd($respuesta);
        }, 'Revisión semanal cargada correctamente.', 'Error al registrar la revisión semanal.');
    }

    public function update(Request $request, Vehiculo $vehiculo, RevisionesSemanales $revision)
    {
        $hoy = Carbon::now();
        if (!$hoy->isMonday()) {
            return back()->with('error', 'Solo puede subir el video final los días lunes.');
        }

        $validatedData = $request->validate([
            'video_final' => 'required|mimes:mp4,ogx,oga,ogv,ogg,webm',
            'kilometraje_final' => 'required|numeric',
        ]);

        if ($validatedData['kilometraje_final'] < $revision->kilometraje_inicial) {
            return back()->with('error', 'El kilometraje final no puede ser menor al inicial.');
        }

        $videoPath = $request->file('video_final')->store('uploads/videos-semanales', 'public');
        $videoName = pathinfo($videoPath, PATHINFO_FILENAME) . '.' . pathinfo($videoPath, PATHINFO_EXTENSION);

        $revision->update([
            'video_final' => $videoName,
            'kilometraje_final' => $validatedData['kilometraje_final'],
        ]);

        return back()->with('success', 'Revisión finalizada correctamente.');
    }
}
