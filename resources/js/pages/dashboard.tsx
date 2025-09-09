/* eslint-disable @typescript-eslint/no-explicit-any */
// resources/js/Pages/Dashboard.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import VehiculoCard from '@/components/VehiculoCard';

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

    return (
        <AppLayout>
            <Head title="Dashboard de Vehículos" />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Dashboard de Vehículos
                    </h1>
                    {flash?.success && <p className="mt-2 font-semibold text-green-600">{flash.success}</p>}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {vehiculos.map((vehiculo) => (
                        <VehiculoCard key={vehiculo.placa} vehiculo={vehiculo} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
