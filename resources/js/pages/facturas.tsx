import { TablaFacturas } from '@/components/TablaFacturas';
import AppLayout from '@/layouts/app-layout';
import { AuditoriaProps } from '@/types';
// import { exportAuditoriaExcel } from '@/utils/exportAuditoriaExcel';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Auditoria({ facturas, vehiculo, isAdmin }: AuditoriaProps) {
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [busqueda, setBusqueda] = useState('');

    const facturasFiltradas = Array.isArray(facturas)
        ? facturas.filter((f) => {
              const fecha = new Date(f.fec_emis).getTime();
              const desde = fechaDesde ? new Date(fechaDesde).getTime() : null;
              const hasta = fechaHasta ? new Date(fechaHasta).getTime() : null;
              const coincideFecha = (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
              const coincideBusqueda = f.fact_num.includes(busqueda.trim());

              return coincideFecha && coincideBusqueda;
          })
        : [];

    // const handleExport = () => {
    //     exportAuditoriaExcel(facturasFiltradas, vehiculo);
    // };

    return (
        <AppLayout>
            <Head title="Historial de Gastos" />

            <div className="min-h-screen bg-white px-4 py-10 dark:bg-gray-900">
                <div className="mb-6 flex flex-col items-center justify-center text-center">
                    <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-100">Auditoria de Gastos del Vehiculo {vehiculo.modelo}</h1>
                </div>

                {/* Filtros */}
                <div className="mb-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-3">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">Fecha desde</label>
                        <input
                            type="date"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                            className="rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">Fecha hasta</label>
                        <input
                            type="date"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                            className="rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">Buscar por N° de factura</label>
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Ej: 3703"
                            className="rounded-md border px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                {/* Tabla modular */}
                <TablaFacturas facturas={facturasFiltradas} vehiculo={vehiculo} isAdmin={!isAdmin} aprobado={false} />

                {/* Botón exportar */}
                {/* <div className="my-6 flex flex-col items-center justify-center text-center">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-1 rounded-2xl bg-[#49af4e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#47a84c]"
                    >
                        Generar Report en Excel
                    </button>
                </div> */}
            </div>
        </AppLayout>
    );
}
