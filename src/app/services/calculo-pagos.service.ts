import { Injectable, signal } from '@angular/core';
import { Pago, ProcesoCalculo, FiltroPago, FormatoPagoAgrupado } from '../models';
import { VersionInsumo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CalculoPagosService {
  private pagos = signal<Pago[]>([]);
  private procesosCalculo = signal<ProcesoCalculo[]>([]);

  constructor() {}

  calcularPagos(versionInsumoId: number): Promise<ProcesoCalculo> {
    return new Promise((resolve) => {
      const proceso: ProcesoCalculo = {
        id: Date.now(),
        versionInsumoId,
        fechaInicio: new Date(),
        estatus: 'en_proceso',
        progreso: 0,
        totalPagos: 0,
        montoTotal: 0,
        profesoresImpactados: 0,
        log: ['Iniciando cálculo de pagos...']
      };

      this.procesosCalculo.update(list => [proceso, ...list]);

      // Simular progreso
      const intervalo = setInterval(() => {
        proceso.progreso += 10;
        proceso.log.push(`Procesando... ${proceso.progreso}%`);

        if (proceso.progreso >= 100) {
          clearInterval(intervalo);
          proceso.estatus = 'completado';
          proceso.fechaFin = new Date();
          proceso.totalPagos = 150;
          proceso.montoTotal = 2500000;
          proceso.profesoresImpactados = 120;
          proceso.log.push('Cálculo completado exitosamente');
          
          // Generar pagos de ejemplo
          this.generarPagosEjemplo(versionInsumoId);
          
          resolve(proceso);
        }
      }, 500);
    });
  }

  private generarPagosEjemplo(versionInsumoId: number): void {
    const nuevosPagos: Pago[] = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      folio: `PAG-${Date.now()}-${i}`,
      profesorId: i + 1,
      asignaciones: [],
      montoTotal: Math.floor(Math.random() * 50000) + 10000,
      formaPago: 'transferencia',
      estatus: 'calculado',
      fechaCalculo: new Date(),
      desglose: {
        tarifaBase: Math.floor(Math.random() * 40000) + 8000,
        incentivos: Math.floor(Math.random() * 5000),
        deducciones: Math.floor(Math.random() * 3000),
        montoNeto: 0
      }
    }));

    nuevosPagos.forEach(p => {
      if (p.desglose) {
        p.desglose.montoNeto = p.desglose.tarifaBase + p.desglose.incentivos - p.desglose.deducciones;
      }
    });

    this.pagos.update(list => [...list, ...nuevosPagos]);
  }

  obtenerPagos(filtros?: FiltroPago): Pago[] {
    let resultado = this.pagos();

    if (filtros?.profesorId) {
      resultado = resultado.filter(p => p.profesorId === filtros.profesorId);
    }

    if (filtros?.estatus) {
      resultado = resultado.filter(p => p.estatus === filtros.estatus);
    }

    if (filtros?.fechaDesde) {
      resultado = resultado.filter(p => 
        p.fechaCalculo && p.fechaCalculo >= filtros.fechaDesde!
      );
    }

    if (filtros?.fechaHasta) {
      resultado = resultado.filter(p => 
        p.fechaCalculo && p.fechaCalculo <= filtros.fechaHasta!
      );
    }

    if (filtros?.centroCostos) {
      resultado = resultado.filter(p => 
        p.asignaciones.some(a => a.centroCostos === filtros.centroCostos)
      );
    }

    return resultado;
  }

  obtenerPagoPorId(id: number): Pago | undefined {
    return this.pagos().find(p => p.id === id);
  }

  obtenerPagosPorEstatus(estatus: Pago['estatus']): Pago[] {
    return this.pagos().filter(p => p.estatus === estatus);
  }

  marcarComoValidado(pagoIds: number[]): void {
    this.pagos.update(list =>
      list.map(p => 
        pagoIds.includes(p.id) 
          ? { ...p, estatus: 'validado' as const }
          : p
      )
    );
  }

  marcarComoObservado(pagoId: number, motivo: string): void {
    this.pagos.update(list =>
      list.map(p => 
        p.id === pagoId 
          ? { ...p, estatus: 'observado' as const }
          : p
      )
    );
  }

  editarPagoExtraordinario(pagoId: number, monto: number, justificacion: string): void {
    this.pagos.update(list =>
      list.map(p => 
        p.id === pagoId 
          ? { 
              ...p, 
              montoTotal: monto,
              estatus: 'pendiente_revision' as const
            }
          : p
      )
    );
  }

  recalcularPago(pagoId: number): Promise<Pago> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pago = this.obtenerPagoPorId(pagoId);
        if (!pago) {
          throw new Error('Pago no encontrado');
        }

        // Simular recálculo
        const pagoRecalculado = {
          ...pago,
          montoTotal: pago.montoTotal * 1.1, // Ejemplo de cambio
          fechaCalculo: new Date()
        };

        this.pagos.update(list =>
          list.map(p => p.id === pagoId ? pagoRecalculado : p)
        );

        resolve(pagoRecalculado);
      }, 1000);
    });
  }

  generarFormatoPagoAgrupado(centroCostos: string): FormatoPagoAgrupado {
    const pagos = this.obtenerPagos({ centroCostos });
    const total = pagos.reduce((sum, p) => sum + p.montoTotal, 0);

    return {
      centroCostos,
      pagos,
      total,
      cantidadPagos: pagos.length
    };
  }

  obtenerProcesosCalculo(): ProcesoCalculo[] {
    return this.procesosCalculo();
  }
}
