<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Controladores
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FichaTecnica\FichaTecnicaController;
use App\Http\Controllers\FichaTecnica\ExpedienteTecnicoController;
use App\Http\Controllers\FichaTecnica\PermisologiaController;
use App\Http\Controllers\FichaTecnica\AccesoriosController;
use App\Http\Controllers\FichaTecnica\PiezasController;
use App\Http\Controllers\RevisionSemanalController;

// Ruta raíz: redirige al dashboard si está autenticado
Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('dashboard')
        : Inertia::render('auth/login');
})->name('home');

// Rutas protegidas por autenticación y verificación
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard principal (muestra las cards de vehículos)
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Ficha Técnica
    Route::get('fichaTecnica', [FichaTecnicaController::class, 'index'])->name('fichaTecnica');
    Route::get('fichaTecnica/{placa}', [FichaTecnicaController::class, 'show'])->name('fichaTecnica.show');

    // Formularios asociados a ficha técnica
    Route::post('fichaTecnica/{placa}/expedientes', [ExpedienteTecnicoController::class, 'store'])->name('expedientes.store');
    Route::post('fichaTecnica/{placa}/permisos', [PermisologiaController::class, 'store'])->name('permisos.store');
    Route::get('fichaTecnica/{placa}/accesorios', [AccesoriosController::class, 'store'])->name('accesorios.store');
    Route::post('fichaTecnica/{placa}/piezas', [PiezasController::class, 'store'])->name('piezas.store');

    // Revisión de Fluidos
    Route::get('fichaTecnica/{placa}/revisionFluidos', function ($placa) {
        return Inertia::render('revisionFluidos', ['placa' => $placa]);
    })->name('revisionFluidos.show');

    // Revisión Semanal
    Route::get('fichaTecnica/{placa}/revisionSemanal', [RevisionSemanalController::class, 'show'])->name('revisionSemanal.show');
});

// Configuración y autenticación
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
