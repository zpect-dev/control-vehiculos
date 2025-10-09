<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class PistaController extends Controller
{
    public function index(Request $request)
    {
        // 1. Lista de cédulas permitidas
        $cedulasPermitidas = ['26686508', '26686507'];

        // 2. Obtener nombres de usuarios por cédula (email)
        $userNames = User::whereIn('email', $cedulasPermitidas)->pluck('name');

        // 3. Obtener fecha enviada desde el frontend
        $date = $request->input('date');

        // 4. Construir la consulta con filtro por fecha si se proporciona
        $query = ActivityLog::whereIn('name', $userNames);

        if ($date) {
            $query->whereDate('created_at', $date);
        }

        $pistas = $query->get();

        // 5. Agrupar los datos para la tabla matricial
        $activityMatrix = $pistas->groupBy('name')
            ->map(function ($activities, $name) {
                $actions = $activities->groupBy('accion')
                    ->map(function ($actions) {
                        return count($actions);
                    });
                return [
                    'name' => $name,
                    'actions' => $actions,
                ];
            })->values();

        // 6. Obtener encabezados únicos
        $administrators = $pistas->pluck('name')->unique()->sort()->values();
        $actions = $pistas->pluck('accion')->unique()->sort()->values();

        // 7. Enviar datos a la vista con el filtro aplicado
        return Inertia::render('pistas', [
            'activityMatrix' => $activityMatrix,
            'administrators' => $administrators,
            'actions' => $actions,
            'filters' => [
                'date' => $date,
            ],
        ]);
    }
}
