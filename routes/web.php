<?php

use App\Http\Controllers\AsignacionesController;
use App\Http\Controllers\NotificacionController;
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
use App\Http\Controllers\ObservacionesController;
use App\Http\Controllers\RevisionDiariaController;
use App\Http\Controllers\RevisionSemanalController;
use App\Http\Controllers\VehiculoController;

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
});

Route::middleware(['auth', 'acceso'])->group(function () {
    // Ficha Técnica
    Route::get('fichaTecnica/{vehiculo:placa}', [FichaTecnicaController::class, 'show'])->name('fichaTecnica.show');

    // Formularios asociados a ficha técnica
    Route::post('fichaTecnica/{vehiculo:placa}/expedientes', [ExpedienteTecnicoController::class, 'store'])->name('expedientes.store');
    Route::post('fichaTecnica/{vehiculo:placa}/permisologia', [PermisologiaController::class, 'store'])->name('permisos.store');
    Route::post('fichaTecnica/{vehiculo:placa}/accesorios', [AccesoriosController::class, 'store'])->name('accesorios.store');
    Route::post('fichaTecnica/{vehiculo:placa}/piezas', [PiezasController::class, 'store'])->name('piezas.store');
    // Revisión de Fluidos
    Route::get('fichaTecnica/{vehiculo:placa}/revisionFluidos', [RevisionDiariaController::class, 'index'])->name('revisionFluidos');
    Route::post('fichaTecnica/{vehiculo:placa}/revisionFluidos', [RevisionDiariaController::class, 'store'])->name('revisionFluidos.store');

    // Revisión Semanal
    Route::get('fichaTecnica/{vehiculo:placa}/revisionSemanal', [RevisionSemanalController::class, 'index'])->name('revisionSemanal');
    Route::post('fichaTecnica/{vehiculo:placa}/revisionSemanal', [RevisionSemanalController::class, 'store'])->name('revisionSemanal.store');

    // Observaciones
    Route::get('observaciones/{vehiculo:placa}', [ObservacionesController::class, 'index'])->name('observaciones.index');
    Route::get('observaciones/{vehiculo:placa}/{observaciones:id}', [ObservacionesController::class, 'show'])->name('observaciones.show');
    Route::post('observaciones/{vehiculo:placa}/save', [ObservacionesController::class, 'store'])->name('observaciones.store');
});

Route::middleware(['auth', 'admin'])->group(function () {
    // Rutas para asignaciones
    Route::get('historial/{vehiculo:placa}/asignaciones', [AsignacionesController::class, 'index'])->name('asignaciones');
    Route::get('historial/{registro}/asignacion', [AsignacionesController::class, 'show'])->name('asignaciones.show');
    Route::post('fichaTecnica/{vehiculo:placa}/assign-user', [AsignacionesController::class, 'store'])->name('asignaciones.store');

    // Rutas para modificar vehiculos (necesario proximamente)
    Route::get('vehiculo/{vehiculo:placa}/edit', [VehiculoController::class, 'edit'])->name('vehiculo.edit');
    Route::patch('vehiculo/{vehiculo:placa}', [VehiculoController::class, 'update'])->name('vehiculo.update');

    // Rutas para notificaciones
    Route::get('notificaciones', [NotificacionController::class, 'index'])->name('notificaciones.index');
    Route::put('notificaciones/{notificacion}/marcar-leida', [NotificacionController::class, 'marcarComoLeida'])->name('notificaciones.marcarLeida');
    Route::put('/notificaciones/marcar-todas', [NotificacionController::class, 'marcarTodasComoLeidas']);
    Route::delete('notificaciones/{notificacion}', [NotificacionController::class, 'destroy'])->name('notificaciones.destroy');

    // Editar Observacion
    Route::patch('observaciones/{vehiculo:placa}/{observaciones:id}/edit', [ObservacionesController::class, 'update'])->name('observaciones.update');
});

// Configuración y autenticación
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
