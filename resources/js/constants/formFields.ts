import { Field } from '@/hooks/useFormLogic';

// Campos para el formulario de Expediente
export const expedienteTecnicoFields: Field[] = [
    { id: '1', label: 'Marca del Aceite', type: 'text', placeholder: 'Ej: Castrol' },
    { id: '2', label: 'Marca de Valvulina', type: 'text', placeholder: 'Ej: Mobil' },
    { id: '3', label: 'Marca del Refrigerante', type: 'text', placeholder: 'Ej: Motul' },
    { id: '4', label: 'Posee Computadora Bloqueada', type: 'text', placeholder: 'SI / NO' },
    { id: '5', label: 'Tipo de Frenos', type: 'text', placeholder: 'Ej: Disco, Tambor, ABS' },
    { id: '6', label: 'Tipo de Distribución de Motor', type: 'text', placeholder: 'Ej: Cadena, Correa, Engranajes' },
    { id: '7', label: 'Sistema de Enfriamiento', type: 'text', placeholder: 'Ej: Aire, Liquido' },
    { id: '8', label: 'Sistema de Inyección', type: 'text', placeholder: 'Ej: Gasolina, Eléctrico, Diésel' },
    { id: '9', label: 'Tipo de Cauchos', type: 'text', placeholder: 'Ej: Medida, Marca' },
];

// Campos para el formulario de Permisologia
export const permisologiaFields: Field[] = [
    { id: 'titulo', label: 'Título del Vehículo', type: 'text' },
    { id: 'carnet', label: 'Carnet de Circulación', type: 'text' },
    { id: 'seguro', label: 'Seguro RCV', type: 'date' },
    { id: 'roct', label: 'Roct', type: 'date' },
    { id: 'permisoRotReg', label: 'Permiso de Rotulado Regional', type: 'date' },
    { id: 'permisoRotNac', label: 'Permiso de Rotulado Nacional', type: 'date' },
    { id: 'salvoconducto', label: 'Salvoconducto', type: 'date' },
    { id: 'permisoAliMed', label: 'Permiso de Alimentos y Medicamentos', type: 'date' },
];

// Campos para el formulario de Accesorios
export const accesoriosFields: Field[] = [
    {
        id: '1',
        label: 'Caja de Herramienta',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '2',
        label: 'Conos de seguridad',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '3',
        label: 'Cuña',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '4',
        label: 'Extintor',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '5',
        label: 'Gato',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '6',
        label: 'Llave de cruz',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '7',
        label: 'Linterna',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '8',
        label: 'Repuesto',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
];

// Campos para el formulario de Piezas Revisadas
export const piezasRevisadasFields: Field[] = [
    {
        id: '1',
        label: 'Aire Acondicionado',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '2',
        label: 'Caucho Delantero Der.',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '3',
        label: 'Caucho Delantero Izq.',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '4',
        label: 'Caucho Tracero Der.',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '5',
        label: 'Caucho Tracero Izq.',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '6',
        label: 'Cepillos Limpia Parabrisas',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '7',
        label: 'Cerraduras de Puertas',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '8',
        label: 'Cinturones de Segurida',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '9',
        label: 'Espejo Interior de Cabina',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '10',
        label: 'Espejo Retovisor Der.',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '11',
        label: 'Espejo Retovisor Izq.',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '12',
        label: 'Estado de la Bateria',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '13',
        label: 'Estado de los Bornes de Bateria',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '14',
        label: 'Estado de la Carroceria',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '15',
        label: 'Estado del Parachoques',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '16',
        label: 'Estado de la Pintura',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '17',
        label: 'Estado del Guardapolvos',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '18',
        label: 'Estados de los Recipientes de Fluidos',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '19',
        label: 'Estado del Sistema de Enfriamiento',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '20',
        label: 'Gomas de las Puertas y Ventanas',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '21',
        label: 'Luces de los Cruces Delanteros',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '22',
        label: 'Luces de los Cruces Traceros',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '23',
        label: 'Luces de los Frenos',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '24',
        label: 'Luces de Neblina',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '25',
        label: 'Luces de los Retroceso',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '26',
        label: 'Luces Delanteras Altas',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '27',
        label: 'Luces Delanteras Bajas',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '28',
        label: 'Luces Intermitentes Delanteras',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '29',
        label: 'Luces Intermitentes Traceras',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '30',
        label: 'Luces Internas',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '31',
        label: 'Luces Testigo',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '32',
        label: 'Manijas de las Puertas',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '33',
        label: 'Manijas de las Ventanas',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '34',
        label: 'Vidrios Laterales Delanteros',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '35',
        label: 'Vidrios Laterales Traceros',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '36',
        label: 'Vidrio Parabrisas',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '37',
        label: 'Pito',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '38',
        label: 'Revisión de Esparragos',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '39',
        label: 'Tablero',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '40',
        label: 'Tapetes',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
    {
        id: '41',
        label: 'Tapicería',
        type: 'select',
        options: [
            { value: '0', label: 'Bueno' },
            { value: '1', label: 'Malo' },
            { value: '2', label: 'No posee' },
        ],
    },
];

// Campos para Fluidos para Revisar y revisionFluidos
export const fluidosPorRevisarFields: Field[] = [
    {
        id: 'aceite',
        label: 'Aceite de Motor',
        type: 'select',
        options: [
            { value: '', label: 'Selecciona nivel' },
            { value: '1', label: 'Normal' },
            { value: '0', label: 'Bajo' },
        ],
    },
    {
        id: 'caja',
        label: 'Aceite de Caja',
        type: 'select',
        options: [
            { value: '', label: 'Selecciona nivel' },
            { value: '1', label: 'Normal' },
            { value: '0', label: 'Bajo' },
        ],
    },
    {
        id: 'refrigerante',
        label: 'Refrigerante o Agua',
        type: 'select',
        options: [
            { value: '', label: 'Selecciona nivel' },
            { value: '1', label: 'Normal' },
            { value: '0', label: 'Bajo' },
        ],
    },
    {
        id: 'direccion',
        label: 'Líquido de Dirección',
        type: 'select',
        options: [
            { value: '', label: 'Selecciona nivel' },
            { value: '1', label: 'Normal' },
            { value: '0', label: 'Bajo' },
        ],
    },
    {
        id: 'frenos',
        label: 'Liga de Frenos',
        type: 'select',
        options: [
            { value: '', label: 'Selecciona nivel' },
            { value: '1', label: 'Normal' },
            { value: '0', label: 'Bajo' },
        ],
    },
];

// Campos para Asignacion de Vehiculo
export const getAsignacionFields = (users: { id: string | number; name: string }[]): Field[] => [
    {
        id: 'user_id',
        label: 'Usuario a asignar',
        type: 'select',
        options: users.map((u) => ({ label: u.name, value: String(u.id) })),
    },
    {
        id: 'kilometraje',
        label: 'Kilometraje actual',
        type: 'text',
        placeholder: 'Ej. 123456',
    },
    {
        id: 'foto_kilometraje',
        label: 'Foto del Kilometraje',
        type: 'file',
    },
];
