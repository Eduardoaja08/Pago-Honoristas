export interface Profesor {
  id: number;
  nombreCompleto: string;
  rfc: string;
  curp: string;
  correo: string;
  telefono: string;
  direccion: string;
  estatus: 'activo' | 'pendiente' | 'inactivo';
  areaAcademica?: string;
  datosFiscales?: DatosFiscales;
  datosBancarios?: DatosBancarios;
  documentos?: Documento[];
  asignaciones?: Asignacion[];
  pagos?: Pago[];
  auditoria?: AuditoriaItem[];
}

export interface DatosFiscales {
  regimenFiscal: string;
  rfc: string;
  validadoPorTesoreria: boolean;
  fechaValidacion?: Date;
}

export interface DatosBancarios {
  clabe: string;
  banco: string;
  cuentaConfirmacion: string;
  validado: boolean;
  historico?: CuentaBancaria[];
}

export interface CuentaBancaria {
  clabe: string;
  banco: string;
  fechaInicio: Date;
  fechaFin?: Date;
  activa: boolean;
}

export interface Documento {
  id: number;
  tipo: 'identificacion' | 'constanciaFiscal' | 'comprobanteDomicilio' | 'otro';
  nombre: string;
  url: string;
  fechaSubida: Date;
  fechaVencimiento?: Date;
  vigente: boolean;
}

export interface Asignacion {
  id: number;
  crn: string;
  materia: string;
  profesorId: number;
  alumnos: number;
  programa: string;
  centroCostos: string;
  periodo: string;
  estatus: 'asignado' | 'validado' | 'calculado' | 'pagado';
}

export interface Pago {
  id: number;
  folio: string;
  profesorId: number;
  asignaciones: Asignacion[];
  montoTotal: number;
  formaPago: string;
  estatus: 'calculado' | 'pendiente_revision' | 'observado' | 'validado' | 'en_fiscal' | 'pagado' | 'rechazado';
  desglose?: DesglosePago;
  fechaCalculo?: Date;
  fechaPago?: Date;
  cfdi?: CFDI;
}

export interface DesglosePago {
  tarifaBase: number;
  incentivos: number;
  deducciones: number;
  montoNeto: number;
}

export interface CFDI {
  id: number;
  uuid: string;
  folio: string;
  fechaTimbrado: Date;
  xml: string;
  pdf: string;
  estatus: 'por_timbrar' | 'timbrado' | 'cancelado';
  motivoCancelacion?: string;
}

export interface AuditoriaItem {
  id: number;
  usuario: string;
  fecha: Date;
  accion: string;
  campo?: string;
  valorAnterior?: string;
  valorNuevo?: string;
  entidad: string;
  entidadId: number;
}
