import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gray-100 p-6 md:p-10 dark:bg-gray-900">
            <div className="w-full max-w-sm rounded-xl border bg-background p-6 shadow-lg md:p-10 dark:bg-gray-800">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <a className="flex flex-col items-center gap-2 font-medium">
                            <span className="text-3xl font-semibold text-gray-900 dark:text-white">Control de Vehículos</span>
                            <span className="sr-only">Control de Vehículos</span>
                        </a>

                        <div className="text-center">
                            <h1 className="text-xl font-medium text-gray-900 dark:text-white">{title}</h1>
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
