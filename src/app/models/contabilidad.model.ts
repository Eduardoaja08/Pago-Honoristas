import { Pago } from './profesor.model';

export interface Reporte {
  id: string;
  nombre: string;
  tipo: 'pago_profesor' | 'pago_centro_costos' | 'incidencias' | 'impuestos' | 'profesores_sin_datos';
  parametros: ParametrosReporte;
  fechaGeneracion?: Date;
  datos: any;
}

export interface ParametrosReporte {
  periodo?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  profesorId?: number;
  centroCostos?: string;
  formato: 'pdf' | 'excel' | 'csv';
}

export interface PolizaContable {
  id: number;
  periodo: string;
  fechaGeneracion: Date;
  tipo: 'egresos' | 'ingresos' | 'diario';
  partidas: PartidaContable[];
  cuadre: CuadreContable;
  formatoExportacion: 'sap' | 'contpaq' | 'excel';
}

export interface PartidaContable {
  cuenta: string;
  concepto: string;
  debe: number;
  haber: number;
  referencia: string;
}

export interface CuadreContable {
  totalDebe: number;
  totalHaber: number;
  diferencia: number;
  cuadra: boolean;
}

export interface LogAuditoria {
  id: number;
  usuario: string;
  fecha: Date;
  tipoAccion: string;
  entidad: string;
  entidadId: number;
  detalles: string;
  ip?: string;
  navegador?: string;
}

export interface FiltroAuditoria {
  usuario?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  tipoAccion?: string;
  entidad?: string;
  entidadId?: number;
}
