import NotificacionCard from '@/components/NotificacionCard';
import type { PropsGrupoNoti } from '@/types';
import clsx from 'clsx';

export default function GrupoNotificaciones({ tipo, notificaciones, modo, onMarcarLeida }: PropsGrupoNoti) {
    return (
        <div className="mb-10">
            <h2
                className={clsx('mb-4 text-lg font-bold tracking-wide uppercase', 'text-gray-700 dark:text-gray-200', {
                    'text-orange-600': tipo === 'chequeoOmitido',
                    'text-red-600': tipo === 'nivelFluido',
                    'text-yellow-600': tipo === 'revisionSemanal' || tipo === 'permiso',
                    'text-blue-600': tipo === 'cambioInput' || tipo === 'estado_item',
                    'text-[#49af4e]': tipo === 'reasignacion',
                    'text-purple-600': tipo === 'observacion',
                    'text-pink-600': tipo === 'documentoUsuario',
                    'text-teal-700': tipo === 'auditoria',
                })}
            >
                {tipo}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {notificaciones.map((noti) => (
                    <div key={noti.id} className="transition-transform duration-300 hover:scale-[1.02]">
                        <NotificacionCard notificacion={noti} modo={modo} onMarcarLeida={() => onMarcarLeida(noti)} />
                    </div>
                ))}
            </div>
        </div>
    );
}
