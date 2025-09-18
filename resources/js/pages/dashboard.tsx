/* eslint-disable @typescript-eslint/no-explicit-any */
import NotificacionRealtime from '@/components/NotificacionRealtime';
import { Toaster } from '@/components/ui/sonner';
import VehiculoCard from '@/components/VehiculoCard';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Dashboard() {
    const { vehiculos } = usePage<{
        vehiculos: any[];
        modo: string;
    }>().props;

    const [searchTerm, setSearchTerm] = useState('');

    const vehiculosFiltrados = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return vehiculos.filter((v) => {
            const placa = v.placa?.toLowerCase() || '';
            const nombre = v.nombre?.toLowerCase() || '';
            const modelo = v.modelo?.toLowerCase() || '';
            return placa.includes(term) || nombre.includes(term) || modelo.includes(term);
        });
    }, [searchTerm, vehiculos]);

    return (
        <AppLayout>
            <Head title="Dashboard de Vehículos" />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <NotificacionRealtime />
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard de Vehículos</h1>
                </div>
                <div className="mb-6 flex justify-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, placa o modelo"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white px-10 py-2 text-sm text-gray-800 shadow-sm focus:border-green-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                </div>
                <div className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Mostrando <strong>{vehiculosFiltrados.length}</strong> de {vehiculos.length} vehículos
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {vehiculosFiltrados.map((vehiculo) => (
                        <div key={vehiculo.placa} className="animate-fade-in-up transition-transform duration-300 hover:scale-[1.02]">
                            <VehiculoCard vehiculo={vehiculo} />
                        </div>
                    ))}
                </div>
                <Toaster />
            </div>
        </AppLayout>
    );
}
