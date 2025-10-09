/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CheckCircle, MinusCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function Pistas() {
    const { activityMatrix, administrators, actions } = usePage<PageProps>().props;

const { data, setData, get } = useForm<{ date: string }>({
  date: '',
});


    // Enviar automáticamente al backend cuando cambia la fecha
    useEffect(() => {
        if (data.date) {
            get('/supervision', {
    preserveScroll: true,
    preserveState: true,
});

        }
    }, [data.date]);

    const getActionCount = (adminName: any, actionName: string | number) => {
        const adminData = activityMatrix.find((item: { name: any }) => item.name === adminName);
        return adminData?.actions[actionName] || 0;
    };

    return (
        <AppLayout>
            <Head title="Pista de Empleados" />
            <div className="min-h-screen bg-white px-4 py-10 dark:bg-gray-800">
                <h1 className="mb-6 text-center text-4xl font-extrabold text-gray-900 dark:text-white">
                    Pista de Empleados
                </h1>

<<<<<<< Updated upstream
                <div className="mx-auto max-w-full overflow-x-auto rounded-xl shadow-2xl transition-all duration-300">
                    <table className="w-full text-gray-700 dark:text-gray-300">
                        <thead>
                            <tr className="rounded-t-xl bg-gray-200 text-sm dark:bg-gray-700">
                                <th className="rounded-tl-xl p-3 text-left font-semibold">Usuario</th>
                                {actions.map((action: any) => (
                                    <th key={action} className="p-3 text-center font-semibold">
                                        {action}
                                    </th>
                                ))}
                                <th className="rounded-tr-xl p-3 text-center font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {administrators.map((adminName: any) => {
                                const totalActions = actions.reduce((sum: number, actionName: any) => sum + getActionCount(adminName, actionName), 0);
                                return (
                                    <tr key={adminName} className="dark:bg-gray-800">
                                        <td className="border-2 border-gray-300 p-3 font-semibold dark:border-gray-700">{adminName}</td>
                                        {actions.map((actionName: any) => {
                                            const count = getActionCount(adminName, actionName);
                                            return (
                                                <td
                                                    key={`${adminName}-${actionName}`}
                                                    className={`border-2 border-gray-300 p-3 text-center font-bold dark:border-gray-700`}
                                                >
                                                    {count > 0 ? (
                                                        <span className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
                                                            <CheckCircle className="h-4 w-4" />
                                                            {count}
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center justify-center gap-1 text-red-500 dark:text-red-400">
                                                            <MinusCircle className="h-4 w-4" />
                                                            {count}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="border-2 border-gray-300 p-3 text-center font-bold dark:border-gray-700">{totalActions}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
=======
                {/* Filtro por fecha */}
                <div className="mb-6 flex flex-col items-center">
                    <label className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">Filtrar por fecha</label>
                    <input
                        type="date"
                        value={data.date}
                        onChange={(e) => setData('date', e.target.value)}
                        className="rounded-md border px-3 py-2 text-sm"
                    />
>>>>>>> Stashed changes
                </div>

                {/* Fecha seleccionada */}
                {data.date && (
                    <div className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        Mostrando acciones del día: <strong>{data.date}</strong>
                    </div>
                )}

                {/* Tabla o mensaje si no hay resultados */}
                {activityMatrix.length === 0 ? (
                    <div className="text-center text-lg text-gray-500 dark:text-gray-400">
                        No se encontraron acciones para esta fecha.
                    </div>
                ) : (
                    <div className="mx-auto max-w-full overflow-x-auto rounded-xl shadow-2xl transition-all duration-300">
                        <table className="w-full text-gray-700 dark:text-gray-300">
                            <thead>
                                <tr className="rounded-t-xl bg-gray-200 text-sm dark:bg-gray-700">
                                    <th className="rounded-tl-xl p-3 text-left font-semibold">Usuario</th>
                                    {actions.map((action: any) => (
                                        <th key={action} className="p-3 text-center font-semibold">{action}</th>
                                    ))}
                                    <th className="rounded-tr-xl p-3 text-center font-semibold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {administrators.map((adminName: any) => {
                                    const totalActions = actions.reduce(
                                        (sum: number, actionName: any) => sum + getActionCount(adminName, actionName),
                                        0
                                    );
                                    return (
                                        <tr key={adminName} className="dark:bg-gray-800">
                                            <td className="border-2 border-gray-300 p-3 font-semibold dark:border-gray-700">{adminName}</td>
                                            {actions.map((actionName: any) => {
                                                const count = getActionCount(adminName, actionName);
                                                return (
                                                    <td
                                                        key={`${adminName}-${actionName}`}
                                                        className="border-2 border-gray-300 p-3 text-center font-bold dark:border-gray-700"
                                                    >
                                                        {count > 0 ? (
                                                            <span className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
                                                                <CheckCircle className="h-4 w-4" />
                                                                {count}
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center justify-center gap-1 text-red-500 dark:text-red-400">
                                                                <MinusCircle className="h-4 w-4" />
                                                                {count}
                                                            </span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            <td className="border-2 border-gray-300 p-3 text-center font-bold dark:border-gray-700">
                                                {totalActions}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
