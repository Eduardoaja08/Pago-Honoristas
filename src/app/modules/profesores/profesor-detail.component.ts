import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProfesoresService } from '../../services';
import { Profesor } from '../../models';

@Component({
  selector: 'app-profesor-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <ng-container *ngIf="profesor; else notFound">
      <div class="space-y-5">
        <!-- Encabezado -->
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {{ profesor.nombreCompleto.split(' ')[0][0] }}
            </div>
            <div>
              <h2 class="text-xl font-semibold">{{ profesor.nombreCompleto }}</h2>
              <p class="text-xs text-muted-foreground">
                RFC: {{ profesor.rfc }} · CURP: {{ profesor.curp }}
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <a routerLink="/profesores" class="rounded-lg border border-border bg-transparent px-3 py-2 text-xs">
              Volver al listado
            </a>
            <button
              type="button"
              class="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
              (click)="editar()"
            >
              Editar profesor
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div>
          <div class="flex flex-wrap gap-2 border-b border-border pb-2 text-xs">
            <button
              class="rounded-full px-3 py-1"
              [ngClass]="tab === 'generales' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
              (click)="tab = 'generales'"
            >
              Datos generales
            </button>
            <button
              class="rounded-full px-3 py-1"
              [ngClass]="tab === 'fiscal' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
              (click)="tab = 'fiscal'"
            >
              Datos fiscales y bancarios
            </button>
            <button
              class="rounded-full px-3 py-1"
              [ngClass]="tab === 'documentos' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
              (click)="tab = 'documentos'"
            >
              Documentos
            </button>
            <button
              class="rounded-full px-3 py-1"
              [ngClass]="tab === 'asignaciones' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
              (click)="tab = 'asignaciones'"
            >
              Asignaciones y pagos
            </button>
            <button
              class="rounded-full px-3 py-1"
              [ngClass]="tab === 'auditoria' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
              (click)="tab = 'auditoria'"
            >
              Línea de tiempo
            </button>
          </div>

          <!-- Contenido de tabs -->
          <div class="mt-4 space-y-4">
            <!-- Datos generales -->
            <div *ngIf="tab === 'generales'" class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2 rounded-2xl border border-border bg-card p-4">
                <h3 class="text-sm font-semibold">Datos generales</h3>
                <div class="text-xs text-muted-foreground space-y-1">
                  <p><span class="font-medium text-foreground">Nombre:</span> {{ profesor.nombreCompleto }}</p>
                  <p><span class="font-medium text-foreground">Correo:</span> {{ profesor.correo }}</p>
                  <p><span class="font-medium text-foreground">Teléfono:</span> {{ profesor.telefono }}</p>
                  <p><span class="font-medium text-foreground">Dirección:</span> {{ profesor.direccion }}</p>
                  <p><span class="font-medium text-foreground">Área académica:</span> {{ profesor.areaAcademica || 'Sin asignar' }}</p>
                </div>
              </div>
              <div class="space-y-2 rounded-2xl border border-border bg-card p-4">
                <h3 class="text-sm font-semibold">Estatus</h3>
                <span
                  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                  [ngClass]="{
                    'bg-emerald-100 text-emerald-700': profesor.estatus === 'activo',
                    'bg-amber-100 text-amber-700': profesor.estatus === 'pendiente',
                    'bg-slate-100 text-slate-600': profesor.estatus === 'inactivo'
                  }"
                >
                  {{ profesor.estatus | titlecase }}
                </span>
              </div>
            </div>

            <!-- Datos fiscales y bancarios -->
            <div *ngIf="tab === 'fiscal'" class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2 rounded-2xl border border-border bg-card p-4">
                <h3 class="text-sm font-semibold">Datos fiscales</h3>
                <div class="text-xs text-muted-foreground space-y-1" *ngIf="profesor.datosFiscales; else noFiscal">
                  <p><span class="font-medium text-foreground">Régimen fiscal:</span> {{ profesor.datosFiscales.regimenFiscal }}</p>
                  <p><span class="font-medium text-foreground">RFC:</span> {{ profesor.datosFiscales.rfc }}</p>
                  <p>
                    <span class="font-medium text-foreground">Validado por tesorería:</span>
                    {{ profesor.datosFiscales.validadoPorTesoreria ? 'Sí' : 'No' }}
                  </p>
                </div>
                <ng-template #noFiscal>
                  <p class="text-xs text-muted-foreground">Sin datos fiscales capturados.</p>
                </ng-template>
              </div>

              <div class="space-y-2 rounded-2xl border border-border bg-card p-4">
                <h3 class="text-sm font-semibold">Datos bancarios</h3>
                <div class="text-xs text-muted-foreground space-y-1" *ngIf="profesor.datosBancarios; else noBancario">
                  <p><span class="font-medium text-foreground">CLABE:</span> {{ profesor.datosBancarios.clabe }}</p>
                  <p><span class="font-medium text-foreground">Banco:</span> {{ profesor.datosBancarios.banco }}</p>
                  <p><span class="font-medium text-foreground">Cuenta de confirmación:</span> {{ profesor.datosBancarios.cuentaConfirmacion }}</p>
                  <p>
                    <span class="font-medium text-foreground">Validada por tesorería:</span>
                    {{ profesor.datosBancarios.validado ? 'Sí' : 'No' }}
                  </p>
                  <div *ngIf="profesor.datosBancarios.historico?.length" class="mt-2 border-t border-border pt-2">
                    <p class="font-medium text-foreground mb-1">Histórico de cuentas</p>
                    <div *ngFor="let cta of profesor.datosBancarios.historico" class="flex justify-between text-[11px]">
                      <span>{{ cta.banco }} · {{ cta.clabe }}</span>
                      <span>{{ cta.fechaInicio | date:'shortDate' }}{{ cta.activa ? ' (activa)' : '' }}</span>
                    </div>
                  </div>
                </div>
                <ng-template #noBancario>
                  <p class="text-xs text-muted-foreground">Sin datos bancarios capturados.</p>
                </ng-template>
              </div>
            </div>

            <!-- Documentos -->
            <div *ngIf="tab === 'documentos'" class="space-y-3 rounded-2xl border border-border bg-card p-4">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold">Documentos</h3>
                <button class="rounded-lg border border-border px-3 py-1.5 text-xs">
                  Subir documento
                </button>
              </div>
              <div *ngIf="profesor.documentos?.length; else noDocs" class="space-y-2 text-xs">
                <div
                  *ngFor="let doc of profesor.documentos"
                  class="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <div>
                    <p class="font-medium text-foreground">{{ doc.nombre }}</p>
                    <p class="text-[11px] text-muted-foreground">
                      {{ doc.tipo }} · Subido: {{ doc.fechaSubida | date:'shortDate' }}
                    </p>
                  </div>
                  <span
                    class="rounded-full px-2 py-0.5 text-[10px] font-medium"
                    [ngClass]="doc.vigente ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
                  >
                    {{ doc.vigente ? 'Vigente' : 'Vencido' }}
                  </span>
                </div>
              </div>
              <ng-template #noDocs>
                <p class="text-xs text-muted-foreground">Sin documentos registrados.</p>
              </ng-template>
            </div>

            <!-- Asignaciones y pagos -->
            <div *ngIf="tab === 'asignaciones'" class="space-y-4">
              <div class="rounded-2xl border border-border bg-card p-4">
                <h3 class="mb-3 text-sm font-semibold">Asignaciones (materias impartidas)</h3>
                <div class="overflow-x-auto">
                  <table class="min-w-full text-xs">
                    <thead class="border-b border-border text-left text-muted-foreground">
                      <tr>
                        <th class="pb-2 pr-3">CRN</th>
                        <th class="pb-2 pr-3">Materia</th>
                        <th class="pb-2 pr-3">Programa</th>
                        <th class="pb-2 pr-3">Centro costos</th>
                        <th class="pb-2 pr-3">Alumnos</th>
                        <th class="pb-2">Estatus</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                      <tr *ngFor="let a of (profesor.asignaciones || [])">
                        <td class="py-2 pr-3 font-mono">{{ a.crn }}</td>
                        <td class="py-2 pr-3 font-medium">{{ a.materia }}</td>
                        <td class="py-2 pr-3">{{ a.programa }}</td>
                        <td class="py-2 pr-3">{{ a.centroCostos }}</td>
                        <td class="py-2 pr-3">{{ a.alumnos }}</td>
                        <td class="py-2">
                          <span class="rounded-full px-2 py-0.5 bg-emerald-100 text-emerald-700">{{ a.estatus }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="rounded-2xl border border-border bg-card p-4">
                <h3 class="mb-3 text-sm font-semibold">Pagos recibidos</h3>
                <div class="overflow-x-auto">
                  <table class="min-w-full text-xs">
                    <thead class="border-b border-border text-left text-muted-foreground">
                      <tr>
                        <th class="pb-2 pr-3">Folio</th>
                        <th class="pb-2 pr-3">Monto</th>
                        <th class="pb-2 pr-3">Forma pago</th>
                        <th class="pb-2 pr-3">Estatus</th>
                        <th class="pb-2">Fecha pago</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                      <tr *ngFor="let p of (profesor.pagos || [])">
                        <td class="py-2 pr-3 font-mono">{{ p.folio }}</td>
                        <td class="py-2 pr-3">{{ p.montoTotal | currency:'MXN':'symbol-narrow' }}</td>
                        <td class="py-2 pr-3">{{ p.formaPago }}</td>
                        <td class="py-2 pr-3">
                          <span class="rounded-full px-2 py-0.5" [ngClass]="{
                            'bg-emerald-100 text-emerald-700': p.estatus === 'pagado',
                            'bg-amber-100 text-amber-700': p.estatus === 'en_fiscal' || p.estatus === 'validado'
                          }">{{ p.estatus }}</span>
                        </td>
                        <td class="py-2">{{ p.fechaPago ? (p.fechaPago | date:'shortDate') : '—' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Auditoría -->
            <div *ngIf="tab === 'auditoria'" class="rounded-2xl border border-border bg-card p-4">
              <h3 class="mb-4 text-sm font-semibold">Línea de tiempo (auditoría)</h3>
              <div class="space-y-0">
                <div
                  *ngFor="let item of (profesor.auditoria || []); let last = last"
                  class="flex gap-3"
                >
                  <div class="flex flex-col items-center">
                    <div class="h-3 w-3 rounded-full bg-primary"></div>
                    <div *ngIf="!last" class="w-px flex-1 min-h-[24px] bg-border"></div>
                  </div>
                  <div class="pb-4 flex-1">
                    <p class="text-xs font-medium text-foreground">{{ item.accion }}</p>
                    <p class="text-[11px] text-muted-foreground">
                      {{ item.usuario }} · {{ item.fecha | date:'medium' }}
                    </p>
                    <p *ngIf="item.campo" class="text-[11px] text-muted-foreground mt-1">
                      {{ item.campo }}:
                      <span *ngIf="item.valorAnterior"> «{{ item.valorAnterior }}»</span>
                      <span *ngIf="item.valorNuevo"> → «{{ item.valorNuevo }}»</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-container>

    <ng-template #notFound>
      <div class="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Profesor no encontrado.
      </div>
    </ng-template>
  `
})
export class ProfesorDetailComponent implements OnInit {
  profesor: Profesor | undefined;
  tab: 'generales' | 'fiscal' | 'documentos' | 'asignaciones' | 'auditoria' = 'generales';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly profesoresService: ProfesoresService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.profesor = this.profesoresService.obtenerProfesorParaDetalle(id);
    }
  }

  editar(): void {
    if (this.profesor) {
      this.router.navigate(['/profesor', this.profesor.id, 'editar']);
    }
  }
}

