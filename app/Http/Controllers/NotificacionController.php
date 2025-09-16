<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificacionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $modo = $user->hasRole('admin') ? 'admin' : 'user';

        $query = Notificacion::query()
            ->with('usuario')
            ->when($modo === 'admin', fn($q) => $q->where('solo_admin', true))
            ->when($modo !== 'admin', fn($q) => $q->where('usuario_id', $user->id));

        // 🔍 Filtros dinámicos
        if ($request->filled('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        if ($request->filled('estado')) {
            $query->where('leida', $request->estado === 'leida');
        }

        if ($request->filled('fecha_inicio') && $request->filled('fecha_fin')) {
            $query->whereBetween('created_at', [$request->fecha_inicio, $request->fecha_fin]);
        }

        if ($request->filled('usuario')) {
            $query->whereHas('usuario', fn($q) => $q->where('name', 'like', '%' . $request->usuario . '%'));
        }

        $notificaciones = $query->orderByDesc('created_at')->get();

        return Inertia::render('dashboardNotificaciones', [
            'notificaciones' => $notificaciones,
            'filtros' => $request->only(['tipo', 'estado', 'fecha_inicio', 'fecha_fin', 'usuario']),
            'modo' => $modo,
        ]);
    }

    public function marcarComoLeida(Notificacion $notificacion, Request $request)
    {
        $user = $request->user();

        if ($user->id !== $notificacion->usuario_id && !$user->hasRole('admin')) {
            abort(403, 'No autorizado');
        }

        $notificacion->update(['leida' => true]);

        return redirect()->back()->with('success', 'Notificacion vista!.');
    }
}
