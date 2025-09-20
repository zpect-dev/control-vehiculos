/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field } from '@/hooks/useFormLogic';
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
    tipo: 'CARRO' | 'MOTO';
    modelo: string;
    usuario?: UsuarioAsignado | null;
    observaciones_no_resueltas?: number;
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

export interface UserInterface {
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
    data: any;
    id: number;
    titulo: string;
    descripcion: string;
    tipo: string;
    leida: boolean;
    created_at: string;
    vehiculo_id?: number;
    usuario_id?: number;
}

interface RevisionSemanalData {
    video: string;
}

interface RevisionSemanalProps {
    vehiculo: Vehiculo;
    revisionSemanal?: RevisionSemanalData | null;
    inicio: string;
    final: string;
}

type VehiculoProps = {
    placa: string;
    modelo: string;
};

type UserProps = {
    id: number;
    name: string;
};

type AsignacionProps = {
    id: number;
    vehiculo: VehiculoProps;
    user: UserProps;
    admin: UserProps;
    kilometraje: number;
    foto_kilometraje?: string;
    fecha_asignacion?: string;
};

type PageProps = {
    vehiculo: VehiculoProps;
    historial: AsignacionProps[];
};

type VehiculoProps = {
    id: number;
    placa: string;
    modelo: string;
};

type UserProps = {
    id: number;
    name: string;
    role?: string;
};

type ObservacionProps = {
    id: number;
    observacion: string;
    resuelto: boolean;
    fecha_creacion: string;
    fecha_resolucion?: string;
    tipo?: string;
    user: UserProps;
    admin?: UserProps;
};

type PagePropsObs = {
    vehiculo: VehiculoProps;
    observaciones: ObservacionProps[];
    flash: { success?: string };
    isAdmin: boolean;
};

interface RevisionFluidosProps {
    vehiculoId: number | string;
    vehiculo: any;
}

interface RevisionFluido {
    id: number;
    tipo: string;
    nivel_fluido: string | number;
    imagen: string | null;
    revisado: boolean;
    fecha_creacion: string;
}

type FlashProps = {
    success?: string;
    [key: string]: any;
};

interface FlashPropsCont {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface Notificacion {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: string;
    leida: boolean;
    created_at: string;
    vehiculo_id?: number;
}

interface Usuario {
    name: string;
}

interface Vehiculo {
    placa: string;
    modelo: string;
    usuario?: Usuario;
    imagen_url?: string;
}

type UserProps = {
    id: number;
    name: string;
};

type ObservacionProps = {
    id: number;
    observacion: string;
    resuelto: boolean;
    fecha_creacion: string;
    fecha_resolucion?: string;
    tipo?: string;
    user: UserProps;
    admin?: UserProps;
};

type Props = {
    observacion: ObservacionProps;
    isAdmin?: boolean;
    onResolver?: (id: number) => void;
};

type Notificacion = {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: string;
    leida: boolean;
    created_at: string;
    vehiculo_id?: number;
};

type PropsNoti = {
    notificacion: Notificacion;
    modo: 'admin' | 'user';
    onMarcarLeida?: (noti: Notificacion) => void;
};

type PropsGrupoNoti = {
    tipo: string;
    notificaciones: Notificacion[];
    modo: 'admin' | 'user';
    onMarcarLeida: (noti: Notificacion) => void;
};

interface FichaSeccionFluidosProps {
    title: string;
    fields: Field[];
    expediente: Record<string | number, string | boolean | File | null>;
    onSubmit: (formData: Record<string, string | boolean | File | null>) => void;
}

interface FormCardProps {
    title?: string;
    fields: Field[];
    buttonText?: string;
    formType?: 'expediente' | 'permisologia' | 'accesorios' | 'piezas' | 'revisionFluidos' | 'asignacion';
    onSubmit?: (formData: Record<string, string | boolean | File | null>) => void;
    expediente?: Record<string | number, string | boolean | File | null>;
}

interface FlashMessageProps {
    mensaje?: string | null;
    duracion?: number;
    isError?: boolean;
}

interface FichaSeccionFluidosProps {
    title: string;
    fields: Field[];
    expediente: Record<string, string | boolean | File | null>;
    onSubmit: (formData: Record<string, string | boolean | File | null>) => void;
}

interface FichaSeccionProps {
    title: string;
    fields: Field[];
    options?: string[];
    formType: 'expediente' | 'permisologia' | 'accesorios' | 'piezas' | 'revisionFluidos';
    expediente: Record<string, string | boolean | File | null>;
    onSubmit: (data: Record<string, string | boolean | File | null>) => void;
}

interface AsignacionUserProps {
    vehiculo: Vehiculo;
    users: UsuarioAsignado[];
    isAdmin: boolean;
    onSuccess?: (user: UsuarioAsignado) => void;
}

interface ModalAsignacionUserProps {
    isOpen: boolean;
    onClose: () => void;
    vehiculo: Vehiculo;
    users: User[];
    isAdmin: boolean;
    onSuccess?: (user: UsuarioAsignado) => void;
}

export interface UsuarioBasico {
  id: number;
  name: string;
  email: string;
  zona?: string;
  foto_cedula?: string;
  vencimiento_cedula?: string;
  foto_licencia?: string;
  vencimiento_licencia?: string;
  foto_certificado_medico?: string;
  vencimiento_certificado_medico?: string;
  foto_seguro_civil?: string;
  vencimiento_seguro_civil?: string;
  foto_carnet_circulacion?: string;
  vencimiento_carnet_circulacion?: string;
  foto_solvencia?: string;
  vencimiento_solvencia?: string;
}


export interface RevisionSemanalData {
    id: number;
    vehiculo_id: string;
    user_id: number;
    video_inicial: string;
    kilometraje_inicial: number;
    video_final?: string;
    kilometraje_final?: number;
    created_at: string;
    updated_at: string;
}

export interface VehiculoData {
    placa: string;
    modelo: string;
    usuario?: { name: string } | null;
}


export interface RevisionSemanalProps {
    vehiculo: VehiculoData;
    revisionSemanal?: RevisionSemanalData | null;
    inicio: string;
    final: string;
}
