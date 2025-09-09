interface TextFieldProps {
    id: string;
    label: string;
    value: string;
    placeholder?: string;
    type?: string;
    onChange: (id: string, value: string) => void;
}

export function TextField({ id, label, value, placeholder, type = 'text', onChange }: TextFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {label}
            </label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(id, e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-[#49af4e] focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
        </div>
    );
}
