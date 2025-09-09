<?php

namespace App\Http\Controllers;

use App\Models\RevisionesDiarias;
use App\Models\Vehiculo;
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

        return Inertia::render('revisionFluidos', [
            'vehiculoId' => $placa
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
                'revision' => false,
                'tipo' => $revision['tipo'],
            ]);
        }
        return response()->json(['message' => 'Revision realizada correctamente para el vehiculo con placa: ' . $placa]);
    }
}