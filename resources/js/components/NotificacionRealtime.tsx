/* eslint-disable @typescript-eslint/no-explicit-any */
import { router, usePage } from '@inertiajs/react';
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

        // Notificacion sobre el cambio del input de MALO y NO POSEE

        channel.bind('input.changed', (data: any) => {
            const estado = data.value === 1 ? 'MALO' : data.value === 2 ? 'NO POSEE' : 'BUENO';

            toast.warning(`Cambio crítico registrado`, {
                description: (
                    <div className="flex cursor-pointer flex-col gap-1 text-left" onClick={() => router.visit(`/fichaTecnica/${data.placa}`)}>
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

        // Notificacion sobre la REASIGNACION DE VEHICULO A UN USUARIO

        channel.bind('asignacion.usuario', (data: any) => {
            toast.info(`Reasignación de vehículo`, {
                description: (
                    <div className="flex cursor-pointer flex-col gap-1 text-left" onClick={() => router.visit(`/fichaTecnica/${data.placa}`)}>
                        <span className="text-sm font-semibold text-gray-700">
                            <strong>{data.adminName}</strong> asignó el vehículo <strong>{data.placa}</strong> a <strong>{data.nuevoUsuario}</strong>
                        </span>
                        <span className="text-xs text-gray-500 italic">Cambio registrado en tiempo real.</span>
                    </div>
                ),
                duration: 15000,
            });
        });

        // Notificacion sobre el CHEQUEO DIARIO DESPUES DE LAS 9AM

        channel.bind('chequeo.omitido', (data: any) => {
            toast.error(`Chequeo diario omitido`, {
                description: (
                    <div
                        className="flex cursor-pointer flex-col gap-1 text-left"
                        onClick={() => router.visit(`/fichaTecnica/${data.placa}/revisionFluidos`)}
                    >
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

        // Notificacion sobre el NIVEL DE FLUIDO BAJO

        channel.bind('nivel.bajo', (data: any) => {
            toast.error(`Nivel de fluido crítico`, {
                description: (
                    <div
                        className="flex cursor-pointer flex-col gap-1 text-left"
                        onClick={() => router.visit(`/fichaTecnica/${data.placa}/revisionFluidos`)}
                    >
                        <span className="text-sm font-semibold text-red-700">
                            <strong>{data.usuario}</strong> marcó el campo <strong>{data.campo}</strong> como <strong>{data.nivel}</strong>
                        </span>
                        <span className="text-xs text-gray-700">
                            Vehículo afectado: <strong>{data.placa}</strong>
                        </span>
                        <span className="text-xs text-gray-600">
                            Formulario: <strong>{data.formulario}</strong>
                        </span>
                        <span className="text-xs text-gray-500 italic">Este evento fue registrado y notificado automáticamente.</span>
                    </div>
                ),
                duration: 15000,
            });
        });

        // Notificacion sobre los PERMISOS QUE ESTEN A 15 DIAS DE VENCERCE

        channel.bind('permiso.por.vencer', (data: any) => {
            toast.warning(`Permiso por vencer`, {
                description: (
                    <div className="flex cursor-pointer flex-col gap-1 text-left" onClick={() => router.visit(`/fichaTecnica/${data.placa}`)}>
                        <span className="text-sm font-semibold text-yellow-700">
                            El permiso <strong>{data.permiso}</strong> del vehículo <strong>{data.placa}</strong> vence el{' '}
                            <strong>{data.fechaVencimiento}</strong>
                        </span>
                        <span className="text-xs text-gray-700">
                            Registrado por: <strong>{data.usuario}</strong>
                        </span>
                        <span className="text-xs text-gray-500 italic">Haz clic para ver la ficha técnica.</span>
                    </div>
                ),
                duration: 15000,
            });
        });

        // Notificacion para VIDEO SEMANAL NO SUBIDO ANTES DE LAS 10 AM LOS SABADOS
        channel.bind('video.semanal.omitido', (data: any) => {
            toast.error(`Video semanal no subido`, {
                description: (
                    <div
                        className="flex cursor-pointer flex-col gap-1 text-left"
                        onClick={() => router.visit(`/fichaTecnica/${data.placa}/revisionSemanal`)}
                    >
                        <span className="text-sm font-semibold text-red-700">
                            El vehículo <strong>{data.placa}</strong> no tiene video para <strong>{data.semana}</strong>
                        </span>
                        <span className="text-xs text-gray-700">
                            Responsable: <strong>{data.usuario}</strong>
                        </span>
                        <span className="text-xs text-gray-500 italic">Haz clic para revisar el módulo de videos.</span>
                    </div>
                ),
                duration: 15000,
            });
        });

        // Notificación sobre nueva observación agregada
        channel.bind('observacion.agregada', (data: any) => {
            toast.info(`Nueva observación registrada`, {
                description: (
                    <div className="flex cursor-pointer flex-col gap-1 text-left" onClick={() => router.visit(`/fichaTecnica/${data.placa}/observaciones`)}>
                        <span className="text-sm font-semibold text-purple-700">
                            <strong>{data.userName}</strong> agregó una observación al vehículo <strong>{data.placa}</strong>
                        </span>
                        <span className="text-xs text-gray-700">
                            Estado: <strong>{data.estado}</strong>
                        </span>
                        <span className="text-xs text-gray-600">
                            Contenido: <em>{data.contenido}</em>
                        </span>
                        <span className="text-xs text-gray-500 italic">Haz clic para ver el historial de observaciones.</span>
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
