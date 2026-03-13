import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { ProfesorDetailComponent } from './modules/profesores/profesor-detail.component';

type Rol = 'administracion' | 'finanzas' | 'profesor' | 'tesoreria';

interface UsuarioDemo {
  nombre: string;
  usuario: string;
  password: string;
  rol: Rol;
  profesorId?: number;
}

interface NavItem {
  label: string;
  href: string;
}

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ProfesorDetailComponent],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss'
})
export class DashboardShellComponent {
  readonly usuariosDemo: UsuarioDemo[] = [
    { nombre: 'Sandra Viña', usuario: 'admin.sandra', password: 'Admin2026*', rol: 'administracion' },
    { nombre: 'Marco Salas', usuario: 'finanzas.marco', password: 'Finanzas2026*', rol: 'finanzas' },
    { nombre: 'Dra. Ana Torres', usuario: 'profesor.ana', password: 'Profesor2026*', rol: 'profesor', profesorId: 1 },
    { nombre: 'Lucía Paredes', usuario: 'tesoreria.lucia', password: 'Tesoreria2026*', rol: 'tesoreria' }
  ];

  readonly menuPorRol: Record<Rol, NavItem[]> = {
    administracion: [
      { label: 'Inicio', href: '/' },
      { label: 'Carga de layout', href: '/administracion' },
      { label: 'Ficha de profesor', href: '/profesor/1' }
    ],
    finanzas: [
      { label: 'Inicio', href: '/' },
      { label: 'Control de contratos', href: '/calculo-pagos' },
      { label: 'Descarga de ZIP renombrado', href: '/contabilidad-reportes' },
      { label: 'Ficha de profesor', href: '/profesor/1' }
    ],
    profesor: [
      { label: 'Inicio', href: '/' },
      { label: 'Mi contrato y facturación', href: '/cumplimiento-fiscal' },
      { label: 'Mi ficha técnica', href: '/profesor/1' }
    ],
    tesoreria: [
      { label: 'Inicio', href: '/' },
      { label: 'Dispersión bancaria', href: '/operacion-bancaria' },
      { label: 'Ficha de profesor', href: '/profesor/1' }
    ]
  };

  readonly rolActual = signal<Rol | null>(null);
  readonly usuarioActual = signal<UsuarioDemo | null>(null);
  readonly currentPath = signal('/');
  readonly credenciales = signal({ usuario: '', password: '' });
  readonly errorLogin = signal('');

  readonly resumenFlujo = [
    { etapa: '1. SAPO + Layout', owner: 'Administración', detalle: 'Se recuperan datos básicos del profesor desde SAPO y se carga layout de alumnos/centros de costo.' },
    { etapa: '2. Monto y contrato', owner: 'Finanzas', detalle: 'Se calcula monto por tabulador, se valida expediente y se genera contrato para firma.' },
    { etapa: '3. Firma y factura', owner: 'Profesor', detalle: 'El profesor descarga contrato, sube contrato firmado y después CFDI/XML/documentación fiscal.' },
    { etapa: '4. Pago y conciliación', owner: 'Tesorería / Finanzas', detalle: 'Tesorería descarga layout TXT, sube bank report y Finanzas descarga ZIP renombrado para contabilidad.' }
  ];

  readonly checklistBase = [
    'CV actualizado',
    'Solicitud de empleo',
    'Acta de nacimiento',
    'Comprobante de domicilio',
    'Identificación oficial vigente',
    'Cédulas profesionales (licenciatura/maestría/doctorado)',
    'Constancia de situación fiscal',
    'Opinión de cumplimiento SAT'
  ];

  readonly rutaActivaTexto = computed(() => {
    const map: Record<string, string> = {
      '/': 'Panel principal por rol',
      '/administracion': 'Carga de layout y sincronización SAPO',
      '/calculo-pagos': 'Control de contratos y validación de carga del profesor',
      '/cumplimiento-fiscal': 'Portal del profesor para contrato y facturación',
      '/operacion-bancaria': 'Dispersión bancaria y carga de bank report',
      '/contabilidad-reportes': 'Entrega de comprobantes renombrados',
      '/profesor/1': 'Ficha técnica del profesor (vista transversal)'
    };
    return map[this.currentPath()] ?? 'Flujo operativo';
  });

  constructor(private readonly router: Router) {
    this.router.events
      .pipe(filter((evt): evt is NavigationEnd => evt instanceof NavigationEnd))
      .subscribe(evt => this.currentPath.set(evt.urlAfterRedirects));

    this.currentPath.set(this.router.url || '/');
  }

  updateUsuario(valor: string): void {
    this.credenciales.update(item => ({ ...item, usuario: valor }));
  }

  updatePassword(valor: string): void {
    this.credenciales.update(item => ({ ...item, password: valor }));
  }

  login(): void {
    const cred = this.credenciales();
    const usuario = this.usuariosDemo.find(
      u => u.usuario === cred.usuario.trim() && u.password === cred.password.trim()
    );

    if (!usuario) {
      this.errorLogin.set('Usuario o contraseña incorrectos. Usa los accesos demo disponibles.');
      return;
    }

    this.errorLogin.set('');
    this.usuarioActual.set(usuario);
    this.rolActual.set(usuario.rol);

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
    this.usuarioActual.set(null);
    this.rolActual.set(null);
    this.credenciales.set({ usuario: '', password: '' });
    this.router.navigateByUrl('/');
  }

  puedeVer(ruta: string): boolean {
    const rol = this.rolActual();
    if (!rol) return false;
    return this.menuPorRol[rol].some(item => item.href === ruta);
  }

  menuActual(): NavItem[] {
    const rol = this.rolActual();
    return rol ? this.menuPorRol[rol] : [];
  }
}
