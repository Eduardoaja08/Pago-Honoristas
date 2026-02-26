import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from '../../icon.component';

@Component({
  selector: 'app-busqueda-global',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="relative max-w-md flex-1">
      <app-icon
        name="search"
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        [size]="16"
      ></app-icon>
      <input
        type="text"
        [(ngModel)]="terminoBusqueda"
        (keyup.enter)="buscar()"
        (input)="onInput()"
        class="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        placeholder="Buscar profesor, RFC, CRN, folio o UUID..."
      />
      <kbd class="absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground md:inline-block">
        ⌘F
      </kbd>
    </div>
  `,
  styles: []
})
export class BusquedaGlobalComponent {
  @Output() buscarEvent = new EventEmitter<string>();

  terminoBusqueda = '';

  constructor(private router: Router) {}

  buscar(): void {
    if (this.terminoBusqueda.trim()) {
      this.buscarEvent.emit(this.terminoBusqueda.trim());
      // Navegar a página de resultados
      this.router.navigate(['/busqueda'], { queryParams: { q: this.terminoBusqueda } });
    }
  }

  onInput(): void {
    // Búsqueda en tiempo real opcional
  }
}
