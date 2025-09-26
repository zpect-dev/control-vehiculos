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
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Helpers\FlashHelper;
use App\Models\User;

class FacturasController extends Controller
{
    public function index(Request $request, Vehiculo $vehiculo)
    {
        $facturas = Factura::where('co_cli', $vehiculo->placa)
            ->latest('fact_num')
            ->get()
            ->map(function ($factura) {
                return [
                    'fact_num' => $factura->fact_num,
                    'fec_emis' => $factura->fec_emis,
                    'co_cli' => trim($factura->co_cli),
                    'tot_bruto' => $factura->tot_bruto,
                    'tot_neto' => $factura->tot_neto,
                    'revisado' => trim($factura->revisado),
                    'descripcion' => $factura->descripcion_limpia,
                ];
            });

        $conductor = $vehiculo->load('usuario:id,name')->toArray();

        return Inertia::render('facturas', [
            'facturas' => $facturas,
            'vehiculo' => [
                'placa' => $vehiculo->placa,
                'conductor' => $conductor['usuario']['name'] ?? null,
            ]
        ]);
    }

    public function show(Request $request, Factura $factura)
    {
        $auditados = RenglonAuditoria::where('fact_num', $factura->fact_num)
            ->get()
            ->map(function ($r) {
                return [
                    'fact_num' => $r->fact_num,
                    'total_art' => $r->total_art,
                    'reng_neto' => $r->reng_neto,
                    'co_art' => $r->co_art,
                    'imagen' => $r->imagen,
                    'imagen_url' => $r->imagen ? Storage::url('uploads/auditorias/' . ltrim($r->imagen, '/')) : null,
                    'repuesto' => [
                        'art_des' => isset($r->repuesto) ? mb_convert_encoding($r->repuesto->art_des, 'UTF-8', 'auto') : null,
                    ],
                ];
            });

        $facturaAuditada = FacturaAuditoria::where('fact_num', $factura->fact_num)->first();
        $conductor = $facturaAuditada ? User::where('id', $facturaAuditada->user_id)->first()->name : Vehiculo::where('placa', $factura->co_cli)->with('usuario:id,name')->first()->name;

        $renglones = $auditados->isNotEmpty()
            ? $auditados
            : RenglonFactura::with('repuesto')
            ->select('fact_num', 'reng_num', 'co_art', 'total_art', 'reng_neto')
            ->where('fact_num', $factura->fact_num)
            ->get()
            ->map(function ($r) {
                return [
                    'fact_num' => $r->fact_num,
                    'total_art' => $r->total_art,
                    'reng_neto' => $r->reng_neto,
                    'co_art' => $r->co_art,
                    'repuesto' => [
                        'art_des' => isset($r->repuesto) ? mb_convert_encoding($r->repuesto->art_des, 'UTF-8', 'auto') : null,
                    ],
                ];
            });

        return Inertia::render('facturas', [
            'factura' => [
                'fact_num' => $factura->fact_num,
                'fec_emis' => $factura->fec_emis,
                'co_cli' => trim($factura->co_cli),
                'tot_bruto' => $factura->tot_bruto,
                'tot_neto' => $factura->tot_neto,
                'revisado' => trim($factura->revisado),
                'descripcion' => $factura->descripcion_limpia,
                'observaciones_res' => $facturaAuditada->observaciones_res ?? null,
                'observaciones_admin' => $facturaAuditada->observaciones_admin ?? null,
                'aprobado' => $facturaAuditada->aprobado ?? false,
                'cubre' => $factura->cubre ? 'Descontar' : 'Cubre',
                'usuario_cubre' => User::where('id', $facturaAuditada->cubre_usuario)->first()->name ?? 'Empresa',
            ],
            'renglones' => $renglones,
            'auditados' => $auditados->isNotEmpty(),
            'vehiculo' => [
                'placa' => $factura->co_cli,
                'conductor' => $conductor,
            ]
        ]);
    }

    public function storeAuditoria(Request $request, Factura $factura)
    {
        return FlashHelper::try(function () use ($request, $factura) {
            DB::beginTransaction();

            $imagenes = $request->file('imagenes') ?? [];

            if (empty($imagenes)) {
                throw new \Exception('Debes subir al menos una imagen por producto');
            }

            foreach ($imagenes as $co_art => $file) {
                if (!$file->isValid()) {
                    throw new \Exception("La imagen de {$co_art} no es válida");
                }
            }
            $request->validate([
                'observacion' => 'nullable|string',
                'imagenes.*' => 'image|max:5120',
            ]);
            
            FacturaAuditoria::create([
                'fact_num' => $factura->fact_num,
                'vehiculo_id' => $factura->co_cli,
                'user_id' => $request->user()->id,
                'observaciones_res' => $request->input('observacion'),
            ]);
            
            $datos = [];
            $multimedia = new Multimedia;

            foreach ($imagenes as $co_art => $file) {
                $nombre = $multimedia->guardarImagen($file, 'auditorias');

                if (!$nombre) {
                    throw new \Exception("Error al guardar la imagen de {$co_art}");
                }

                $datos[] = [
                    'fact_num' => $factura->fact_num,
                    'co_art' => $co_art,
                    'imagen' => $nombre,
                    'reng_neto' => $factura->renglones()->where('co_art', $co_art)->value('reng_neto') ?? 0,
                    'total_art' => $factura->renglones()->where('co_art', $co_art)->value('total_art') ?? 0,
                    'reng_num' => $factura->renglones()->where('co_art', $co_art)->value('reng_num') ?? 0,
                ];
            }

            RenglonAuditoria::insert($datos);

            DB::commit();
        }, 'Auditoría registrada con éxito.', 'Error al registrar la auditoría.');
    }

    public function update(Request $request, FacturaAuditoria $factura)
    {
        $validatedData = $request->validate([
            'aprobado' => 'required|boolean',
            'observaciones_admin' => 'nullable'
        ]);

        $fechaEmis = Carbon::parse(Factura::where('fact_num', $factura->fact_num)->first()->fec_emis);
        $fechaAudi = Carbon::parse($factura->created_at);

        $diasDiff = $fechaEmis->diffInDays($fechaAudi);

        if($diasDiff > 5){
            $factura->cubre = true;
            $factura->cubre_usuario = $factura->user_id;
        }

        $factura->aprobado = $validatedData['aprobado'];
        $factura->observaciones_admin = $validatedData['observaciones_admin'];

        $factura->save();
    }
}
