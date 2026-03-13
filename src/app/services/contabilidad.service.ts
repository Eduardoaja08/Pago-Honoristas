import { Injectable, signal } from '@angular/core';
import { Reporte, ParametrosReporte, PolizaContable, LogAuditoria, FiltroAuditoria } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ContabilidadService {
  private reportes = signal<Reporte[]>([]);
  private polizas = signal<PolizaContable[]>([]);
  private logsAuditoria = signal<LogAuditoria[]>([]);

  constructor() {
    this.sembrarDatosDummy();
  }

  private sembrarDatosDummy(): void {
    // Sembrar Reportes Históricos
    this.reportes.set([
      {
        id: 'RPT-1001',
        nombre: 'Retenciones ISR - Octubre 2024',
        tipo: 'impuestos',
        parametros: { formato: 'pdf' },
        fechaGeneracion: new Date('2024-10-31T23:59:00'),
        datos: {}
      },
      {
        id: 'RPT-1002',
        nombre: 'Nómina Honorarios - Septiembre 2024',
        tipo: 'pago_profesor',
        parametros: { formato: 'excel' },
        fechaGeneracion: new Date('2024-09-28T14:20:00'),
        datos: {}
      }
    ]);

    // Sembrar Pólizas
    this.polizas.set([
      {
        id: 9901,
        periodo: '2024-09',
        fechaGeneracion: new Date('2024-09-30'),
        tipo: 'egresos',
        partidas: [
          { cuenta: '401.01', concepto: 'Honorarios Licenciatura', debe: 0, haber: 1850000, referencia: 'CC-GEN' },
          { cuenta: '102.01', concepto: 'Bancos Nacionales', debe: 1850000, haber: 0, referencia: 'CC-GEN' }
        ],
        cuadre: { totalDebe: 1850000, totalHaber: 1850000, diferencia: 0, cuadra: true },
        formatoExportacion: 'sap'
      },
      {
        id: 9902,
        periodo: '2024-10',
        fechaGeneracion: new Date('2024-10-30'),
        tipo: 'egresos',
        partidas: [
          { cuenta: '401.02', concepto: 'Honorarios Posgrado', debe: 0, haber: 650000, referencia: 'CC-POS' },
          { cuenta: '102.01', concepto: 'Bancos Nacionales', debe: 650000, haber: 0, referencia: 'CC-POS' }
        ],
        cuadre: { totalDebe: 650000, totalHaber: 650000, diferencia: 0, cuadra: true },
        formatoExportacion: 'excel'
      }
    ]);

    // Sembrar Logs de Auditoría
    this.logsAuditoria.set([
      { id: 1, usuario: 'system.bot', fecha: new Date('2024-11-20T08:00:00'), tipoAccion: 'SYNC', entidad: 'BANNER', entidadId: 0, detalles: 'Sincronización de 1,200 asignaciones académicas completada.' },
      { id: 2, usuario: 'lupita.finanzas', fecha: new Date('2024-11-20T10:15:00'), tipoAccion: 'PAGOS', entidad: 'PAGO', entidadId: 442, detalles: 'Pago de $12,500 autorizado para Dr. García.' },
      { id: 3, usuario: 'admin.contable', fecha: new Date('2024-11-21T09:30:00'), tipoAccion: 'POLIZA', entidad: 'CIERRE', entidadId: 202410, detalles: 'Exportación de póliza de octubre a formato SAP.' },
      { id: 4, usuario: 'juan.fiscal', fecha: new Date('2024-11-22T13:00:00'), tipoAccion: 'CFDI', entidad: 'PAGO', entidadId: 501, detalles: 'Cancelación de CFDI por error en RFC del receptor.' }
    ]);
  }

  generarReporte(tipo: Reporte['tipo'], parametros: ParametrosReporte): Promise<Reporte> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reporte: Reporte = {
          id: `RPT-${Date.now()}`,
          nombre: this.obtenerNombreReporte(tipo),
          tipo,
          parametros,
          fechaGeneracion: new Date(),
          datos: this.generarDatosReporte(tipo)
        };

        this.reportes.update(list => [reporte, ...list]);
        resolve(reporte);
      }, 1500);
    });
  }

  private obtenerNombreReporte(tipo: Reporte['tipo']): string {
    const nombres: Record<Reporte['tipo'], string> = {
      'pago_profesor': 'Reporte de Pago por Profesor',
      'pago_centro_costos': 'Reporte de Pago por Centro de Costos',
      'incidencias': 'Reporte de Incidencias',
      'impuestos': 'Reporte de Impuestos',
      'profesores_sin_datos': 'Reporte de Profesores sin Datos Fiscales'
    };
    return nombres[tipo];
  }

  private generarDatosReporte(tipo: Reporte['tipo']): any {
    // Datos simulados según el tipo de reporte
    switch (tipo) {
      case 'pago_profesor':
        return [
          { profesor: 'Dr. Juan Pérez', monto: 50000, periodo: '2024-1' },
          { profesor: 'Dra. María López', monto: 45000, periodo: '2024-1' }
        ];
      case 'pago_centro_costos':
        return [
          { centroCostos: 'Ingeniería', total: 500000, cantidad: 10 },
          { centroCostos: 'Medicina', total: 750000, cantidad: 15 }
        ];
      case 'incidencias':
        return [
          { tipo: 'CFDI rechazado', cantidad: 5 },
          { tipo: 'Pago rebotado', cantidad: 2 }
        ];
      default:
        return [];
    }
  }

  exportarReporte(reporteId: string, formato: 'pdf' | 'excel' | 'csv'): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const url = `/reportes/${reporteId}.${formato === 'excel' ? 'xlsx' : formato}`;
        resolve(url);
      }, 1000);
    });
  }

  generarPolizaEgresos(periodo: string): Promise<PolizaContable> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const partidas = [
          { cuenta: '401.01', concepto: 'Honorarios docentes', debe: 0, haber: 2500000, referencia: 'PAG-001' },
          { cuenta: '102.01', concepto: 'Banco', debe: 2500000, haber: 0, referencia: 'PAG-001' }
        ];

        const totalDebe = partidas.reduce((sum, p) => sum + p.debe, 0);
        const totalHaber = partidas.reduce((sum, p) => sum + p.haber, 0);

        const poliza: PolizaContable = {
          id: Date.now(),
          periodo,
          fechaGeneracion: new Date(),
          tipo: 'egresos',
          partidas,
          cuadre: {
            totalDebe,
            totalHaber,
            diferencia: totalDebe - totalHaber,
            cuadra: totalDebe === totalHaber
          },
          formatoExportacion: 'excel'
        };

        this.polizas.update(list => [poliza, ...list]);
        resolve(poliza);
      }, 2000);
    });
  }

  exportarPoliza(polizaId: number, formato: 'sap' | 'contpaq' | 'excel'): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const poliza = this.polizas().find(p => p.id === polizaId);
        if (!poliza) {
          throw new Error('Póliza no encontrada');
        }

        const extension = formato === 'excel' ? 'xlsx' : 'txt';
        const url = `/polizas/${polizaId}.${extension}`;
        resolve(url);
      }, 1000);
    });
  }

  obtenerLogsAuditoria(filtros?: FiltroAuditoria): LogAuditoria[] {
    let logs = this.logsAuditoria();

    if (filtros?.usuario) {
      logs = logs.filter(l => l.usuario.includes(filtros.usuario!));
    }

    if (filtros?.fechaDesde) {
      logs = logs.filter(l => l.fecha >= filtros.fechaDesde!);
    }

    if (filtros?.fechaHasta) {
      logs = logs.filter(l => l.fecha <= filtros.fechaHasta!);
    }

    if (filtros?.tipoAccion) {
      logs = logs.filter(l => l.tipoAccion === filtros.tipoAccion);
    }

    if (filtros?.entidad) {
      logs = logs.filter(l => l.entidad === filtros.entidad);
    }

    if (filtros?.entidadId) {
      logs = logs.filter(l => l.entidadId === filtros.entidadId);
    }

    return logs;
  }

  registrarAccion(log: Omit<LogAuditoria, 'id'>): void {
    const nuevoLog: LogAuditoria = {
      id: Date.now(),
      ...log
    };

    this.logsAuditoria.update(list => [nuevoLog, ...list]);
  }

  exportarLogs(filtros?: FiltroAuditoria): Promise<string> {
    return new Promise((resolve) => {
      const logs = this.obtenerLogsAuditoria(filtros);
      const url = `/auditoria/export-${Date.now()}.csv`;
      resolve(url);
    });
  }
}
