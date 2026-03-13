import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { IconComponent } from './icon.component';

type RolSistema = 'administracion' | 'finanzas' | 'profesor' | 'tesoreria';
type TipoInsumo = 'pagos' | 'profesores';

interface UsuarioDemo {
  nombre: string;
  usuario: string;
  password: string;
  rol: RolSistema;
  correo: string;
}

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss'
})
export class DashboardShellComponent {
  readonly menuAdministracion: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard Administración', href: '/administracion/dashboard' },
    { icon: 'book', label: 'Insumo para pagos', href: '/administracion/insumo-pagos' },
    { icon: 'users', label: 'Insumo datos profesor', href: '/administracion/insumo-profesores' },
    { icon: 'analytics', label: 'Reportes', href: '/administracion/reportes' }
  ];

  readonly accesosPorRol: Record<RolSistema, string[]> = {
    administracion: ['/', '/administracion/dashboard', '/administracion/insumo-pagos', '/administracion/insumo-profesores', '/administracion/reportes', '/settings', '/help'],
    finanzas: ['/', '/settings', '/help'],
    profesor: ['/', '/settings', '/help'],
    tesoreria: ['/', '/settings', '/help']
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

  readonly pageMap: Record<string, { title: string; description: string; cta?: string; secondary?: string }> = {
    '/': {
      title: 'Plataforma Pago a Honoristas',
      description: 'Accede a los módulos permitidos por tu rol y da seguimiento al proceso operativo.'
    },
    '/administracion/dashboard': {
      title: 'Dashboard de Administración',
      description: 'Monitorea la carga de insumos, estatus de validación y preparación de información para pago.',
      cta: 'Ir a insumo de pagos',
      secondary: 'Ir a datos de profesores'
    },
    '/administracion/insumo-pagos': {
      title: 'Carga de Insumo para Pago de Profesores',
      description: 'Sube el archivo base con profesores a pagar, alumnos y centros de costo para validar estructura y disponibilidad.',
      cta: 'Simular carga de insumo'
    },
    '/administracion/insumo-profesores': {
      title: 'Carga de Insumo de Datos Personales y Contacto',
      description: 'Sube el catálogo maestro de información personal y de contacto del profesor para completar expediente operativo.',
      cta: 'Simular carga de catálogo'
    },
    '/administracion/reportes': {
      title: 'Reportes de Administración',
      description: 'Consulta evidencias de carga, incidencias detectadas y trazabilidad de insumos por periodo.'
    },
    '/settings': {
      title: 'Configuración',
      description: 'Administra parámetros generales del sistema.'
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

  readonly routePath = signal('/');
  readonly currentPath = signal('/');
  readonly sesionActiva = signal(false);
  readonly usuarioActual = signal<UsuarioDemo | null>(null);
  readonly rolActual = signal<RolSistema | null>(null);
  readonly usuarioInput = signal('');
  readonly passwordInput = signal('');
  readonly errorLogin = signal('');
  readonly isMobileMenuOpen = signal(false);

  readonly archivoPagos = signal('');
  readonly archivoProfesores = signal('');
  readonly cargandoPagos = signal(false);
  readonly cargandoProfesores = signal(false);
  readonly resumenPagos = signal<{ total: number; periodo: string; monto: string; validos: number; incidencias: number } | null>(null);
  readonly resumenProfesores = signal<{ total: number; conCorreo: number; conTelefono: number; pendientes: number } | null>(null);

  readonly detallePagos = signal<Array<{ id: string; profesor: string; alumnos: number; centroCosto: string; monto: string; estatus: string }>>([]);
  readonly detalleProfesores = signal<Array<{ id: string; nombre: string; correo: string; telefono: string; rfc: string; estatus: string }>>([]);

  readonly pageInfo = computed(() => this.pageMap[this.routePath()] ?? this.pageMap['/']);

  readonly menuItems = computed(() => {
    const rol = this.rolActual();
    if (rol === 'administracion') {
      return this.menuAdministracion;
    }
    return [] as NavItem[];
  });

  constructor(private readonly router: Router) {
    this.recuperarSesion();
    this.routePath.set(this.normalizePath(this.router.url));
    this.currentPath.set(this.normalizePath(this.router.url));

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const normalizedPath = this.normalizePath(this.router.url);
      this.routePath.set(normalizedPath);
      this.currentPath.set(normalizedPath);
      this.isMobileMenuOpen.set(false);
    });
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

    const destino = usuario.rol === 'administracion' ? '/administracion/dashboard' : '/';
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

  puedeVer(ruta: string): boolean {
    const rol = this.rolActual();
    if (!rol) return false;
    const permitidos = this.accesosPorRol[rol];
    return permitidos.some(p => ruta === p || ruta.startsWith(p + '/'));
  }

  seleccionarArchivo(tipo: TipoInsumo, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (tipo === 'pagos') {
      this.archivoPagos.set(file.name);
      this.resumenPagos.set(null);
      this.detallePagos.set([]);
      return;
    }

    this.archivoProfesores.set(file.name);
    this.resumenProfesores.set(null);
    this.detalleProfesores.set([]);
  }

  simularCarga(tipo: TipoInsumo): void {
    if (tipo === 'pagos') {
      if (!this.archivoPagos()) return;
      this.cargandoPagos.set(true);
      setTimeout(() => {
        this.resumenPagos.set({ total: 42, periodo: '2026-1', monto: '$1,284,550', validos: 39, incidencias: 3 });
        this.detallePagos.set([
          { id: 'P-001', profesor: 'Dra. Ana Torres', alumnos: 36, centroCosto: 'CC-ADM-01', monto: '$42,500', estatus: 'Válido' },
          { id: 'P-002', profesor: 'Mtro. Luis Meza', alumnos: 28, centroCosto: 'CC-ADM-04', monto: '$28,900', estatus: 'Válido' },
          { id: 'P-003', profesor: 'Mtra. Paulina Cruz', alumnos: 24, centroCosto: 'CC-ADM-02', monto: '$24,300', estatus: 'Con observación (sin centro de costo)' }
        ]);
        this.cargandoPagos.set(false);
      }, 1200);
      return;
    }

    if (!this.archivoProfesores()) return;
    this.cargandoProfesores.set(true);
    setTimeout(() => {
      this.resumenProfesores.set({ total: 58, conCorreo: 56, conTelefono: 54, pendientes: 4 });
      this.detalleProfesores.set([
        { id: 'PR-1001', nombre: 'Dra. Ana Torres', correo: 'ana.torres@anahuac.mx', telefono: '55-1000-1122', rfc: 'TOAA850101XX1', estatus: 'Completo' },
        { id: 'PR-1032', nombre: 'Mtro. Luis Meza', correo: 'luis.meza@anahuac.mx', telefono: '55-1000-3355', rfc: 'MELU820505AB2', estatus: 'Completo' },
        { id: 'PR-1045', nombre: 'Mtra. Laura Neri', correo: 'Sin correo', telefono: '55-1000-7722', rfc: 'NELA790909RC9', estatus: 'Incompleto (correo)' }
      ]);
      this.cargandoProfesores.set(false);
    }, 1200);
  }

  irA(ruta: string): void {
    if (!this.puedeVer(ruta)) return;
    this.router.navigateByUrl(ruta);
  }

  private normalizePath(url: string): string {
    if (!url) return '/';
    let path = url.split('?')[0].split('#')[0];
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    return path;
  }

  private recuperarSesion(): void {
    const raw = localStorage.getItem('honoristas-demo-session');
    if (!raw) return;

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
}
