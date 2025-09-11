<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RevisionDiariaController extends Controller
{
<<<<<<< Updated upstream
    public function index()
    {
        return inertia('revisionFluidos');
=======
    public function index(Request $request, string $placa)
    {
        $vehiculo = Vehiculo::where('placa', $placa)->first();
        if(!$vehiculo){
            return redirect()->route('dashboard')->with('mensaje', 'Placa no entontrada');
        }
        if ($vehiculo->user_id !== Auth::id() && !$request->user()->hasRole('admin')) {
            abort(403, 'No autorizado');
        }

        $semanaMap = [
            'Monday' => 0,
            'Tuesday' => 1,
            'Wednesday' => 2,
            'Thursday' => 3,
            'Friday' => 4,
            'Saturday' => 5,
            'Sunday' => 6
        ];

        $fechaActual = Carbon::today()->setTime(23, 59)->toImmutable();
        $diaActual = $fechaActual->isoFormat('dddd');

        $inicioSemana = $fechaActual->subDays($semanaMap[$diaActual]);

        $revisionDiaria = RevisionesDiarias::where('vehiculo_id', $placa)
                                            ->whereBetween('fecha_creacion', [$inicioSemana, $fechaActual])
                                            ->get();

        $revisionesDiarias = [];

        foreach ($revisionDiaria as $revision) {
            $dia = Carbon::parse($revision->fecha_creacion)->isoFormat('dddd');
            $revision->imagen = asset('storage/uploads/fotos-diarias/' . $revision->imagen);

            if (!isset($revisionesDiarias[$dia])) {
                $revisionesDiarias[$dia] = [];
            }
            $revisionesDiarias[$dia][] = $revision;
        }

        dd($revisionesDiarias);

        if(!$revisionDiaria->isEmpty()){
            return Inertia::render('revisionFluidos', [
                'vehiculoId' => $placa,
                'revisionesDiarias' => $revisionesDiarias,
            ]);
        }

        return Inertia::render('revisionFluidos', [
            'vehiculoId' => $placa,
        ]);
>>>>>>> Stashed changes
    }

    public function store(Request $request, string $placa)
    {
<<<<<<< Updated upstream
        
=======
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
>>>>>>> Stashed changes
    }
}
