import { router } from '@inertiajs/react';
import { useState } from 'react';

type User = {
    id: string | number;
    name: string;
};

type Vehiculo = {
    placa: string;
    usuario?: User | null;
};

interface AsignacionUserProps {
    vehiculo: Vehiculo;
    users: User[];
    isAdmin: boolean;
}

export default function AsignacionUser({ vehiculo, users, isAdmin }: AsignacionUserProps) {
    const [assignedUser, setAssignedUser] = useState(vehiculo.usuario || null);
    const [selectedUserId, setSelectedUserId] = useState(vehiculo.usuario?.id || '');
    const [validationError, setValidationError] = useState('');

    const handleUserAssign = () => {
        if (!selectedUserId) {
            setValidationError('Por favor, selecciona un usuario para asignar.');
            return;
        }
        setValidationError('');

        router.post(
            `/fichaTecnica/${vehiculo.placa}/assign-user`,
            { user_id: selectedUserId },
            {
                preserveState: true,
                onSuccess: () => {
                    const newUser = users.find((u) => String(u.id) === String(selectedUserId)) || null;
                    setAssignedUser(newUser);
                },
                onError: (errors) => {
                    console.error('Error al asignar usuario:', errors);
                },
            },
        );
    };

    return (
        <div className="mt-4 flex flex-col items-center justify-center">
            <div className="flex items-center space-x-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Usuario Asignado:</p>
                {assignedUser ? (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-semibold text-[#49af4e] dark:bg-green-200 dark:text-green-900">
                        {assignedUser.name}
                    </span>
                ) : (
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-semibold text-red-500 dark:bg-red-200 dark:text-red-900">
                        Sin asignar
                    </span>
                )}
            </div>

            {isAdmin && (
                <div className="mt-4 flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="user-select" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Asignar a:
                        </label>
                        <select
                            id="user-select"
                            value={selectedUserId}
                            onChange={(e) => {
                                setSelectedUserId(e.target.value);
                                setValidationError('');
                            }}
                            className="focus:ring-opacity-50 block rounded-md border-gray-300 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Seleccionar usuario</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleUserAssign}
                            className="inline-flex items-center rounded-md border border-transparent bg-[#1a9888] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#198d7e] focus:ring-2 focus:ring-[#1a9888] focus:ring-offset-2 focus:outline-none"
                        >
                            Asignar
                        </button>
                    </div>
                    {validationError && <p className="text-sm text-red-500">{validationError}</p>}
                </div>
            )}
        </div>
    );
}
