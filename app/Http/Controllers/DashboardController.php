<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use App\Models\Notificacion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $modo = $user->hasRole('admin') ? 'admin' : 'user';

        $vehiculos = $modo === 'admin'
            ? Vehiculo::with('usuario')->get()
            : Vehiculo::with('usuario')->where('user_id', $user->id)->get();

        $notificaciones = $modo === 'admin'
            ? Notificacion::where('usuario_id', $user->id)
            ->where('solo_admin', true)
            ->orderByDesc('created_at')
            ->get()
            : [];

        return Inertia::render('dashboard', [
            'vehiculos' => $vehiculos,
            'modo' => $modo,
            'notificaciones' => $notificaciones,
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'is_admin' => $user->hasRole('admin'),
                ],
            ],
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }
}
