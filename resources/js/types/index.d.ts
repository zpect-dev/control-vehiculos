/* eslint-disable @typescript-eslint/no-explicit-any */
import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface Vehiculo {
    placa: string;
    modelo: string;
    usuario?: UsuarioAsignado | null;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: any;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    is_admin?: boolean;
}

export type UsuarioAsignado = {
    id: string | number;
    name: string;
};

export interface Notificacion {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: string;
    leida: boolean;
    created_at: string;
    vehiculo_id?: number;
}
