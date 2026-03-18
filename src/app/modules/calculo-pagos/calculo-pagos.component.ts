import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalculoPagosService, AsignacionService, ProfesoresService } from '../../services';
import { Pago, ProcesoCalculo, VersionInsumo, FiltroPago } from '../../models';
import { IconComponent } from '../../icon.component';
import { ButtonComponent } from '../../shared/buttons/button.component';

@Component({
    selector: 'app-calculo-pagos',
    standalone: true,
    imports: [CommonModule, FormsModule, IconComponent, ButtonComponent],
    templateUrl: './calculo-pagos.component.html'
})
export class CalculoPagosComponent implements OnInit {
    tab = signal<'procesamiento' | 'bandeja'>('procesamiento');

    // Tab: Procesamiento
    versionesInsumo = signal<VersionInsumo[]>([]);
    versionSeleccionadaId = signal<number | null>(null);
    procesoEjecutandose = signal<ProcesoCalculo | null>(null);
    historialProcesos = signal<ProcesoCalculo[]>([]);

    // Tab: Bandeja de Pagos
    subTabBandeja = signal<'pendientes' | 'observados' | 'validados'>('pendientes');
    pagos = signal<Pago[]>([]);
    filtros: FiltroPago = {};
    pagosSeleccionadosIds = signal<Set<number>>(new Set());

    // Detalle de Pago (Modal)
    pagoSeleccionado = signal<Pago | null>(null);
    mostrandoDetalle = signal(false);

    // EdiciÃ³n de Pago Extraordinario
    mostrandoEdicionExtraordinaria = signal(false);
    montoEditado = 0;

    // ObservaciÃ³n de pago
    mostrandoObservacion = signal(false);
    pagoObservadoId = signal<number | null>(null);
    motivoObservacion = '';
    justificacionEdicion = '';

    constructor(
        private readonly calculoPagosService: CalculoPagosService,
        private readonly asignacionService: AsignacionService,
        private readonly profesoresService: ProfesoresService
    ) { }

    ngOnInit(): void {
        this.cargarDatos();
    }

    cargarDatos(): void {
        this.versionesInsumo.set(this.asignacionService.obtenerVersionesInsumo());
        this.historialProcesos.set(this.calculoPagosService.obtenerProcesosCalculo());
        this.actualizarBandeja();
    }

    actualizarBandeja(): void {
        let estatus: Pago['estatus'] = 'calculado';
        if (this.subTabBandeja() === 'observados') estatus = 'observado';
        if (this.subTabBandeja() === 'validados') estatus = 'validado';

        // Obtenemos todos los pagos y filtramos por estatus del tab actual
        const todosLosPagos = this.calculoPagosService.obtenerPagos(this.filtros);
        this.pagos.set(todosLosPagos.filter(p => {
            if (this.subTabBandeja() === 'pendientes') return p.estatus === 'calculado' || p.estatus === 'pendiente_revision';
            return p.estatus === estatus;
        }));
        this.pagosSeleccionadosIds.set(new Set());
    }

    setTab(tab: 'procesamiento' | 'bandeja'): void {
        this.tab.set(tab);
        if (tab === 'bandeja') this.actualizarBandeja();
    }

    setSubTab(sub: 'pendientes' | 'observados' | 'validados'): void {
        this.subTabBandeja.set(sub);
        this.actualizarBandeja();
    }

    // --- Acciones Procesamiento ---
    ejecutarCalculo(): void {
        if (!this.versionSeleccionadaId()) return;

        this.calculoPagosService.calcularPagos(this.versionSeleccionadaId()!).then(proceso => {
            this.procesoEjecutandose.set(null);
            this.cargarDatos();
            alert('CÃ¡lculo de pagos completado con Ã©xito.');
        });

        // Simulamos el objeto de proceso para la UI mientras corre
        const interval = setInterval(() => {
            const procesos = this.calculoPagosService.obtenerProcesosCalculo();
            if (procesos.length > 0 && procesos[0].estatus === 'en_proceso') {
                this.procesoEjecutandose.set(procesos[0]);
            } else {
                this.procesoEjecutandose.set(null);
                clearInterval(interval);
            }
        }, 100);
    }

    // --- Acciones Bandeja ---
    toggleSeleccion(pagoId: number): void {
        const nuevos = new Set(this.pagosSeleccionadosIds());
        if (nuevos.has(pagoId)) nuevos.delete(pagoId);
        else nuevos.add(pagoId);
        this.pagosSeleccionadosIds.set(nuevos);
    }

    seleccionarTodos(): void {
        if (this.pagosSeleccionadosIds().size === this.pagos().length && this.pagos().length > 0) {
            this.pagosSeleccionadosIds.set(new Set());
        } else {
            this.pagosSeleccionadosIds.set(new Set(this.pagos().map(p => p.id)));
        }
    }

    validarSeleccionados(): void {
        const ids = Array.from(this.pagosSeleccionadosIds());
        if (ids.length === 0) return;

        this.calculoPagosService.marcarComoValidado(ids);
        this.actualizarBandeja();
        alert(`${ids.length} pagos marcados como validados.`);
    }

    verDetalle(pago: Pago): void {
        this.pagoSeleccionado.set(pago);
        this.mostrandoDetalle.set(true);
    }

    observarPago(pagoId: number): void {
        this.pagoObservadoId.set(pagoId);
        this.motivoObservacion = '';
        this.mostrandoObservacion.set(true);
    }

    abrirEdicionExtraordinaria(pago: Pago): void {
        this.pagoSeleccionado.set(pago);
        this.montoEditado = pago.montoTotal;
        this.justificacionEdicion = '';
        this.mostrandoEdicionExtraordinaria.set(true);
    }

    guardarEdicionExtraordinaria(): void {
        if (!this.pagoSeleccionado() || !this.justificacionEdicion.trim()) return;
        this.calculoPagosService.editarPagoExtraordinario(
            this.pagoSeleccionado()!.id,
            this.montoEditado,
            this.justificacionEdicion
        );
        this.mostrandoEdicionExtraordinaria.set(false);
        this.actualizarBandeja();
        alert('Pago editado y enviado a revisiÃ³n.');
    }

    recalcular(pagoId: number): void {
        this.calculoPagosService.recalcularPago(pagoId).then(() => {
            this.actualizarBandeja();
            alert('Pago recalculado exitosamente.');
        });
    }

    generarFormatoPago(): void {
        const contenido = [
            'CENTRO_COSTOS,PROFESOR,MONTO,ESTATUS,PERIODO',
            'CC-ADM-01,ANA TORRES,42500,VALIDADO,2026-1',
            'CC-ADM-04,LUIS MEZA,28900,OBSERVADO,2026-1',
            'CC-ADM-02,LAURA NERI,24300,VALIDADO,2026-1'
        ].join('\\n');
        this.descargarContenido('formato_pago_agrupado_2026_1.csv', contenido, 'text/csv');
    }

    confirmarObservacion(): void {
        if (!this.pagoObservadoId() || !this.motivoObservacion.trim()) return;
        this.calculoPagosService.marcarComoObservado(this.pagoObservadoId()!, this.motivoObservacion.trim());
        this.mostrandoObservacion.set(false);
        this.actualizarBandeja();
        alert('Pago marcado como observado.');
    }

    cancelarObservacion(): void {
        this.mostrandoObservacion.set(false);
        this.pagoObservadoId.set(null);
        this.motivoObservacion = '';
    }

    descargarContenido(nombre: string, contenido: string, tipo: string = 'text/plain'): void {
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
}
