import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    cedula: string;
}

export default function ResetPassword({ token, cedula }: ResetPasswordProps) {
    return (
        <AuthLayout title="Reset password" description="Please enter your new password below">
            <Head title="Reset password" />

            <Form
                {...NewPasswordController.store.form()}
                transform={(data) => ({ ...data, token, cedula })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="cedula">cedula</Label>
                            <Input
                                id="cedula"
                                type="cedula"
                                name="cedula"
                                autoComplete="cedula"
                                value={cedula}
                                className="mt-1 block w-full"
                                readOnly
                            />
                            <InputError message={errors.cedula} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                autoFocus
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <Button type="submit" className="mt-4 w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Reset password
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
