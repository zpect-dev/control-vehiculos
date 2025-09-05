<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ConsultaSQL
{
    public function obtenerAccesorios($userId)
    {
        $accesorios = DB::table('accesorios')->pluck('accesorio');
        $columnasDinamicas = $accesorios->map(function ($accesorio) {
            //$accesorio = str_replace(' ', '_', strtolower($accesorio));
            return "MAX(CASE WHEN a.accesorio = '$accesorio' THEN va.estado ELSE NULL END) AS \"$accesorio\"";
        })->implode(', ');

        $consultaSQL = "SELECT
        v.placa, v.tipo, v.modelo, u.name AS responsable, {$columnasDinamicas}
        FROM vehiculos v
        LEFT JOIN users u ON v.user_id = u.id
        LEFT JOIN vehiculo_accesorios va ON v.placa = va.vehiculo_id
        LEFT JOIN accesorios a ON va.accesorio_id = a.id
        WHERE v.user_id = ? AND va.fecha_verificacion = (
            SELECT MAX(va2.fecha_verificacion)
            FROM vehiculo_accesorios va2
            WHERE va2.accesorio_id = va.accesorio_id AND va2.vehiculo_id = va.vehiculo_id
        ) 
        GROUP BY
        v.placa, v.tipo, v.modelo
        ORDER BY v.placa;";

        return DB::select($consultaSQL, [$userId]);
    }
}