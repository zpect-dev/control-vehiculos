<?php

namespace App\Http\Controllers;

use App\Services\ConsultaSQL;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FichaTecnicaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $consultaSQL = new ConsultaSQL();
        $userId = $request->user()->id;
<<<<<<< Updated upstream:app/Http/Controllers/FichaTecnicaController.php
        $vehiculos = Vehiculo::with('usuario')->get();

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
        
        // dd($vehiculos->toArray());

        return Inertia::render('fichaTecnica', [
=======

        $vehiculos = $consultaSQL->obtenerAccesorios($userId);
        
        dd($vehiculos);

        return Inertia::render('general', [
>>>>>>> Stashed changes:app/Http/Controllers/GeneralController.php
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
