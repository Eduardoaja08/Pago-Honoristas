import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfesoresService } from '../../services';

@Component({
  selector: 'app-profesor-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-5">
      <!-- Encabezado -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold">{{ esEdicion ? 'Editar profesor' : 'Alta de profesor' }}</h2>
          <p class="text-xs text-muted-foreground">
            {{ esEdicion ? 'Modifica los datos del profesor.' : 'Asistente paso a paso: datos personales, fiscales, bancarios y documentos.' }}
          </p>
        </div>
      </div>

      <!-- Pasos -->
      <div class="flex flex-wrap gap-3 text-xs">
        <div
          *ngFor="let paso of pasos; index as i"
          class="flex items-center gap-2"
        >
          <div
            class="flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold"
            [ngClass]="{
              'bg-primary text-primary-foreground border-primary': pasoActual === i + 1,
              'bg-card text-muted-foreground border-border': pasoActual !== i + 1
            }"
          >
            {{ i + 1 }}
          </div>
          <div class="hidden flex-col text-[11px] sm:flex">
            <span class="font-medium" [ngClass]="{ 'text-foreground': pasoActual === i + 1, 'text-muted-foreground': pasoActual !== i + 1 }">
              {{ paso.titulo }}
            </span>
            <span class="text-[10px] text-muted-foreground">{{ paso.descripcion }}</span>
          </div>
        </div>
      </div>

      <!-- Contenido del paso -->
      <form [formGroup]="form" class="space-y-4" (ngSubmit)="onSubmit()">
        <!-- Paso 1: Datos personales -->
        <div *ngIf="pasoActual === 1" class="grid gap-4 md:grid-cols-2">
          <div class="space-y-1 text-xs">
            <label class="font-medium text-foreground">Nombre completo</label>
            <input class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm" formControlName="nombreCompleto" />
          </div>
          <div class="space-y-1 text-xs">
            <label class="font-medium text-foreground">RFC</label>
            <input class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm" formControlName="rfc" />
          </div>
          <div class="space-y-1 text-xs">
            <label class="font-medium text-foreground">CURP</label>
            <input class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm" formControlName="curp" />
          </div>
          <div class="space-y-1 text-xs">
            <label class="font-medium text-foreground">Correo</label>
            <input type="email" class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm" formControlName="correo" />
          </div>
          <div class="space-y-1 text-xs">
            <label class="font-medium text-foreground">Teléfono</label>
            <input class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm" formControlName="telefono" />
          </div>
          <div class="space-y-1 text-xs md:col-span-2">
            <label class="font-medium text-foreground">Dirección</label>
            <input class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm" formControlName="direccion" />
          </div>
        </div>

        <!-- Paso 2: Datos fiscales -->
        <div *ngIf="pasoActual === 2" class="grid gap-4 md:grid-cols-2 text-xs">
          <div class="space-y-1">
            <label class="font-medium text-foreground">Régimen fiscal</label>
            <input class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm" formControlName="regimenFiscal" />
          </div>
          <div class="space-y-1">
            <label class="font-medium text-foreground">RFC fiscal</label>
            <input class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm" formControlName="rfcFiscal" />
          </div>
        </div>

        <!-- Paso 3: Datos bancarios -->
        <div *ngIf="pasoActual === 3" class="grid gap-4 md:grid-cols-2 text-xs">
          <div class="space-y-1">
            <label class="font-medium text-foreground">CLABE</label>
            <input class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm" formControlName="clabe" />
          </div>
          <div class="space-y-1">
            <label class="font-medium text-foreground">Banco</label>
            <input class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm" formControlName="banco" />
          </div>
          <div class="space-y-1 md:col-span-2">
            <label class="font-medium text-foreground">Cuenta de confirmación</label>
            <input class="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm" formControlName="cuentaConfirmacion" />
          </div>
        </div>

        <!-- Paso 4: Documentos -->
        <div *ngIf="pasoActual === 4" class="space-y-3 text-xs">
          <p class="text-muted-foreground">
            Aquí se podrán cargar la identificación oficial, constancia fiscal y comprobante de domicilio.
          </p>
          <div class="rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center text-xs text-muted-foreground">
            Arrastra y suelta documentos aquí o haz clic para seleccionar archivos.
          </div>
        </div>

        <!-- Paso 5: Revisión -->
        <div *ngIf="pasoActual === 5" class="space-y-3 text-xs">
          <h3 class="text-sm font-semibold">Resumen</h3>
          <div class="grid gap-3 md:grid-cols-2">
            <div class="space-y-1 rounded-2xl border border-border bg-card p-3">
              <p class="font-medium text-foreground">Datos personales</p>
              <p>{{ form.value.nombreCompleto }}</p>
              <p class="text-muted-foreground">RFC: {{ form.value.rfc }}</p>
              <p class="text-muted-foreground">CURP: {{ form.value.curp }}</p>
            </div>
            <div class="space-y-1 rounded-2xl border border-border bg-card p-3">
              <p class="font-medium text-foreground">Fiscales y bancarios</p>
              <p class="text-muted-foreground">Régimen: {{ form.value.regimenFiscal }}</p>
              <p class="text-muted-foreground">CLABE: {{ form.value.clabe }}</p>
              <p class="text-muted-foreground">Banco: {{ form.value.banco }}</p>
            </div>
          </div>
        </div>

        <!-- Navegación de pasos -->
        <div class="flex items-center justify-between pt-3">
          <button
            type="button"
            class="rounded-lg border border-border px-3 py-2 text-xs"
            [disabled]="pasoActual === 1"
            (click)="anteriorPaso()"
          >
            Anterior
          </button>

          <div class="flex gap-2">
            <button
              *ngIf="pasoActual < pasos.length"
              type="button"
              class="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
              (click)="siguientePaso()"
            >
              Siguiente
            </button>
            <button
              *ngIf="pasoActual === pasos.length"
              type="submit"
              class="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
            >
              {{ esEdicion ? 'Guardar cambios' : 'Guardar profesor' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  `
})
export class ProfesorWizardComponent implements OnInit {
  pasoActual = 1;
  esEdicion = false;
  profesorId: number | null = null;

  pasos = [
    { titulo: 'Datos personales', descripcion: 'Nombre, RFC, CURP y contacto.' },
    { titulo: 'Datos fiscales', descripcion: 'Régimen fiscal y RFC.' },
    { titulo: 'Datos bancarios', descripcion: 'CLABE y banco.' },
    { titulo: 'Documentos', descripcion: 'Identificación, constancia fiscal, comprobante.' },
    { titulo: 'Revisión', descripcion: 'Confirmar y guardar.' }
  ];

  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly profesoresService: ProfesoresService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombreCompleto: ['', Validators.required],
      rfc: ['', Validators.required],
      curp: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      regimenFiscal: [''],
      rfcFiscal: [''],
      clabe: [''],
      banco: [''],
      cuentaConfirmacion: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.profesorId = Number(id);
      this.esEdicion = true;
      const p = this.profesoresService.obtenerProfesorPorId(this.profesorId);
      if (p) {
        this.form.patchValue({
          nombreCompleto: p.nombreCompleto,
          rfc: p.rfc,
          curp: p.curp,
          correo: p.correo,
          telefono: p.telefono ?? '',
          direccion: p.direccion ?? '',
          regimenFiscal: p.datosFiscales?.regimenFiscal ?? '',
          rfcFiscal: p.datosFiscales?.rfc ?? p.rfc,
          clabe: p.datosBancarios?.clabe ?? '',
          banco: p.datosBancarios?.banco ?? '',
          cuentaConfirmacion: p.datosBancarios?.cuentaConfirmacion ?? ''
        });
      }
    }
  }

  siguientePaso(): void {
    if (this.pasoActual < this.pasos.length) {
      this.pasoActual++;
    }
  }

  anteriorPaso(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const valores = this.form.value;
    const payload = {
      nombreCompleto: valores.nombreCompleto,
      rfc: valores.rfc,
      curp: valores.curp,
      correo: valores.correo,
      telefono: valores.telefono,
      direccion: valores.direccion,
      estatus: this.esEdicion ? undefined : ('pendiente' as const),
      datosFiscales: {
        regimenFiscal: valores.regimenFiscal,
        rfc: valores.rfcFiscal || valores.rfc,
        validadoPorTesoreria: false
      },
      datosBancarios: {
        clabe: valores.clabe,
        banco: valores.banco,
        cuentaConfirmacion: valores.cuentaConfirmacion,
        validado: false
      }
    };

    if (this.esEdicion && this.profesorId != null) {
      this.profesoresService.actualizarProfesor(this.profesorId, payload);
      this.router.navigate(['/profesor', this.profesorId]);
    } else {
      const creado = this.profesoresService.crearProfesor(payload);
      this.router.navigate(['/profesores']);
    }
  }
}

