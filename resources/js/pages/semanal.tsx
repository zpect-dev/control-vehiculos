import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Semanal() {
    return (
        <AppLayout>
            <Head title="Semanal" />
            <div className="bg-accent p-4">
                <div className="">Registro Semanal</div>
            </div>
        </AppLayout>
    );
}
