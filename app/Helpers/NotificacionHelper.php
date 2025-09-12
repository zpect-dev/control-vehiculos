<?php

namespace App\Helpers;

use App\Events\EventoCambioInputs;
use App\Events\EventoAsignacionUsuario;
use App\Events\NotificacionPush;
use App\Models\Notificacion;
use App\Models\User;

class NotificacionHelper
{
    public static function emitirCambioCritico(string $field, int|string $value, string $formType, string $placa, string $userName): void
    {
        broadcast(new EventoCambioInputs($field, $value, $formType, $placa, $userName))->toOthers();

        $admins = User::role('admin')->get();

        foreach ($admins as $admin) {
            Notificacion::create([
                'titulo' => 'Cambio crítico en formulario',
                'descripcion' => "El campo '{$field}' del formulario '{$formType}' para el vehículo '{$placa}' fue modificado por {$userName}. Nuevo valor: '{$value}'",
                'tipo' => 'estado_item',
                'usuario_id' => $admin->id,
                'solo_admin' => true,
            ]);

            broadcast(new NotificacionPush($admin->id))->toOthers();
        }
    }

    public static function emitirAsignacionUsuario(string $placa, string $adminName, string $nuevoUsuario): void
    {
        broadcast(new EventoAsignacionUsuario($placa, $adminName, $nuevoUsuario))->toOthers();

        $admins = User::role('admin')->get();

        foreach ($admins as $admin) {
            Notificacion::create([
                'titulo' => 'Reasignación de usuario',
                'descripcion' => "El administrador {$adminName} reasignó el vehículo '{$placa}' al usuario {$nuevoUsuario}.",
                'tipo' => 'reasignacion',
                'usuario_id' => $admin->id,
                'solo_admin' => true,
            ]);

            broadcast(new NotificacionPush($admin->id))->toOthers();
        }
    }
}
