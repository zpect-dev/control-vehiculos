<?php

namespace App\Http\Controllers;

use App\Helpers\FlashHelper;
use App\Models\FacturaAuditoria;
use Inertia\Inertia;
use App\Models\Surtido;
use App\Models\User;
use App\Models\Vehiculo;
use App\Services\Gasolina;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SurtidosController extends Controller
{
    public function index(Request $request, Vehiculo $vehiculo)
    {
        $vehiculo->load('usuario');

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

    public function exportSelected(Request $request)
    {
        $facturas = Surtido::whereIn('fact_num', $request->facturas)->orderBy('fact_num')->get();

        $ultimoSurtido = $facturas->last();
        $primerSurtido = $facturas->first();

        $recorrido = $ultimoSurtido->kilometraje - $primerSurtido->kilometraje;

        $litros = 0;
        foreach($facturas as $registro) {
            $litros += $registro->cant_litros;
        }

        $valorCarburador =  $litros / $recorrido;

        return response()->json([
            'valorCarburador' => $valorCarburador,
            'litros' => $litros,
            'recorrido' => $recorrido,
        ]);
    }

    public function info(Vehiculo $vehiculo)
    {
        $ids = array_filter([
            $vehiculo->user_id,
            $vehiculo->user_id_adicional_1,
            $vehiculo->user_id_adicional_2,
            $vehiculo->user_id_adicional_3,
        ]);

        $users = User::whereIn('id', $ids)->select('id', 'name')->get();

        $ultimo = Surtido::where('vehiculo_id', $vehiculo->placa)->latest()->first();
        $valorCarburador = $vehiculo->tipo == 'CARRO' ? 0.10 : 0.035;

        return response()->json([
            'kilometraje_anterior' => $ultimo ? $ultimo->kilometraje : null,
            'precio_unitario' => 0.5,
            'valor_carburador' => $valorCarburador,
            'users' => $users
        ]);
    }

    public function store(Request $request, Vehiculo $vehiculo)
    {
        return FlashHelper::try(function () use ($request, $vehiculo) {
            DB::beginTransaction();

            $validatedData = $request->validate([
                'cant_litros' => 'required|numeric|min:0.1|max:1000',
                'kilometraje' => 'required|numeric|min:0',
                'observaciones' => 'nullable',
                'precio' => 'required|numeric|min:0',
                'user_id' => 'required|exists:users,id'
            ]);

            $valorCarburador = $vehiculo->tipo === 'CARRO' ? 0.10 : 0.035;

            $UltimoSurtido = Surtido::where('vehiculo_id', $vehiculo->placa)->latest()->first();

            if ($UltimoSurtido && (
                $validatedData['kilometraje'] <= $UltimoSurtido->kilometraje
            )) {
                throw new \Exception('Kilometraje inválido: menor o igual al anterior');
            }

            $surtido_ideal = $UltimoSurtido
                ? ($validatedData['kilometraje'] - $UltimoSurtido->kilometraje) * $valorCarburador
                : 0;

            $diferencia = $surtido_ideal - $validatedData['cant_litros'];

            $usuario = User::find($validatedData['user_id']);
            if (!$usuario) throw new \Exception('El vehículo debe tener un conductor asignado');

            $profit = new Gasolina;
            $fact_num = $profit->registrarFacturaConRenglon(
                $validatedData['kilometraje'],
                $validatedData['observaciones'],
                $validatedData['precio'],
                $vehiculo->placa,
                $usuario->email,
                substr($request->user()->name, 0, 20),
                $diferencia,
                $validatedData['cant_litros']
            );

            if (!is_numeric($fact_num)) {
                throw new \Exception('No se pudo generar el número de factura');
            }

            Surtido::create([
                'user_id' => $validatedData['user_id'],
                'admin_id' => $request->user()->id,
                'vehiculo_id' => $vehiculo->placa,
                'fact_num' => $fact_num,
                'cant_litros' => $validatedData['cant_litros'],
                'kilometraje' => $validatedData['kilometraje'],
                'surtido_ideal' => $surtido_ideal,
                'observaciones' => $validatedData['observaciones'] ?? null,
                'diferencia' => $diferencia,
                'precio' => $validatedData['precio']
            ]);

            DB::commit();
        }, 'Surtido realizado correctamente.', 'Error al registrar el surtido.');
    }
}
