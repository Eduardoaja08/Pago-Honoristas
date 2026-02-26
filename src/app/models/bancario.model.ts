import { Pago } from './profesor.model';

export interface LayoutBancario {
  id: number;
  nombre: string;
  banco: string;
  formato: 'txt' | 'csv' | 'xlsx';
  columnas: ColumnaLayout[];
  separador?: string;
  activo: boolean;
}

export interface ColumnaLayout {
  nombre: string;
  posicion: number;
  tipo: 'texto' | 'numero' | 'fecha';
  formato?: string;
  longitud?: number;
}

export interface Dispersión {
  id: number;
  pagos: Pago[];
  layoutBancarioId: number;
  fechaGeneracion: Date;
  archivo: string;
  estatus: 'pendiente_autorizar' | 'autorizado' | 'enviado' | 'aplicado';
  montoTotal: number;
  cantidadPagos: number;
  solicitadoPor: string;
  autorizadoPor?: string;
  fechaAutorizacion?: Date;
}

export interface ArchivoRetorno {
  id: number;
  archivo: File | string;
  fechaCarga: Date;
  procesado: boolean;
  resultados: ResultadoConciliacion;
}

export interface ResultadoConciliacion {
  pagosAplicados: PagoAplicado[];
  pagosRechazados: PagoRechazado[];
  pagosNoEncontrados: PagoNoEncontrado[];
}

export interface PagoAplicado {
  pagoId: number;
  folio: string;
  fechaAplicacion: Date;
}

export interface PagoRechazado {
  pagoId: number;
  folio: string;
  motivo: string;
  codigoError?: string;
}

export interface PagoNoEncontrado {
  folio: string;
  motivo: string;
}
