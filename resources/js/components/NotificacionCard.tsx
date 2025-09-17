import clsx from 'clsx';
import { AlertTriangle, Bell, CalendarClock, ClipboardPenLine, Droplets, UserCheck } from 'lucide-react';

type Notificacion = {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: string;
    leida: boolean;
    created_at: string;
    vehiculo_id?: number;
};

type Props = {
    notificacion: Notificacion;
    modo: 'admin' | 'user';
    onMarcarLeida?: (noti: Notificacion) => void;
};

export default function NotificacionCard({ notificacion, onMarcarLeida }: Props) {
    const { titulo, descripcion, tipo, leida, created_at } = notificacion;

    const icono = (() => {
        switch (tipo) {
            case 'chequeoOmitido':
                return <AlertTriangle className="h-5 w-5 text-orange-600" />;
            case 'nivelFluido':
                return <Droplets className="h-5 w-5 text-red-600" />;
            case 'revisionSemanal':
                return <Bell className="h-5 w-5 text-yellow-600" />;
            case 'permiso':
                return <CalendarClock className="h-5 w-5 text-yellow-700" />;
            case 'cambioInput':
            case 'estado_item':
                return <ClipboardPenLine className="h-5 w-5 text-blue-600" />;
            case 'reasignacion':
                return <UserCheck className="h-5 w-5 text-green-600" />;
            default:
                return <AlertTriangle className="h-5 w-5 text-gray-400" />;
        }
    })();

    const handleClick = () => {
        onMarcarLeida?.(notificacion);
        console.log(notificacion)
    };

    return (
        <div
            onClick={handleClick}
            className={clsx(
                'cursor-pointer rounded-md border-l-4 p-4 shadow-sm transition hover:shadow-md',
                {
                    'border-orange-600 bg-orange-50 dark:bg-orange-900': tipo === 'chequeoOmitido' && !leida,
                    'border-red-600 bg-red-50 dark:bg-red-900': tipo === 'nivelFluido' && !leida,
                    'border-yellow-600 bg-yellow-50 dark:bg-yellow-900': (tipo === 'revisionSemanal' || tipo === 'permiso') && !leida,
                    'border-indigo-600 bg-indigo-50 dark:bg-indigo-900': (tipo === 'cambioInput' || tipo === 'estado_item') && !leida,
                    'border-green-400 bg-green-50 dark:bg-green-800': tipo === 'reasignacion' && !leida,
                },
                leida && 'border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800',
                !leida && 'hover:scale-[1.02] active:scale-[0.98]',
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icono}
                    <h2 className={clsx('text-sm font-semibold', leida ? 'text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white')}>
                        {titulo}
                    </h2>
                </div>
                <span
                    className={clsx('rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase', {
                        'bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200': tipo === 'chequeo' && !leida,
                        'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200': tipo === 'fluido' && !leida,
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200':
                            (tipo === 'revisionSemanal' || tipo === 'permiso') && !leida,
                        'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200': (tipo === 'cambioInput' || tipo === 'estado_item') && !leida,
                        'bg-green-200 text-green-700 dark:bg-green-700 dark:text-green-300': tipo === 'reasignacion' && !leida,
                        'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400': leida,
                    })}
                >
                    {tipo}
                </span>
            </div>
            <p className={clsx('mt-2 text-xs', leida ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300')}>{descripcion}</p>
            <div className={clsx('mt-2 text-right text-[11px]', leida ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400')}>
                {new Date(created_at).toLocaleString('es-VE', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </div>
        </div>
    );
}
