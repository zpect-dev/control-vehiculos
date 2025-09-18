<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\Multimedia;

class UsersController extends Controller
{
    public function index(Request $request){
        $usuarios = User::all();
        
        return Inertia::render('nombre_vista', [
            'usuarios' => $usuarios
        ]);
    }

    public function show(Request $request, User $user){
        return Inertia::render('nombre_vista', [
            'usuario' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        $documentos = [
            'cedula', 
            'licencia', 
            'certificado_medico',
            'seguro_civil', 
            'carnet_circulacion', 
            'solvencia',
        ];

        $rules = ['zona' => 'nullable|string'];

        foreach ($documentos as $doc) {
            $rules["foto_$doc"] = 'nullable|image';
            $rules["vencimiento_$doc"] = 'nullable|date';
        }

        $validatedData = $request->validate($rules);
        $multimedia = new Multimedia();

        foreach ($validatedData as $key => $value) {
            if ($value instanceof \Illuminate\Http\UploadedFile) {
                $nameImage = $multimedia->guardarImagen($value, 'documentos');
                if (!$nameImage) {
                    return back()->with('error', 'Error al almacenar los documentos');
                }
                $validatedData[$key] = $nameImage;
            }
        }

        if (!$user->update($validatedData)) {
            return back()->with('error', 'Error al actualizar la base de datos');
        }

        return back()->with('success', 'Documentos actualizados correctamente');
    }
}
