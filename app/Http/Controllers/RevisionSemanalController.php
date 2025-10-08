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
use Illuminate\Support\Facades\Validator;

class RevisionSemanalController extends Controller
{
    public function index(Request $request, Vehiculo $vehiculo)
    {
        $vehiculo->load('usuario');

        $inicioSemana = Carbon::now()->startOfWeek(Carbon::MONDAY)->toImmutable();
        $finalSemana = Carbon::now()->endOfWeek(Carbon::SUNDAY)->toImmutable();

        $revisionSemanal = RevisionesSemanales::where('vehiculo_id', $vehiculo->placa)
            ->whereBetween('created_at', [$inicioSemana, $finalSemana])
            ->first();

        if ($revisionSemanal) {
            $basePath = '/storage/uploads/fotos-semanales/';
            $revisionSemanal->imagen = $basePath . ltrim($revisionSemanal->imagen, '/');
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

    public function store(Request $request, Vehiculo $vehiculo)
{
    return FlashHelper::try(function () use ($request, $vehiculo) {
        $validator = Validator::make($request->all(), [
            'semanal' => 'required|array',
            'semanal.*.tipo' => 'required|string',
            'semanal.*.imagen' => 'required|file|image|max:5120',
            'semanal.*.observacion' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            throw new \Exception('Validación fallida: ' . $validator->errors()->first());
        }

        $datos = [];
        foreach ($request->input('semanal') as $index => $revision) {
            $file = $request->file("semanal.$index.imagen");

            $multimedia = new Multimedia;
            $nameImage = $multimedia->guardarImagen($file, 'semanal');

            if (!$nameImage) {
                throw new \Exception('Error al guardar la imagen');
            }

            $datos[] = [
                'vehiculo_id' => $vehiculo->placa,
                'user_id' => Auth::id(),
                'imagen' => $nameImage,
                'tipo' => $revision['tipo'],
                'observacion' => $revision['observacion'] ?? '',
            ];
        }

        RevisionesSemanales::insert($datos);
    }, 'Revisión semanal cargada correctamente.', 'Error al registrar la revisión semanal.');
}
}