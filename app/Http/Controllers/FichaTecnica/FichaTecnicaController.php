<?php

namespace App\Http\Controllers\FichaTecnica;

use App\Http\Controllers\Controller;
use App\Models\Vehiculo;
use App\Models\VehiculoEspecificaciones;
use App\Models\VehiculoPermisos;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Services\ConsultaSQL;

class FichaTecnicaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            $vehiculos = Vehiculo::with('usuario')->get();
            $modo = 'admin';
        } else {
            $vehiculos = Vehiculo::with('usuario')->where('user_id', $user->id)->get();
            $modo = 'usuario';
        }

        $expedientesTecnicosPorVehiculo = [];
        $permisosPorVehiculo = [];

        // Mapeo de IDs a nombres semánticos y tipo de campo
        $mapaPermisos = [
            1 => ['campo' => 'tipo', 'tipo' => 'text'],
            2 => ['campo' => 'carnet', 'tipo' => 'text'],
            3 => ['campo' => 'seguro', 'tipo' => 'date'],
            4 => ['campo' => 'roct', 'tipo' => 'date'],
            5 => ['campo' => 'permisoRotReg', 'tipo' => 'date'],
            6 => ['campo' => 'permisoRotNac', 'tipo' => 'date'],
            7 => ['campo' => 'salvoconducto', 'tipo' => 'date'],
            8 => ['campo' => 'permisoAliMed', 'tipo' => 'date'],
            9 => ['campo' => 'trimestres', 'tipo' => 'date'],
        ];

        foreach ($vehiculos as $vehiculo) {
            // Expediente Técnico
            $expediente = VehiculoEspecificaciones::where('vehiculo_id', $vehiculo->placa)->get();
            $expedientesTecnicosPorVehiculo[$vehiculo->placa] = $expediente->pluck('estado', 'especificacion_id')->toArray();

            // Permisología
            $permisos = VehiculoPermisos::where('vehiculo_id', $vehiculo->placa)->get();
            $permisosPorVehiculo[$vehiculo->placa] = [];

            foreach ($permisos as $permiso) {
                $config = $mapaPermisos[$permiso->permiso_id] ?? null;
                if (!$config) continue;

                $campo = $config['campo'];
                $tipo = $config['tipo'];

if ($tipo === 'text') {
    $permisosPorVehiculo[$vehiculo->placa][$campo] = $permiso->valor_texto;
} else {
    $permisosPorVehiculo[$vehiculo->placa]["{$campo}_expedicion"] = $permiso->fecha_expedicion;
    $permisosPorVehiculo[$vehiculo->placa]["{$campo}_vencimiento"] = $permiso->fecha_vencimiento;
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

        $mapaPermisos = [
            1 => ['campo' => 'tipo', 'tipo' => 'text'],
            2 => ['campo' => 'carnet', 'tipo' => 'text'],
            3 => ['campo' => 'seguro', 'tipo' => 'date'],
            4 => ['campo' => 'roct', 'tipo' => 'date'],
            5 => ['campo' => 'permisoRotReg', 'tipo' => 'date'],
            6 => ['campo' => 'permisoRotNac', 'tipo' => 'date'],
            7 => ['campo' => 'salvoconducto', 'tipo' => 'date'],
            8 => ['campo' => 'permisoAliMed', 'tipo' => 'date'],
            9 => ['campo' => 'trimestres', 'tipo' => 'date'],
        ];

        $permisos = VehiculoPermisos::where('vehiculo_id', $placa)->get();
        $permisosPorVehiculo = [
            $placa => [],
        ];

        foreach ($permisos as $permiso) {
            $config = $mapaPermisos[$permiso->permiso_id] ?? null;
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

    public function create() {}
    public function store(Request $request) {}
    public function edit(string $id) {}
    public function update(Request $request, string $id) {}
    public function destroy(string $id) {}
}
