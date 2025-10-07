import AppLayout from '@/layouts/app-layout';
import { PageProps, Pista } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CalendarDays, FileText, Layers, User } from 'lucide-react';
import { useState } from 'react';

export default function Pistas() {
    const { pistas } = usePage<PageProps>().props;
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroAccion, setFiltroAccion] = useState('');

    const pistasFiltradas = pistas.filter((pista: Pista) => {
        const nombreMatch = pista.name?.toLowerCase().includes(filtroNombre.toLowerCase());
        const accionMatch = pista.accion?.toLowerCase().includes(filtroAccion.toLowerCase());
        return nombreMatch && accionMatch;
    });

    return (
        <AppLayout>
            <Head title="Pista de Empleados" />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <h1 className="mb-8 text-center text-4xl font-bold text-gray-900 dark:text-white">Pista de Empleados</h1>

                {/* Filtros */}
                <div className="mx-auto mb-6 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Filtrar por nombre</label>
                        <input
                            type="text"
                            value={filtroNombre}
                            onChange={(e) => setFiltroNombre(e.target.value)}
                            placeholder="Ej. Cristian"
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-green-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Filtrar por acción</label>
                        <input
                            type="text"
                            value={filtroAccion}
                            onChange={(e) => setFiltroAccion(e.target.value)}
                            placeholder="Ej. Aprobo, Audito, Asigno..."
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-green-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                </div>

                {/* Resultados */}
                <div className="mx-auto max-w-5xl space-y-4">
                    {pistasFiltradas.length > 0 ? (
                        pistasFiltradas.map((pista: Pista) => (
                            <div
                                key={pista.id}
                                className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <span className="font-semibold">Usuario:</span> {pista.name || 'Desconocido'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <span className="font-semibold">Acción:</span> {pista.accion}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Layers className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <span className="font-semibold">Área:</span> {pista.modelo}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <span className="font-semibold">Fecha:</span>{' '}
                                        {new Date(pista.created_at).toLocaleString('es-VE', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 dark:text-gray-400">No se encontraron pistas con esos filtros.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
