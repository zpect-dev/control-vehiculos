import ModalRegistroSurtido from '@/components/modal/ModalRegistrarSurtido';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Gasolina() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <AppLayout>
            <Head title="Historial de Gasolina" />

            {/* Modal visual */}
            <ModalRegistroSurtido isOpen={modalOpen} onClose={() => setModalOpen(false)} />

            <div className="min-h-screen bg-gray-100 px-4 py-10 dark:bg-gray-900">
                <div className="mb-6 flex flex-col items-center justify-center text-center">
                    <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-100">Surtido Detallado de Gasolina</h1>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-1 rounded-2xl bg-[#49af4e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#47a84c]"
                    >
                        Nuevo surtido
                    </button>
                </div>

                {/* Filtros */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">Filtrar por placa</label>
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

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">Sede</label>
                        <select className="rounded-md border px-3 py-2 text-sm">
                            <option value="">Todas las sedes</option>
                            <option value="San Cristóbal">San Cristóbal</option>
                            <option value="Rubio">Rubio</option>
                            <option value="La Fría">La Fría</option>
                        </select>
                    </div>
                </div>

                <button className="mb-6 rounded bg-[#49af4e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#47a84c]">Aplicar filtros</button>

                {/* Tabla */}
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full table-auto border-collapse bg-white dark:bg-gray-800">
                        <thead className="bg-gray-200 dark:bg-gray-700">
                            <tr className="text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                                <th className="px-4 py-2">N°</th>
                                <th className="px-4 py-2">Fecha</th>
                                <th className="px-4 py-2">Vehículo</th>
                                <th className="px-4 py-2">Sede</th>
                                <th className="px-4 py-2">Precio</th>
                                <th className="px-4 py-2">Km Inicial</th>
                                <th className="px-4 py-2">Km Final</th>
                                <th className="px-4 py-2">Recorrido Km</th>
                                <th className="px-4 py-2">Litros</th>
                                <th className="px-4 py-2">Total $</th>
                                <th className="px-4 py-2">Observaciones</th>
                                <th className="px-4 py-2">Detallado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, index) => (
                                <tr key={index} className="border-b text-sm text-gray-600 dark:text-gray-300">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">2025-09-22</td>
                                    <td className="px-4 py-2">Toyota Corolla</td>
                                    <td className="px-4 py-2">San Cristóbal</td>
                                    <td className="px-4 py-2">$0.50</td>
                                    <td className="px-4 py-2">12000</td>
                                    <td className="px-4 py-2">12250</td>
                                    <td className="px-4 py-2">250</td>
                                    <td className="px-4 py-2">20</td>
                                    <td className="px-4 py-2">$10.00</td>
                                    <td className="px-4 py-2">Sin observaciones</td>
                                    <td className="px-4 py-2">
                                        <button className="flex items-center gap-1 rounded bg-[#49af4e] p-2 text-xs font-semibold text-white hover:bg-[#47a84c]">
                                            <Search className="h-4 w-4" />
                                            Ver detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
