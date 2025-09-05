<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RevisionSemanalController extends Controller
{
    public function index()
    {
        $vehiculo = Vehiculo::with('usuario')->where('user_id', Auth::id())->first();

        if (!$vehiculo) {
            return Inertia::render('revisionSemanal', [
                'vehiculo' => null,
                'mensaje' => 'No tienes un vehículo asignado.',
            ]);
        }
        return Inertia::render('revisionSemanal', [
            'vehiculo' => $vehiculo,
        ]);
    }
}
