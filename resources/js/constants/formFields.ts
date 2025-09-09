// Campos para el formulario de Expediente
export const expedienteTecnicoFields = [
    { id: '1', label: 'Marca del Aceite', type: 'text', placeholder: 'Ej: Castrol' },
    { id: '2', label: 'Marca de Valvulina', type: 'text', placeholder: 'Ej: Mobil' },
    { id: '3', label: 'Marca del Refrigerante', type: 'text', placeholder: 'Ej: Motul' },
    { id: '4', label: 'Posee Computadora Bloqueada', type: 'text', placeholder: 'SI / NO' },
    { id: '5', label: 'Tipo de Frenos', type: 'text', placeholder: 'Ej: Disco, Tambor, ABS' },
    { id: '6', label: 'Tipo de Distribución de Motor', type: 'text', placeholder: 'Ej: Cadena, Correa, Engranajes' },
    { id: '7', label: 'Sistema de Enfriamiento', type: 'text', placeholder: 'Ej: Aire, Liquido' },
    { id: '8', label: 'Sistema de Inyección', type: 'text', placeholder: 'Ej: Gasolina, Eléctrico, Diésel' },
    { id: '9', label: 'Tipo de Cauchos', type: 'text', placeholder: 'Ej: Medida, Marca' },
    { id: '10', label: 'Kilometraje', type: 'text', placeholder: 'Ej: 14.500' },
];

// Campos para el formulario de Permisologia
export const permisologiaFields = [
    { id: 'titulo', label: 'Título del Vehículo', type: 'text' },
    { id: 'carnet', label: 'Carnet de Circulación', type: 'text' },
    { id: 'seguro', label: 'Seguro RCV', type: 'date' },
    { id: 'roct', label: 'Roct', type: 'date' },
    { id: 'permisoRotReg', label: 'Permiso de Rotulado Regional', type: 'date' },
    { id: 'permisoRotNac', label: 'Permiso de Rotulado Nacional', type: 'date' },
    { id: 'salvoconducto', label: 'Salvoconducto', type: 'date' },
    { id: 'permisoAliMed', label: 'Permiso de Alimentos y Medicamentos', type: 'date' },
    { id: 'trimestres', label: 'Trimestres', type: 'date' },
];

// Campos para el formulario de Accesorios
export const accesoriosFields = [
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
export const piezasRevisadasFields = [
    {
        id: 'aire',
        label: 'Aire Acondicionado',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'cauchoDelDer',
        label: 'Caucho Delantero Der.',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'cauchoDelIzq',
        label: 'Caucho Delantero Izq.',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'cauchoTraDer',
        label: 'Caucho Tracero Der.',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'cauchoTraIzq',
        label: 'Caucho Tracero Izq.',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'cepillosPara',
        label: 'Cepillos Limpia Parabrisas',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'cerraduras',
        label: 'Cerraduras de Puertas',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'cinturones',
        label: 'Cinturones de Segurida',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'espejo',
        label: 'Espejo Interior de Cabina',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'espejoRetDer',
        label: 'Espejo Retovisor Der.',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'espejoRetIzq',
        label: 'Espejo Retovisor Izq.',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'bateria',
        label: 'Estado de la Bateria',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'bornes',
        label: 'Estado de los Bornes de Bateria',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'carroceria',
        label: 'Estado de la Carroceria',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'parachoques',
        label: 'Estado del Parachoques',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'pintura',
        label: 'Estado de la Pintura',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'guardapolvos',
        label: 'Estado del Guardapolvos',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'fluidos',
        label: 'Estados de los Recipientes de Fluidos',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'enfriamiento',
        label: 'Estado del Sistema de Enfriamiento',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'gomas',
        label: 'Gomas de las Puertas y Ventanas',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'lucesCrucesDel',
        label: 'Luces de los Cruces Delanteros',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'lucesCrucesTra',
        label: 'Luces de los Cruces Traceros',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'lucesFrenos',
        label: 'Luces de los Frenos',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'lucesNeblina',
        label: 'Luces de Neblina',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'lucesRetro',
        label: 'Luces de los Retroceso',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'lucesDelAltas',
        label: 'Luces Delanteras Altas',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'lucesDelBajas',
        label: 'Luces Delanteras Bajas',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'lucesIntermitentes',
        label: 'Luces Intermitentes Delanteras',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'lucesIntermitentesTra',
        label: 'Luces Intermitentes Traceras',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'lucesInternas',
        label: 'Luces Internas',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'lucesTestigo',
        label: 'Luces Testigo',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'manijasPuertas',
        label: 'Manijas de las Puertas',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'manijasVentanas',
        label: 'Manijas de las Ventanas',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'vidriosLatDel',
        label: 'Vidrios Laterales Delanteros',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'vidriosLatTra',
        label: 'Vidrios Laterales Traceros',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'vidrioParabrisas',
        label: 'Vidrio Parabrisas',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'pito',
        label: 'Pito',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'esparragos',
        label: 'Revisión de Esparragos',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'tablero',
        label: 'Tablero',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'tapetes',
        label: 'Tapetes',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
    {
        id: 'tapiceria',
        label: 'Tapicería',
        type: 'select',
        options: [
            { value: 'bueno', label: 'Bueno' },
            { value: 'malo', label: 'Malo' },
            { value: 'no-posee', label: 'No posee' },
        ],
    },
];
