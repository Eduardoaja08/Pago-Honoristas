import { Injectable, signal } from '@angular/core';
import { ValidacionFiscal, Contrato, EmisionCFDI, RecepcionCFDI } from '../models';
import { Profesor, Pago, CFDI } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FiscalService {
  private contratos = signal<Contrato[]>([]);
  private cfdies = signal<CFDI[]>([]);

  constructor() {}

  validarProfesoresMasiva(pagos: Pago[]): ValidacionFiscal[] {
    const profesoresIds = new Set(pagos.map(p => p.profesorId));
    
    return Array.from(profesoresIds).map(profesorId => {
      // Simulación de validación
      const problemas: any[] = [];
      
      // Ejemplo: verificar RFC
      if (Math.random() > 0.8) {
        problemas.push({
          tipo: 'falta_rfc',
          descripcion: 'RFC no registrado',
          severidad: 'error'
        });
      }

      return {
        profesorId,
        profesor: {} as Profesor,
        valido: problemas.length === 0,
        problemas
      };
    });
  }

  generarContratos(pagoIds: number[]): Promise<Contrato[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contratos: Contrato[] = pagoIds.map(pagoId => ({
          id: Date.now() + pagoId,
          pagoId,
          pago: {} as Pago,
          version: '1.0',
          fechaGeneracion: new Date(),
          pdf: `/contratos/contrato-${pagoId}.pdf`,
          estatus: 'generado'
        }));

        this.contratos.update(list => [...list, ...contratos]);
        resolve(contratos);
      }, 1500);
    });
  }

  obtenerContratos(estatus?: Contrato['estatus']): Contrato[] {
    const contratos = this.contratos();
    return estatus 
      ? contratos.filter(c => c.estatus === estatus)
      : contratos;
  }

  timbrarCFDI(pagoIds: number[]): Promise<EmisionCFDI> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cfdiesGenerados: CFDI[] = [];
        const errores: any[] = [];

        pagoIds.forEach((pagoId, index) => {
          if (Math.random() > 0.1) { // 90% éxito
            const cfdi: CFDI = {
              id: Date.now() + index,
              uuid: `uuid-${Date.now()}-${index}`,
              folio: `FOL-${pagoId}`,
              fechaTimbrado: new Date(),
              xml: `/cfdi/xml/${pagoId}.xml`,
              pdf: `/cfdi/pdf/${pagoId}.pdf`,
              estatus: 'timbrado'
            };
            cfdiesGenerados.push(cfdi);
            this.cfdies.update(list => [...list, cfdi]);
          } else {
            errores.push({
              pagoId,
              motivo: 'Error en el timbrado',
              codigoError: 'PAC-001'
            });
          }
        });

        const resultado: EmisionCFDI = {
          pagos: [],
          fechaProcesamiento: new Date(),
          resultado: errores.length === 0 ? 'exitoso' : errores.length === pagoIds.length ? 'fallido' : 'parcial',
          cfdiesGenerados,
          errores
        };

        resolve(resultado);
      }, 2000);
    });
  }

  obtenerCFDIes(estatus?: CFDI['estatus']): CFDI[] {
    const cfdies = this.cfdies();
    return estatus 
      ? cfdies.filter(c => c.estatus === estatus)
      : cfdies;
  }

  cancelarCFDI(cfdiId: number, motivo: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.cfdies.update(list =>
          list.map(c =>
            c.id === cfdiId
              ? { ...c, estatus: 'cancelado', motivoCancelacion: motivo }
              : c
          )
        );
        resolve();
      }, 500);
    });
  }

  recibirCFDIProveedor(pagoId: number, xml: File | string): Promise<RecepcionCFDI> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular validación del XML
        const validado = Math.random() > 0.2; // 80% válido

        const resultado: RecepcionCFDI = {
          pagoId,
          xml,
          validado,
          errores: validado ? undefined : ['XML inválido', 'RFC no coincide']
        };

        if (validado) {
          const cfdi: CFDI = {
            id: Date.now(),
            uuid: `uuid-recibido-${Date.now()}`,
            folio: `FOL-REC-${pagoId}`,
            fechaTimbrado: new Date(),
            xml: typeof xml === 'string' ? xml : URL.createObjectURL(xml),
            pdf: `/cfdi/pdf/recibido-${pagoId}.pdf`,
            estatus: 'timbrado'
          };
          resultado.cfdiRecibido = cfdi;
          this.cfdies.update(list => [...list, cfdi]);
        }

        resolve(resultado);
      }, 1000);
    });
  }

  enviarCFDIPorCorreo(cfdiId: number, correo: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Enviando CFDI ${cfdiId} a ${correo}`);
        resolve();
      }, 500);
    });
  }
}
