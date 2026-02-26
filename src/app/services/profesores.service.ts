import { Injectable, signal } from '@angular/core';
import {
  Profesor,
  Documento,
  DatosFiscales,
  DatosBancarios,
  Asignacion,
  Pago,
  DesglosePago,
  AuditoriaItem
} from '../models';

function dummyDocumentos(profesorId: number): Documento[] {
  const base = new Date();
  return [
    {
      id: 1,
      tipo: 'identificacion',
      nombre: 'INE - Frente y reverso.pdf',
      url: '/docs/ine.pdf',
      fechaSubida: new Date(base.getTime() - 180 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(base.getFullYear() + 2, base.getMonth(), base.getDate()),
      vigente: true
    },
    {
      id: 2,
      tipo: 'constanciaFiscal',
      nombre: 'Opinión de cumplimiento SAT.pdf',
      url: '/docs/constancia.pdf',
      fechaSubida: new Date(base.getTime() - 90 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(base.getFullYear() + 1, 5, 30),
      vigente: true
    },
    {
      id: 3,
      tipo: 'comprobanteDomicilio',
      nombre: 'Recibo CFE.pdf',
      url: '/docs/cfe.pdf',
      fechaSubida: new Date(base.getTime() - 60 * 24 * 60 * 60 * 1000),
      vigente: true
    }
  ];
}

function dummyAsignaciones(profesorId: number): Asignacion[] {
  return [
    {
      id: 1,
      crn: '12345',
      materia: 'Cálculo I',
      profesorId,
      alumnos: 32,
      programa: 'Ingeniería Civil',
      centroCostos: 'División Ingeniería',
      periodo: '2024-1',
      estatus: 'pagado'
    },
    {
      id: 2,
      crn: '12346',
      materia: 'Álgebra Lineal',
      profesorId,
      alumnos: 28,
      programa: 'Ingeniería en Sistemas',
      centroCostos: 'División Ingeniería',
      periodo: '2024-1',
      estatus: 'validado'
    }
  ];
}

function dummyPagos(profesorId: number): Pago[] {
  const desglose: DesglosePago = {
    tarifaBase: 18500,
    incentivos: 1200,
    deducciones: 0,
    montoNeto: 19700
  };
  return [
    {
      id: 1,
      folio: 'PAG-2024-001234',
      profesorId,
      asignaciones: [],
      montoTotal: 19700,
      formaPago: 'Transferencia',
      estatus: 'pagado',
      desglose,
      fechaCalculo: new Date('2024-11-15'),
      fechaPago: new Date('2024-11-22')
    },
    {
      id: 2,
      folio: 'PAG-2024-001235',
      profesorId,
      asignaciones: [],
      montoTotal: 18200,
      formaPago: 'Transferencia',
      estatus: 'en_fiscal',
      desglose: { ...desglose, montoNeto: 18200 }
    }
  ];
}

function dummyAuditoria(entidadId: number): AuditoriaItem[] {
  const base = new Date();
  return [
    {
      id: 1,
      usuario: 'admin@anahuac.mx',
      fecha: new Date(base.getTime() - 2 * 24 * 60 * 60 * 1000),
      accion: 'Actualización de datos',
      campo: 'correo',
      valorAnterior: 'juan.perez@antiguo.com',
      valorNuevo: 'juan.perez@example.com',
      entidad: 'Profesor',
      entidadId
    },
    {
      id: 2,
      usuario: 'tesoreria@anahuac.mx',
      fecha: new Date(base.getTime() - 5 * 24 * 60 * 60 * 1000),
      accion: 'Validación CLABE',
      campo: 'datosBancarios.validado',
      valorAnterior: 'false',
      valorNuevo: 'true',
      entidad: 'Profesor',
      entidadId
    },
    {
      id: 3,
      usuario: 'rrhh@anahuac.mx',
      fecha: new Date(base.getTime() - 30 * 24 * 60 * 60 * 1000),
      accion: 'Alta de profesor',
      entidad: 'Profesor',
      entidadId
    }
  ];
}

@Injectable({
  providedIn: 'root'
})
export class ProfesoresService {
  private profesores = signal<Profesor[]>([]);

  constructor() {
    const id = 1;
    this.profesores.set([
      {
        id,
        nombreCompleto: 'Dr. Juan Pérez García',
        rfc: 'PEGJ800101ABC',
        curp: 'PEGJ800101HDFRZN01',
        correo: 'juan.perez@example.com',
        telefono: '5551234567',
        direccion: 'Calle Principal 123, Col. Centro, CDMX',
        estatus: 'activo',
        areaAcademica: 'Ingeniería',
        datosFiscales: {
          regimenFiscal: '612 - Personas Físicas con Actividades Empresariales',
          rfc: 'PEGJ800101ABC',
          validadoPorTesoreria: true,
          fechaValidacion: new Date('2024-10-01')
        },
        datosBancarios: {
          clabe: '012180001234567890',
          banco: 'BBVA',
          cuentaConfirmacion: '****7890',
          validado: true,
          historico: [
            {
              clabe: '012180001234567890',
              banco: 'BBVA',
              fechaInicio: new Date('2023-01-15'),
              activa: true
            }
          ]
        },
        documentos: dummyDocumentos(id),
        asignaciones: dummyAsignaciones(id),
        pagos: dummyPagos(id),
        auditoria: dummyAuditoria(id)
      }
    ]);
  }

  obtenerProfesores(filtros?: {
    nombre?: string;
    rfc?: string;
    estatus?: string;
    areaAcademica?: string;
  }) {
    let resultado = this.profesores();
    
    if (filtros?.nombre) {
      resultado = resultado.filter(p => 
        p.nombreCompleto.toLowerCase().includes(filtros.nombre!.toLowerCase())
      );
    }
    
    if (filtros?.rfc) {
      resultado = resultado.filter(p => p.rfc.includes(filtros.rfc!));
    }
    
    if (filtros?.estatus) {
      resultado = resultado.filter(p => p.estatus === filtros.estatus);
    }
    
    if (filtros?.areaAcademica) {
      resultado = resultado.filter(p => p.areaAcademica === filtros.areaAcademica);
    }
    
    return resultado;
  }

  obtenerProfesorPorId(id: number): Profesor | undefined {
    return this.profesores().find(p => p.id === id);
  }

  /** Devuelve el profesor con datos dummy en secciones vacías para la vista de detalle */
  obtenerProfesorParaDetalle(id: number): Profesor | undefined {
    const p = this.obtenerProfesorPorId(id);
    if (!p) return undefined;
    return {
      ...p,
      datosFiscales: p.datosFiscales ?? {
        regimenFiscal: '612 - Personas Físicas con Actividades Empresariales',
        rfc: p.rfc,
        validadoPorTesoreria: false,
        fechaValidacion: undefined
      },
      datosBancarios: p.datosBancarios ?? {
        clabe: '012180001234567890',
        banco: 'BBVA',
        cuentaConfirmacion: '****7890',
        validado: false
      },
      documentos: p.documentos?.length ? p.documentos : dummyDocumentos(id),
      asignaciones: p.asignaciones?.length ? p.asignaciones : dummyAsignaciones(id),
      pagos: p.pagos?.length ? p.pagos : dummyPagos(id),
      auditoria: p.auditoria?.length ? p.auditoria : dummyAuditoria(id)
    };
  }

  crearProfesor(profesor: Partial<Profesor>): Profesor {
    const nuevoProfesor: Profesor = {
      id: Date.now(),
      nombreCompleto: profesor.nombreCompleto || '',
      rfc: profesor.rfc || '',
      curp: profesor.curp || '',
      correo: profesor.correo || '',
      telefono: profesor.telefono || '',
      direccion: profesor.direccion || '',
      estatus: profesor.estatus || 'pendiente',
      ...profesor
    };
    
    this.profesores.update(list => [...list, nuevoProfesor]);
    return nuevoProfesor;
  }

  actualizarProfesor(id: number, cambios: Partial<Profesor>): Profesor | null {
    const profesor = this.obtenerProfesorPorId(id);
    if (!profesor) return null;
    
    const profesorActualizado = { ...profesor, ...cambios };
    this.profesores.update(list => 
      list.map(p => p.id === id ? profesorActualizado : p)
    );
    
    return profesorActualizado;
  }

  subirDocumento(profesorId: number, documento: Documento): void {
    const profesor = this.obtenerProfesorPorId(profesorId);
    if (!profesor) return;
    
    if (!profesor.documentos) {
      profesor.documentos = [];
    }
    
    profesor.documentos.push(documento);
    this.actualizarProfesor(profesorId, { documentos: profesor.documentos });
  }

  validarCLABE(clabe: string): boolean {
    // Algoritmo de validación de CLABE (18 dígitos)
    if (clabe.length !== 18) return false;
    if (!/^\d+$/.test(clabe)) return false;
    
    // Validación de dígito verificador
    const pesos = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
    let suma = 0;
    
    for (let i = 0; i < 17; i++) {
      suma += parseInt(clabe[i]) * pesos[i];
    }
    
    const digitoVerificador = (10 - (suma % 10)) % 10;
    return digitoVerificador === parseInt(clabe[17]);
  }

  actualizarDatosFiscales(profesorId: number, datosFiscales: DatosFiscales): void {
    this.actualizarProfesor(profesorId, { datosFiscales });
  }

  actualizarDatosBancarios(profesorId: number, datosBancarios: DatosBancarios): void {
    this.actualizarProfesor(profesorId, { datosBancarios });
  }

  exportarAExcel(): void {
    // Implementar exportación a Excel
    console.log('Exportando profesores a Excel...');
  }
}
