import { Asignacion } from './profesor.model';

export interface VersionInsumo {
  id: number;
  nombre: string;
  comentario: string;
  fechaCreacion: Date;
  usuario: string;
  estatus: 'borrador' | 'validado' | 'calculado';
  asignaciones: Asignacion[];
  totalRegistros: number;
  registrosValidos: number;
  registrosConAdvertencias: number;
  registrosConErrores: number;
}

export interface Sincronizacion {
  id: number;
  fecha: Date;
  usuario: string;
  tipo: 'automatica' | 'manual';
  resultado: 'exitoso' | 'con_errores' | 'fallido';
  totalRegistros: number;
  registrosProcesados: number;
  errores?: string[];
  log?: string[];
}

export interface ConflictoAsignacion {
  tipo: 'profesor_no_existe' | 'crn_duplicado' | 'materia_sin_profesor' | 'datos_incompletos';
  asignacion: Asignacion;
  mensaje: string;
  severidad: 'error' | 'advertencia';
}

export interface ValidacionAsignacion {
  asignacion: Asignacion;
  valida: boolean;
  advertencias: string[];
  errores: string[];
}
