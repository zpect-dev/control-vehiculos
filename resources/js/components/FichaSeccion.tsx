import FormCard from '@/components/FormCard';
import { Field } from '@/hooks/useFormLogic';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { PanelTopOpen } from 'lucide-react';

interface FichaSeccionProps {
    title: string;
    fields: Field[];
    formType: 'expediente' | 'permisologia' | 'accesorios' | 'piezas' | 'revisionFluidos';
    expediente: Record<string, string | boolean | File | null>;
    onSubmit: (data: Record<string, string | boolean | File | null>) => void;
}

export default function FichaSeccion({ title, fields, formType, expediente, onSubmit }: FichaSeccionProps) {
    return (
        <Disclosure as="div" className="mx-auto w-full max-w-5xl rounded-xl border bg-gray-100 shadow-lg dark:bg-gray-800">
            {({ open }) => (
                <>
                    <DisclosureButton className="flex w-full items-center justify-between px-6 py-4 text-left text-xl font-bold text-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-[#49af4e] focus-visible:ring-offset-2 dark:text-white">
                        <span>{title}</span>
                        <PanelTopOpen className={`h-5 w-5 transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} />
                    </DisclosureButton>
                    <DisclosurePanel className="px-6 pt-2 pb-6">
                        <FormCard fields={fields} formType={formType} expediente={expediente || {}} onSubmit={onSubmit} />
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
}
