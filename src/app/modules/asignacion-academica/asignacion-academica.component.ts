import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsignacionService } from '../../services';
import type { Asignacion } from '../../models';
import type { Sincronizacion, VersionInsumo, ConflictoAsignacion, ValidacionAsignacion } from '../../models';
@Component({
  selector: 'app-asignacion-academica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asignacion-academica.component.html',
  styleUrl: './asignacion-academica.component.scss'
})
export class AsignacionAcademicaComponent implements OnInit {
  tab: 'carga' | 'mapa' | 'consolidacion' | 'historial' = 'carga';

  sincronizando = signal(false);
  cargandoArchivo = signal(false);
  sincronizaciones: Sincronizacion[] = [];

  asignaciones: Asignacion[] = [];
  conflictos: ConflictoAsignacion[] = [];
  filtroPrograma = '';
  filtroMateria = '';
  filtroEstatus = '';

  get asignacionesFiltradas(): Asignacion[] {
    let list = this.asignaciones;
    if (this.filtroPrograma) list = list.filter(a => a.programa.toLowerCase().includes(this.filtroPrograma.toLowerCase()));
    if (this.filtroMateria) list = list.filter(a => a.materia.toLowerCase().includes(this.filtroMateria.toLowerCase()));
    if (this.filtroEstatus) list = list.filter(a => a.estatus === this.filtroEstatus);
    return list;
  }

  validaciones: ValidacionAsignacion[] = [];
  nombreVersion = '';
  comentarioVersion = '';
  versiones: VersionInsumo[] = [];
  versionSeleccionadaId: number | null = null;
  versionCompararId: number | null = null;
  resultadoComparacion: { diferencias: any[]; resumen: { agregados: number; eliminados: number; modificados: number } } | null = null;

  editandoId: number | null = null;
  editandoCampo: string | null = null;
  valorEdit: string | number = '';

  archivoInput: HTMLInputElement | null = null;

  constructor(private readonly asignacionService: AsignacionService) {}

  ngOnInit(): void {
    this.sincronizaciones = this.asignacionService.obtenerSincronizaciones();
    this.asignaciones = this.asignacionService.getAsignacionesActuales();
    this.versiones = this.asignacionService.obtenerVersionesInsumo();
    this.actualizarConflictos();
  }

  actualizarConflictos(): void {
    this.conflictos = this.asignacionService.detectarConflictos(this.asignaciones);
  }

  crnsConConflicto(): Set<string> {
    return new Set(this.conflictos.map(c => c.asignacion.crn));
  }

  tieneConflicto(asignacion: Asignacion): boolean {
    return this.conflictos.some(c => c.asignacion.id === asignacion.id);
  }

  sincronizarConBanner(): void {
    this.sincronizando.set(true);
    this.asignacionService.sincronizarConBanner().then(() => {
      this.sincronizando.set(false);
      this.sincronizaciones = this.asignacionService.obtenerSincronizaciones();
      this.asignaciones = this.asignacionService.getAsignacionesActuales();
      this.actualizarConflictos();
    });
  }

  subirArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.cargandoArchivo.set(true);
    this.asignacionService.cargarArchivoManual(file).then(() => {
      this.cargandoArchivo.set(false);
      this.sincronizaciones = this.asignacionService.obtenerSincronizaciones();
      this.asignaciones = this.asignacionService.getAsignacionesActuales();
      this.actualizarConflictos();
      input.value = '';
    }).catch(() => {
      this.cargandoArchivo.set(false);
      input.value = '';
    });
  }

  ejecutarValidaciones(): void {
    this.validaciones = this.asignacionService.ejecutarValidaciones(this.asignaciones);
  }

  generarInsumoBase(): void {
    if (!this.nombreVersion.trim()) return;
    this.asignacionService.generarInsumoBase(this.asignaciones, this.nombreVersion.trim(), this.comentarioVersion.trim());
    this.versiones = this.asignacionService.obtenerVersionesInsumo();
    this.nombreVersion = '';
    this.comentarioVersion = '';
  }

  compararVersiones(): void {
    if (this.versionSeleccionadaId == null || this.versionCompararId == null) return;
    this.resultadoComparacion = this.asignacionService.compararVersiones(this.versionSeleccionadaId, this.versionCompararId);
  }

  iniciarEdicion(asignacion: Asignacion, campo: string): void {
    this.editandoId = asignacion.id;
    this.editandoCampo = campo;
    this.valorEdit = (asignacion as any)[campo] ?? '';
  }

  guardarEdicion(): void {
    if (this.editandoId == null || this.editandoCampo == null) return;
    const valor = typeof this.valorEdit === 'string' && !isNaN(Number(this.valorEdit)) && this.editandoCampo === 'alumnos'
      ? Number(this.valorEdit)
      : this.valorEdit;
    this.asignacionService.actualizarAsignacion(this.editandoId, { [this.editandoCampo]: valor });
    this.asignaciones = this.asignacionService.getAsignacionesActuales();
    this.actualizarConflictos();
    this.editandoId = null;
    this.editandoCampo = null;
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.editandoCampo = null;
  }

  descargarReporteIncidencias(): void {
    console.log('Descargar reporte de incidencias');
  }

  irAHistorial(): void {
    this.tab = 'historial';
    this.versiones = this.asignacionService.obtenerVersionesInsumo();
  }
}
