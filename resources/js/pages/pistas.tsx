import AppLayout from '@/layouts/app-layout';
import { PageProps, Pista } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Pistas() {
    const { pistas } = usePage<PageProps>().props;

    return (
        <AppLayout>
            <Head title="Pista de Empleados" />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <h1 className="mb-8 text-center text-4xl font-bold text-gray-900 dark:text-white">Pista de Empleados</h1>

                <div className="mx-auto max-w-5xl space-y-4">
                    {pistas.map((pista: Pista) => (
                        <div key={pista.id} className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">Usuario:</span> {pista.name || 'Desconocido'}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">Acción:</span> {pista.accion}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">Área:</span> {pista.modelo}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">Fecha:</span> {new Date(pista.created_at).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
