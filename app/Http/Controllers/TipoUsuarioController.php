<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class TipoUsuarioController extends Controller
{
    public function index()
    {
        return view('asignar-tipo');
    }

    public function assign(Request $request)
    {
        $request->validate([
            'email' => 'required|exists:users,email',
            'tipo' => 'required|in:moto,carro'
        ]);

        $user = User::where('email', $request->email)->first();
        $user->tipo = strtoupper($request->tipo);
        $user->save();

        return back();
    }
}
