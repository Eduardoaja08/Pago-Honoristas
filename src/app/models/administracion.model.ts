export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
  activo: boolean;
  fechaCreacion: Date;
  ultimoAcceso?: Date;
}

export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: Permiso[];
}

export interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  recurso: string;
  accion: string;
  condiciones?: CondicionPermiso[];
}

export interface CondicionPermiso {
  campo: string;
  operador: 'mayor_que' | 'menor_que' | 'igual' | 'diferente';
  valor: any;
}

export interface Catalogo {
  id: string;
  nombre: string;
  descripcion: string;
  items: CatalogoItem[];
}

export interface CatalogoItem {
  id: number;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  metadata?: Record<string, any>;
}

export interface ReglaNegocio {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: 'calculo' | 'validacion';
  formula: string;
  fechaInicio: Date;
  fechaFin?: Date;
  prioridad: number;
  activa: boolean;
}

export interface Integracion {
  id: string;
  nombre: string;
  tipo: 'banner' | 'pac' | 'banco' | 'otro';
  activa: boolean;
  configuracion: ConfiguracionIntegracion;
}

export interface ConfiguracionIntegracion {
  url?: string;
  usuario?: string;
  contraseña?: string;
  token?: string;
  frecuenciaSincronizacion?: string;
  layout?: any;
}

export interface Periodo {
  id: number;
  nombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  activo: boolean;
}
