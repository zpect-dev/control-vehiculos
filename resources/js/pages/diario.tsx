import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Diario() {
    return (
        <AppLayout>
            <Head title="Diario" />
            <div className='p-4 bg-accent'>
                <div className="">Registro Diario</div>
            </div>
        </AppLayout>
    );
}
