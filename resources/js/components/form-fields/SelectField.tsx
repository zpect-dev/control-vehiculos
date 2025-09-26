import { SelectFieldProps } from '@/types';

export function SelectField({ id, label, value, options = [], onChange }: SelectFieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {label}
            </label>
            <p className="text-sm font-semibold text-gray-100 dark:text-gray-800">{label}</p>
            <select
                id={id}
                value={typeof value === 'string' || typeof value === 'number' ? value : value === null ? '' : undefined}
                onChange={(e) => onChange(id, e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition focus:border-[#49af4e] focus:ring-2 focus:ring-[#49af4e] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
                <option value="">Seleccionar estado</option>
                {options.length ? (
                    options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))
                ) : (
                    <option disabled>No hay opciones disponibles</option>
                )}
            </select>
        </div>
    );
}
