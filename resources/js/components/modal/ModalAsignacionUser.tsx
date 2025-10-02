import FormCard from '@/components/FormCard';
import { getAsignacionFields } from '@/constants/formFields';
import type { ModalAsignacionUserProps } from '@/types';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';

export default function ModalAsignacionUser({ isOpen, onClose, vehiculo, users, onSuccess }: ModalAsignacionUserProps) {
    const fields = getAsignacionFields(users);

    const handleSubmit = (formData: Record<string, string | boolean | File | null>) => {
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                form.append(key, value instanceof File ? value : String(value));
            }
        });

        router.post(`/fichaTecnica/${vehiculo.placa}/assign-user`, form, {
            preserveState: true,
            forceFormData: true,
            onSuccess: () => {
                const nuevoUsuario = users.find((u) => String(u.id) === formData.user_id);
                if (nuevoUsuario) {
                    onSuccess?.({ id: nuevoUsuario.id, name: nuevoUsuario.name });
                }
                onClose();
            },
            onError: (errors) => {
                console.error('Error al asignar usuario:', errors);
            },
        });
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="animate-fade-in max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:border dark:border-gray-700 dark:bg-gray-900">
                    {/* Encabezado */}
                    <div className="mb-6 flex items-center justify-between border-b pb-3">
                        <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-white">Asignar Usuario al Vehículo</DialogTitle>
                        <button
                            onClick={onClose}
                            aria-label="Cerrar modal"
                            className="rounded-full p-1 text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Info del vehículo */}
                    <fieldset className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <legend className="text-base font-medium text-gray-700 dark:text-white">Detalles del Vehículo</legend>
                        <div>
                            <strong>Placa:</strong> {vehiculo.placa}
                        </div>
                        <div>
                            <strong>Modelo:</strong> {vehiculo.modelo}
                        </div>
                    </fieldset>

                    {/* Formulario */}
                    <FormCard
                        title="Asignación de Usuario"
                        fields={fields}
                        formType="asignacion"
                        buttonText="Asignar Usuario"
                        onSubmit={handleSubmit}
                    />
                </DialogPanel>
            </div>
        </Dialog>
    );
}
