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

class RevisionDiariaController extends Controller
{
    public function index(string $placa)
    {
        return Inertia::render('revisionFluidos', [
            'vehiculoId' => $placa
        ]);
    }

    public function store(Request $request, string $placa)
    {
        $manager = new ImageManager(new Driver());

        $validatedData = $request->validate([
            '*.tipo' => 'required',
            '*.vehiculo_id' => 'required|max:255',
            '*.nivel_fluido' => 'required',
            '*.revisado' => 'required',
            '*.imagen' => 'required|image|max:5120',
        ]);

        $vehiculo = Vehiculo::where('placa', $placa)->first();

        foreach($validatedData as $revision){
            if (!$request->hasFile('*.imagen')) {
                return redirect()->back()->withErrors(['image' => 'No se pudo subir la imagen.']);
            }
            $image = $revision['imagen'];
            
            $nameImage = Str::uuid() . "." . $image->extension();
            
            $serverImage = $manager->read($image);
            $serverImage->cover(1000, 1000);
            
            $targetPath = 'uploads';
            
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