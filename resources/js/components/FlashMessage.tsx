import { useEffect, useState } from 'react';

interface FlashMessageProps {
    mensaje?: string | null;
    duracion?: number;
    isError?: boolean;
}

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
        <div className={`mt-2 text-lg font-semibold transition-opacity duration-500 ease-in-out ${isError ? 'text-red-600' : 'text-green-600'}`}>
            {mensaje}
        </div>
    );
}
