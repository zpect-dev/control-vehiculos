import { SurtidoField } from '@/types';

// Campos para Surtidos
export const fields: SurtidoField[] = [
    {
        id: 'kilometraje',
        label: 'Kilometraje actual',
        type: 'number',
        placeholder: 'Ej: 12500',
        required: true,
    },
    {
        id: 'litros',
        label: 'Litros surtidos',
        type: 'number',
        placeholder: 'Ej: 20',
        required: true,
    },
    {
        id: 'observacion',
        label: 'Observación',
        type: 'textarea',
        placeholder: 'Observaciones adicionales...',
        required: false,
    },
];
