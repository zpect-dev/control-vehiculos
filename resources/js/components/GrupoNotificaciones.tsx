import NotificacionCard from '@/components/NotificacionCard';
import type { Notificacion } from '@/types';
import clsx from 'clsx';

type Props = {
    tipo: string;
    notificaciones: Notificacion[];
    modo: 'admin' | 'user';
    onMarcarLeida: (id: number) => void;
};

export default function GrupoNotificaciones({ tipo, notificaciones, modo, onMarcarLeida }: Props) {
    return (
        <div className="mb-10">
            <h2
                className={clsx('mb-4 text-lg font-bold tracking-wide uppercase', 'text-gray-700 dark:text-gray-200', {
                    'text-orange-600': tipo === 'chequeoOmitido',
                    'text-red-600': tipo === 'nivelFluido',
                    'text-yellow-600': tipo === 'revisionSemanal' || tipo === 'permiso',
                    'text-blue-600': tipo === 'cambioInput' || tipo === 'estado_item',
                    'text-green-600': tipo === 'reasignacion',
                })}
            >
                {tipo}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {notificaciones.map((noti) => (
                    <div key={noti.id} className="transition-transform duration-300 hover:scale-[1.02]">
                        <NotificacionCard notificacion={noti} modo={modo} onMarcarLeida={() => onMarcarLeida(noti.id)} />
                    </div>
                ))}
            </div>
        </div>
    );
}
