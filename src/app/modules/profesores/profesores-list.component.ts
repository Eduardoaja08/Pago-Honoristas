import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Profesor } from '../../models';
import { ProfesoresService } from '../../services';
import { IconComponent } from '../../icon.component';
import { ButtonComponent } from '../../shared/buttons/button.component';

@Component({
  selector: 'app-profesores-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, ButtonComponent],
  template: `
    <div class="space-y-4">
      <!-- Filtros y acciones -->
      <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div class="grid flex-1 grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <label class="mb-1 block text-xs font-medium text-muted-foreground">Nombre</label>
            <input
              type="text"
              class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Buscar por nombre"
              [(ngModel)]="filtros.nombre"
              (input)="aplicarFiltros()"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-muted-foreground">RFC</label>
            <input
              type="text"
              class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="RFC"
              [(ngModel)]="filtros.rfc"
              (input)="aplicarFiltros()"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-muted-foreground">Estatus</label>
            <select
              class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              [(ngModel)]="filtros.estatus"
              (change)="aplicarFiltros()"
            >
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="pendiente">Pendiente</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-muted-foreground">Área académica</label>
            <input
              type="text"
              class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Área"
              [(ngModel)]="filtros.areaAcademica"
              (input)="aplicarFiltros()"
            />
          </div>
        </div>

        <div class="flex gap-2">
          <app-button variant="outline" (onClick)="limpiarFiltros()">
            Limpiar
          </app-button>
          <app-button variant="default" (onClick)="onAltaProfesor()">
            + Alta de profesor
          </app-button>
          <app-button variant="ghost" (onClick)="exportar()">
            <app-icon name="download" [size]="16" className="mr-1"></app-icon>
            Exportar
          </app-button>
        </div>
      </div>

      <!-- Tabla de profesores -->
      <div class="overflow-hidden rounded-xl border border-border bg-card">
        <table class="min-w-full divide-y divide-border">
          <thead class="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th class="px-4 py-3 text-left">Profesor</th>
              <th class="px-4 py-3 text-left">RFC</th>
              <th class="px-4 py-3 text-left">Área académica</th>
              <th class="px-4 py-3 text-left">Estatus</th>
              <th class="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border text-sm">
            <tr *ngFor="let profesor of profesoresFiltrados">
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {{ profesor.nombreCompleto.split(' ')[0][0] }}
                  </div>
                  <div>
                    <p class="font-medium">{{ profesor.nombreCompleto }}</p>
                    <p class="text-xs text-muted-foreground">{{ profesor.correo }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <p class="font-mono text-xs">{{ profesor.rfc }}</p>
                <p class="text-[10px] text-muted-foreground">CURP: {{ profesor.curp }}</p>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs text-muted-foreground">
                  {{ profesor.areaAcademica || 'Sin asignar' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                  [ngClass]="{
                    'bg-emerald-100 text-emerald-700': profesor.estatus === 'activo',
                    'bg-amber-100 text-amber-700': profesor.estatus === 'pendiente',
                    'bg-slate-100 text-slate-600': profesor.estatus === 'inactivo'
                  }"
                >
                  {{ profesor.estatus | titlecase }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <a
                  [routerLink]="['/profesor', profesor.id]"
                  class="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-secondary"
                >
                  <app-icon name="upRight" [size]="12"></app-icon>
                  Ver ficha
                </a>
              </td>
            </tr>
            <tr *ngIf="profesoresFiltrados.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-sm text-muted-foreground">
                No se encontraron profesores con los filtros seleccionados.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ProfesoresListComponent implements OnInit {
  profesores: Profesor[] = [];
  profesoresFiltrados: Profesor[] = [];

  filtros: {
    nombre?: string;
    rfc?: string;
    estatus?: string;
    areaAcademica?: string;
  } = {};

  constructor(
    private readonly profesoresService: ProfesoresService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.profesores = this.profesoresService.obtenerProfesores();
    this.profesoresFiltrados = [...this.profesores];
  }

  aplicarFiltros(): void {
    this.profesoresFiltrados = this.profesoresService.obtenerProfesores(this.filtros);
  }

  limpiarFiltros(): void {
    this.filtros = {};
    this.aplicarFiltros();
  }

  onAltaProfesor(): void {
    this.router.navigate(['/profesores/nuevo']);
  }

  exportar(): void {
    this.profesoresService.exportarAExcel();
  }
}

