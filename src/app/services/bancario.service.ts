import { Injectable, signal } from '@angular/core';
import { LayoutBancario, Dispersión, ArchivoRetorno, ResultadoConciliacion } from '../models';
import { Pago } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BancarioService {
  private layouts = signal<LayoutBancario[]>([
    {
      id: 1,
      nombre: 'Santander SPEI',
      banco: 'Santander',
      formato: 'txt',
      separador: '|',
      activo: true,
      columnas: [
        { nombre: 'CLABE', posicion: 1, tipo: 'texto', longitud: 18 },
        { nombre: 'Monto', posicion: 2, tipo: 'numero' },
        { nombre: 'Referencia', posicion: 3, tipo: 'texto' }
      ]
    },
    {
      id: 2,
      nombre: 'BBVA Dispersión',
      banco: 'BBVA',
      formato: 'csv',
      separador: ',',
      activo: true,
      columnas: [
        { nombre: 'Cuenta', posicion: 1, tipo: 'texto' },
        { nombre: 'Importe', posicion: 2, tipo: 'numero' },
        { nombre: 'Concepto', posicion: 3, tipo: 'texto' }
      ]
    }
  ]);

  private dispersiones = signal<Dispersión[]>([]);

  constructor() {}

  obtenerLayouts(): LayoutBancario[] {
    return this.layouts();
  }

  obtenerLayoutPorId(id: number): LayoutBancario | undefined {
    return this.layouts().find(l => l.id === id);
  }

  generarDispersión(
    pagos: Pago[],
    layoutBancarioId: number
  ): Promise<Dispersión> {
    return new Promise((resolve) => {
      const layout = this.obtenerLayoutPorId(layoutBancarioId);
      if (!layout) {
        throw new Error('Layout bancario no encontrado');
      }

      const montoTotal = pagos.reduce((sum, p) => sum + p.montoTotal, 0);
      const archivo = this.generarArchivoLayout(pagos, layout);

      const dispersión: Dispersión = {
        id: Date.now(),
        pagos,
        layoutBancarioId,
        fechaGeneracion: new Date(),
        archivo,
        estatus: 'pendiente_autorizar',
        montoTotal,
        cantidadPagos: pagos.length,
        solicitadoPor: 'Usuario Actual'
      };

      this.dispersiones.update(list => [dispersión, ...list]);
      resolve(dispersión);
    });
  }

  private generarArchivoLayout(pagos: Pago[], layout: LayoutBancario): string {
    const lineas: string[] = [];
    
    pagos.forEach(pago => {
      const valores: string[] = [];
      layout.columnas.forEach(col => {
        switch (col.nombre.toLowerCase()) {
          case 'clabe':
          case 'cuenta':
            valores.push('123456789012345678'); // Simulado
            break;
          case 'monto':
          case 'importe':
            valores.push(pago.montoTotal.toString());
            break;
          case 'referencia':
          case 'concepto':
            valores.push(pago.folio);
            break;
          default:
            valores.push('');
        }
      });
      lineas.push(valores.join(layout.separador || ','));
    });

    return lineas.join('\n');
  }

  vistaPreviaLayout(pagos: Pago[], layoutBancarioId: number): string {
    const layout = this.obtenerLayoutPorId(layoutBancarioId);
    if (!layout) return '';

    const archivo = this.generarArchivoLayout(pagos, layout);
    const lineas = archivo.split('\n');
    return lineas.slice(0, 10).join('\n'); // Primeras 10 líneas
  }

  autorizarDispersión(dispersiónId: number, autorizadoPor: string): void {
    this.dispersiones.update(list =>
      list.map(d =>
        d.id === dispersiónId
          ? {
              ...d,
              estatus: 'autorizado',
              autorizadoPor,
              fechaAutorizacion: new Date()
            }
          : d
      )
    );
  }

  procesarArchivoRetorno(archivo: File | string): Promise<ArchivoRetorno> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular procesamiento del archivo de retorno
        const resultados: ResultadoConciliacion = {
          pagosAplicados: [
            { pagoId: 1, folio: 'PAG-001', fechaAplicacion: new Date() },
            { pagoId: 2, folio: 'PAG-002', fechaAplicacion: new Date() }
          ],
          pagosRechazados: [
            { pagoId: 3, folio: 'PAG-003', motivo: 'Cuenta inexistente', codigoError: 'BAN-001' }
          ],
          pagosNoEncontrados: [
            { folio: 'PAG-999', motivo: 'Folio no encontrado en el sistema' }
          ]
        };

        const archivoRetorno: ArchivoRetorno = {
          id: Date.now(),
          archivo,
          fechaCarga: new Date(),
          procesado: true,
          resultados
        };

        resolve(archivoRetorno);
      }, 2000);
    });
  }

  aplicarResultadosConciliacion(resultados: ResultadoConciliacion): void {
    // Actualizar estatus de pagos según resultados
    resultados.pagosAplicados.forEach(pago => {
      // Actualizar pago a "Pagado"
      console.log(`Aplicando pago ${pago.pagoId}`);
    });

    resultados.pagosRechazados.forEach(pago => {
      // Actualizar pago a "Rechazado"
      console.log(`Rechazando pago ${pago.pagoId}: ${pago.motivo}`);
    });
  }

  obtenerDispersiones(): Dispersión[] {
    return this.dispersiones();
  }
}
