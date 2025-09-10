<?php

namespace App\Http\Controllers;

use App\Models\RevisionesDiarias;
use App\Models\Vehiculo;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Auth;

class RevisionDiariaController extends Controller
{
    public function index(string $placa)
    {
        $vehiculo = Vehiculo::where('placa', $placa)->first();
        if(!$vehiculo){
            return redirect()->route('dashboard')->with('mensaje', 'Placa no entontrada');
        }
        if ($vehiculo->user_id !== Auth::id()) {
            abort(403, 'No autorizado');
        }

        $fechaActual = Carbon::now();
        $revisionDiaria = RevisionesDiarias::where('vehiculo_id', $placa)->whereDate('fecha_creacion', $fechaActual)->get();
        
        if(!$revisionDiaria->isEmpty()){
            $imageUrls = $revisionDiaria->map(function ($revision) {
                return asset('storage/uploads/fotos-diarias/' . $revision->imagen);
            })->all();
            return Inertia::render('revisionFluidos', [
                'vehiculoId' => $placa,
                'revisionDiaria' => $revisionDiaria,
                'imageUrl' => $imageUrls
            ]);
        }

        return Inertia::render('revisionFluidos', [
            'vehiculoId' => $placa,
        ]);
    }

    public function store(Request $request, string $placa)
    {
        $manager = new ImageManager(new Driver());
        $vehiculo = Vehiculo::where('placa', $placa)->first();

        if(!$vehiculo){
            return redirect()->route('dashboard')->with('mensaje', 'Placa no entontrada');
        }
        if ($vehiculo->user_id !== Auth::id()) {
            abort(403, 'No autorizado');
        }
        if (!$request->hasFile('*.imagen')) {
            return redirect()->back()->with(['mensaje' => 'Debe subir las imagenes a la plataforma']);
        }

        $validatedData = $request->validate([
            '*.tipo' => 'required',
            '*.vehiculo_id' => 'required|max:255',
            '*.nivel_fluido' => 'required',
            '*.revisado' => 'required',
            '*.imagen' => 'required|image|max:5120',
        ]);


        foreach($validatedData as $revision){
            $image = $revision['imagen'];
            
            $nameImage = Str::uuid() . "." . $image->extension();
            
            $serverImage = $manager->read($image);
            $serverImage->cover(1000, 1000);
            
            $targetPath = 'uploads/fotos-diarias';
            
            if (!Storage::disk('public')->exists($targetPath)) {
                Storage::disk('public')->makeDirectory($targetPath);
            }
            
            $serverImage->save(storage_path('app/public/' . $targetPath . '/' . $nameImage));

            RevisionesDiarias::create([
                'vehiculo_id' => $placa,
                'user_id' => $vehiculo->user_id,
                'nivel_fluido' => $revision['nivel_fluido'],
                'imagen' => $nameImage,
                'revisado' => true,
                'tipo' => $revision['tipo'],
            ]);
        }
        return back()->with([
            'vehiculoId' => $placa,
            'flash' => 'Revision de fluidos cargado correctamente'
        ]);
    }
}