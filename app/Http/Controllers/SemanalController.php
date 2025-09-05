<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SemanalController extends Controller
{
    public function index()
    {
        $vehiculo = Vehiculo::where('user_id', Auth::id())->first();
        if (!$vehiculo) {
            return Inertia::render('semanal', [
                'vehiculo' => null,
                'mensaje' => 'No tienes un vehículo asignado.',
            ]);
        }
        return Inertia::render('semanal', [
            'vehiculo' => $vehiculo,
        ]);
    }
}
