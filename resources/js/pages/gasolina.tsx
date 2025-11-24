import ModalRegistroSurtido from '@/components/modal/ModalRegistrarSurtido';
import AppLayout from '@/layouts/app-layout';
import { RegistroGasolina, VehiculoData } from '@/types';
import { exportGasolinaExcel } from '@/utils/exportExcel';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useMemo, useState } from 'react';

export default function Gasolina() {
    const { vehiculo, registros } = usePage<{ vehiculo: VehiculoData; registros: RegistroGasolina[] }>().props;

    // Filtros
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [factura, setFactura] = useState('');

    // Estado para la selección múltiple (Array de números de factura)
    const [selectedFacturas, setSelectedFacturas] = useState<number[]>([]);

    const registrosFiltrados = useMemo(() => {
        return registros.filter((r) => {
            const matchFactura = factura ? r.factura.toString().includes(factura) : true;
            const matchDesde = fechaDesde ? r.fecha >= fechaDesde : true;
            const matchHasta = fechaHasta ? r.fecha <= fechaHasta : true;
            return matchFactura && matchDesde && matchHasta;
        });
    }, [factura, fechaDesde, fechaHasta, registros]);

    const [modalOpen, setModalOpen] = useState(false);

    // Seleccionar o Deseleccionar
    const toggleSeleccion = (numFactura: number) => {
        setSelectedFacturas((prev) => (prev.includes(numFactura) ? prev.filter((f) => f !== numFactura) : [...prev, numFactura]));
    };

    // Seleccionar o Deseleccionar todos
    const toggleSeleccionarTodo = () => {
        if (selectedFacturas.length === registrosFiltrados.length) {
            setSelectedFacturas([]);
        } else {
            setSelectedFacturas(registrosFiltrados.map((r) => r.factura));
        }
    };

    const handleExport = () => {
        exportGasolinaExcel(registros);
    };

    // Función para enviar al backend los seleccionados
    const handleExportSeleccionados = async () => {
        if (selectedFacturas.length === 0) return;

        try {
            const response = await axios.post('/gasolina/exportar-seleccion', {
                facturas: selectedFacturas,
            });

            const datos = response.data;
            console.log(datos);
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('Hubo un error al generar el reporte.');
        }
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
                        <label className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">Fecha desde</label>
                        <input
                            type="date"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                            className="rounded-md border px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">Fecha hasta</label>
                        <input
                            type="date"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                            className="rounded-md border px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">Buscar por N° de factura</label>
                        <input
                            type="text"
                            value={factura}
                            onChange={(e) => setFactura(e.target.value)}
                            placeholder="Ej: ABC12345"
                            className="rounded-md border px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-center">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-1 rounded-2xl bg-[#49af4e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#47a84c]"
                    >
                        Nuevo surtido
                    </button>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-1 rounded-2xl bg-[#49af4e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#47a84c]"
                    >
                        Reporte de Excel
                    </button>

                    {/* Botón exportar seleccionados */}
                    {selectedFacturas.length > 0 && (
                        <button
                            onClick={handleExportSeleccionados}
                            className="flex items-center gap-1 rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-purple-500 hover:shadow-xl"
                        >
                            Exportar Seleccionados ({selectedFacturas.length})
                        </button>
                    )}
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full table-auto border-collapse bg-white dark:bg-gray-800">
                        <thead className="bg-gray-200 dark:bg-gray-700">
                            <tr className="text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                                {/* Checkbox Header (Seleccionar Todo) */}
                                <th className="px-4 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-[#49af4e] focus:ring-[#49af4e]"
                                        onChange={toggleSeleccionarTodo}
                                        checked={registrosFiltrados.length > 0 && selectedFacturas.length === registrosFiltrados.length}
                                    />
                                </th>
                                <th className="px-4 py-2">N° Factura</th>
                                <th className="px-4 py-2">Fecha</th>
                                <th className="px-4 py-2">Vehículo</th>
                                <th className="px-4 py-2">Precio</th>
                                <th className="px-4 py-2">Km</th>
                                <th className="px-4 py-2">Surtido ideal</th>
                                <th className="px-4 py-2">Litros</th>
                                <th className="px-4 py-2">Total $</th>
                                <th className="px-4 py-2">Observaciones</th>
                                <th className="px-4 py-2">Diferencia Litros</th>
                                <th className="px-4 py-2">Conductor</th>
                                <th className="px-4 py-2">Supervisor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.length === 0 ? (
                                <tr>
                                    <td colSpan={13} className="py-4 text-center text-gray-500">
                                        No hay registros de gasolina para este vehículo.
                                    </td>
                                </tr>
                            ) : (
                                registrosFiltrados.map((registro, index) => (
                                    <tr
                                        key={index}
                                        className={`text-sm text-gray-700 even:bg-gray-50 dark:text-gray-300 dark:even:bg-gray-700 ${selectedFacturas.includes(registro.factura) ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                                    >
                                        {/* Checkbox Individual */}
                                        <td className="px-4 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-[#49af4e] focus:ring-[#49af4e]"
                                                checked={selectedFacturas.includes(registro.factura)}
                                                onChange={() => toggleSeleccion(registro.factura)}
                                            />
                                        </td>
                                        <td className="px-4 py-2">{registro.factura}</td>
                                        <td className="px-4 py-2">{registro.fecha}</td>
                                        <td className="px-4 py-2">{registro.vehiculo}</td>
                                        <td className="px-4 py-2">${registro.precio}</td>
                                        <td className="px-4 py-2">{registro.km_actual}</td>
                                        <td className="px-4 py-2">{registro.recorrido}</td>
                                        <td className="px-4 py-2">{registro.litros}</td>
                                        <td className="px-4 py-2">${registro.total}</td>
                                        <td className="px-4 py-2">{registro.observaciones}</td>
                                        <td className="px-4 py-2">{registro.diferencia} Litros</td>
                                        <td className="px-4 py-2">{registro.conductor}</td>
                                        <td className="px-4 py-2">{registro.admin ?? '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
