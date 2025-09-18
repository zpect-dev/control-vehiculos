import AppLayout from '@/layouts/app-layout';
import { UsuarioBasico } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function PerfilUsuario() {
    const { usuario } = usePage<{ usuario: UsuarioBasico }>().props;


    return (
        <AppLayout>
            <Head title={`Perfil de ${usuario.name}`} />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Perfil del Empleado</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">ID interno: {usuario.id}</p>
                </div>

                <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Nombre completo</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{usuario.name}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Cédula</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{usuario.email}</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
