import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContabilidadService } from '../../services';
import { Reporte, PolizaContable, LogAuditoria, ParametrosReporte, FiltroAuditoria } from '../../models';
import { IconComponent } from '../../icon.component';
import { ButtonComponent } from '../../shared/buttons/button.component';

@Component({
    selector: 'app-contabilidad-reportes',
    standalone: true,
    imports: [CommonModule, FormsModule, IconComponent, ButtonComponent],
    templateUrl: './contabilidad-reportes.component.html'
})
export class ContabilidadReportesComponent implements OnInit {
    tab = signal<'reportes' | 'polizas' | 'auditoria'>('reportes');

    // Tab: Reportes
    tiposReporte: { id: Reporte['tipo'], label: string, icon: string }[] = [
        { id: 'pago_profesor', label: 'Pagos por Profesor', icon: 'users' },
        { id: 'pago_centro_costos', label: 'Pagos por Centro de Costos', icon: 'analytics' },
        { id: 'impuestos', label: 'Retenciones e Impuestos', icon: 'task' },
        { id: 'incidencias', label: 'Incidencias y Rechazos', icon: 'help' },
        { id: 'profesores_sin_datos', label: 'Inconsistencias de Datos', icon: 'settings' }
    ];
    reporteSeleccionado = signal<Reporte['tipo']>('pago_profesor');
    parametros: ParametrosReporte = { formato: 'pdf' };
    generandoReporte = signal(false);
    historialReportes = signal<Reporte[]>([]);

    // Tab: Pólizas
    polizas = signal<PolizaContable[]>([]);
    generandoPoliza = signal(false);
    periodoActivo = '2024-11';

    // Tab: Auditoría
    logs = signal<LogAuditoria[]>([]);
    filtroAuditoria: FiltroAuditoria = {};
    cargandoAuditoria = signal(false);

    constructor(private readonly contabilidadService: ContabilidadService) { }

    ngOnInit(): void {
        this.cargarDatos();
    }

    cargarDatos(): void {
        this.logs.set(this.contabilidadService.obtenerLogsAuditoria());
        this.polizas.set((this.contabilidadService as any).polizas());
        this.historialReportes.set((this.contabilidadService as any).reportes());
    }

    setTab(tab: 'reportes' | 'polizas' | 'auditoria'): void {
        this.tab.set(tab);
    }

    // --- Acciones Reportes ---
    ejecutarReporte(): void {
        this.generandoReporte.set(true);
        this.contabilidadService.generarReporte(this.reporteSeleccionado(), this.parametros).then(rep => {
            this.historialReportes.update(list => [rep, ...list]);
            this.generandoReporte.set(false);
            alert('Reporte generado exitosamente.');
        });
    }

    descargarReporte(repId: string, formato: Reporte['parametros']['formato']): void {
        this.contabilidadService.exportarReporte(repId, formato).then(url => {
            alert('Iniciando descarga: ' + url);
        });
    }

    // --- Acciones Pólizas ---
    generarNuevaPoliza(): void {
        this.generandoPoliza.set(true);
        this.contabilidadService.generarPolizaEgresos(this.periodoActivo).then(poliza => {
            this.polizas.update(list => [poliza, ...list]);
            this.generandoPoliza.set(false);
            alert('Póliza contable de egresos generada.');
        });
    }

    exportarPoliza(id: number, formato: PolizaContable['formatoExportacion']): void {
        this.contabilidadService.exportarPoliza(id, formato).then(url => {
            alert('Póliza exportada a ' + formato.toUpperCase());
        });
    }

    // --- Acciones Auditoría ---
    filtrarAuditoria(): void {
        this.cargandoAuditoria.set(true);
        setTimeout(() => {
            this.logs.set(this.contabilidadService.obtenerLogsAuditoria(this.filtroAuditoria));
            this.cargandoAuditoria.set(false);
        }, 500);
    }

    exportarAuditoria(): void {
        this.contabilidadService.exportarLogs(this.filtroAuditoria).then(url => {
            alert('Descargando bitácora de auditoría (CSV)');
        });
    }
}
