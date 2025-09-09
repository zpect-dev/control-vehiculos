<?php

namespace App\Http\Controllers\FichaTecnica;

use App\Http\Controllers\Controller;
use App\Models\Vehiculo;
use App\Models\VehiculoEspecificaciones;
use App\Models\VehiculoPermisos;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FichaTecnicaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $modo = $user->hasRole('admin') ? 'admin' : 'usuario';

        $vehiculos = $modo === 'admin'
            ? Vehiculo::with('usuario')->get()
            : Vehiculo::with('usuario')->where('user_id', $user->id)->get();

        $expedientesTecnicosPorVehiculo = [];
        $permisosPorVehiculo = [];

        foreach ($vehiculos as $vehiculo) {
            $placa = $vehiculo->placa;

            // Expediente Técnico
            $expediente = VehiculoEspecificaciones::where('vehiculo_id', $placa)->get();
            $expedientesTecnicosPorVehiculo[$placa] = $expediente->pluck('estado', 'especificacion_id')->toArray();

            // Permisología
            $permisos = VehiculoPermisos::where('vehiculo_id', $placa)->get();
            $permisosPorVehiculo[$placa] = [];

            foreach ($permisos as $permiso) {
                $config = $this->mapaPermisos()[$permiso->permiso_id] ?? null;
                if (!$config) continue;

                $campo = $config['campo'];
                $tipo = $config['tipo'];

                if ($tipo === 'text') {
                    $permisosPorVehiculo[$placa][$campo] = $permiso->valor_texto;
                } else {
                    $permisosPorVehiculo[$placa]["{$campo}_expedicion"] = $permiso->fecha_expedicion;
                    $permisosPorVehiculo[$placa]["{$campo}_vencimiento"] = $permiso->fecha_vencimiento;
                }
            }
        }

        return Inertia::render('fichaTecnica', [
            'vehiculos' => $vehiculos,
            'expedientesTecnicos' => $expedientesTecnicosPorVehiculo,
            'permisosGuardados' => $permisosPorVehiculo,
            'modo' => $modo,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    public function show(Request $request, string $placa)
    {
        $vehiculo = Vehiculo::with('usuario')->where('placa', $placa)->firstOrFail();
        $modo = $request->user()->hasRole('admin') ? 'admin' : 'usuario';

        $expediente = VehiculoEspecificaciones::where('vehiculo_id', $placa)->get();
        $expedientesTecnicosPorVehiculo = [
            $placa => $expediente->pluck('estado', 'especificacion_id')->toArray()
        ];

        $permisos = VehiculoPermisos::where('vehiculo_id', $placa)->get();
        $permisosPorVehiculo = [$placa => []];

        foreach ($permisos as $permiso) {
            $config = $this->mapaPermisos()[$permiso->permiso_id] ?? null;
            if (!$config) continue;

            $campo = $config['campo'];
            $tipo = $config['tipo'];

            if ($tipo === 'text') {
                $permisosPorVehiculo[$placa][$campo] = $permiso->valor_texto;
            } else {
                $permisosPorVehiculo[$placa]["{$campo}_expedicion"] = $permiso->fecha_expedicion;
                $permisosPorVehiculo[$placa]["{$campo}_vencimiento"] = $permiso->fecha_vencimiento;
            }
        }

        return Inertia::render('fichaTecnica', [
            'vehiculos' => [$vehiculo],
            'expedientesTecnicos' => $expedientesTecnicosPorVehiculo,
            'permisosGuardados' => $permisosPorVehiculo,
            'modo' => $modo,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    public function storeExpediente(Request $request, string $placa)
    {
        $data = $request->except('vehiculo_id');

        foreach ($data as $especificacion_id => $estado) {
            VehiculoEspecificaciones::updateOrCreate(
                ['vehiculo_id' => $placa, 'especificacion_id' => $especificacion_id],
                ['estado' => $estado]
            );
        }

        return redirect()->back()->with('success', 'Expediente técnico actualizado correctamente.');
    }

    public function storePermisos(Request $request, string $placa)
    {
        $data = $request->except('vehiculo_id');

        foreach ($this->mapaPermisos() as $permiso_id => $config) {
            $campo = $config['campo'];
            $tipo = $config['tipo'];

            $registro = VehiculoPermisos::firstOrNew([
                'vehiculo_id' => $placa,
                'permiso_id' => $permiso_id,
            ]);

            if ($tipo === 'text') {
                $registro->valor_texto = array_key_exists($campo, $data) ? $data[$campo] : null;
            } else {
                $registro->fecha_expedicion = $data["{$campo}_expedicion"] ?? null;
                $registro->fecha_vencimiento = $data["{$campo}_vencimiento"] ?? null;
            }

            $registro->save();
        }

        return redirect()->back()->with('success', 'Permisología actualizada correctamente.');
    }

    public function storeAccesorios(Request $request, string $placa)
    {
        $data = $request->except('vehiculo_id');

        $vehiculo = Vehiculo::where('placa', $placa)->firstOrFail();

        foreach ($data as $accesorio_id => $estado) {
            $vehiculo->accesorios()->updateOrCreate(
                ['accesorio_id' => $accesorio_id],
                ['estado' => $estado]
            );
        }

        return redirect()->back()->with('success', 'Accesorios actualizados correctamente.');
    }

    private function mapaPermisos(): array
    {
        return [
            1 => ['campo' => 'titulo', 'tipo' => 'text'],
            2 => ['campo' => 'carnet', 'tipo' => 'text'],
            3 => ['campo' => 'seguro', 'tipo' => 'date'],
            4 => ['campo' => 'roct', 'tipo' => 'date'],
            5 => ['campo' => 'permisoRotReg', 'tipo' => 'date'],
            6 => ['campo' => 'permisoRotNac', 'tipo' => 'date'],
            7 => ['campo' => 'salvoconducto', 'tipo' => 'date'],
            8 => ['campo' => 'permisoAliMed', 'tipo' => 'date'],
            9 => ['campo' => 'trimestres', 'tipo' => 'date'],
        ];
    }
}
