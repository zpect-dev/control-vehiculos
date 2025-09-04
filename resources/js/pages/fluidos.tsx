import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Fluidos() {
    return (
        <AppLayout>
            <Head title="Fluidos" />
            <div className='p-4 bg-accent'>
                <div className="">Registro de Fluidoss</div>
            </div>
        </AppLayout>
    );
}
