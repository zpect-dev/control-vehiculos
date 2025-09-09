<?php

namespace App\Http\Controllers\FichaTecnica;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VehiculoPermisos;

class PermisologiaController extends Controller
{
    public function store(Request $request, string $placa)
    {
        $vehiculoId = $placa;

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

        foreach ($mapaPermisos as $campo => $config) {
            $permisoId = $config['id'];
            $tipo = $config['tipo'];

            if ($tipo === 'text') {
                $valor = $request->input($campo);
                if ($valor !== null && $valor !== '') {
                    VehiculoPermisos::updateOrCreate(
                        [
                            'user_id' => $request->user()->id,
                            'vehiculo_id' => $vehiculoId,
                            'permiso_id' => $permisoId,
                        ],
                        [
                            'valor_texto' => $valor,
                            'estado' => true,
                            'fecha_expedicion' => null,
                            'fecha_vencimiento' => null,
                        ]
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

                    VehiculoPermisos::updateOrCreate(
                        [
                            'user_id' => $request->user()->id,
                            'vehiculo_id' => $vehiculoId,
                            'permiso_id' => $permisoId,
                        ],
                        [
                            'estado' => $estado,
                            'fecha_expedicion' => $expedicion,
                            'fecha_vencimiento' => $vencimiento,
                            'valor_texto' => null,
                        ]
                    );
                }
            }
        }

        // Construir respuesta con datos actualizados
        $permisosActualizados = VehiculoPermisos::where('vehiculo_id', $vehiculoId)
            ->get()
            ->groupBy('permiso_id')
            ->map(function ($items) {
                $permiso = $items->first();
                return [
                    'fecha_expedicion' => $permiso->fecha_expedicion,
                    'fecha_vencimiento' => $permiso->fecha_vencimiento,
                    'valor_texto' => $permiso->valor_texto,
                    'estado' => $permiso->estado,
                ];
            });

        return redirect()->route('fichaTecnica.show', $vehiculoId)->with([
            'success' => 'Permisología guardada correctamente.',
            'permisosGuardados' => [$vehiculoId => $permisosActualizados],
        ]);
    }
}
