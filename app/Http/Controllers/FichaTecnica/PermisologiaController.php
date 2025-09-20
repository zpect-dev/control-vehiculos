<?php

namespace App\Http\Controllers\FichaTecnica;

use App\Helpers\NotificacionHelper;
use App\Helpers\FlashHelper;
use App\Http\Controllers\Controller;
use App\Models\Vehiculo;
use Illuminate\Http\Request;
use App\Models\VehiculoPermisos;
use App\Services\Multimedia;
use Carbon\Carbon;

class PermisologiaController extends Controller
{
    public function store(Request $request, Vehiculo $vehiculo)
    {
        return FlashHelper::try(function () use ($request, $vehiculo) {
            $usuario = $request->user()->name;

            $mapaPermisos = [
                'titulo' => ['id' => 1, 'tipo' => 'text'],
                'carnet' => ['id' => 2, 'tipo' => 'text'],
                'seguro' => ['id' => 3, 'tipo' => 'date'],
                'roct' => ['id' => 4, 'tipo' => 'date'],
                'permisoRotReg' => ['id' => 5, 'tipo' => 'date'],
                'permisoRotNac' => ['id' => 6, 'tipo' => 'date'],
                'salvoconducto' => ['id' => 7, 'tipo' => 'date'],
                'permisoAliMed' => ['id' => 8, 'tipo' => 'date'],
                'trimestres' => ['id' => 9, 'tipo' => 'date'],
            ];

            $multimedia = new Multimedia;

            foreach ($mapaPermisos as $campo => $config) {
                $permisoId = $config['id'];
                $tipo = $config['tipo'];

                $archivo = $request->file("{$campo}_archivo");
                $documento = null;

                if ($archivo) {
                    $mime = $archivo->getClientMimeType();
                    if ($mime === 'application/pdf') {
                        $documento = $multimedia->guardarArchivoPdf($archivo, 'pdf');
                    } else {
                        $documento = $multimedia->guardarImagen($archivo, 'documentos');
                    }
                }

                if ($tipo === 'text') {
                    $valor = $request->input($campo);
                    if ($valor !== null && $valor !== '') {
                        $datos = [
                            'valor_texto' => $valor,
                            'estado' => true,
                            'fecha_expedicion' => null,
                            'fecha_vencimiento' => null,
                        ];
                        if ($documento) {
                            $datos['documento'] = $documento;
                        }

                        VehiculoPermisos::updateOrCreate(
                            [
                                'user_id' => $request->user()->id,
                                'vehiculo_id' => $vehiculo->placa,
                                'permiso_id' => $permisoId,
                            ],
                            $datos
                        );
                    }
                } else {
                    $expedicion = $request->input("{$campo}_expedicion");
                    $vencimiento = $request->input("{$campo}_vencimiento");

                    if ($expedicion && $vencimiento && $vencimiento < $expedicion) {
                        continue;
                    }

                    if ($expedicion || $vencimiento) {
                        $estado = $vencimiento ? now()->lt($vencimiento) : true;

                        $datos = [
                            'estado' => $estado,
                            'fecha_expedicion' => $expedicion,
                            'fecha_vencimiento' => $vencimiento,
                            'valor_texto' => null,
                        ];
                        if ($documento) {
                            $datos['documento'] = $documento;
                        }

                        VehiculoPermisos::updateOrCreate(
                            [
                                'user_id' => $request->user()->id,
                                'vehiculo_id' => $vehiculo->placa,
                                'permiso_id' => $permisoId,
                            ],
                            $datos
                        );

                        if ($vencimiento) {
                            $vencimientoCarbon = Carbon::parse($vencimiento)->startOfDay();
                            $diasRestantes = Carbon::today()->diffInDays($vencimientoCarbon, false);
                            $clave = "permiso_alertado_{$vehiculo->placa}_{$campo}_{$vencimientoCarbon->toDateString()}";

                            if (!session()->has($clave)) {
                                session()->put($clave, true);

                                if ($diasRestantes <= 15) {
                                    NotificacionHelper::emitirPermisoPorVencer(
                                        $vehiculo->placa,
                                        $usuario,
                                        ucfirst($campo),
                                        $vencimientoCarbon->toDateString()
                                    );
                                }
                            }
                        }
                    }
                }
            }

            $permisosActualizados = VehiculoPermisos::where('vehiculo_id', $vehiculo->placa)
                ->get()
                ->groupBy('permiso_id')
                ->map(function ($items) {
                    $permiso = $items->first();
                    return [
                        'fecha_expedicion' => $permiso->fecha_expedicion,
                        'fecha_vencimiento' => $permiso->fecha_vencimiento,
                        'valor_texto' => $permiso->valor_texto,
                        'estado' => $permiso->estado,
                        'documento' => $permiso->documento,
                    ];
                });

            session()->flash('permisosGuardados', [$vehiculo->placa => $permisosActualizados]);
        }, 'Permisología guardada correctamente.', 'Error al guardar la permisología.');
    }
}
