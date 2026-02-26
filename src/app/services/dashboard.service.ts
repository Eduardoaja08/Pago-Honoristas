import { Injectable, signal } from '@angular/core';
import { KPI, GraficaAvance, TareaPendiente, IncidenciaCritica } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private periodoActual = signal<string>('2024-1');

  constructor() {}

  obtenerKPIs(): KPI[] {
    return [
      {
        titulo: 'Total a pagar en el período',
        valor: '$2,500,000',
        cambio: '+12% vs período anterior',
        tendencia: 'ascendente'
      },
      {
        titulo: 'Profesores activos',
        valor: '1,248',
        cambio: 'vs 1,180 pendientes de validar',
        tendencia: 'ascendente'
      },
      {
        titulo: 'Pagos programados',
        valor: '932',
        cambio: 'vs 850 pagados',
        tendencia: 'ascendente'
      },
      {
        titulo: 'Incidencias críticas',
        valor: '27',
        cambio: 'CFDI rechazados: 5, Pagos rebotados: 2',
        tendencia: 'descendente'
      }
    ];
  }

  obtenerGraficaAvance(): GraficaAvance[] {
    return [
      { etapa: 'Asignados', cantidad: 1500, porcentaje: 100, color: '#3b82f6' },
      { etapa: 'Validados', cantidad: 1200, porcentaje: 80, color: '#10b981' },
      { etapa: 'Calculados', cantidad: 950, porcentaje: 63, color: '#f59e0b' },
      { etapa: 'Pagados', cantidad: 850, porcentaje: 57, color: '#8b5cf6' }
    ];
  }

  obtenerTareasPendientes(): TareaPendiente[] {
    return [
      {
        id: 1,
        titulo: 'Validar cuentas de 5 profesores',
        descripcion: 'Cuentas pendientes de validación por tesorería',
        modulo: 'Operación Bancaria',
        prioridad: 'alta',
        fechaLimite: new Date('2024-12-01'),
        asignadoA: 'Usuario Actual'
      },
      {
        id: 2,
        titulo: 'Autorizar pago por $150,000',
        descripcion: 'Pago extraordinario pendiente de autorización',
        modulo: 'Cálculo y Pagos',
        prioridad: 'alta',
        fechaLimite: new Date('2024-11-30'),
        asignadoA: 'Usuario Actual'
      },
      {
        id: 3,
        titulo: 'Revisar CFDI rechazados',
        descripcion: '5 CFDI requieren atención',
        modulo: 'Cumplimiento Fiscal',
        prioridad: 'media',
        asignadoA: 'Usuario Actual'
      }
    ];
  }

  obtenerIncidenciasCriticas(): IncidenciaCritica[] {
    return [
      {
        id: 1,
        tipo: 'cfdi_rechazado',
        titulo: 'CFDI rechazado por el PAC',
        descripcion: 'El CFDI con UUID xxx-xxx-xxx fue rechazado',
        severidad: 'critica',
        fecha: new Date(),
        resuelta: false
      },
      {
        id: 2,
        tipo: 'pago_rebotado',
        titulo: 'Pago rebotado por el banco',
        descripcion: 'El pago PAG-001 fue rechazado: Cuenta inexistente',
        severidad: 'alta',
        fecha: new Date(),
        resuelta: false
      }
    ];
  }

  obtenerPeriodoActual(): string {
    return this.periodoActual();
  }

  establecerPeriodo(periodo: string): void {
    this.periodoActual.set(periodo);
  }
}
