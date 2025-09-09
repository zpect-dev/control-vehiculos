<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
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

        return Inertia::render('dashboard', [
            'vehiculos' => $vehiculos,
            'modo' => $modo,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }
}
