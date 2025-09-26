export function formatCantidad(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString('es-VE', {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 0,
    });
}

export function formatPrecio(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `$${num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}
