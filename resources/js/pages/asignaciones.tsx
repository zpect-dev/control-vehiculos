import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

type VehiculoProps = {
    placa: string;
    modelo: string;
};

type UserProps = {
    id: number;
    name: string;
};

type AsignacionProps = {
    id: number;
    vehiculo: VehiculoProps;
    user: UserProps;
    admin: UserProps;
    kilometraje: number;
    foto_kilometraje?: string;
    fecha_asignacion?: string;
};

type PageProps = {
    vehiculo: VehiculoProps;
    historial: AsignacionProps[];
};

export default function Asignaciones() {
    const { vehiculo, historial } = usePage<PageProps>().props;

    return (
        <AppLayout>
            <Head title={`Historial de Asignaciones - ${vehiculo.placa}`} />

            <div className="min-h-screen bg-gray-100 px-4 py-10 dark:bg-gray-900">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-gray-100">Historial de Asignaciones</h1>

                <div className="mx-auto max-w-6xl space-y-6">
                    {historial.length > 0 ? (
                        historial.map((registro) => (
                            <div key={registro.id} className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
                                <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-semibold">Vehículo:</span> {registro.vehiculo?.placa}
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-semibold">Asignado a:</span> {registro.user?.name}
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-semibold">Asignado por:</span> {registro.admin?.name}
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-semibold">Kilometraje:</span> {registro.kilometraje} km
                                </div>

                                {registro.fecha_asignacion && (
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        <span className="font-semibold">Fecha:</span> {new Date(registro.fecha_asignacion).toLocaleDateString()}
                                    </div>
                                )}

                                {registro.foto_kilometraje && (
                                    <div className="mt-4">
                                        <img
                                            src={`/storage/${registro.foto_kilometraje}`}
                                            alt="Foto de kilometraje"
                                            className="max-w-xs rounded-md shadow-md"
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400">No hay asignaciones registradas para este vehículo.</div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
