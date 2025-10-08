<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Vehiculo;
use Illuminate\Http\Request;
use App\Models\RevisionesSemanales;
use Illuminate\Support\Facades\Auth;
use App\Helpers\FlashHelper;
use App\Services\Multimedia;

class RevisionSemanalController extends Controller
{
    public function index(Request $request, Vehiculo $vehiculo)
    {
        $vehiculo->load('usuario');

        $inicioSemana = Carbon::now()->startOfWeek(Carbon::MONDAY)->toImmutable();
        $finalSemana = Carbon::now()->endOfWeek(Carbon::SUNDAY)->toImmutable();

        $revisionSemanal = RevisionesSemanales::where('vehiculo_id', $vehiculo->placa)
            ->whereBetween('created_at', [$inicioSemana, $finalSemana])
            ->get();

        foreach($revisionSemanal as $revision) {
            if ($revision) {
                $basePath = '/storage/uploads/fotos-semanales/';
                $revision->imagen = $basePath . ltrim($revision->imagen, '/');
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

    public function store(Request $request, Vehiculo $vehiculo){
        return FlashHelper::try(function () use ($request, $vehiculo) {
            $validatedData = $request->validate([
                'semanal' => 'required|array',
                'semanal.*.tipo' => 'required|string',
                'semanal.*.imagen' => 'required|image|max:5120',
                'semanal.*.observacion' => 'nullable|string'
            ]);
            
            $datos = [];
            foreach($validatedData['semanal'] as $revision){
                $multimedia = new Multimedia;
                $nameImage = $multimedia->guardarImagen($revision['imagen'], 'semanal');
                
                if(!$nameImage){
                    dd($validatedData);
                    throw new \Exception('Error al guardar la imagen');
                }

                $datos[] = [
                    'vehiculo_id' => $vehiculo->placa,
                    'user_id' => Auth::id(),
                    'imagen' => $nameImage,
                    'tipo' => $revision['tipo'],
                    'observacion' => $revision['observacion'] ?? '',
                    'created_at' => Carbon::today(),
                    'updated_at' => Carbon::today()
                ];
            }
            
            RevisionesSemanales::insert($datos);
        }, 'Revisión semanal cargada correctamente.', 'Error al registrar la revisión semanal.');
    

    }
    
    // public function store(Request $request, Vehiculo $vehiculo)
    // {
    //     return FlashHelper::try(function () use ($request, $vehiculo) {
    //         if (!$request->hasFile('imagen')) {
    //             throw new \Exception('Debe subir un video a la plataforma');
    //         }

    //         $request->validate([
    //             'video' => 'required|mimes:mp4,ogx,oga,ogv,ogg,webm',
    //         ]);
            
    //         // $KilometrajeFinal = RevisionesSemanales::select('kilometraje_final')->where('vehiculo_id', $vehiculo->placa)->latest()->first();
            
    //         // if($KilometrajeFinal && $KilometrajeFinal !== $validatedData['kilometraje_inicial']){
    //         //     return back()->with('error', 'El kilometraje no concuerda con el de la semana pasada, comunicarse con un administrador');   
    //         // }
            
    //         $videoPath = $request->file('video')->store('uploads/videos-semanales', 'public');
    //         $extension = "." . pathinfo($videoPath, PATHINFO_EXTENSION);
    //         $videoName = pathinfo($videoPath, PATHINFO_FILENAME) . $extension;
            
    //         RevisionesSemanales::create([
    //             'vehiculo_id' => $vehiculo->placa,
    //             'user_id' => Auth::id(),
    //             'video' => $videoName,
    //         ]);

    //     }, 'Revisión semanal cargada correctamente.', 'Error al registrar la revisión semanal.');
    // }

    // public function update(Request $request, Vehiculo $vehiculo, RevisionesSemanales $revision)
    // {
    //     $validatedData = $request->validate([
    //         'video_final' => 'required|mimes:mp4,ogx,oga,ogv,ogg,webm',
    //         'kilometraje_final' => 'required|numeric'
    //     ]);

    //     if ($validatedData['kilometraje_final'] < $revision->kilometraje_inicial) {
    //         return back()->with('error', 'El kilometraje final no puede ser menor al inicial');
    //     }
        
    //     $videoPath = $request->file('video_final')->store('uploads/videos-semanales', 'public');
    //     $extension = "." . pathinfo($videoPath, PATHINFO_EXTENSION);
    //     $videoName = pathinfo($videoPath, PATHINFO_FILENAME) . $extension;

    //     $validatedData['video_final'] = $videoName;
    //     $respuesta = $revision->update($validatedData);

    //     if(!$respuesta){
    //         return back()->with('error', 'Error al realizar la revision');
    //     }

    //     return back()->with('success', 'Revision realizada correctamente');
    // }   
}