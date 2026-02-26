import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministracionService } from '../../services';
import { Periodo } from '../../models';
import { IconComponent } from '../../icon.component';

@Component({
  selector: 'app-periodo-selector',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="relative">
      <select
        [value]="periodoSeleccionado"
        (change)="onPeriodoChange($event)"
        class="h-9 rounded-lg border border-border bg-card px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        @for (periodo of periodos; track periodo.id) {
          <option [value]="periodo.id">{{ periodo.nombre }}</option>
        }
      </select>
      <app-icon
        name="chevronDown"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
        [size]="16"
      ></app-icon>
    </div>
  `,
  styles: []
})
export class PeriodoSelectorComponent {
  @Input() periodoSeleccionado: number | null = null;
  @Output() periodoChange = new EventEmitter<number>();

  periodos: Periodo[] = [];

  constructor(private administracionService: AdministracionService) {
    this.periodos = this.administracionService.obtenerPeriodos();
    if (this.periodos.length > 0 && !this.periodoSeleccionado) {
      const activo = this.periodos.find(p => p.activo);
      this.periodoSeleccionado = activo?.id || this.periodos[0].id;
    }
  }

  onPeriodoChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const periodoId = parseInt(target.value);
    this.periodoSeleccionado = periodoId;
    this.periodoChange.emit(periodoId);
  }
}
