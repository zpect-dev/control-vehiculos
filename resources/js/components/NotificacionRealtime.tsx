/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePage } from '@inertiajs/react';
import Pusher from 'pusher-js';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function NotificacionRealtime() {
    const { auth } = usePage<{ auth: { user: { id: number; name: string; is_admin: boolean } } }>().props;

    useEffect(() => {
        if (!auth?.user?.is_admin) return;

        Pusher.logToConsole = true;

        const pusher = new Pusher('d1e9e4983a9ebf030f2b', {
            cluster: 'us2',
        });

        const channel = pusher.subscribe('admin.dashboard');
        channel.bind('input.changed', (data: any) => {
            const estado = data.value === 1 ? 'MALO' : data.value === 2 ? 'NO POSEE' : 'BUENO';

            toast.warning(`Cambio crítico registrado`, {
                description: (
                    <div className="flex flex-col gap-1 text-left">
                        <span className="text-sm font-semibold text-gray-700">
                            <strong>{data.userName}</strong> marcó el campo <strong>{data.field}</strong> como <strong>{estado}</strong>
                        </span>
                        <span className="text-xs text-gray-700">
                            Vehículo afectado: <strong>{data.placa}</strong>
                        </span>
                        {data.formType && (
                            <span className="text-xs text-gray-600">
                                Formulario: <strong>{data.formType}</strong>
                            </span>
                        )}
                        <span className="text-xs text-gray-500 italic">Este cambio fue registrado y notificado automáticamente.</span>
                    </div>
                ),
                duration: 15000,
            });
        });

        channel.bind('asignacion.usuario', (data: any) => {
            toast.info(`Reasignación de vehículo`, {
                description: (
                    <div className="flex flex-col gap-1 text-left">
                        <span className="text-sm font-semibold text-gray-700">
                            <strong>{data.adminName}</strong> asignó el vehículo <strong>{data.placa}</strong> a <strong>{data.nuevoUsuario}</strong>
                        </span>
                        <span className="text-xs text-gray-500 italic">Cambio registrado en tiempo real.</span>
                    </div>
                ),
                duration: 15000,
            });
        });

        channel.bind('chequeo.omitido', (data: any) => {
            toast.error(`Chequeo diario omitido`, {
                description: (
                    <div className="flex flex-col gap-1 text-left">
                        <span className="text-sm font-semibold text-red-700">
                            El vehículo <strong>{data.placa}</strong> no fue revisado el <strong>{data.fecha}</strong>
                        </span>
                        <span className="text-xs text-gray-700">
                            Responsable asignado: <strong>{data.usuario}</strong>
                        </span>
                        <span className="text-xs text-gray-500 italic">Este evento fue detectado automáticamente a las 9:00am.</span>
                    </div>
                ),
                duration: 15000,
            });
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [auth?.user?.is_admin]);

    return null;
}
