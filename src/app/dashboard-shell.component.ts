import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { IconComponent } from './icon.component';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: string;
}

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss'
})
export class DashboardShellComponent {
  readonly menuItems: NavItem[] = [
    { icon: 'dashboard', label: 'Resumen', href: '/' },
    { icon: 'task', label: 'Flujos', badge: '8', href: '/tasks' },
    { icon: 'calendar', label: 'Calendario', href: '/calendar' },
    { icon: 'analytics', label: 'Indicadores', href: '/analytics' },
    { icon: 'users', label: 'Equipo', href: '/team' }
  ];

  readonly generalItems: NavItem[] = [
    { icon: 'settings', label: 'Configuración', href: '/settings' },
    { icon: 'help', label: 'Soporte', href: '/help' },
    { icon: 'logout', label: 'Salir', href: '/logout' }
  ];

  readonly statsCards = [
    { title: 'Honoristas activos', value: '1,248', increase: '+7% vs periodo anterior', bg: 'bg-primary text-primary-foreground' },
    { title: 'Pagos timbrados', value: '932', increase: 'Cierre parcial del mes', bg: 'bg-card text-foreground' },
    { title: 'Validaciones fiscales', value: '184', increase: 'Sin incidencias críticas', bg: 'bg-card text-foreground' },
    { title: 'Pendientes de autorización', value: '27', increase: 'En revisión de Finanzas', bg: 'bg-card text-foreground' }
  ];

  readonly tasks = [
    { id: 1, title: 'Sincronizar asignaciones con Banner', project: 'Módulo 2 · Planeación', priority: 'High', dueDate: '24 Nov, 2024', completed: false, tags: ['Integración', 'Académico'] },
    { id: 2, title: 'Validar constancias fiscales vigentes', project: 'Módulo 5 · Cumplimiento', priority: 'High', dueDate: '25 Nov, 2024', completed: false, tags: ['Fiscal', 'SAT'] },
    { id: 3, title: 'Aprobar reglas de cálculo de honorarios', project: 'Módulo 4 · Motor de cálculo', priority: 'Medium', dueDate: '23 Nov, 2024', completed: true, tags: ['Finanzas', 'Reglas'] },
    { id: 4, title: 'Publicar layout bancario para dispersión', project: 'Módulo 7 · Pagos', priority: 'Low', dueDate: '26 Nov, 2024', completed: false, tags: ['Tesorería', 'SPEI'] }
  ];

  readonly teamMembers = ['Coordinación Académica', 'Finanzas', 'Fiscal y Legal', 'TI Institucional'];
  readonly helpCategories = ['Guía de módulos', 'Capacitación en video', 'Mesa de control', 'Contacto operativo'];
  readonly daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  readonly monthData = [45, 52, 48, 61, 55, 67];

  readonly routePath = signal('/');
  readonly taskFilter = signal<'all' | 'active' | 'completed'>('all');
  readonly isMobileMenuOpen = signal(false);
  readonly elapsedSeconds = signal(24 * 3600 + 8);
  readonly isRunning = signal(true);

  readonly pageMap: Record<string, { title: string; description: string; cta?: string; secondary?: string; ctaOutline?: boolean }> = {
    '/': { title: 'Plataforma Pago a Honoristas', description: 'Orquesta todo el ciclo de pago: asignación académica, validación fiscal, CFDI, dispersión bancaria y cierre contable.', cta: '+ Registrar periodo', secondary: 'Importar insumos' },
    '/tasks': { title: 'Flujos operativos', description: 'Da seguimiento al avance de los 8 módulos críticos del proceso de pago.', cta: '+ Nueva gestión' },
    '/calendar': { title: 'Calendario de cierre', description: 'Controla hitos clave por periodo: validaciones, timbrado, dispersión y póliza contable.', cta: '+ Agendar hito' },
    '/analytics': { title: 'Indicadores de operación', description: 'Monitorea productividad, cumplimiento fiscal y tiempos de procesamiento.', cta: 'Exportar reporte', ctaOutline: true },
    '/team': { title: 'Áreas participantes', description: 'Visualiza responsables, estatus y carga operativa por área.', cta: '+ Asignar responsable' },
    '/settings': { title: 'Configuración', description: 'Administra parámetros de negocio, seguridad y catálogos de operación.' },
    '/help': { title: 'Soporte y adopción', description: 'Consulta guías rápidas para operar la plataforma y resolver incidencias.' },
    '/logout': { title: 'Cerrar sesión', description: '' }
  };

  readonly pageInfo = computed(() => this.pageMap[this.routePath()] ?? this.pageMap['/']);

  readonly filteredTasks = computed(() => {
    if (this.taskFilter() === 'completed') {
      return this.tasks.filter((task) => task.completed);
    }
    if (this.taskFilter() === 'active') {
      return this.tasks.filter((task) => !task.completed);
    }
    return this.tasks;
  });

  readonly timerText = computed(() => {
    const total = this.elapsedSeconds();
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const format = (value: number): string => String(value).padStart(2, '0');
    return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
  });

  constructor(private readonly router: Router) {
    this.routePath.set(this.router.url.split('?')[0] || '/');
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.routePath.set(this.router.url.split('?')[0] || '/');
      this.isMobileMenuOpen.set(false);
    });

    setInterval(() => {
      if (this.isRunning()) {
        this.elapsedSeconds.update((value) => value + 1);
      }
    }, 1000);
  }

  setFilter(filterValue: 'all' | 'active' | 'completed'): void {
    this.taskFilter.set(filterValue);
  }

  toggleTimer(): void {
    this.isRunning.update((value) => !value);
  }

  resetTimer(): void {
    this.elapsedSeconds.set(0);
    this.isRunning.set(false);
  }
}
