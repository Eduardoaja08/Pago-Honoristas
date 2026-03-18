import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BancarioService, ProfesoresService, CalculoPagosService } from '../../services';
import { LayoutBancario, Dispersion, ArchivoRetorno, Pago, Profesor } from '../../models';
import { IconComponent } from '../../icon.component';
import { ButtonComponent } from '../../shared/buttons/button.component';

@Component({
    selector: 'app-operacion-bancaria',
    standalone: true,
    imports: [CommonModule, FormsModule, IconComponent, ButtonComponent],
    templateUrl: './operacion-bancaria.component.html'
})
export class OperacionBancariaComponent implements OnInit {
    tab = signal<'cuentas' | 'dispersion' | 'conciliacion'>('cuentas');

    // Tab: Cuentas Bancarias
    profesores = signal<Profesor[]>([]);
    filtroProfesor = signal('');
    profesoresFiltrados = computed(() => {
        const filtro = this.filtroProfesor().toLowerCase();
        return this.profesores().filter(p =>
            p.nombreCompleto.toLowerCase().includes(filtro) ||
            p.rfc.toLowerCase().includes(filtro)
        );
    });

    // Tab: Generación de Dispersión
    layouts = signal<LayoutBancario[]>([]);
    layoutSeleccionadoId = signal<number | null>(null);
    pagosDisponibles = signal<Pago[]>([]);
    pagosSeleccionadosIds = signal<Set<number>>(new Set());
    dispersiones = signal<Dispersion[]>([]);
    vistaPrevia = signal<string>('');
    mostrandoVistaPrevia = signal(false);

    // Tab: Conciliación
    cargandoArchivo = signal(false);
    archivoRetorno = signal<ArchivoRetorno | null>(null);

    constructor(
        private readonly bancarioService: BancarioService,
        private readonly profesoresService: ProfesoresService,
        private readonly calculoPagosService: CalculoPagosService
    ) { }

    ngOnInit(): void {
        this.cargarDatos();
    }

    cargarDatos(): void {
        this.profesores.set(this.profesoresService.obtenerProfesores());
        this.layouts.set(this.bancarioService.obtenerLayouts());
        this.dispersiones.set(this.bancarioService.obtenerDispersiones());

        // Pagos listos para dispersión (CFDI timbrados - simulamos con los que tienen estatus 'en_fiscal' o 'validado')
        const pagos = this.calculoPagosService.obtenerPagos();
        this.pagosDisponibles.set(pagos.filter(p => ['validado', 'en_fiscal'].includes(p.estatus)));
    }

    setTab(tab: 'cuentas' | 'dispersion' | 'conciliacion'): void {
        this.tab.set(tab);
        if (tab === 'dispersion') {
            this.cargarDatos();
        }
    }

    // --- Acciones Cuentas Bancarias ---
    validarCLABE(profesor: Profesor): void {
        if (!profesor.datosBancarios) return;
        const esValida = this.profesoresService.validarCLABE(profesor.datosBancarios.clabe);
        if (esValida) {
            this.profesoresService.actualizarDatosBancarios(profesor.id, {
                ...profesor.datosBancarios,
                validado: true
            });
            this.cargarDatos();
            alert('CLABE validada correctamente');
        } else {
            alert('La CLABE no es válida (dígito verificador incorrecto)');
        }
    }

    marcarValidadaPorTesoreria(profesor: Profesor): void {
        if (!profesor.datosBancarios) return;
        this.profesoresService.actualizarDatosBancarios(profesor.id, {
            ...profesor.datosBancarios,
            validado: true
        });
        this.cargarDatos();
    }

    // --- Acciones Dispersión ---
    toggleSeleccionPago(pagoId: number): void {
        const nuevos = new Set(this.pagosSeleccionadosIds());
        if (nuevos.has(pagoId)) {
            nuevos.delete(pagoId);
        } else {
            nuevos.add(pagoId);
        }
        this.pagosSeleccionadosIds.set(nuevos);
    }

    seleccionarTodosPagos(): void {
        if (this.pagosSeleccionadosIds().size === this.pagosDisponibles().length) {
            this.pagosSeleccionadosIds.set(new Set());
        } else {
            this.pagosSeleccionadosIds.set(new Set(this.pagosDisponibles().map(p => p.id)));
        }
    }

    generarVistaPrevia(): void {
        if (!this.layoutSeleccionadoId() || this.pagosSeleccionadosIds().size === 0) return;

        const pagos = this.pagosDisponibles().filter(p => this.pagosSeleccionadosIds().has(p.id));
        const vista = this.bancarioService.vistaPreviaLayout(pagos, this.layoutSeleccionadoId()!);
        this.vistaPrevia.set(vista);
        this.mostrandoVistaPrevia.set(true);
    }

    generarArchivoDispersion(): void {
        if (!this.layoutSeleccionadoId() || this.pagosSeleccionadosIds().size === 0) return;

        const pagos = this.pagosDisponibles().filter(p => this.pagosSeleccionadosIds().has(p.id));
        this.bancarioService.generarDispersion(pagos, this.layoutSeleccionadoId()!).then(disp => {
            this.dispersiones.set(this.bancarioService.obtenerDispersiones());
            this.pagosSeleccionadosIds.set(new Set());
            this.mostrandoVistaPrevia.set(false);
            alert('Archivo de dispersión generado exitosamente');
        });
    }

    solicitarAutorizacion(dispId: number): void {
        // Simulado: cambia estatus a pendiente de autorizar (ya está por defecto)
        alert('Solicitud de autorización enviada');
    }

    autorizarDispersion(dispId: number): void {
        this.bancarioService.autorizarDispersion(dispId, 'Usuario Autorizador');
        this.dispersiones.set(this.bancarioService.obtenerDispersiones());
        alert('Dispersión autorizada exitosamente');
    }

    // --- Acciones Conciliación ---
    seleccionarArchivoRetorno(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        this.cargandoArchivo.set(true);
        this.bancarioService.procesarArchivoRetorno(file).then(resultado => {
            this.archivoRetorno.set(resultado);
            this.cargandoArchivo.set(false);
        });
    }

    aplicarResultadosConciliacion(): void {
        if (!this.archivoRetorno()) return;
        this.bancarioService.aplicarResultadosConciliacion(this.archivoRetorno()!.resultados);
        alert('Resultados de conciliación aplicados masivamente');
        this.archivoRetorno.set(null);
    }


    descargarDispersion(disp: Dispersion): void {
        const layout = this.bancarioService.obtenerLayoutPorId(disp.layoutBancarioId);
        const extension = layout?.formato || 'txt';
        const nombre = 'layout_' + disp.id + '.' + extension;
        this.descargarContenido(nombre, disp.archivo, extension === 'csv' ? 'text/csv' : 'text/plain');
    }

    descargarEjemploLayout(): void {
        const link = document.createElement('a');
        link.href = '/ejemplos/layout_banco_santander_2026_1.txt';
        link.download = 'layout_banco_santander_2026_1.txt';
        link.click();
    }

    descargarPlantillaRetorno(): void {
        const link = document.createElement('a');
        link.href = '/ejemplos/bank_report_2026_1.csv';
        link.download = 'bank_report_2026_1.csv';
        link.click();
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
        return this.profesores().find(p => p.id === id)?.nombreCompleto || 'Desconocido';
    }
}
