<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('general', function () {
        return Inertia::render('general');
    })->name('general');

    Route::get('diario', function () {
        return Inertia::render('diario');
    })->name('diario');

    Route::get('fluidos', function () {
        return Inertia::render('fluidos');
    })->name('fluidos');

    Route::get('semanal', function () {
        return Inertia::render('semanal');
    })->name('semanal');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
