import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';

export default function ModalRegistroSurtido({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl dark:border dark:border-gray-700 dark:bg-gray-900">
                    {/* Encabezado */}
                    <div className="mb-6 flex items-center justify-between border-b pb-2">
                        <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">Registrar Surtido de Gasolina</DialogTitle>
                        <button onClick={onClose} className="rounded-full p-1 text-gray-500 hover:text-gray-700 dark:hover:text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Placa */}
                    <div className="mb-4">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">32TOAD</label>
                    </div>

                    {/* Datos simulados del vehículo */}
                    <div className="mb-6 grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                        <p>
                            <strong>Conductor:</strong> Juan Pérez
                        </p>
                        <p>
                            <strong>Modelo:</strong> Toyota Corolla
                        </p>
                    </div>

                    {/* Campos editables */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">


                        <div>
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Litros surtidos</label>
                            <input type="number" placeholder="Ej: 20" className="w-full rounded border px-3 py-2 text-sm" />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kilometraje actual</label>
                            <input type="number" placeholder="Ej: 12500" className="w-full rounded border px-3 py-2 text-sm" />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Observación</label>
                            <textarea placeholder="Observaciones adicionales..." className="w-full rounded border px-3 py-2 text-sm" rows={3} />
                        </div>
                    </div>

                    {/* Botón de acción */}
                    <div className="mt-6 text-right">
                        <button className="rounded bg-[#49af4e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4fbb55]">
                            Registrar surtido
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
