export function formatFecha(fecha?: string, formato: 'corto' | 'largo' = 'corto'): string {
    if (!fecha) return 'Fecha inválida';

    const date = new Date(fecha);
    if (isNaN(date.getTime())) return 'Fecha inválida';

    return formato === 'corto'
        ? date.toLocaleDateString('es-VE')
        : date.toLocaleDateString('es-VE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          });
}
