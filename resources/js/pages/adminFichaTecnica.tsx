import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function adminFichaTecnica() {
    return (
        <AppLayout>
            <Head title="Ficha Técnica / Registro General del Vehículo" />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Ficha Técnica / Registro General del Vehículo</h1>
                </div>
            </div>
        </AppLayout>
    );
}
