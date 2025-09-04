<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GeneralController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $vehiculos = Vehiculo::where('user_id', $userId)->get();
        $vehiculos->each->append('ultimas_piezas', 'ultimos_accesorios', 'ultimas_especificaciones', 'ultimos_permisos');

        $vehiculos->each(function ($vehiculo) {
            $vehiculo->ultimas_piezas->each(function ($pieza) {
                $pieza->load('pieza');
            });
            $vehiculo->ultimos_accesorios->each(function ($accesorio) {
                $accesorio->load('accesorio');
            });
            $vehiculo->ultimas_especificaciones->each(function ($especificacion) {
                $especificacion->load('especificacion');
            });
            $vehiculo->ultimos_permisos->each(function ($permiso) {
                $permiso->load('permiso');
            });
        });

        //dd($vehiculos->toArray());

        return Inertia::render('general', [
            'vehiculos' => $vehiculos
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
