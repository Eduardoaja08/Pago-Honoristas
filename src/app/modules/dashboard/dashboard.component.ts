import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services';
import { KPI, GraficaAvance, TareaPendiente, IncidenciaCritica } from '../../models';
import { IconComponent } from '../../icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="space-y-6">
      <!-- KPIs principales -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        @for (kpi of kpis; track kpi.titulo) {
          <article class="rounded-2xl border border-border bg-[#dd5400] p-6 shadow-lg">
            <div class="mb-3 flex items-start justify-between">
              <h3 class="text-sm font-medium text-white">{{ kpi.titulo }}</h3>
              <app-icon name="upRight" [size]="16" className="text-white"></app-icon>
            </div>
            <p class="mb-2 text-3xl font-bold text-white">{{ kpi.valor }}</p>
            @if (kpi.cambio) {
              <div class="flex items-center gap-1.5 text-xs">
                <app-icon 
                  [name]="kpi.tendencia === 'ascendente' ? 'trendUp' : 'trendDown'" 
                  [size]="12"
                  [color]="kpi.tendencia === 'ascendente' ? '#fff' : '#fff'"
                ></app-icon>
                <span class="text-white">
                  {{ kpi.cambio }}
                </span>
              </div>
            }
          </article>
        }
      </div>

      <!-- Gráfica de avance por etapa -->
      <article class="rounded-2xl border border-border bg-card p-6">
        <h2 class="mb-6 text-xl font-semibold">Avance por Etapa del Proceso</h2>
        <div class="space-y-4">
          @for (etapa of graficaAvance; track etapa.etapa) {
            <div>
              <div class="mb-2 flex justify-between text-sm">
                <span class="font-medium">{{ etapa.etapa }}</span>
                <span>{{ etapa.cantidad }} ({{ etapa.porcentaje }}%)</span>
              </div>
              <div class="h-3 rounded-full bg-muted">
                <div 
                  class="h-full rounded-full transition-all duration-500"
                  [style.width.%]="etapa.porcentaje"
                  [style.background-color]="etapa.color"
                ></div>
              </div>
            </div>
          }
        </div>
      </article>

      <!-- Tareas pendientes -->
      <article class="rounded-2xl border border-border bg-card p-6">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-semibold">Tareas Pendientes</h2>
          <button class="rounded-lg border border-border bg-transparent px-3 py-1.5 text-sm">
            Ver todas
          </button>
        </div>
        <div class="space-y-3">
          @for (tarea of tareasPendientes; track tarea.id) {
            <div class="flex items-start gap-4 rounded-lg border border-border p-4 hover:bg-secondary">
              <div class="flex-1">
                <h3 class="mb-1 font-semibold">{{ tarea.titulo }}</h3>
                <p class="mb-2 text-sm text-muted-foreground">{{ tarea.descripcion }}</p>
                <div class="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{{ tarea.modulo }}</span>
                  @if (tarea.fechaLimite) {
                    <span>• Vence: {{ tarea.fechaLimite | date:'short' }}</span>
                  }
                </div>
              </div>
              <span 
                class="rounded-full px-2 py-1 text-xs font-medium"
                [class.bg-red-100]="tarea.prioridad === 'alta'"
                [class.text-red-700]="tarea.prioridad === 'alta'"
                [class.bg-yellow-100]="tarea.prioridad === 'media'"
                [class.text-yellow-700]="tarea.prioridad === 'media'"
                [class.bg-blue-100]="tarea.prioridad === 'baja'"
                [class.text-blue-700]="tarea.prioridad === 'baja'"
              >
                {{ tarea.prioridad | titlecase }}
              </span>
            </div>
          }
        </div>
      </article>

      <!-- Incidencias críticas -->
      @if (incidenciasCriticas.length > 0) {
        <article class="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 class="mb-4 text-xl font-semibold text-red-900">Incidencias Críticas</h2>
          <div class="space-y-3">
            @for (incidencia of incidenciasCriticas; track incidencia.id) {
              <div class="rounded-lg border border-red-200 bg-white p-4">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="mb-1 font-semibold text-red-900">{{ incidencia.titulo }}</h3>
                    <p class="text-sm text-red-700">{{ incidencia.descripcion }}</p>
                    <span class="mt-2 inline-block text-xs text-red-600">
                      {{ incidencia.fecha | date:'short' }}
                    </span>
                  </div>
                  @if (!incidencia.resuelta) {
                    <span class="rounded-full bg-red-600 px-2 py-1 text-xs font-medium text-white">
                      Pendiente
                    </span>
                  }
                </div>
              </div>
            }
          </div>
        </article>
      }
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  kpis: KPI[] = [];
  graficaAvance: GraficaAvance[] = [];
  tareasPendientes: TareaPendiente[] = [];
  incidenciasCriticas: IncidenciaCritica[] = [];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.kpis = this.dashboardService.obtenerKPIs();
    this.graficaAvance = this.dashboardService.obtenerGraficaAvance();
    this.tareasPendientes = this.dashboardService.obtenerTareasPendientes();
    this.incidenciasCriticas = this.dashboardService.obtenerIncidenciasCriticas();
  }
}
