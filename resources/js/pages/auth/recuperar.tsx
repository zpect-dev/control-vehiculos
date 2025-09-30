import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status }: LoginProps) {
    return (
        <AuthLayout title="Recupera tu contraseña" description="Ingresa tus datos para recuperar contraseña">
            <Head title="Recuperar" />

            <Form {...NewPasswordController.actualizar.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-semibold text-gray-700 dark:text-gray-300">
                                    Cedula de Identidad
                                </Label>
                                <Input
                                    id="email"
                                    type="text"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="12345678"
                                    className="rounded-lg border border-gray-300 px-4 py-2 transition-all focus:border-[#49af4e] focus:ring-2 focus:ring-[#49af4e]"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="font-semibold text-gray-700 dark:text-gray-300">
                                        Contraseña
                                    </Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Contraseña"
                                    className="rounded-lg border border-gray-300 px-4 py-2 transition-all focus:border-[#49af4e] focus:ring-2 focus:ring-[#49af4e]"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full rounded-lg bg-[#49af4e] py-3 font-semibold text-white shadow-md transition-colors hover:bg-[#3d9641]"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Recuperar
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            {status && <div className="mb-4 text-center text-sm font-medium text-[#49af4e]">{status}</div>}
        </AuthLayout>
    );
}
