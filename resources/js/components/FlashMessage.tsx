import { FlashMessageProps } from '@/types';
import { useEffect, useState } from 'react';

export default function FlashMessage({ mensaje, isError, duracion = 4000 }: FlashMessageProps) {
    const [visible, setVisible] = useState(!!mensaje);

    useEffect(() => {
        if (mensaje) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), duracion);
            return () => clearTimeout(timer);
        }
    }, [mensaje, duracion]);

    if (!visible || !mensaje) return null;

    return (
        <div
            className={`rounded px-4 py-2 shadow-md transition-all duration-500 ease-in-out ${isError ? 'border border-red-300 bg-red-100 text-red-700' : 'border border-green-300 bg-green-100 text-green-700'}`}
        >
            {mensaje}
        </div>
    );
}
