<?php

use App\Http\Controllers\AsignacionesController;
use App\Http\Controllers\NotificacionController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Controladores
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FacturasController;
use App\Http\Controllers\FichaTecnica\FichaTecnicaController;
use App\Http\Controllers\FichaTecnica\ExpedienteTecnicoController;
use App\Http\Controllers\FichaTecnica\PermisologiaController;
use App\Http\Controllers\FichaTecnica\AccesoriosController;
use App\Http\Controllers\FichaTecnica\PiezasController;
use App\Http\Controllers\ObservacionesController;
use App\Http\Controllers\RevisionDiariaController;
use App\Http\Controllers\RevisionSemanalController;
use App\Http\Controllers\SurtidosController;
use App\Http\Controllers\UsersController;
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

    // Rutas perfil
    Route::get('perfil/{user}', [UsersController::class, 'show'])->name('perfil.show');
    Route::patch('perfil/{user}', [UsersController::class, 'update'])->name('perfil.update');
});

//Rutas Factura
Route::get('fichaTecnica/{vehiculo:placa}/facturas', [FacturasController::class, 'index'])->name('facturas.index');
Route::get('fichaTecnica/facturas/{factura:fact_num}', [FacturasController::class, 'show'])->name('facturas.show');
Route::post('fichaTecnica/facturas/{factura:fact_num}/auditoria', [FacturasController::class, 'storeAuditoria'])->name('facturas.auditoria.store');

Route::get('gasolina', [SurtidosController::class, 'test']);


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
    Route::patch('fichaTecnica/{vehiculo:placa}/revisionSemanal/{revision}', [RevisionSemanalController::class, 'update'])->name('revisionSemanal.update');

    // Observaciones
    Route::get('fichaTecnica/{vehiculo:placa}/observaciones', [ObservacionesController::class, 'index'])->name('observaciones.index');
    Route::post('observaciones/{vehiculo:placa}/save', [ObservacionesController::class, 'store'])->name('observaciones.store');

    // Rutas para asignaciones
    Route::get('fichaTecnica/{vehiculo:placa}/asignaciones', [AsignacionesController::class, 'index'])->name('asignaciones');

    // Ruta para la Gasolina
    Route::get('fichaTecnica/{vehiculo:placa}/gasolina', [SurtidosController::class, 'index'])->name('gasolina.index');
});
Route::middleware(['auth', 'admin'])->group(function () {
    // Rutas gasolina
    Route::post('fichaTecnica/{vehiculo:placa}/gasolina', [SurtidosController::class, 'store'])->name('surtidos.store');

    // Visualizar perfil
    Route::get('perfiles', [UsersController::class, 'index'])->name('perfil.index');

    // Asignar usuario
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
    Route::patch('observaciones/{vehiculo:placa}/{observacion}/edit', [ObservacionesController::class, 'update'])->name('observaciones.update');
});

// Configuración y autenticación
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
