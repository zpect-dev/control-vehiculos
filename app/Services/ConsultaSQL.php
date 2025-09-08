<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ConsultaSQL
{
    public function obtenerExpediente($userId, $placa)
    {
        // Accesorios
        $accesorios = DB::table('accesorios')->pluck('accesorio');
        $columnasAccesorios = $accesorios->map(function ($accesorio) {
            return "MAX(CASE WHEN a.accesorio = '$accesorio' THEN va.estado ELSE NULL END) AS 'accesorio_estado_$accesorio', MAX(CASE WHEN a.accesorio = '$accesorio' THEN va.observaciones ELSE NULL END) AS 'accesorio_observacion_$accesorio'";
        })->implode(', ');

        // Piezas
        $piezas = DB::table('piezas')->pluck('pieza');
        $columnasPiezas = $piezas->map(function ($pieza) {
            return "MAX(CASE WHEN pz.pieza = '$pieza' THEN vp.estado ELSE NULL END) AS 'pieza_estado_$pieza', MAX(CASE WHEN pz.pieza = '$pieza' THEN vp.observaciones ELSE NULL END) AS 'pieza_observacion_$pieza'";
        })->implode(', ');

        // Permisos
        $permisos = DB::table('permisos')->pluck('permiso');
        $columnasPermisos = $permisos->map(function ($permiso) {
            return "MAX(CASE WHEN pm.permiso = '$permiso' THEN vpms.fecha_vencimiento ELSE NULL END) AS 'permiso_vencimiento_$permiso', MAX(CASE WHEN pm.permiso = '$permiso' THEN vpms.fecha_expedicion ELSE NULL END) AS 'permiso_expedicion_$permiso', MAX(CASE WHEN pm.permiso = '$permiso' THEN vpms.estado ELSE NULL END) AS 'permiso_estado_$permiso'";
        })->implode(', ');

        // Especificaciones
        $especificaciones = DB::table('especificaciones')->pluck('especificacion');
        $columnasEspecificaciones = $especificaciones->map(function ($especificacion) {
            return "MAX(CASE WHEN es.especificacion = '$especificacion' THEN ve.estado ELSE NULL END) AS 'especificacion_estado_$especificacion'";
        })->implode(', ');

        $todasLasColumnas = collect([
            $columnasAccesorios,
            $columnasPiezas,
            $columnasPermisos,
            $columnasEspecificaciones
        ])->filter()->implode(', ');

        $consultaSQL = "SELECT
        v.placa, v.tipo, v.modelo, u.name AS responsable, $todasLasColumnas
        FROM vehiculos v
        JOIN users u ON v.user_id = u.id
        -- Accesorios
        LEFT JOIN vehiculo_accesorios va ON v.placa = va.vehiculo_id
        LEFT JOIN accesorios a ON va.accesorio_id = a.id
        -- Piezas
        LEFT JOIN vehiculo_piezas vp ON v.placa = vp.vehiculo_id
        LEFT JOIN piezas pz ON vp.pieza_id = pz.id
        -- Permisos
        LEFT JOIN vehiculo_permisos vpms ON v.placa = vpms.vehiculo_id
        LEFT JOIN permisos pm ON vpms.permiso_id = pm.id
        -- Especificaciones
        LEFT JOIN vehiculo_especificaciones ve ON v.placa = ve.vehiculo_id
        LEFT JOIN especificaciones es ON ve.especificacion_id = es.id
        WHERE v.user_id = ? AND v.placa = ?
        AND (
            va.fecha_verificacion IS NULL OR va.fecha_verificacion = (
                SELECT MAX(va2.fecha_verificacion)
                FROM vehiculo_accesorios va2
                WHERE va2.accesorio_id = va.accesorio_id AND va2.vehiculo_id = va.vehiculo_id
            )
        )
        AND (
            vp.fecha_verificacion IS NULL OR vp.fecha_verificacion = (
                SELECT MAX(vp2.fecha_verificacion)
                FROM vehiculo_piezas vp2
                WHERE vp2.pieza_id = vp.pieza_id AND vp2.vehiculo_id = vp.vehiculo_id
            )
        )
        AND (
            vpms.fecha_vencimiento IS NULL OR vpms.fecha_vencimiento = (
                SELECT MAX(vpms2.fecha_vencimiento)
                FROM vehiculo_permisos vpms2
                WHERE vpms2.permiso_id = vpms.permiso_id AND vpms2.vehiculo_id = vpms.vehiculo_id
            )
        )
        AND (
            ve.fecha_registro IS NULL OR ve.fecha_registro = (
                SELECT MAX(ve2.fecha_registro)
                FROM vehiculo_especificaciones ve2
                WHERE ve2.especificacion_id = ve.especificacion_id AND ve2.vehiculo_id = ve.vehiculo_id
            )
        )
        GROUP BY
        v.placa, v.tipo, v.modelo, u.name";

        return DB::select($consultaSQL, [$userId, $placa]);
    }
}