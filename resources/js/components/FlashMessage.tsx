import { useEffect, useState } from 'react';

interface FlashMessageProps {
    mensaje?: string;
    duracion?: number;
}

export default function FlashMessage({ mensaje, duracion = 4000 }: FlashMessageProps) {
    const [visible, setVisible] = useState(!!mensaje);

    useEffect(() => {
        if (mensaje) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), duracion);
            return () => clearTimeout(timer);
        }
    }, [mensaje, duracion]);

    if (!visible || !mensaje) return null;

    return <div className="animate-fade-in mt-2 text-sm font-semibold text-green-600 transition-opacity duration-500 ease-in-out">{mensaje}</div>;
}
