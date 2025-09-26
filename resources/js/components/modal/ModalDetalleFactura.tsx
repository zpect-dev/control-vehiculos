/* eslint-disable react-hooks/rules-of-hooks */
import { ModalDetalleFacturaProps } from '@/types';
import { formatFecha } from '@/utils/formatDate';
import { formatCantidad, formatPrecio } from '@/utils/formatNumbers';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Checkbox } from '../ui/checkbox';

export default function ModalDetalleFactura({ factura, vehiculo, renglones, auditados, isAdmin, onClose, visible }: ModalDetalleFacturaProps) {
    if (!visible || typeof document === 'undefined') return null;

    const badgeEstado = (estado: boolean) => (
        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            {estado ? 'Aprobado' : 'Pendiente'}
        </span>
    );
    const handleSubmitAuditoria = () => {
        const hayImagenes = Object.values(imagenes).some((file) => file instanceof File);

        if (!hayImagenes) {
            return;
        }

        const formData = new FormData();
        formData.append('fact_num', factura.fact_num);
        formData.append('observacion', observacionConductor);

        Object.entries(imagenes).forEach(([co_art, file]) => {
            if (file) formData.append(`imagenes[${co_art}]`, file);
        });

        router.post(`/fichaTecnica/facturas/${factura.fact_num}/auditoria`, formData, {
            onSuccess: () => {
                console.log('Auditoría enviada con éxito');
                onClose();
            },
            onError: (errors) => {
                console.log('Error al enviar auditoría:', errors);
            },
            onFinish: () => {
                console.log('Petición finalizada');
            },
        });
    };

    const [observacionConductor, setObservacionConductor] = useState(factura.observaciones_res ?? '');
    const [imagenes, setImagenes] = useState<Record<string, File | null>>({});
    const modalContent = (
        <div
            className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-black p-2 backdrop-blur-sm sm:p-4 md:p-6"
            role="dialog"
            aria-modal="true"
        >
            <div className="relative max-h-[90vh] w-full max-w-[95vw] overflow-auto rounded-2xl bg-white p-4 text-base text-gray-800 shadow-2xl sm:max-w-2xl sm:p-6 md:max-w-3xl dark:bg-gray-900">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="flex items-center gap-3 text-xl font-extrabold text-green-700 dark:text-green-500">
                        Detalle de la Factura #{factura?.fact_num ?? '—'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-3xl font-bold text-gray-400 hover:text-gray-600"
                        title="Cerrar"
                        aria-label="Cerrar modal"
                    >
                        <X />
                    </button>
                </div>
                {/* <pre className="mt-4 rounded bg-gray-100 p-2 text-xs text-red-500">{JSON.stringify({ factura, renglones, vehiculo }, null, 2)}</pre> */}
                {/* Datos principales */}
                <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-2">
                    <div>
                        <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Conductor</p>
                        <div className="rounded-lg border bg-gray-100 p-3 font-medium text-gray-900 shadow-sm dark:bg-gray-200">
                            {vehiculo.conductor}
                        </div>
                    </div>
                    <div>
                        <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Placa</p>
                        <div className="rounded-lg border bg-gray-100 p-3 font-medium text-black shadow-sm dark:bg-gray-200">{vehiculo.placa}</div>
                    </div>
                    <div>
                        <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Fecha de Factura</p>
                        <div className="rounded-lg border bg-gray-100 p-3 font-medium text-gray-900 shadow-sm dark:bg-gray-200">
                            {formatFecha(factura?.fec_emis ?? '-')}
                        </div>
                    </div>
                    <div>
                        <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Revisado</p>
                        <div className="rounded-lg border bg-gray-100 p-3 font-medium text-gray-900 shadow-sm dark:bg-gray-200">
                            {typeof factura?.revisado === 'boolean' ? badgeEstado(factura.revisado) : '—'}
                        </div>
                    </div>
                    <div className="col-span-2">
                        <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Descripción</p>
                        <div className="rounded-lg border bg-gray-100 p-3 font-medium text-gray-900 shadow-sm dark:bg-gray-200">
                            {factura?.descripcion ?? '—'}
                        </div>
                    </div>
                </div>

                {/* Tabla de productos */}
                <div className="mt-8">
                    <h3 className="mb-2 text-lg font-bold text-gray-800 dark:text-gray-100">
                        {auditados ? 'Renglones auditados' : 'Renglones originales'}
                    </h3>

                    <div className="overflow-x-auto rounded-lg border shadow-sm">
                        <table className="w-full min-w-[700px] bg-white text-sm dark:bg-gray-800">
                            <thead className="border-b bg-gray-100 font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left">Producto</th>
                                    <th className="px-4 py-2 text-left">Código</th>
                                    <th className="px-4 py-2 text-left">Cantidad</th>
                                    <th className="px-4 py-2 text-left">Precio</th>
                                    <th className="px-4 py-2 text-left">Imagen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renglones.map((r, index) => {
                                    const cantidad = typeof r.total_art === 'string' ? parseFloat(r.total_art) : r.total_art;
                                    const precio = typeof r.reng_neto === 'string' ? parseFloat(r.reng_neto) : r.reng_neto;

                                    return (
                                        <tr key={`${r.fact_num}-${r.co_art}-${index}`} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td
                                                className="max-w-[125px] truncate px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100"
                                                title={r.repuesto?.art_des ?? '—'}
                                            >
                                                {r.repuesto?.art_des ?? '—'}
                                            </td>
                                            <td className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">{r.co_art}</td>
                                            <td className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{formatCantidad(cantidad)}</td>
                                            <td className="px-4 py-2 text-left font-bold text-green-700 dark:text-green-400">
                                                {formatPrecio(precio)}
                                            </td>
                                            <td className="px-4 py-2 text-left">
                                                <div className="flex items-center gap-2">
                                                    {imagenes[r.co_art] ? (
                                                        <img
                                                            src={URL.createObjectURL(imagenes[r.co_art]!)}
                                                            alt="Nueva imagen"
                                                            className="h-18 w-14 rounded border border-blue-500 object-cover"
                                                        />
                                                    ) : (
                                                        r.imagen_url && (
                                                            <img
                                                                src={r.imagen_url}
                                                                alt="Imagen guardada"
                                                                className="h-18 w-14 rounded border border-green-500 object-cover"
                                                            />
                                                        )
                                                    )}

                                                    <div className="flex flex-col">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0] ?? null;
                                                                setImagenes((prev) => ({ ...prev, [r.co_art]: file }));
                                                            }}
                                                            className="block w-full max-w-[110px] truncate text-xs text-gray-600 dark:text-gray-300"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Resumen de totales */}
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border bg-gray-100 p-4 shadow-sm dark:bg-gray-800">
                            <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">Total Bruto</p>
                            <p className="text-lg font-bold text-green-700 dark:text-green-400">{formatPrecio(factura.tot_bruto)}</p>
                        </div>
                        <div className="rounded-lg border bg-gray-100 p-4 shadow-sm dark:bg-gray-800">
                            <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">Total Neto</p>
                            <p className="text-lg font-bold text-green-700 dark:text-green-400">{formatPrecio(factura.tot_neto)}</p>
                        </div>
                    </div>
                </div>
                {/* Observación del conductor */}
                <div className="my-6">
                    <h3 className="mb-2 block text-lg font-semibold text-gray-800 dark:text-white">Observación del conductor</h3>
                    <textarea
                        value={observacionConductor}
                        onChange={(e) => setObservacionConductor(e.target.value)}
                        className="w-full resize-none rounded border px-3 py-2 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-white"
                        rows={4}
                        placeholder="Escribe aquí..."
                    />

                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                handleSubmitAuditoria();
                            }}
                            className="mt-4 rounded-md bg-[#1a9888] px-4 py-2 text-sm font-semibold text-white hover:bg-[#188576]"
                        >
                            Guardar auditoría
                        </button>
                    </div>
                </div>
                {/* Sección Admin */}
                {isAdmin && (
                    <>
                        <div className="my-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Marcar Aprobado</label>
                                <div className="flex items-center gap-3 rounded-lg border bg-gray-100 p-3 shadow-sm dark:bg-gray-200">
                                    <Checkbox id="aprobado" name="aprobado" />
                                    <span className="text-md font-medium text-gray-900 dark:text-gray-800">Aprobado</span>
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Supervisor</label>
                                <div className="rounded-lg border bg-gray-100 p-3 font-medium text-black shadow-sm dark:bg-gray-200">—</div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Descontar o Cubre Empresa</label>
                                <select
                                    className="w-full rounded-lg border bg-gray-50 p-3 font-medium text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-400"
                                    disabled
                                >
                                    <option>—</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Usuario que Paga</label>
                                <select
                                    className="w-full rounded-lg border bg-gray-50 p-3 font-medium text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-400"
                                    disabled
                                >
                                    <option>—</option>
                                </select>
                            </div>
                        </div>

                        <h3 className="mb-2 block text-lg font-semibold text-gray-800 dark:text-white">Observación del supervisor</h3>
                        <textarea
                            className="w-full resize-none rounded border px-3 py-2 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-white"
                            rows={4}
                            placeholder="Escribe aquí..."
                        />
                        <div className="flex items-center justify-end">
                            <button
                                type="submit"
                                className="mt-4 rounded-md bg-[#1a9888] px-4 py-2 text-sm font-semibold text-white hover:bg-[#188576]"
                            >
                                Guardar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
