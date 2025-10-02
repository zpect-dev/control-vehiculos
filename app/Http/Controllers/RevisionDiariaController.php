<?php

namespace App\Http\Controllers;

use App\Helpers\NotificacionHelper;
use App\Helpers\FlashHelper;
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
            $validatedData = $request->validate([
                'fluidos' => 'required|array',
                'fluidos.*.tipo' => 'nullable|string',
                'fluidos.*.vehiculo_id' => 'nullable|string|max:255',
                'fluidos.*.dia' => 'nullable|string',
                'fluidos.*.nivel_fluido' => 'nullable|string',
                'fluidos.*.revisado' => 'nullable|string',
                'fluidos.*.imagen' => 'nullable|image|max:5120',
            ]);

            $datos = [];
            foreach ($validatedData['fluidos'] as $revision) {

                if (!$revision['revisado']) {
                    continue;
                }
                
                if ($revision['revisado'] && !array_key_exists('imagen', $revision)) {
                    continue;
                }
                
                $multimedia = new Multimedia;
                $nameImage = $multimedia->guardarImagen($revision['imagen'], 'diario');
                
                if (!$nameImage) {
                    throw new \Exception('Error al guardar la imagen');
                }
                
                $nivel = $revision['nivel_fluido'];
                $tipo = $revision['tipo'];
                
                if ($nivel === '0') {
                    NotificacionHelper::emitirNivelBajo(
                        $vehiculo->placa,
                        Auth::user()->name,
                        $tipo,
                        'Revisión de Fluidos'
                    );
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
        }, 'Revisión diaria registrada correctamente.', 'Error al registrar la revisión diaria.');
    }
}
