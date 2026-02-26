import { Profesor, Pago, CFDI } from './profesor.model';

export interface ValidacionFiscal {
  profesorId: number;
  profesor: Profesor;
  valido: boolean;
  problemas: ProblemaFiscal[];
}

export interface ProblemaFiscal {
  tipo: 'falta_rfc' | 'regimen_invalido' | 'documentos_vencidos' | 'datos_incompletos';
  descripcion: string;
  severidad: 'error' | 'advertencia';
}

export interface Contrato {
  id: number;
  pagoId: number;
  pago: Pago;
  version: string;
  fechaGeneracion: Date;
  pdf: string;
  estatus: 'pendiente_generar' | 'generado' | 'enviado_firma' | 'firmado' | 'cancelado';
  fechaFirma?: Date;
  urlFirma?: string;
}

export interface EmisionCFDI {
  pagos: Pago[];
  fechaProcesamiento: Date;
  resultado: 'exitoso' | 'parcial' | 'fallido';
  cfdiesGenerados: CFDI[];
  errores: ErrorTimbrado[];
}

export interface ErrorTimbrado {
  pagoId: number;
  motivo: string;
  codigoError?: string;
}

export interface RecepcionCFDI {
  pagoId: number;
  xml: File | string;
  validado: boolean;
  cfdiRecibido?: CFDI;
  errores?: string[];
}
