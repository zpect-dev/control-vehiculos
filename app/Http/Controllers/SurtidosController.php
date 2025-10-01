<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Surtido;
use App\Models\User;
use App\Models\Vehiculo;
use App\Services\Gasolina;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;


class SurtidosController extends Controller
{
    public function test(Request $request)
    {
        // $row = (string) Uuid::uuid4();
        // dd($row);
        $profit = new Gasolina;
        $respuesta = $profit->registrarFacturaConRenglon(100, 'Prueba gasolina', 20, 14417896, '9338301', 'Juan Vargas', 19, 40);
        dd($respuesta);
    }

    public function index(Request $request, Vehiculo $vehiculo)
    {
        $vehiculo->load('usuario');

        $query = Surtido::where('vehiculo_id', $vehiculo->placa);

        if ($request->filled('fecha_desde')) {
            $query->whereDate('created_at', '>=', $request->fecha_desde);
        }

        if ($request->filled('fecha_hasta')) {
            $query->whereDate('created_at', '<=', $request->fecha_hasta);
        }

        if ($request->filled('factura')) {
            $query->where('fact_num', 'like', '%' . $request->factura . '%');
        }

        $registros = $query->latest()->get();

        $registros = Surtido::where('vehiculo_id', $vehiculo->placa)
            ->latest()
            ->get();

        return Inertia::render('gasolina', [
            'vehiculo' => [
                'placa' => $vehiculo->placa,
                'modelo' => $vehiculo->modelo,
                'usuario' => [
                    'name' => optional($vehiculo->usuario)->name,
                ],
            ],
            'registros' => $registros->map(function ($surtido) use ($vehiculo) {
                $user = User::find($surtido->user_id);
                $admin = User::find($surtido->admin_id);
                return [
                    'factura' => $surtido->fact_num,
                    'fecha' => $surtido->created_at->format('Y-m-d'),
                    'vehiculo' => $surtido->vehiculo_id,
                    'precio' => 0.5,
                    'km_actual' => $surtido->kilometraje,
                    'recorrido' => $surtido->surtido_ideal,
                    'litros' => $surtido->cant_litros,
                    'total' => $surtido->precio,
                    'observaciones' => $surtido->observaciones,
                    'diferencia' => $surtido->diferencia,
                    'conductor' => $user->name ?? 'Sin conductor',
                    'admin' => $admin->name,
                ];
            }),
        ]);
    }


    public function info(Vehiculo $vehiculo)
    {
        $ultimo = Surtido::where('vehiculo_id', $vehiculo->placa)->latest()->first();

        return response()->json([
            'kilometraje_anterior' => $ultimo ? $ultimo->kilometraje : null,
            'precio_unitario' => 0.5,
        ]);
    }



    public function store(Request $request, Vehiculo $vehiculo)
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validate([
                'cant_litros' => 'required|numeric|min:0.1|max:1000',
                'kilometraje' => 'required|numeric|min:0',
                'observaciones' => 'nullable',
                'precio' => 'required|numeric|min:0'
            ]);

            $UltimoSurtido = Surtido::where('vehiculo_id', $vehiculo->placa)->latest()->first();

            $surtido_ideal = $UltimoSurtido ? ($validatedData['kilometraje'] - $UltimoSurtido->kilometraje) * 0.35 : 0;
            $diferencia = $surtido_ideal - $validatedData['cant_litros'];

            $usuario = User::find($vehiculo->user_id);
            $profit = new Gasolina;
            //$fact_num = $profit->registrarFacturaConRenglon($validatedData['kilometraje'], $validatedData['observaciones'], $validatedData['precio'], $vehiculo->placa, $usuario->email, $request->user()->name, $surtido_ideal, $validatedData['cant_litros']);
            $fact_num = $profit->registrarFacturaConRenglon($validatedData['kilometraje'], $validatedData['observaciones'], $validatedData['precio'], '10150838', $usuario->email, $request->user()->name, $diferencia, $validatedData['cant_litros']);

            if (!is_numeric($fact_num)) {
                throw new \Exception('No se pudo generar el número de factura');
            }

            Surtido::create([
                'user_id' => $vehiculo->user_id,
                'admin_id' => $request->user()->id,
                'vehiculo_id' => $vehiculo->placa,
                'fact_num' => $fact_num,
                'cant_litros' => $validatedData['cant_litros'],
                'kilometraje' => $validatedData['kilometraje'],
                'surtido_ideal' => $surtido_ideal ?? null,
                'observaciones' => $validatedData['observaciones'] ?? null,
                'diferencia' => $diferencia,
                'precio' => $validatedData['precio']
            ]);

            DB::commit();
            return back()->with('success', 'Surtido realizado correctamente');
        } catch (\Throwable $e) {
            DB::rollBack();
            dd($e);
            return back()->with('error', 'Error: ' . $e->getMessage());
        }
    }
}
