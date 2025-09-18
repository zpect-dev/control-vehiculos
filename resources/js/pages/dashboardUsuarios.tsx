/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toaster } from '@/components/ui/sonner';
import UserCard from '@/components/UserCard';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function DashboardUsuarios() {
    const { usuarios } = usePage<{ usuarios: any[] }>().props;
    const [searchTerm, setSearchTerm] = useState('');

    const usuariosFiltrados = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return usuarios.filter((u) => {
            const nombre = u.name?.toLowerCase() || '';
            const cedula = u.email?.toLowerCase() || '';
            return nombre.includes(term) || cedula.includes(term);
        });
    }, [searchTerm, usuarios]);

    return (
        <AppLayout>
            <Head title="Dashboard de Empleados" />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard de Empleados</h1>
                </div>

                <div className="mb-6 flex justify-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o cedula"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white px-10 py-2 text-sm text-gray-800 shadow-sm focus:border-green-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                </div>

                <div className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Mostrando <strong>{usuariosFiltrados.length}</strong> de {usuarios.length} empleados
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {usuariosFiltrados.map((usuario) => (
                        <div key={usuario.id} className="animate-fade-in-up transition-transform duration-300 hover:scale-[1.02]">
                            <UserCard usuario={usuario} />
                        </div>
                    ))}
                </div>

                <Toaster />
            </div>
        </AppLayout>
    );
}
