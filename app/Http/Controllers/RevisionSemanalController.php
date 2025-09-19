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

            if($revisionSemanal->video_final){
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
            if (!$request->hasFile('video_inicial')) {
                throw new \Exception('Debe subir un video a la plataforma');
            }

            $validatedData = $request->validate([
                'video_inicial' => 'required|mimes:mp4,ogx,oga,ogv,ogg,webm',
                'kilometraje_inicial' => 'required|numeric'
            ]);
            
            $KilometrajeFinal = RevisionesSemanales::select('kilometraje_final')->where('vehiculo_id', $vehiculo->placa)->latest()->first();
            
            if($KilometrajeFinal && $KilometrajeFinal !== $validatedData['kilometraje_inicial']){
                dd('1');
                return back()->with('error', 'El kilometraje no concuerda con el de la semana pasada, comunicarse con un administrador');   
            }
            
            $videoPath = $request->file('video_inicial')->store('uploads/videos-semanales', 'public');
            $extension = "." . pathinfo($videoPath, PATHINFO_EXTENSION);
            $videoName = pathinfo($videoPath, PATHINFO_FILENAME) . $extension;
            
            RevisionesSemanales::create([
                'vehiculo_id' => $vehiculo->placa,
                'user_id' => Auth::id(),
                'video_inicial' => $videoName,
                'kilometraje_inicial' => $validatedData['kilometraje_inicial'],
            ]);
        }, 'Revisión semanal cargada correctamente.', 'Error al registrar la revisión semanal.');
    }

    public function update(Request $request, Vehiculo $vehiculo, RevisionesSemanales $revision)
    {
        $validatedData = $request->validate([
            'video_final' => 'required|mimes:mp4,ogx,oga,ogv,ogg,webm',
            'kilometraje_final' => 'required|numeric'
        ]);

        if($revision->kilometraje_inicial < $validatedData['kilometraje_final']){
            return back()->with('error', 'El kilometraje que intenta ingresar, es menor al de inicio de semana');
        }

        $videoPath = $request->file('video_final')->store('uploads/videos-semanales', 'public');
        $extension = "." . pathinfo($videoPath, PATHINFO_EXTENSION);
        $videoName = pathinfo($videoPath, PATHINFO_FILENAME) . $extension;

        $validatedData['video_final'] = $videoName;
        $respuesta = $revision->update($validatedData);

        if(!$respuesta){
            return back()->with('error', 'Error al realizar la revision');
        }

        return back()->with('success', 'Revision realizada correctamente');
    }   
}