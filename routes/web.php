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
use App\Http\Controllers\RevisionDiariaController;
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
    Route::get('fichaTecnica/{vehiculo:placa}', [FichaTecnicaController::class, 'show'])->name('fichaTecnica.show');

    // Formularios asociados a ficha técnica
    Route::post('fichaTecnica/{placa}/expedientes', [ExpedienteTecnicoController::class, 'store'])->name('expedientes.store');
    Route::post('fichaTecnica/{placa}/permisologia', [PermisologiaController::class, 'store'])->name('permisos.store');
    Route::post('fichaTecnica/{placa}/accesorios', [AccesoriosController::class, 'store'])->name('accesorios.store');
    Route::post('fichaTecnica/{placa}/piezas', [PiezasController::class, 'store'])->name('piezas.store');

    // Revisión de Fluidos
    Route::get('fichaTecnica/{vehiculo:placa}/revisionFluidos', [RevisionDiariaController::class, 'index'])->name('revisionFluidos');
    Route::post('fichaTecnica/{vehiculo:placa}/revisionFluidos', [RevisionDiariaController::class, 'store'])->name('revisionFluidos.store');

    // Revisión Semanal
    Route::get('fichaTecnica/{vehiculo:placa}/revisionSemanal', [RevisionSemanalController::class, 'index'])->name('revisionSemanal');
    Route::post('fichaTecnica/{vehiculo:placa}/revisionSemanal', [RevisionSemanalController::class, 'store'])->name('revisionSemanal.store');

    // Nueva ruta para la asignación de usuario
    Route::post('fichaTecnica/{vehiculo:placa}/assign-user', [FichaTecnicaController::class, 'assignUser'])->name('fichaTecnica.assignUser');
});

// Configuración y autenticación
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
