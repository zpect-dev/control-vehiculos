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
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class RevisionDiariaController extends Controller
{
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
            'monday' => 0,
            'tuesday' => 1,
            'wednesday' => 2,
            'thursday' => 3,
            'friday' => 4,
            'saturday' => 5,
            'sunday' => 6
        ];

        $fechaActual = Carbon::today()->toImmutable();
        $diaActual = strtolower($fechaActual->isoFormat('dddd'));

        $inicioSemana = $fechaActual->subDays($semanaMap[$diaActual])->setTime(00, 00);
        $finalSemana = $inicioSemana->addDays($semanaMap['friday'])->setTime(23, 59);

        $revisionDiaria = RevisionesDiarias::where('vehiculo_id', $placa)
                                            ->whereBetween('fecha_creacion', [$inicioSemana, $finalSemana])
                                            ->get();

        $revisionesDiarias = [];
        $modo = Auth::user()->hasRole('admin') ? 'admin' : 'normal';

        foreach ($revisionDiaria as $revision) {
            $dia = strtolower(Carbon::parse($revision->fecha_creacion)->isoFormat('dddd'));

            if (!isset($revisionesDiarias[$dia])) {
                $revisionesDiarias[$dia] = [];
            }
            $revision->imagen = asset('storage/uploads/fotos-diarias/' . $revision->imagen);
            $revisionesDiarias[$dia][] = $revision;
        }

        if(!$revisionDiaria->isEmpty()){
            return Inertia::render('revisionFluidos', [
                'vehiculoId' => $placa,
                'revisionDiaria' => $revisionesDiarias,
                'modo' => $modo
            ]);
        }

        return Inertia::render('revisionFluidos', [
            'vehiculoId' => $placa,
            'modo' => $modo
        ]);
    }

    public function store(Request $request, string $placa)
    {
        try {
            $validatedData = $request->validate([
                'fluidos' => 'required|array',
                'fluidos.*.tipo' => 'required|string',
                'fluidos.*.vehiculo_id' => 'required|string|max:255',
                'fluidos.*.dia' => 'required|string',
                'fluidos.*.nivel_fluido' => 'required|string',
                'fluidos.*.revisado' => 'required|string',
                'fluidos.*.imagen' => 'nullable|file|max:5120',
            ]);
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        }

        $vehiculo = Vehiculo::where('placa', $placa)->firstOrFail();
        $userId = Auth::user()->id;

        foreach ($validatedData['fluidos'] as $index => $revision) {
            $nameImage = null;

            $imageKey = "fluidos.{$index}.imagen";
            if ($request->hasFile($imageKey)) {
                $image = $request->file($imageKey);
                $nameImage = Str::uuid() . '.' . $image->extension();

                $serverImage = ImageManager::gd()->read($image);
                $serverImage->cover(1000, 1000);
                $targetPath = 'uploads/fotos-diarias';
                Storage::disk('public')->put($targetPath . '/' . $nameImage, $serverImage->encode());
            }

            RevisionesDiarias::create([
                'vehiculo_id' => $placa,
                'user_id' => $userId,
                'nivel_fluido' => $revision['nivel_fluido'],
                'imagen' => $nameImage,
                'revisado' => (bool)$revision['revisado'],
                'tipo' => $revision['tipo'],
            ]);
        }

        return redirect()->back()->with('success', 'Revisión diaria registrada correctamente.');
    }
}
