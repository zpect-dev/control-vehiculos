<?php

namespace App\Http\Controllers;

use App\Services\AdminRoleAssigner;
use Illuminate\Http\Request;

class AdminRoleController extends Controller
{
    public function index()
    {
        return view('asignar');
    }

    public function assign(Request $request)
    {
        $request->validate([
            'email' => 'required|exists:users,email'
        ]);
        
        $success = AdminRoleAssigner::assignToUser($request->email);

        return back()->with($success ? 'seccess' : 'error', $success
            ? 'Rol admin asignado correctamente'
            : 'No se encontro el usuario');
    }
}
