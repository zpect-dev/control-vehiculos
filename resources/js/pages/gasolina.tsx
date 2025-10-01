import ModalRegistroSurtido from '@/components/modal/ModalRegistrarSurtido';
import AppLayout from '@/layouts/app-layout';
import { RegistroGasolina, VehiculoData } from '@/types';
import { exportGasolinaExcel } from '@/utils/exportExcel';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Gasolina() {
    const { vehiculo, registros } = usePage<{ vehiculo: VehiculoData; registros: RegistroGasolina[] }>().props;

    const [modalOpen, setModalOpen] = useState(false);

    const handleExport = () => {
        exportGasolinaExcel(registros);
        exportGasolinaExcel();
    };

    return (
        <AppLayout>
            <Head title="Historial de Gasolina" />

            <ModalRegistroSurtido
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                vehiculo={{
                    placa: vehiculo.placa,
                    modelo: vehiculo.modelo,
                    conductor: vehiculo.usuario?.name ?? 'Sin conductor',
                }}
            />

            <div className="min-h-screen bg-white px-4 py-10 dark:bg-gray-900">
                <div className="mb-6 flex flex-col items-center justify-center text-center">
                    <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-100">Surtido Detallado de Gasolina</h1>
                </div>

                {/* Filtros */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">N° Factura</label>
                        <input type="text" placeholder="Ej: ABC123" className="rounded-md border px-3 py-2 text-sm" />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">Fecha desde</label>
                        <input type="date" className="rounded-md border px-3 py-2 text-sm" />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">Fecha hasta</label>
                        <input type="date" className="rounded-md border px-3 py-2 text-sm" />
                    </div>
                </div>

                {/* Botón para abrir modal */}
                <div className="mb-6 flex flex-col items-center justify-center text-center">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-1 rounded-2xl bg-[#49af4e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#47a84c]"
                    >
                        Nuevo surtido
                    </button>
                </div>

                {/* Tabla simulada */}
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full table-auto border-collapse bg-white dark:bg-gray-800">
                        <thead className="bg-gray-200 dark:bg-gray-700">
                            <tr className="text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                                <th className="px-4 py-2">N° Factura</th>
                                <th className="px-4 py-2">Fecha</th>
                                <th className="px-4 py-2">Vehículo</th>
                                <th className="px-4 py-2">Precio</th>
                                <th className="px-4 py-2">Km Actual</th>
                                <th className="px-4 py-2">Surtido ideal</th>
                                <th className="px-4 py-2">Litros</th>
                                <th className="px-4 py-2">Total $</th>
                                <th className="px-4 py-2">Observaciones</th>
                                <th className="px-4 py-2">Diferencia</th>
                                <th className="px-4 py-2">Conductor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="py-4 text-center text-gray-500">
                                        No hay registros de gasolina para este vehículo.
                                    </td>
                                </tr>
                            ) : (
                                registros.map((registro, index) => (
                                    <tr key={index} className="text-sm text-gray-700 dark:text-gray-300">
                                        <td className="px-4 py-2">{registro.factura}</td>
                                        <td className="px-4 py-2">{registro.fecha}</td>
                                        <td className="px-4 py-2">{registro.vehiculo}</td>
                                        <td className="px-4 py-2">${registro.precio}</td>
                                        <td className="px-4 py-2">{registro.km_actual}</td>
                                        <td className="px-4 py-2">{registro.recorrido}</td>
                                        <td className="px-4 py-2">{registro.litros}</td>
                                        <td className="px-4 py-2">${registro.total}</td>
                                        <td className="px-4 py-2">{registro.observaciones}</td>
                                        <td className="px-4 py-2">{registro.diferencia}</td>
                                        <td className="px-4 py-2">{registro.conductor}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Botón exportar */}
                <div className="my-6 flex flex-col items-center justify-center text-center">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-1 rounded-2xl bg-[#49af4e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#47a84c]"
                    >
                        Generar Excel
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
