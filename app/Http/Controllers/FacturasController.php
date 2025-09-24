<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Factura;
use App\Models\Vehiculo;
use App\Services\Multimedia;
use Illuminate\Http\Request;
use App\Models\RenglonFactura;
use App\Models\FacturaAuditoria;
use App\Models\RenglonAuditoria;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FacturasController extends Controller
{
    public function index(Request $request, Vehiculo $vehiculo)
    {
        $facturas = Factura::where('co_cli', $vehiculo->placa)->latest('fact_num')->get();
        return Inertia::render('nombre_vista', [
            'facturas' => $facturas
        ]);
    }

    public function show(Request $request, Factura $factura)
    {
        $auditados = RenglonAuditoria::where('fact_num', $factura->fact_num)->get();

        $renglones = $auditados->isNotEmpty() ? $auditados : RenglonFactura::with('repuesto')
            ->select('fact_num', 'reng_num', 'co_art', 'total_art', 'reng_neto')
            ->where('fact_num', $factura->fact_num)
            ->get();

        return Inertia::render('nombre_vista', [
            'factura' => $factura,
            'renglones' => $renglones,
            'auditados' => $auditados->isNotEmpty()
        ]);
    }

    public function store(Request $request, Factura $factura)
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validate([
                'auditorias' => 'required|array',
                'auditorias.*.reng_num' => 'required|integer',
                'auditorias.*.co_art' => 'required|string',
                'auditorias.*.total_art' => 'required|numeric',
                'auditorias.*.reng_neto' => 'required|numeric',
                'auditorias.*.imagen' => 'required|image|max:5120',
                'observaciones_res' => 'nullable|string'
            ]);

            FacturaAuditoria::create([
                'fact_num' => $factura->fact_num,
                'vehiculo_id' => $factura->co_cli,
                'user_id' => $request->user()->id,
                'observaciones_res' => $validatedData['observaciones_res'],
            ]);

            $datos = [];
            $multimedia = new Multimedia;

            foreach ($validatedData['auditorias'] as $auditoria) {
                $nameImage = $multimedia->guardarImagen($auditoria['imagen'], 'auditoria');

                if (!$nameImage) {
                    throw new \Exception('Error al guardar la imagen');
                }

                $datos[] = [
                    'fact_num' => $factura->fact_num,
                    'reng_num' => $auditoria['reng_num'],
                    'co_art' => $auditoria['co_art'],
                    'total_art' => $auditoria['total_art'],
                    'reng_neto' => $auditoria['reng_neto'],
                    'imagen' => $nameImage,
                ];
            }

            RenglonAuditoria::insert($datos);

            DB::commit();
            return back()->with('success', 'Repuesto registrado con éxito');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al registrar auditoría', ['exception' => $e]);
            return back()->with('error', 'Error: ' . $e->getMessage());
        }
    }
    
    public function update(Request $request, FacturaAuditoria $factura){
        
    }
}
