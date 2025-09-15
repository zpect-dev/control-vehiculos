<?php

namespace App\Http\Controllers;

use App\Events\EventoNivelBajo;
use App\Models\RevisionesDiarias;
use App\Models\Vehiculo;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Auth;

class RevisionDiariaController extends Controller
{
    public function index(Request $request, Vehiculo $vehiculo)
    {
        // Validación de acceso con casting seguro
        if ((int) $vehiculo->user_id !== (int) Auth::id() && !$request->user()->hasRole('admin')) {
            abort(403, 'No autorizado');
        }

        $inicioSemana = Carbon::now()->startOfWeek(Carbon::MONDAY)->toImmutable();
        $finalSemana = Carbon::now()->endOfWeek(Carbon::FRIDAY)->toImmutable();

        $revisionDiaria = RevisionesDiarias::where('vehiculo_id', $vehiculo->placa)
            ->whereBetween('fecha_creacion', [$inicioSemana, $finalSemana])
            ->get();

        $revisionesDiarias = [];
        foreach ($revisionDiaria as $revision) {
            $dia = strtolower(Carbon::parse($revision->fecha_creacion)->isoFormat('dddd'));

            if (!isset($revisionesDiarias[$dia])) {
                $revisionesDiarias[$dia] = [];
            }

            $revision->imagen = '/storage/uploads/fotos-diarias/' . $revision->imagen;
            $revisionesDiarias[$dia][] = $revision;
        }

        return Inertia::render('revisionFluidos', [
            'vehiculoId' => $vehiculo->placa,
            'vehiculo' => $vehiculo,
            'revisionDiaria' => $revisionesDiarias,
            'modo' => Auth::user()->hasRole('admin') ? 'admin' : 'normal'
        ]);
    }

    public function store(Request $request, Vehiculo $vehiculo)
    {
        $validatedData = $request->validate([
            'fluidos' => 'required|array',
            'fluidos.*.tipo' => 'required|string',
            'fluidos.*.vehiculo_id' => 'required|string|max:255',
            'fluidos.*.dia' => 'required|string',
            'fluidos.*.nivel_fluido' => 'required|string',
            'fluidos.*.revisado' => 'required|string',
            'fluidos.*.imagen' => 'nullable|file|max:5120',
        ]);

        $datos = [];

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

            $nivel = $revision['nivel_fluido'];
            $tipo = $revision['tipo'];

            if ($nivel === '0') {
                broadcast(new EventoNivelBajo(
                    $vehiculo->placa,
                    Auth::user()->name,
                    $tipo,
                    'Revisión de Fluidos',
                    'BAJO'
                ))->toOthers();
            }

            $datos[] = [
                'vehiculo_id' => $vehiculo->placa,
                'user_id' => Auth::id(),
                'nivel_fluido' => $nivel,
                'imagen' => $nameImage,
                'revisado' => (bool)$revision['revisado'],
                'tipo' => $tipo,
            ];
        }

        RevisionesDiarias::insert($datos);
        return redirect()->back()->with('success', 'Revisión diaria registrada correctamente.');
    }
}
