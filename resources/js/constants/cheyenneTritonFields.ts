import { Field } from '@/hooks/useFormLogic';

const commonFields: Field[] = [
    // MOTOR
    {
        id: 'motor_ct',
        label: 'Realizar Observacion de MotorSOTE?',
        type: 'text',
        required: true,
    },
    {
        id: 'motor_ct_archivo_1',
        label: 'Correas, alternador y compresor',
        type: 'file',
        required: true,
    },
    {
        id: 'motor_ct_archivo_2',
        label: 'Tapavalvuas',
        type: 'file',
        required: true,
    },
    {
        id: 'motor_ct_archivo_3',
        label: 'Carter',
        type: 'file',
        required: true,
    },
    // SISTEMA DE INYECCION
    {
        id: 'sistema_ct_inyeccion',
        label: 'Realizar Observacion del Sistema de Inyeccion?',
        type: 'text',
        required: true,
    },
    {
        id: 'sistema_ct_inyeccion_archivo_1',
        label: 'Cuerpo de Aceleracion y Cables de Bujia',
        type: 'file',
        required: false,
    },
    // SISTEMA DE ENFRIAMIENTO
    {
        id: 'sistema_ct_enfriamiento',
        label: 'Realizar Observacion del Sistema de Enfriamiento?',
        type: 'text',
        required: false,
    },
    {
        id: 'sistema_ct_enfriamiento_archivo_1',
        label: 'Radiador con Mangueras',
        type: 'file',
        required: false,
    },
    // SISTEMA DE CARGA
    {
        id: 'sistema_ct_carga',
        label: 'Realizar Observacion del Sistema de Carga?',
        type: 'text',
        required: false,
    },
    {
        id: 'sistema_ct_carga_archivo_1',
        label: 'Bateria y Bornes',
        type: 'file',
        required: false,
    },
    // SISTEMA DE ESCAPE
    {
        id: 'sistema_ct_escape',
        label: 'Realizar Observacion de Sistema de Escape?',
        type: 'text',
        required: false,
    },
    {
        id: 'sistema_ct_escape_archivo_1',
        label: 'Multiple de Escape',
        type: 'file',
        required: false,
    },
    {
        id: 'sistema_ct_escape_archivo_2',
        label: 'Tubo de Escape',
        type: 'file',
        required: false,
    },
    {
        id: 'sistema_ct_escape_archivo_3',
        label: 'Silenciador',
        type: 'file',
        required: false,
    },
    // TRANSMISION
    {
        id: 'transmision_ct',
        label: 'Realizar Observacion de la Transmision?',
        type: 'text',
        required: false,
    },
    {
        id: 'transmision_ct_archivo_1',
        label: 'Parte Inferior Caja',
        type: 'file',
        required: false,
    },
    // TREN DELANTERO IZQUIERDO
    {
        id: 'tren_ct_delantero_izq',
        label: 'Realizar Observacion del Tren Delantero Izquierdo?',
        type: 'text',
        required: false,
    },
    {
        id: 'tren_ct_delantero_izq_archivo_1',
        label: 'Terminal, Muñon, Bieleta, Tripode, Bujes',
        type: 'file',
        required: false,
    },
    {
        id: 'tren_ct_delantero_izq_archivo_2',
        label: 'Amortiguador y Espiral',
        type: 'file',
        required: false,
    },
    {
        id: 'tren_ct_delantero_izq_archivo_3',
        label: 'Brazo Axial, Coca, Triceta',
        type: 'file',
        required: false,
    },
    // TREN DELANTERO DERECHO
    {
        id: 'tren_ct_delantero_der',
        label: 'Realizar Observacion del Tren Delantero Derecho?',
        type: 'text',
        required: false,
    },
    {
        id: 'tren_ct_delantero_der_archivo_1',
        label: 'Terminal, Muñon, Bieleta, Tripode, Bujes',
        type: 'file',
        required: false,
    },
    {
        id: 'tren_ct_delantero_der_archivo_2',
        label: 'Amortiguador y Espiral',
        type: 'file',
        required: false,
    },
    {
        id: 'tren_ct_delantero_der_archivo_3',
        label: 'Brazo Axial, Coca, Triceta',
        type: 'file',
        required: false,
    },
    // TREN TRASERO IZQUIERDO
    {
        id: 'tren_ct_trasero_izq',
        label: 'Realizar Observacion del Tren Trasero Izquierdo?',
        type: 'text',
        required: false,
    },
    {
        id: 'tren_ct_trasero_izq_archivo_1',
        label: 'Amortiguador, Espiral',
        type: 'file',
        required: false,
    },
    {
        id: 'tren_ct_trasero_izq_archivo_2',
        label: 'Tunel, Gomas de Suspension',
        type: 'file',
        required: false,
    },
    // TREN TRASERO DERECHO
    {
        id: 'tren_ct_trasero_der',
        label: 'Realizar Observacion del Tren Trasero Derecho?',
        type: 'text',
        required: false,
    },
    {
        id: 'tren_ct_trasero_der_archivo_1',
        label: 'Amortiguador, Espiral',
        type: 'file',
        required: false,
    },
    {
        id: 'tren_ct_trasero_der_archivo_2',
        label: 'Tunel, Gomas de Suspension',
        type: 'file',
        required: false,
    },
    // LUCES
    {
        id: 'luces_ct',
        label: 'Realizar Observacion de las Luces?',
        type: 'text',
        required: false,
    },
    {
        id: 'luces_ct_archivo_1',
        label: 'Luces Frontales',
        type: 'file',
        required: false,
    },
    {
        id: 'luces_ct_archivo_2',
        label: 'Luces Traseras',
        type: 'file',
        required: false,
    },
    // CLUSTER
    {
        id: 'cluster_ct',
        label: 'Realizar Observacion del Cluster?',
        type: 'text',
        required: false,
    },
    {
        id: 'cluster_ct_archivo_1',
        label: 'Tablero',
        type: 'file',
        required: false,
    },
    // CARROCERIA
    {
        id: 'carroceria_ct',
        label: 'Realizar Observacion de la Carroceria?',
        type: 'text',
        required: false,
    },
    {
        id: 'carroceria_ct_archivo_1',
        label: 'Laterla Derecho',
        type: 'file',
        required: false,
    },
    {
        id: 'carroceria_ct_archivo_2',
        label: 'Lateral Izquierdo',
        type: 'file',
        required: false,
    },
    // CAUCHOS
    {
        id: 'cauchos_ct',
        label: 'Realizar Observacion de los Cauchos?',
        type: 'text',
        required: false,
    },
    {
        id: 'cauchos_ct_archivo_1',
        label: 'Caucho Delantero Derecho',
        type: 'file',
        required: false,
    },
    {
        id: 'cauchos_ct_archivo_2',
        label: 'Caucho Delantero Izquierdo',
        type: 'file',
        required: false,
    },
    {
        id: 'cauchos_ct_archivo_3',
        label: 'Caucho Trasero Derecho',
        type: 'file',
        required: false,
    },
    {
        id: 'cauchos_ct_archivo_4',
        label: 'Caucho Trasero Izquierdo',
        type: 'file',
        required: false,
    },
];

export const cheyenneTritonFields: Record<'CARRO', Field[]> = {
    CARRO: commonFields,
};
