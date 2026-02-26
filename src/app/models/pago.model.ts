import { Pago, DesglosePago } from './profesor.model';

export interface ProcesoCalculo {
  id: number;
  versionInsumoId: number;
  fechaInicio: Date;
  fechaFin?: Date;
  estatus: 'en_proceso' | 'completado' | 'fallido';
  progreso: number;
  totalPagos: number;
  montoTotal: number;
  profesoresImpactados: number;
  log: string[];
}

export interface FiltroPago {
  profesorId?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
  centroCostos?: string;
  estatus?: Pago['estatus'];
  montoMinimo?: number;
  montoMaximo?: number;
}

export interface FormatoPagoAgrupado {
  centroCostos: string;
  pagos: Pago[];
  total: number;
  cantidadPagos: number;
}

export interface PagoExtraordinario extends Pago {
  justificacion: string;
  autorizadoPor?: string;
  fechaAutorizacion?: Date;
}
