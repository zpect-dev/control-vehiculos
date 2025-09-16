<?php

namespace App\Http\Controllers;

use App\Events\EventoNivelBajo;
use App\Models\RevisionesDiarias;
use App\Models\Vehiculo;
use App\Services\Multimedia;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
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

            if ($revision->imagen) {
                $revision->imagen = '/storage/uploads/fotos-diarias/' . ltrim($revision->imagen, '/');
            }
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
            'fluidos.*.imagen' => 'required|file|image|max:5120',
        ]);

        $datos = [];

        foreach ($validatedData['fluidos'] as $revision) {
            $multimedia = new Multimedia;

            $nameImage = $multimedia->guardarImagen($revision['imagen']);

            if(!$nameImage) { return back()->with('error', 'Error al guardar la imagen'); }

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
        redirect()->back()->with('success', 'Revisión diaria registrada correctamente.');
    }
}
