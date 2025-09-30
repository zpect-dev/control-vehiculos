<?php

namespace App\Services;

use App\Helpers\ProfitLogger;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;

class Gasolina 
{   
    protected $TASA_GASOLINA = 0.5;
    
    public function registrarFacturaConRenglon($kilometraje, $descrip, $saldo, $co_cli, $cedula, $admin, $diferencia, $cant_litros){
        DB::connection('sqlsrv')->beginTransaction();
        try {
            $fact_num = DB::connection('sqlsrv')->select("
                SELECT ISNULL(MAX(fact_num), 0) + 1 AS nuevo
                FROM factura WITH (UPDLOCK, HOLDLOCK)
                WHERE fact_num <> 9446
            ")[0]->nuevo;

            $num_doc = DB::connection('sqlsrv')->select("
                SELECT ISNULL(MAX(num_doc), 0) + 1 AS nuevo
                FROM reng_fac WITH (UPDLOCK, HOLDLOCK)
            ")[0]->nuevo;
            $datosFactura = $this->construir_factura($kilometraje, $descrip, $saldo, $co_cli, $cedula, $admin, $diferencia, $fact_num);
            $datosRenglon = $this->construir_renglon($fact_num, $cant_litros, $num_doc);
            DB::connection('sqlsrv')->table('factura')->insert($datosFactura);
            DB::connection('sqlsrv')->table('reng_fac')->insert($datosRenglon);
            DB::connection('sqlsrv')->table('pistas')->insert(ProfitLogger::pista('FACTURA', $fact_num, 'I', 'VEHI24'));
            DB::connection('sqlsrv')->commit();
            return $datosFactura['fact_num'];
        } catch (\Exception $e) {
            DB::connection('sqlsrv')->rollBack();
            throw $e;
        }
    }

    public function co_ven($cedula){
        $co_ven = DB::connection('sqlsrv')->select("
            SELECT co_ven FROM vendedor WHERE cedula=?
        ", [$cedula]);
        return $co_ven[0]->co_ven ?? '999';
    }

    public function construir_factura($kilometraje, $descrip, $saldo, $co_cli, $cedula, $admin, $diferencia, $fact_num){
        $factura = [
            "fact_num" => $fact_num,
            "contrib" => 1,
            "nombre" => "",
            "rif" => "",
            "nit" => "",
            "num_control" => $kilometraje,
            "status" => 0,
            "comentario" => "",
            "descrip" => $descrip,
            "saldo" => $saldo,
            "fec_emis" => Carbon::today()->format('d-m-Y H:i:s'),
            "fec_venc" => Carbon::today()->format('d-m-Y H:i:s'),
            "co_cli" => $co_cli,
            "co_ven" => $this->co_ven($cedula),
            "co_tran" => "03",
            "dir_ent" => "",
            "forma_pag" => "40",
            "tot_bruto" => $saldo,
            "tot_neto" => $saldo,
            "glob_desc" => 0,
            "tot_reca" => 0,
            "porc_gdesc" => "",
            "porc_reca" => "",
            "total_uc" => 0,
            "total_cp" => 0,
            "tot_flete" => 0,
            "monto_dev" => 0,
            "totklu" => 0,
            "anulada" => 0,
            "impresa" => 0,
            "iva" => 0,
            "iva_dev" => 0,
            "feccom" => Carbon::today()->format('d-m-Y H:i:s'),
            "numcom" => 0,
            "tasa" => 1,
            "moneda" => "BS",
            "dis_cen" => "",
            "vuelto" => 0,
            "seriales" => 0,
            "tasag" => 16,
            "tasag10" => 16,
            "tasag20" => 16,
            "campo1" => $diferencia,
            "campo2" => $admin,
            "campo3" => "",
            "campo4" => "",
            "campo5" => "",
            "campo6" => "",
            "campo7" => "",
            "campo8" => "",
            "co_us_in" => "VEHI99",
            "fe_us_in" => Carbon::today()->format('d-m-Y H:i:s'),
            "co_us_mo" => "",
            "fe_us_mo" => Carbon::today()->format('d-m-Y H:i:s'),
            "co_us_el" => "",
            "fe_us_el" => Carbon::today()->format('d-m-Y H:i:s'),
            "revisado" => "",
            "trasnfe" => "",
            "numcon" => 0,
            "co_sucu" => "01",
            "rowguid" => (string) Uuid::uuid4(),
            "mon_ilc" => 0,
            "otros1" => 0,
            "otros2" => 0,
            "otros3" => 0,
            "num_turno" => 0,
            "aux01" => 0,
            "aux02" => "",
            "ID" => -1,
            "salestax" => "",
            "origen" => "",
            "origen_d" => "",
            "sta_prod" => "",
            "fec_reg" => "",
            "impfis" => "",
            "impfisfac" => "",
            "imp_nro_z" => "",
            "ven_ter" => 0,
            "ptovta" => 0,
            "telefono" => "",
        ];
        return $factura;
    }

    public function construir_renglon($fact_num, $cant_litros, $num_doc){
        $renglon = [
            "fact_num" => $fact_num,
            "reng_num" => 1,
            "dis_cen" => "",
            "tipo_doc" => "E",
            "reng_doc" => 1,
            "num_doc" => $num_doc,
            "co_art" => "AMP00417",
            "co_alma" => "01",
            "total_art" => $cant_litros,
            "stotal_art" => 0,
            "pendiente" => $cant_litros,
            "uni_venta" => "000001",
            "prec_vta" => $this->TASA_GASOLINA,
            "porc_desc" => 0,
            "tipo_imp" => "6",
            "isv" => 0,
            "reng_neto" => $this->TASA_GASOLINA,
            "cos_pro_un" => $this->TASA_GASOLINA,
            "ult_cos_un" => $this->TASA_GASOLINA,
            "ult_cos_om" => 0,
            "cos_pro_om" => 0,
            "total_dev" => 0,
            "monto_dev" => 0,
            "prec_vta2" => 0,
            "anulado" => 0,
            "des_art" => "",
            "seleccion" => 0,
            "cant_imp" => 0,
            "comentario" => "",
            "rowguid" => (string) Uuid::uuid4(),
            "total_uni" => 1,
            "mon_ilc" => 0,
            "otros" => 0,
            "nro_lote" => "",
            "fec_lote" => Carbon::today()->format('d-m-Y H:i:s'),
            "pendiente2" => 0,
            "tipo_doc2" => "",
            "reng_doc2" => 0,
            "num_doc2" => 0,
            "tipo_prec" => 1,
            "co_alma2" => "01",
            "aux01" => 0,
            "aux02" => "",
            "cant_prod" => 0,
            "imp_prod" => 0,
        ];
        return $renglon;
    }
}