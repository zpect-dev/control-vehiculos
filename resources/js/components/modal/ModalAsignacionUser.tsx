import FormCard from '@/components/FormCard';
import { getAsignacionFields } from '@/constants/formFields';
import type { User, UsuarioAsignado, Vehiculo } from '@/types';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';

interface ModalAsignacionUserProps {
    isOpen: boolean;
    onClose: () => void;
    vehiculo: Vehiculo;
    users: User[];
    isAdmin: boolean;
    onSuccess?: (user: UsuarioAsignado) => void;
}

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
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl dark:border dark:border-gray-700 dark:bg-gray-900">
                    {/* Encabezado */}
                    <div className="mb-6 flex items-center justify-between border-b pb-2">
                        <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">Asignar Usuario al Vehículo</DialogTitle>
                        <button onClick={onClose} className="rounded-full p-1 text-gray-500 hover:text-gray-700 dark:hover:text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Info del vehículo */}
                    <div className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                        <p>
                            <strong>Placa:</strong> {vehiculo.placa}
                        </p>
                        <p>
                            <strong>Modelo:</strong> {vehiculo.modelo}
                        </p>
                    </div>

                    {/* Formulario */}
                    <FormCard title="" fields={fields} formType="asignacion" buttonText="Asignar Usuario" onSubmit={handleSubmit} />
                </DialogPanel>
            </div>
        </Dialog>
    );
}
