import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FiscalService, CalculoPagosService, ProfesoresService } from '../../services';
import { Pago, Profesor, ValidacionFiscal, Contrato, CFDI } from '../../models';
import { IconComponent } from '../../icon.component';
import { ButtonComponent } from '../../shared/buttons/button.component';

@Component({
    selector: 'app-cumplimiento-fiscal',
    standalone: true,
    imports: [CommonModule, FormsModule, IconComponent, ButtonComponent],
    templateUrl: './cumplimiento-fiscal.component.html'
})
export class CumplimientoFiscalComponent implements OnInit {
    tab = signal<'validacion' | 'contratos' | 'cfdi'>('validacion');

    // Tab: Validación Fiscal
    pagosPendientesFiscal = signal<Pago[]>([]);
    validacionesFiscales = signal<ValidacionFiscal[]>([]);
    validandoMasivamente = signal(false);

    // Tab: Contratos
    contratos = signal<Contrato[]>([]);
    generandoContratos = signal(false);

    // Tab: CFDI
    cfdies = signal<CFDI[]>([]);
    timbrando = signal(false);
    pagoSeleccionadoParaCFDI = signal<Pago | null>(null);
    mostrandoSubidaCFDI = signal(false);
    modalInfo = signal<{ titulo: string; mensaje: string } | null>(null);

    constructor(
        private readonly fiscalService: FiscalService,
        private readonly calculoPagosService: CalculoPagosService,
        private readonly profesoresService: ProfesoresService
    ) { }

    ngOnInit(): void {
        this.cargarDatos();
    }

    cargarDatos(): void {
        // Pagos validados académicamente que entran a flujo fiscal
        const pagos = this.calculoPagosService.obtenerPagos();
        this.pagosPendientesFiscal.set(pagos.filter(p => p.estatus === 'validado' || p.estatus === 'en_fiscal'));

        this.contratos.set(this.fiscalService.obtenerContratos());
        this.cfdies.set(this.fiscalService.obtenerCFDIes());

        // Ejecutar una validación inicial automática para mostrar datos dummy
        if (this.pagosPendientesFiscal().length > 0) {
            const resultados = this.fiscalService.validarProfesoresMasiva(this.pagosPendientesFiscal());
            this.validacionesFiscales.set(resultados);
        }
    }

    setTab(tab: 'validacion' | 'contratos' | 'cfdi'): void {
        this.tab.set(tab);
        this.cargarDatos();
    }

    // --- Acciones Validación Fiscal ---
    ejecutarValidacionMasiva(): void {
        this.validandoMasivamente.set(true);
        setTimeout(() => {
            const resultados = this.fiscalService.validarProfesoresMasiva(this.pagosPendientesFiscal());
            this.validacionesFiscales.set(resultados);
            this.validandoMasivamente.set(false);
            alert('Validación fiscal completada.');
        }, 1500);
    }

    // --- Acciones Contratos ---
    generarContratosPendientes(): void {
        const pagosSinContrato = this.pagosPendientesFiscal().filter(p =>
            !this.contratos().some(c => c.pagoId === p.id)
        );

        if (pagosSinContrato.length === 0) {
            alert('No hay pagos pendientes de contrato.');
            return;
        }

        this.generandoContratos.set(true);
        this.fiscalService.generarContratos(pagosSinContrato.map(p => p.id)).then(() => {
            this.contratos.set(this.fiscalService.obtenerContratos());
            this.generandoContratos.set(false);
            alert(`${pagosSinContrato.length} contratos generados exitosamente.`);
        });
    }

    enviarAFirma(contratoId: number): void {
        alert('Enviando contrato a firma digital...');
    }

    // --- Acciones CFDI ---
    timbrarPagosSeleccionados(): void {
        const pagosATimbrar = this.pagosPendientesFiscal()
            .filter(p => !this.cfdies().some(c => c.folio === `FOL-${p.id}`))
            .slice(0, 5); // Simulamos timbrado de los primeros 5

        if (pagosATimbrar.length === 0) {
            alert('No hay pagos listos para timbrado institucional.');
            return;
        }

        this.timbrando.set(true);
        this.fiscalService.timbrarCFDI(pagosATimbrar.map(p => p.id)).then(resultado => {
            this.cfdies.set(this.fiscalService.obtenerCFDIes());
            this.timbrando.set(false);
            alert(`Proceso de timbrado finalizado. Exitosos: ${resultado.cfdiesGenerados.length}, Errores: ${resultado.errores.length}`);
        });
    }

    abrirSubidaCFDI(pago: Pago): void {
        this.pagoSeleccionadoParaCFDI.set(pago);
        this.mostrandoSubidaCFDI.set(true);
    }

    procesarXMLRecibido(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file || !this.pagoSeleccionadoParaCFDI()) return;

        this.fiscalService.recibirCFDIProveedor(this.pagoSeleccionadoParaCFDI()!.id, file).then(res => {
            if (res.validado) {
                alert('CFDI validado y cargado correctamente.');
                this.cfdies.set(this.fiscalService.obtenerCFDIes());
                this.mostrandoSubidaCFDI.set(false);
            } else {
                alert('Error al validar XML: ' + res.errores?.join(', '));
            }
        });
    }

    abrirModalInfo(titulo: string, mensaje: string): void {
        this.modalInfo.set({ titulo, mensaje });
    }

    cerrarModalInfo(): void {
        this.modalInfo.set(null);
    }

    descargarCFDI(tipo: 'xml' | 'pdf'): void {
        if (tipo === 'xml') {
            const link = document.createElement('a');
            link.href = '/ejemplos/cfdi_ejemplo.xml';
            link.download = 'cfdi_ejemplo.xml';
            link.click();
            return;
        }
        this.descargarContenido('cfdi_ejemplo.pdf', 'CFDI PDF dummy', 'application/pdf');
    }

    descargarContratoPDF(): void {
        this.descargarContenido('contrato_ejemplo.pdf', 'Contrato dummy', 'application/pdf');
    }

    private descargarContenido(nombre: string, contenido: string, tipo: string): void {
        const blob = new Blob([contenido], { type: tipo });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nombre;
        link.click();
        URL.revokeObjectURL(url);
    }

    getNombreProfesor(id: number): string {
        return this.profesoresService.obtenerProfesorPorId(id)?.nombreCompleto || 'Cargando...';
    }

    getRFCProfesor(id: number): string {
        return this.profesoresService.obtenerProfesorPorId(id)?.rfc || 'N/A';
    }
}
