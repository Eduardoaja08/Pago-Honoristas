import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { IconComponent } from './icon.component';
// import { PeriodoSelectorComponent } from './shared/periodo-selector/periodo-selector.component';
import { BusquedaGlobalComponent } from './shared/busqueda-global/busqueda-global.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProfesoresListComponent } from './modules/profesores/profesores-list.component';
import { ProfesorDetailComponent } from './modules/profesores/profesor-detail.component';
import { ProfesorWizardComponent } from './modules/profesores/profesor-wizard.component';
import { AsignacionAcademicaComponent } from './modules/asignacion-academica/asignacion-academica.component';
import { OperacionBancariaComponent } from './modules/operacion-bancaria/operacion-bancaria.component';
import { CalculoPagosComponent } from './modules/calculo-pagos/calculo-pagos.component';
import { CumplimientoFiscalComponent } from './modules/cumplimiento-fiscal/cumplimiento-fiscal.component';
import { ContabilidadReportesComponent } from './modules/contabilidad-reportes/contabilidad-reportes.component';
import { AdministracionComponent } from './modules/administracion/administracion.component';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: string;
}

type RolSistema = 'administracion' | 'finanzas' | 'profesor' | 'tesoreria';

interface UsuarioDemo {
  nombre: string;
  usuario: string;
  password: string;
  rol: RolSistema;
  correo: string;
}

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    IconComponent,
    // PeriodoSelectorComponent,
    BusquedaGlobalComponent,
    DashboardComponent,
    ProfesoresListComponent,
    ProfesorDetailComponent,
    ProfesorWizardComponent,
    AsignacionAcademicaComponent,
    OperacionBancariaComponent,
    CalculoPagosComponent,
    CumplimientoFiscalComponent,
    ContabilidadReportesComponent,
    AdministracionComponent
  ],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss'
})
export class DashboardShellComponent {
  readonly menuItemsBase: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard / Inicio', href: '/' },
    { icon: 'users', label: 'Profesores', href: '/profesores' },
    { icon: 'book', label: 'Asignación Académica', href: '/asignacion-academica' },
    { icon: 'analytics', label: 'Cálculo y Pagos', href: '/calculo-pagos' },
    { icon: 'settings', label: 'Cumplimiento Fiscal', href: '/cumplimiento-fiscal' },
    { icon: 'phone', label: 'Operación Bancaria', href: '/operacion-bancaria' },
    { icon: 'analytics', label: 'Contabilidad y Reportes', href: '/contabilidad-reportes' },
    { icon: 'settings', label: 'Administración', href: '/administracion' }
  ];

  readonly accesosPorRol: Record<RolSistema, string[]> = {
    administracion: ['/', '/profesores', '/profesor', '/profesores/nuevo', '/profesor/editar', '/asignacion-academica', '/administracion'],
    finanzas: ['/', '/profesores', '/profesor', '/calculo-pagos', '/cumplimiento-fiscal', '/contabilidad-reportes'],
    profesor: ['/', '/profesor', '/cumplimiento-fiscal'],
    tesoreria: ['/', '/profesor', '/operacion-bancaria', '/contabilidad-reportes']
  };

  readonly usuariosDemo: UsuarioDemo[] = [
    { nombre: 'Sandra Viña', usuario: 'admin.sandra', password: 'Admin2026*', rol: 'administracion', correo: 'sandra.vina@anahuac.mx' },
    { nombre: 'Marco Salas', usuario: 'finanzas.marco', password: 'Finanzas2026*', rol: 'finanzas', correo: 'marco.salas@anahuac.mx' },
    { nombre: 'Dra. Ana Torres', usuario: 'profesor.ana', password: 'Profesor2026*', rol: 'profesor', correo: 'ana.torres@anahuac.mx' },
    { nombre: 'Lucía Paredes', usuario: 'tesoreria.lucia', password: 'Tesoreria2026*', rol: 'tesoreria', correo: 'lucia.paredes@anahuac.mx' }
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
  readonly sesionActiva = signal(false);
  readonly usuarioActual = signal<UsuarioDemo | null>(null);
  readonly rolActual = signal<RolSistema | null>(null);
  readonly usuarioInput = signal('');
  readonly passwordInput = signal('');
  readonly errorLogin = signal('');
  readonly taskFilter = signal<'all' | 'active' | 'completed'>('all');
  readonly isMobileMenuOpen = signal(false);
  readonly elapsedSeconds = signal(24 * 3600 + 8);
  readonly isRunning = signal(true);

  readonly pageMap: Record<string, { title: string; description: string; cta?: string; secondary?: string; ctaOutline?: boolean }> = {
    '/': {
      title: 'Plataforma Pago a Honoristas',
      description: 'Orquesta todo el ciclo de pago: asignación académica, validación fiscal, CFDI, dispersión bancaria y cierre contable.',
      cta: '+ Registrar periodo',
      secondary: 'Importar insumos'
    },
    '/profesores': {
      title: 'Profesores',
      description: 'Gestiona el catálogo maestro de profesores.',
      cta: '+ Alta de profesor',
      secondary: 'Exportar a Excel'
    },
    '/profesor': {
      title: 'Ficha del profesor',
      description: 'Consulta la vista integral de datos, asignaciones, pagos y auditoría del profesor.'
    },
    '/profesores/nuevo': {
      title: 'Alta de profesor',
      description: 'Registra un nuevo profesor mediante un asistente guiado.'
    },
    '/profesor/editar': {
      title: 'Editar profesor',
      description: 'Modifica los datos del profesor.'
    },
    '/operacion-bancaria': {
      title: 'Operación Bancaria',
      description: 'Gestión de cuentas bancarias, generación de layouts para dispersión y conciliación con el banco.',
      cta: 'Generar dispersión',
      secondary: 'Conciliar archivo'
    },
    '/asignacion-academica': {
      title: 'Asignación Académica',
      description: 'Carga, mapa de asignaciones, consolidación y historial de versiones de insumo.'
    },
    '/calculo-pagos': {
      title: 'Cálculo y Pagos',
      description: 'Motor de cálculo para procesar pagos ordinarios y extraordinarios.',
      cta: 'Ejecutar cálculo',
      secondary: 'Ver bandeja'
    },
    '/cumplimiento-fiscal': {
      title: 'Cumplimiento Fiscal',
      description: 'Gestión de requisitos fiscales, contratos y timbrado de CFDIs.',
      cta: 'Validación masiva',
      secondary: 'Timbrar seleccionados'
    },
    '/contabilidad-reportes': {
      title: 'Contabilidad y Reportes',
      description: 'Cierre mensual, generación de pólizas contables y reportes ejecutivos.',
      cta: 'Generar reporte',
      secondary: 'Cerrar periodo'
    },
    '/administracion': {
      title: 'Administración y Configuración',
      description: 'Gestión de usuarios, roles, catálogos maestros y reglas de negocio del sistema.',
      cta: '+ Agregar usuario',
      secondary: 'Configurar ERP'
    },
    '/tasks': {
      title: 'Flujos operativos',
      description: 'Da seguimiento al avance de los 8 módulos críticos del proceso de pago.',
      cta: '+ Nueva gestión'
    },
    '/calendar': {
      title: 'Calendario de cierre',
      description: 'Controla hitos clave por periodo: validaciones, timbrado, dispersión y póliza contable.',
      cta: '+ Agendar hito'
    },
    '/analytics': {
      title: 'Indicadores de operación',
      description: 'Monitorea productividad, cumplimiento fiscal y tiempos de procesamiento.',
      cta: 'Exportar reporte',
      ctaOutline: true
    },
    '/team': {
      title: 'Áreas participantes',
      description: 'Visualiza responsables, estatus y carga operativa por área.',
      cta: '+ Asignar responsable'
    },
    '/settings': {
      title: 'Configuración',
      description: 'Administra parámetros de negocio, seguridad y catálogos de operación.'
    },
    '/help': {
      title: 'Soporte y adopción',
      description: 'Consulta guías rápidas para operar la plataforma y resolver incidencias.'
    },
    '/logout': {
      title: 'Cerrar sesión',
      description: ''
    }
  };

  readonly pageInfo = computed(() => this.pageMap[this.routePath()] ?? this.pageMap['/']);
  readonly menuItems = computed(() => {
    const rol = this.rolActual();
    if (!rol) {
      return this.menuItemsBase;
    }
    const permitidos = this.accesosPorRol[rol];
    return this.menuItemsBase.filter(item => permitidos.includes(item.href));
  });

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
    this.recuperarSesion();
    this.routePath.set(this.normalizePath(this.router.url));
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.routePath.set(this.normalizePath(this.router.url));
      this.isMobileMenuOpen.set(false);

      const actual = this.routePath();
      if (this.sesionActiva() && !this.tieneAcceso(actual)) {
        this.router.navigateByUrl('/');
      }
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

  private normalizePath(url: string): string {
    const path = url.split('?')[0] || '/';
    const segments = path.split('/').filter(Boolean);
    if (!segments.length) {
      return '/';
    }

    if (segments[0] === 'profesor' && segments[2] === 'editar') {
      return '/profesor/editar';
    }

    if (segments[0] === 'profesor') {
      return '/profesor';
    }

    if (segments[0] === 'profesores' && segments[1] === 'nuevo') {
      return '/profesores/nuevo';
    }

    return `/${segments[0]}`;
  }

  onPeriodoChange(periodoId: number): void {
    // Actualizar período global - afecta todas las vistas
    console.log('Período cambiado:', periodoId);
    // Aquí se actualizaría el servicio de período global
  }

  onBuscar(termino: string): void {
    // Manejar búsqueda global
    console.log('Buscando:', termino);
  }

  login(): void {
    const usuario = this.usuariosDemo.find(
      item => item.usuario === this.usuarioInput().trim() && item.password === this.passwordInput().trim()
    );

    if (!usuario) {
      this.errorLogin.set('Credenciales inválidas. Usa uno de los usuarios demo publicados.');
      return;
    }

    this.errorLogin.set('');
    this.sesionActiva.set(true);
    this.usuarioActual.set(usuario);
    this.rolActual.set(usuario.rol);
    localStorage.setItem('honoristas-demo-session', JSON.stringify(usuario));

    const destino = usuario.rol === 'administracion'
      ? '/administracion'
      : usuario.rol === 'finanzas'
      ? '/calculo-pagos'
      : usuario.rol === 'profesor'
      ? '/cumplimiento-fiscal'
      : '/operacion-bancaria';

    this.router.navigateByUrl(destino);
  }

  logout(): void {
    this.sesionActiva.set(false);
    this.usuarioActual.set(null);
    this.rolActual.set(null);
    this.usuarioInput.set('');
    this.passwordInput.set('');
    localStorage.removeItem('honoristas-demo-session');
    this.router.navigateByUrl('/');
  }

  setUsuario(valor: string): void {
    this.usuarioInput.set(valor);
  }

  setPassword(valor: string): void {
    this.passwordInput.set(valor);
  }

  private recuperarSesion(): void {
    const raw = localStorage.getItem('honoristas-demo-session');
    if (!raw) {
      return;
    }

    try {
      const usuario = JSON.parse(raw) as UsuarioDemo;
      const existe = this.usuariosDemo.find(item => item.usuario === usuario.usuario);
      if (!existe) {
        localStorage.removeItem('honoristas-demo-session');
        return;
      }
      this.sesionActiva.set(true);
      this.usuarioActual.set(existe);
      this.rolActual.set(existe.rol);
    } catch {
      localStorage.removeItem('honoristas-demo-session');
    }
  }

  private tieneAcceso(path: string): boolean {
    const rol = this.rolActual();
    if (!rol) {
      return false;
    }
    return this.accesosPorRol[rol].includes(path);
  }
}
