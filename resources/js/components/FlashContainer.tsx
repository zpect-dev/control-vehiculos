import FlashMessage from '@/components/FlashMessage';
import { FlashPropsCont } from '@/types';
import { usePage } from '@inertiajs/react';

export default function FlashContainer() {
    const { flash } = usePage().props as FlashPropsCont;

    const mensajes = [
        { tipo: 'success', contenido: flash?.success, isError: false },
        { tipo: 'error', contenido: flash?.error, isError: true },
    ];

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {mensajes.map(({ contenido, isError }, index) =>
                typeof contenido === 'string' && contenido.trim() !== '' ? <FlashMessage key={index} mensaje={contenido} isError={isError} /> : null,
            )}
        </div>
    );
}
