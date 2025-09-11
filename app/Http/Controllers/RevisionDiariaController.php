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
use Illuminate\Validation\ValidationException;

class RevisionDiariaController extends Controller
{
    public function index(Request $request, string $placa)
    {
        $vehiculo = Vehiculo::where('placa', $placa)->first();

        if (!$vehiculo) {
            return redirect()->route('dashboard')->with('mensaje', 'Placa no encontrada');
        }
<<<<<<< HEAD

        if ($vehiculo->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
=======
        if ($vehiculo->user_id !== Auth::id() && !$request->user()->hasRole('admin')) {
>>>>>>> a3785076cc2bdd97d7a5454f1f6004afab6ef0e8
            abort(403, 'No autorizado');
        }

        $fechaActual = Carbon::now();
        $revisionDiaria = RevisionesDiarias::where('vehiculo_id', $placa)->whereDate('fecha_creacion', $fechaActual)->get();

        $modo = Auth::user()->hasRole('admin') ? 'admin' : 'normal';

        if (!$revisionDiaria->isEmpty()) {
            $imageUrls = $revisionDiaria->map(function ($revision) {
                return asset('storage/uploads/fotos-diarias/' . $revision->imagen);
            })->all();
            return Inertia::render('revisionFluidos', [
                'vehiculoId' => $placa,
                'revisionDiaria' => $revisionDiaria,
                'imageUrl' => $imageUrls,
                'modo' => $modo,
            ]);
        }

        return Inertia::render('revisionFluidos', [
            'vehiculoId' => $placa,
            'modo' => $modo,
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
