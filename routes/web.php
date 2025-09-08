<?php

use App\Http\Controllers\FichaTecnica\AccesorioController;
use App\Http\Controllers\FichaTecnica\ExpedienteController;
use App\Http\Controllers\FichaTecnica\PermisoController;
use App\Http\Controllers\FichaTecnica\PiezaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\FichaTecnica\FichaTecnicaController;
use App\Http\Controllers\RevisionSemanalController;

Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('fichaTecnica')
        : Inertia::render('auth/login');
})->name('home');

// Rutas protegidas

Route::middleware(['auth', 'verified'])->group(function () {

    // Ficha Tecnica
    Route::get('fichaTecnica', [FichaTecnicaController::class, 'index'])->name('fichaTecnica');
    Route::get('fichaTecnica/{placa}', [FichaTecnicaController::class, 'show'])->name('fichaTecnica.show');

    Route::get('fichaTecnica/{placa}/accesorios', [AccesorioController::class, 'store'])->name('accesorios.store');
    Route::post('fichaTecnica/{placa}/expedientes', [ExpedienteController::class, 'store'])->name('expedientes.store');
    Route::post('fichaTecnica/{placa}/permisos', [PermisoController::class, 'store'])->name('permisos.store');
    Route::post('fichaTecnica/{placa}/piezas', [PiezaController::class, 'store'])->name('piezas.store');

    // RevisionFluidos
    Route::get('revisionFluidos', function () {
        return Inertia::render('revisionFluidos');
    })->name('revisionFluidos');

    // RevisionSemanal
    Route::get('revisionSemanal', [RevisionSemanalController::class, 'index'])->name('revisionSemanal');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
