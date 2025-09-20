<?php

namespace App\Http\Controllers;

use App\Helpers\NotificacionHelper;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\Multimedia;
use App\Helpers\FlashHelper;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        $usuarios = User::all();

        return Inertia::render('dashboardUsuarios', [
            'usuarios' => $usuarios
        ]);
    }

    public function show(Request $request, User $user)
    {
        $documentos = [
            'cedula',
            'licencia',
            'certificado_medico',
            'seguro_civil',
            'carnet_circulacion',
            'solvencia',
        ];

        $usuario = $user->toArray();

        foreach ($documentos as $doc) {
            $foto = "foto_$doc";
            if ($usuario[$foto]) {
                $usuario[$foto] = '/storage/uploads/fotos-documentos/' . ltrim($usuario[$foto], '/');
            }
        }

        //dd($usuario);

        return Inertia::render('perfilUsuario', [
            'usuario' => $usuario
        ]);
    }

    public function update(Request $request, User $user)
    {
        return FlashHelper::try(function () use ($request, $user) {
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
                $rules["foto_$doc"] = 'nullable|file|mimes:jpeg,png,jpg,webp';
                $rules["vencimiento_$doc"] = 'nullable|date';
            }

            $validatedData = $request->validate($rules);
            $multimedia = new Multimedia();

            foreach ($validatedData as $key => $value) {
                if ($value instanceof \Illuminate\Http\UploadedFile) {
                    $nameImage = $multimedia->guardarImagen($value, 'documentos');
                    if (!$nameImage) {
                        throw new \Exception("Error al almacenar el documento: $key");
                    }
                    $validatedData[$key] = $nameImage;
                }
            }

            $user->update($validatedData);

            // 🔔 Emitir notificación si algún documento está por vencer
            foreach ($documentos as $doc) {
                $campoVencimiento = "vencimiento_$doc";
                if (isset($validatedData[$campoVencimiento])) {
                    $fecha = \Carbon\Carbon::parse($validatedData[$campoVencimiento])->startOfDay();
                    $diasRestantes = \Carbon\Carbon::today()->diffInDays($fecha, false);

                    if ($diasRestantes <= 15) {
                        NotificacionHelper::emitirDocumentoUsuarioPorVencer(
                            $user->id,
                            $user->name,
                            ucfirst($doc),
                            $fecha->toDateString()
                        );
                    }
                }
            }
        }, 'Documentos actualizados correctamente.', 'Error al actualizar los documentos.');
    }
}
