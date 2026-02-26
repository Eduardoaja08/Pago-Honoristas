import { Injectable, signal } from '@angular/core';
import { VersionInsumo, Sincronizacion, ConflictoAsignacion, ValidacionAsignacion } from '../models';
import { Asignacion } from '../models';

function asignacionesDummy(): Asignacion[] {
  return [
    { id: 1, crn: '12345', materia: 'Cálculo I', profesorId: 1, alumnos: 32, programa: 'Ingeniería Civil', centroCostos: 'Div. Ingeniería', periodo: '2024-1', estatus: 'asignado' },
    { id: 2, crn: '12346', materia: 'Álgebra Lineal', profesorId: 1, alumnos: 28, programa: 'Ingeniería en Sistemas', centroCostos: 'Div. Ingeniería', periodo: '2024-1', estatus: 'asignado' },
    { id: 3, crn: '12347', materia: 'Física General', profesorId: 2, alumnos: 45, programa: 'Ingeniería Mecánica', centroCostos: 'Div. Ingeniería', periodo: '2024-1', estatus: 'validado' },
    { id: 4, crn: '12348', materia: 'Química Orgánica', profesorId: 999, alumnos: 30, programa: 'Medicina', centroCostos: 'Div. Salud', periodo: '2024-1', estatus: 'asignado' },
    { id: 5, crn: '12345', materia: 'Cálculo I (dup)', profesorId: 2, alumnos: 25, programa: 'Ingeniería', centroCostos: 'Div. Ingeniería', periodo: '2024-1', estatus: 'asignado' }
  ];
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {
  private versionesInsumo = signal<VersionInsumo[]>([]);
  private sincronizaciones = signal<Sincronizacion[]>([]);
  private asignacionesActuales = signal<Asignacion[]>([]);

  constructor() {
    this.asignacionesActuales.set(asignacionesDummy());
  }

  getAsignacionesActuales(): Asignacion[] {
    return this.asignacionesActuales();
  }

  setAsignacionesActuales(asignaciones: Asignacion[]): void {
    this.asignacionesActuales.set(asignaciones);
  }

  actualizarAsignacion(id: number, cambios: Partial<Asignacion>): void {
    this.asignacionesActuales.update(list =>
      list.map(a => (a.id === id ? { ...a, ...cambios } : a))
    );
  }

  sincronizarConBanner(): Promise<Sincronizacion> {
    return new Promise((resolve) => {
      // Simular proceso de sincronización
      setTimeout(() => {
        const sincronizacion: Sincronizacion = {
          id: Date.now(),
          fecha: new Date(),
          usuario: 'Usuario Actual',
          tipo: 'automatica',
          resultado: 'exitoso',
          totalRegistros: 150,
          registrosProcesados: 150,
          log: ['Iniciando sincronización...', 'Conectando con Banner...', 'Procesando asignaciones...', 'Sincronización completada']
        };
        
        this.sincronizaciones.update(list => [sincronizacion, ...list]);
        this.asignacionesActuales.set(asignacionesDummy());
        resolve(sincronizacion);
      }, 2000);
    });
  }

  cargarArchivoManual(archivo: File): Promise<Sincronizacion> {
    return new Promise((resolve, reject) => {
      // Validar formato del archivo
      const extension = archivo.name.split('.').pop()?.toLowerCase();
      if (!['xlsx', 'xls', 'csv'].includes(extension || '')) {
        reject(new Error('Formato de archivo no válido. Use Excel o CSV.'));
        return;
      }

      // Simular procesamiento
      setTimeout(() => {
        const sincronizacion: Sincronizacion = {
          id: Date.now(),
          fecha: new Date(),
          usuario: 'Usuario Actual',
          tipo: 'manual',
          resultado: 'exitoso',
          totalRegistros: 100,
          registrosProcesados: 95,
          errores: ['Línea 5: RFC inválido', 'Línea 12: CRN duplicado'],
          log: [`Procesando archivo: ${archivo.name}`, 'Validando estructura...', 'Importando registros...', 'Proceso completado']
        };
        
        this.sincronizaciones.update(list => [sincronizacion, ...list]);
        this.asignacionesActuales.set(asignacionesDummy());
        resolve(sincronizacion);
      }, 1500);
    });
  }

  obtenerSincronizaciones(): Sincronizacion[] {
    return this.sincronizaciones();
  }

  /** IDs de profesores considerados dados de alta (en producción vendría de ProfesoresService) */
  private readonly idsProfesoresValidos = new Set<number>([1, 2]);

  detectarConflictos(asignaciones: Asignacion[]): ConflictoAsignacion[] {
    const conflictos: ConflictoAsignacion[] = [];
    const crnsVistos = new Set<string>();

    asignaciones.forEach(asignacion => {
      // Verificar CRN duplicado
      if (crnsVistos.has(asignacion.crn)) {
        conflictos.push({
          tipo: 'crn_duplicado',
          asignacion,
          mensaje: `CRN ${asignacion.crn} está duplicado`,
          severidad: 'error'
        });
      } else {
        crnsVistos.add(asignacion.crn);
      }

      // Verificar profesor no existe
      if (!this.idsProfesoresValidos.has(asignacion.profesorId)) {
        conflictos.push({
          tipo: 'profesor_no_existe',
          asignacion,
          mensaje: `Profesor con ID ${asignacion.profesorId} no está dado de alta`,
          severidad: 'error'
        });
      }

      // Verificar datos incompletos
      if (!asignacion.materia || !asignacion.programa) {
        conflictos.push({
          tipo: 'datos_incompletos',
          asignacion,
          mensaje: 'Faltan datos requeridos en la asignación',
          severidad: 'advertencia'
        });
      }
    });

    return conflictos;
  }

  ejecutarValidaciones(asignaciones: Asignacion[]): ValidacionAsignacion[] {
    return asignaciones.map(asignacion => {
      const advertencias: string[] = [];
      const errores: string[] = [];

      if (!asignacion.profesorId) {
        errores.push('Profesor no asignado');
      }

      if (!asignacion.materia) {
        errores.push('Materia no especificada');
      }

      if (asignacion.alumnos < 1) {
        advertencias.push('Número de alumnos muy bajo');
      }

      return {
        asignacion,
        valida: errores.length === 0,
        advertencias,
        errores
      };
    });
  }

  generarInsumoBase(
    asignaciones: Asignacion[],
    nombre: string,
    comentario: string
  ): VersionInsumo {
    const validaciones = this.ejecutarValidaciones(asignaciones);
    const registrosValidos = validaciones.filter(v => v.valida).length;
    const registrosConAdvertencias = validaciones.filter(v => v.advertencias.length > 0).length;
    const registrosConErrores = validaciones.filter(v => !v.valida).length;

    const version: VersionInsumo = {
      id: Date.now(),
      nombre,
      comentario,
      fechaCreacion: new Date(),
      usuario: 'Usuario Actual',
      estatus: 'validado',
      asignaciones,
      totalRegistros: asignaciones.length,
      registrosValidos,
      registrosConAdvertencias,
      registrosConErrores
    };

    this.versionesInsumo.update(list => [version, ...list]);
    return version;
  }

  obtenerVersionesInsumo(): VersionInsumo[] {
    return this.versionesInsumo();
  }

  obtenerVersionPorId(id: number): VersionInsumo | undefined {
    return this.versionesInsumo().find(v => v.id === id);
  }

  compararVersiones(version1Id: number, version2Id: number): {
    diferencias: any[];
    resumen: { agregados: number; eliminados: number; modificados: number };
  } {
    const v1 = this.obtenerVersionPorId(version1Id);
    const v2 = this.obtenerVersionPorId(version2Id);

    if (!v1 || !v2) {
      return { diferencias: [], resumen: { agregados: 0, eliminados: 0, modificados: 0 } };
    }

    // Lógica de comparación simplificada
    const diferencias: any[] = [];
    const crnsV1 = new Set(v1.asignaciones.map(a => a.crn));
    const crnsV2 = new Set(v2.asignaciones.map(a => a.crn));

    const agregados = v2.asignaciones.filter(a => !crnsV1.has(a.crn));
    const eliminados = v1.asignaciones.filter(a => !crnsV2.has(a.crn));

    agregados.forEach(a => diferencias.push({ tipo: 'agregado', asignacion: a }));
    eliminados.forEach(a => diferencias.push({ tipo: 'eliminado', asignacion: a }));

    return {
      diferencias,
      resumen: {
        agregados: agregados.length,
        eliminados: eliminados.length,
        modificados: 0
      }
    };
  }
}
