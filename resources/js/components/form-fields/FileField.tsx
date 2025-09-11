import { useEffect, useState } from 'react';

interface FileFieldProps {
    id: string;
    label: string;
    value?: File | string | null;
    onChange: (id: string, file: File | null) => void;
}

export function FileField({ id, label, value, onChange }: FileFieldProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (value instanceof File) {
            const url = URL.createObjectURL(value);
            setPreviewUrl(url);
        } else if (typeof value === 'string' && value.startsWith('/storage')) {
            setPreviewUrl(value);
        } else {
            setPreviewUrl(null);
        }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange(id, file);

        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm font-semibold text-muted-foreground">
                {label}
            </label>
            <input
                type="file"
                id={id}
                accept="image/*"
                onChange={handleFileChange}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {previewUrl && <img src={previewUrl} alt="Vista previa" className="mt-2 h-32 w-auto rounded-md border object-contain shadow" />}
        </div>
    );
}
