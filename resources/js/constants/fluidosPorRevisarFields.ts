import { Field } from "@/types";

// Campos para Fluidos para Revisar y revisionFluidos
export const fluidosPorRevisarFields: Record<'CARRO' | 'MOTO', Field[]> = {
    CARRO: [
        {
            id: 'aceite',
            label: 'Aceite de Motor',
            type: 'select',
            options: [
                { value: '0', label: 'Full' },
                { value: '1', label: 'Normal' },
                { value: '2', label: 'Bajo' },
            ],
            required: false,
        },
        {
            id: 'refrigerante',
            label: 'Refrigerante o Agua',
            type: 'select',
            options: [
                { value: '0', label: 'Full' },
                { value: '1', label: 'Normal' },
                { value: '2', label: 'Bajo' },
            ],
            required: false,
        },
        {
            id: 'direccion',
            label: 'Líquido de Dirección',
            type: 'select',
            options: [
                { value: '0', label: 'Full' },
                { value: '1', label: 'Normal' },
                { value: '2', label: 'Bajo' },
            ],
            required: false,
        },
        {
            id: 'frenos',
            label: 'Liga de Frenos',
            type: 'select',
            options: [
                { value: '0', label: 'Full' },
                { value: '1', label: 'Normal' },
                { value: '2', label: 'Bajo' },
            ],
            required: false,
        },
    ],
    MOTO: [
        {
            id: 'cauchos',
            label: 'Vida de los Cauchos',
            type: 'select',
            options: [
                { value: '0', label: 'Nuevos' },
                { value: '1', label: 'Media Vida' },
                { value: '2', label: 'Lisos' },
            ],
            required: false,
        },
        {
            id: 'relacion',
            label: 'Vida de la Relación',
            type: 'select',
            options: [
                { value: '0', label: 'Nueva' },
                { value: '1', label: 'Media Vida' },
                { value: '2', label: 'Mala' },
            ],
            required: false,
        },
    ],
};
