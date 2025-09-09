/* eslint-disable @typescript-eslint/no-explicit-any */
// resources/js/Pages/Dashboard.tsx

import VehiculoCard from '@/components/VehiculoCard';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type FlashProps = {
    success?: string;
    [key: string]: any;
};

export default function Dashboard() {
    const { vehiculos, flash } = usePage<{
        vehiculos: any[];
        modo: string;
        flash: FlashProps;
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
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard de Vehículos</h1>
                    {flash?.success && <p className="mt-2 font-semibold text-green-600 dark:text-green-400">{flash.success}</p>}
                </div>

                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o placa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 shadow-sm focus:border-green-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {vehiculosFiltrados.map((vehiculo) => (
                        <VehiculoCard key={vehiculo.placa} vehiculo={vehiculo} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
