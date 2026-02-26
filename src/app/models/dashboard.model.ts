export interface KPI {
  titulo: string;
  valor: string | number;
  cambio?: string;
  tendencia?: 'ascendente' | 'descendente' | 'neutro';
  icono?: string;
}

export interface GraficaAvance {
  etapa: string;
  cantidad: number;
  porcentaje: number;
  color: string;
}

export interface TareaPendiente {
  id: number;
  titulo: string;
  descripcion: string;
  modulo: string;
  prioridad: 'alta' | 'media' | 'baja';
  fechaLimite?: Date;
  asignadoA: string;
}

export interface IncidenciaCritica {
  id: number;
  tipo: 'cfdi_rechazado' | 'pago_rebotado' | 'validacion_fiscal' | 'otro';
  titulo: string;
  descripcion: string;
  severidad: 'critica' | 'alta' | 'media';
  fecha: Date;
  resuelta: boolean;
}
