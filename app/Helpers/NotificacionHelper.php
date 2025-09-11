<?php

namespace App\Helpers;

use App\Events\EventoCambioInputs;
use App\Events\EventoAsignacionUsuario;

class NotificacionHelper
{
    public static function emitirCambioCritico(string $field, int|string $value, string $formType, string $placa, string $userName): void
    {
        broadcast(new EventoCambioInputs(
            $field,
            $value,
            $formType,
            $placa,
            $userName
        ))->toOthers();
    }

    public static function emitirAsignacionUsuario(string $placa, string $adminName, string $nuevoUsuario): void
    {
        broadcast(new EventoAsignacionUsuario(
            $placa,
            $adminName,
            $nuevoUsuario
        ))->toOthers();
    }
}
