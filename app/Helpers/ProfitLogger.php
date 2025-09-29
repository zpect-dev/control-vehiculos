<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Ramsey\Uuid\Uuid;

class ProfitLogger
{
    public static function pista(string $tabla, int $numDoc = 0, string $tipoOp = 'I', string $empresa = 'VEHI24')
    {
        $pista = [
            "usuario_id" => "VEHI99",
            "usuario" => Auth::user()?->name ?? 'SISTEMA_CONTROL_VEHICULOS',
            "fecha" => Carbon::today()->format('d-m-Y H:i:s'),
            "empresa" => $empresa,
            "co_sucu" => "01",
            "tabla" => $tabla,
            "num_doc" => $numDoc,
            "codigo" => "",
            "tipo_op" => $tipoOp,
            "maquina" => gethostname(),
            "campos" => "",
            "rowguid" => (string) Uuid::uuid4(),
            "trasnfe" => "",
            "AUX01" => "0",
            "AUX02" => ""
        ];
        return $pista;
    }
}
