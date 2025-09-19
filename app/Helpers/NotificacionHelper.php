<?php

namespace App\Helpers;

use App\Events\ChequeoOmitido;
use App\Events\EventoCambioInputs;
use App\Events\EventoAsignacionUsuario;
use App\Events\EventoNivelBajo;
use App\Events\EventoPermisoPorVencer;
use App\Events\NotificacionPush;
use App\Events\ObservacionAgregada;
use App\Events\VideoSemanalOmitido;
use App\Models\Notificacion;
use App\Models\User;

class NotificacionHelper
{

    /**
     * Emite y guarda una notificación de cambio de inputs
     */

    public static function emitirCambioCritico(string $field, int|string $value, string $formType, string $placa, string $userName): void
    {
        broadcast(new EventoCambioInputs($field, $value, $formType, $placa, $userName))->toOthers();

        $admin = User::role('admin')->first();

        Notificacion::create([
            'titulo' => 'Cambio crítico en formulario',
            'vehiculo_id' => $placa,
            'descripcion' => "El campo '{$field}' del formulario '{$formType}' para el vehículo '{$placa}' fue modificado por {$userName}. Nuevo valor: '{$value}'",
            'tipo' => 'cambioInput',
            'usuario_id' => $admin->id,
            'solo_admin' => true,
        ]);
        broadcast(new NotificacionPush($admin->id))->toOthers();
    }

    /**
     * Emite y guarda una notificación de asignacion de usuario
     */

    public static function emitirAsignacionUsuario(string $placa, string $adminName, string $nuevoUsuario): void
    {
        broadcast(new EventoAsignacionUsuario($placa, $adminName, $nuevoUsuario))->toOthers();

        $admin = User::role('admin')->first();

        Notificacion::create([
            'titulo' => 'Reasignación de usuario',
            'vehiculo_id' => $placa,
            'descripcion' => "El administrador {$adminName} reasignó el vehículo '{$placa}' al usuario {$nuevoUsuario}.",
            'tipo' => 'reasignacion',
            'usuario_id' => $admin->id,
            'solo_admin' => true,
        ]);
        broadcast(new NotificacionPush($admin->id))->toOthers();
    }

    /**
     * Emite y guarda una notificación de nivel de fluido bajo.
     */
    public static function emitirNivelBajo(string $placa, string $userName, string $campo, string $formulario): void
    {
        $admin = User::role('admin')->first();

        Notificacion::create([
            'titulo' => 'Nivel de Fluido Bajo',
            'vehiculo_id' => $placa,
            'descripcion' => "El vehículo '{$placa}' tiene un nivel bajo en el campo '{$campo}' del formulario '{$formulario}'. Notificado por '{$userName}'.",
            'tipo' => 'nivelFluido',
            'usuario_id' => $admin->id,
            'solo_admin' => true,
        ]);
        broadcast(new EventoNivelBajo($placa, $userName, $campo, $formulario))->toOthers();
    }

    /**
     * Emite y guarda una notificación de chequeo omitido.
     */
    public static function emitirChequeoOmitido(string $placa, string $userName, string $fecha): void
    {
        $admin = User::role('admin')->first();

        Notificacion::create([
            'titulo' => 'Chequeo Omitido',
            'vehiculo_id' => $placa,
            'descripcion' => "El vehículo '{$placa}' no realizó el chequeo programado para el {$fecha}. Responsable: '{$userName}'.",
            'tipo' => 'chequeoOmitido',
            'usuario_id' => $admin->id,
            'solo_admin' => true,
        ]);
        broadcast(new ChequeoOmitido($placa, $userName, $fecha))->toOthers();
    }

    /**
     * Emite y guarda una notificación de permiso por vencer.
     */
    public static function emitirPermisoPorVencer(string $placa, string $userName, string $permiso, string $fechaVencimiento): void
    {
        $admin = User::role('admin')->first();

        Notificacion::create([
            'titulo' => 'Permiso por Vencer',
            'vehiculo_id' => $placa,
            'descripcion' => "El permiso '{$placa}' del vehículo '{$placa}' vence pronto, el {$fechaVencimiento}. Responsable: '{$userName}'.",
            'tipo' => 'permiso',
            'usuario_id' => $admin->id,
            'solo_admin' => true,
        ]);
        broadcast(new EventoPermisoPorVencer($placa, $userName, $permiso, $fechaVencimiento))->toOthers();
    }

    /**
     * Emite y guarda una notificación de video semanal omitido.
     */
    public static function emitirVideoSemanalOmitido(string $placa, string $userName, string $semana): void
    {
        $admin = User::role('admin')->first();

        Notificacion::create([
            'titulo' => 'Video Semanal Omitido',
            'vehiculo_id' => $placa,
            'descripcion' => "El usuario '{$userName}' ha omitido el video semanal del vehículo '{$placa}' correspondiente a la semana {$semana}.",
            'tipo' => 'revisionSemanal',
            'usuario_id' => $admin->id,
            'solo_admin' => true,
        ]);
        broadcast(new VideoSemanalOmitido($placa, $userName, $semana))->toOthers();
    }

    /**
     * Emite y guarda una notificación cuando se agrega una observación.
     */
    public static function emitirObservacionAgregada(string $placa, string $userName, string $contenido, string $estado): void
    {
        $admin = User::role('admin')->first();

        Notificacion::create([
            'titulo' => 'Nueva Observación Agregada',
            'vehiculo_id' => $placa,
            'descripcion' => "El usuario '{$userName}' agregó una observación al vehículo '{$placa}' con estado '{$estado}': \"{$contenido}\"",
            'tipo' => 'observacion',
            'usuario_id' => $admin->id,
            'solo_admin' => true,
        ]);
        broadcast(new ObservacionAgregada($placa, $userName, $contenido, $estado))->toOthers();
    }
}
