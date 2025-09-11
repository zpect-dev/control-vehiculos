/* eslint-disable @typescript-eslint/no-explicit-any */
import Pusher from 'pusher-js';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function NotificacionRealtime() {
    useEffect(() => {
        Pusher.logToConsole = true;

        const pusher = new Pusher('d1e9e4983a9ebf030f2b', {
            cluster: 'us2',
            authEndpoint: '/broadcasting/auth',
            auth: {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            },
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
                duration: 7000,
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
                duration: 7000,
            });
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    return null;
}
