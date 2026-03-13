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

interface ProfesorFinanzas {
  id: string;
  nombre: string;
  tipoPago: string;
  montoPeriodo: string;
  alumnos: number;
  centroCosto: string;
  contratoEstatus: string;
  facturaEstatus: string;
  pagoEstatus: string;
  ultimoMovimiento: string;
  datosFiscales: { rfc: string; regimen: string; usoCfdi: string; cuentaClabe: string };
  documentos: Array<{ nombre: string; estatus: string; vencimiento?: string }>;
  correos: Array<{ fecha: string; asunto: string; resultado: string }>;
  contratos: Array<{ folio: string; modulo: string; actividad: string; monto: string; estatus: string; firma: string }>;
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

  readonly menuFinanzas: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard Finanzas', href: '/finanzas/dashboard' },
    { icon: 'users', label: 'Profesores para pago', href: '/finanzas/profesores' },
    { icon: 'book', label: 'Contratos y correos', href: '/finanzas/contratos' },
    { icon: 'analytics', label: 'Seguimiento de pagos', href: '/finanzas/seguimiento' },
    { icon: 'analytics', label: 'Comprobantes y ZIP', href: '/finanzas/comprobantes' }
  ];

  readonly accesosPorRol: Record<RolSistema, string[]> = {
    administracion: ['/', '/administracion/dashboard', '/administracion/insumo-pagos', '/administracion/insumo-profesores', '/administracion/reportes', '/settings', '/help'],
    finanzas: ['/', '/finanzas/dashboard', '/finanzas/profesores', '/finanzas/profesor', '/finanzas/contratos', '/finanzas/seguimiento', '/finanzas/comprobantes', '/settings', '/help'],
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

  readonly checklistDocumentalBase = [
    'Currículum vitae (CV): Actualizado',
    'Solicitud de empleo',
    'Acta de nacimiento',
    'Comprobante de domicilio',
    'Identificación oficial vigente',
    'Cédula profesional Licenciatura',
    'Cédula profesional Maestría',
    'Cédula profesional Doctorado',
    'Comprobante de ingresos adicionales',
    'Constancia de situación fiscal',
    'Cumplimiento del SAT'
  ];

  readonly requisitosTipoPago = [
    {
      tipo: 'Asimilados',
      requisitos: [
        'Dos recibos de nómina',
        'Constancia laboral del otro empleo',
        'Carta firmada de ingresos complementarios (fecha, firma, domicilio, RFC, CURP)'
      ]
    },
    {
      tipo: 'Empresa',
      requisitos: ['Acta constitutiva', 'Comprobante de domicilio', 'Carátula bancaria de la empresa']
    },
    {
      tipo: 'Extranjero',
      requisitos: ['Acta de nacimiento', 'Pasaporte', 'Constancia de residencia fiscal (residente extranjero)']
    },
    {
      tipo: 'Honorarios',
      requisitos: ['CFDI PDF', 'XML', 'Constancia de situación fiscal', 'Opinión de cumplimiento']
    }
  ];

  readonly profesoresFinanzas: ProfesorFinanzas[] = [
    {
      id: 'PR-1001',
      nombre: 'Dra. Ana Torres',
      tipoPago: 'Honorarios',
      montoPeriodo: '$42,500',
      alumnos: 36,
      centroCosto: 'CC-ADM-01',
      contratoEstatus: 'Firmado',
      facturaEstatus: 'CFDI recibido y validado',
      pagoEstatus: 'Listo para dispersión',
      ultimoMovimiento: '13/03/2026 11:35',
      datosFiscales: { rfc: 'TOAA850101XX1', regimen: 'Régimen Simplificado de Confianza', usoCfdi: 'G03', cuentaClabe: '002180700111223344' },
      documentos: [
        { nombre: 'CV actualizado', estatus: 'Vigente', vencimiento: '12/2026' },
        { nombre: 'Constancia de situación fiscal', estatus: 'Vigente', vencimiento: '09/2026' },
        { nombre: 'Opinión de cumplimiento SAT', estatus: 'Vigente', vencimiento: '08/2026' },
        { nombre: 'Contrato firmado', estatus: 'Cargado' },
        { nombre: 'CFDI XML/PDF', estatus: 'Validado' }
      ],
      correos: [
        { fecha: '08/03/2026 10:12', asunto: 'Contrato disponible para firma', resultado: 'Entregado' },
        { fecha: '10/03/2026 18:05', asunto: 'Confirmación de contrato firmado', resultado: 'Entregado' },
        { fecha: '12/03/2026 09:15', asunto: 'Habilitación para carga de factura', resultado: 'Entregado' }
      ],
      contratos: [
        { folio: 'CNT-2026-01011', modulo: 'Módulo Finanzas', actividad: 'Docencia Maestría', monto: '$32,000', estatus: 'Firmado', firma: '10/03/2026' },
        { folio: 'CNT-2026-01012', modulo: 'Seminario Especial', actividad: 'Asesoría', monto: '$10,500', estatus: 'Firmado', firma: '10/03/2026' }
      ]
    },
    {
      id: 'PR-1098',
      nombre: 'Ing. Carlos Rivera',
      tipoPago: 'Empresa',
      montoPeriodo: '$31,200',
      alumnos: 30,
      centroCosto: 'CC-ADM-06',
      contratoEstatus: 'Firmado',
      facturaEstatus: 'CFDI en validación',
      pagoEstatus: 'En revisión de comprobantes',
      ultimoMovimiento: '13/03/2026 12:40',
      datosFiscales: { rfc: 'CRI990101AB3', regimen: 'Persona moral general', usoCfdi: 'G03', cuentaClabe: '014180567890123456' },
      documentos: [
        { nombre: 'Currículum vitae (CV): Actualizado', estatus: 'Vigente', vencimiento: '12/2026' },
        { nombre: 'Solicitud de empleo', estatus: 'Cargado' },
        { nombre: 'Acta constitutiva', estatus: 'Cargado' },
        { nombre: 'Comprobante de domicilio', estatus: 'Vigente', vencimiento: '07/2026' },
        { nombre: 'Carátula bancaria de la empresa', estatus: 'Cargado' },
        { nombre: 'Constancia de situación fiscal', estatus: 'Vigente', vencimiento: '11/2026' },
        { nombre: 'Cumplimiento del SAT', estatus: 'Vigente', vencimiento: '09/2026' }
      ],
      correos: [
        { fecha: '10/03/2026 11:20', asunto: 'Contrato disponible para firma', resultado: 'Entregado' },
        { fecha: '12/03/2026 13:10', asunto: 'Habilitación para carga de CFDI', resultado: 'Entregado' }
      ],
      contratos: [
        { folio: 'CNT-2026-01103', modulo: 'Licenciatura', actividad: 'Docencia', monto: '$31,200', estatus: 'Firmado', firma: '11/03/2026' }
      ]
    },

    {
      id: 'PR-1032',
      nombre: 'Mtro. Luis Meza',
      tipoPago: 'Asimilados',
      montoPeriodo: '$28,900',
      alumnos: 28,
      centroCosto: 'CC-ADM-04',
      contratoEstatus: 'Enviado (pendiente firma)',
      facturaEstatus: 'No habilitado',
      pagoEstatus: 'En espera de contrato',
      ultimoMovimiento: '13/03/2026 09:20',
      datosFiscales: { rfc: 'MELU820505AB2', regimen: 'Sueldos y Salarios', usoCfdi: 'CN01', cuentaClabe: '012180009991234567' },
      documentos: [
        { nombre: 'Constancia de situación fiscal', estatus: 'Vigente', vencimiento: '10/2026' },
        { nombre: 'Recibos de nómina (2)', estatus: 'Cargado' },
        { nombre: 'Constancia laboral externa', estatus: 'Pendiente' },
        { nombre: 'Carta firmada de ingresos', estatus: 'Pendiente' }
      ],
      correos: [
        { fecha: '11/03/2026 08:40', asunto: 'Contrato disponible para firma', resultado: 'Entregado' },
        { fecha: '12/03/2026 17:30', asunto: 'Recordatorio firma de contrato', resultado: 'Entregado' }
      ],
      contratos: [
        { folio: 'CNT-2026-01058', modulo: 'Licenciatura', actividad: 'Docencia', monto: '$28,900', estatus: 'Enviado', firma: 'Pendiente' }
      ]
    },
    {
      id: 'PR-1045',
      nombre: 'Mtra. Laura Neri',
      tipoPago: 'Extranjero',
      montoPeriodo: '$24,300',
      alumnos: 24,
      centroCosto: 'CC-ADM-02',
      contratoEstatus: 'Firmado',
      facturaEstatus: 'Factura extranjero pendiente',
      pagoEstatus: 'En validación fiscal',
      ultimoMovimiento: '13/03/2026 12:04',
      datosFiscales: { rfc: 'XEXX010101000', regimen: 'Residente en el extranjero', usoCfdi: 'S01', cuentaClabe: 'No aplica (transferencia internacional)' },
      documentos: [
        { nombre: 'Pasaporte', estatus: 'Cargado' },
        { nombre: 'Constancia de residencia fiscal', estatus: 'Vigente', vencimiento: '11/2026' },
        { nombre: 'Contrato firmado', estatus: 'Cargado' },
        { nombre: 'Factura del extranjero', estatus: 'Pendiente' }
      ],
      correos: [
        { fecha: '09/03/2026 09:00', asunto: 'Contrato disponible para firma', resultado: 'Entregado' },
        { fecha: '11/03/2026 19:12', asunto: 'Solicitud de factura extranjera', resultado: 'Entregado' }
      ],
      contratos: [
        { folio: 'CNT-2026-01077', modulo: 'Doctorado', actividad: 'Docencia', monto: '$24,300', estatus: 'Firmado', firma: '11/03/2026' }
      ]
    }
  ];

  readonly pageMap: Record<string, { title: string; description: string }> = {
    '/': {
      title: 'Plataforma Pago a Honoristas',
      description: 'Accede a los módulos permitidos por tu rol y da seguimiento al proceso operativo.'
    },
    '/administracion/dashboard': {
      title: 'Dashboard de Administración',
      description: 'Monitorea la carga de insumos, estatus de validación y preparación de información para pago.'
    },
    '/administracion/insumo-pagos': {
      title: 'Carga de Insumo para Pago de Profesores',
      description: 'Sube el archivo base con profesores a pagar, alumnos y centros de costo para validar estructura y disponibilidad.'
    },
    '/administracion/insumo-profesores': {
      title: 'Carga de Insumo de Datos Personales y Contacto',
      description: 'Sube el catálogo maestro de información personal y de contacto del profesor para completar expediente operativo.'
    },
    '/administracion/reportes': {
      title: 'Reportes de Administración',
      description: 'Consulta evidencias de carga, incidencias detectadas y trazabilidad de insumos por periodo.'
    },
    '/finanzas/dashboard': {
      title: 'Dashboard de Finanzas',
      description: 'Seguimiento del estatus de contratos, facturación y pagos listos para dispersión por periodo.'
    },
    '/finanzas/profesores': {
      title: 'Profesores para pago (vista Finanzas)',
      description: 'Listado proveniente del insumo cargado por Administración para revisión de estatus y expediente.'
    },
    '/finanzas/contratos': {
      title: 'Contratos y notificaciones',
      description: 'Monitorea contratos enviados, firma del profesor y correos de confirmación.'
    },
    '/finanzas/seguimiento': {
      title: 'Seguimiento de estatus de pago',
      description: 'Controla el avance: contrato, requisitos fiscales, CFDI y estado de pago.'
    },

    '/finanzas/comprobantes': {
      title: 'Comprobantes renombrados y descarga ZIP',
      description: 'Finanzas descarga el ZIP final de comprobantes (PDF/XML) renombrados con base en bank report y resultados de pago.'
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

  readonly procesamientoZip = signal(false);
  readonly zipComprobantesListo = signal(false);
  readonly loteZipActual = signal<{
    periodo: string;
    origen: string;
    totalComprobantes: number;
    renombrados: number;
    incidencias: number;
    archivo: string;
  } | null>(null);


  readonly archivoPagos = signal('');
  readonly archivoProfesores = signal('');
  readonly cargandoPagos = signal(false);
  readonly cargandoProfesores = signal(false);
  readonly resumenPagos = signal<{ total: number; periodo: string; monto: string; validos: number; incidencias: number } | null>(null);
  readonly resumenProfesores = signal<{ total: number; conCorreo: number; conTelefono: number; pendientes: number } | null>(null);

  readonly detallePagos = signal<Array<{ id: string; profesor: string; alumnos: number; centroCosto: string; monto: string; estatus: string }>>([]);
  readonly detalleProfesores = signal<Array<{ id: string; nombre: string; correo: string; telefono: string; rfc: string; estatus: string }>>([]);

  readonly pageInfo = computed(() => {
    const path = this.routePath();
    if (path.startsWith('/finanzas/profesor/')) {
      return {
        title: 'Ficha detallada del profesor (Finanzas)',
        description: 'Revisión integral de documentos, contratos, correos y estatus de pago del profesor.'
      };
    }
    return this.pageMap[path] ?? this.pageMap['/'];
  });

  readonly menuItems = computed(() => {
    const rol = this.rolActual();
    if (rol === 'administracion') {
      return this.menuAdministracion;
    }
    if (rol === 'finanzas') {
      return this.menuFinanzas;
    }
    return [] as NavItem[];
  });

  readonly profesorDetalle = computed(() => {
    const path = this.currentPath();
    const match = path.match(/^\/finanzas\/profesor\/([^/]+)$/);
    if (!match) return null;
    const id = decodeURIComponent(match[1]);
    return this.profesoresFinanzas.find((item) => item.id === id) ?? null;
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

    const destino = usuario.rol === 'administracion'
      ? '/administracion/dashboard'
      : usuario.rol === 'finanzas'
      ? '/finanzas/dashboard'
      : '/';

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

  verProfesorFinanzas(id: string): void {
    this.router.navigateByUrl(`/finanzas/profesor/${id}`);
  }


  prepararZipComprobantes(): void {
    this.procesamientoZip.set(true);
    this.zipComprobantesListo.set(false);

    setTimeout(() => {
      this.loteZipActual.set({
        periodo: '2026-1',
        origen: 'Bank report + comprobantes de pago',
        totalComprobantes: 42,
        renombrados: 40,
        incidencias: 2,
        archivo: 'comprobantes_renombrados_2026_1.zip'
      });
      this.zipComprobantesListo.set(true);
      this.procesamientoZip.set(false);
    }, 1200);
  }


  obtenerEstatusDocumento(nombre: string): string {
    const profesor = this.profesorDetalle();
    if (!profesor) return 'No aplica';
    const doc = profesor.documentos.find((item) => item.nombre.toLowerCase() === nombre.toLowerCase());
    return doc?.estatus ?? 'No cargado';
  }

  obtenerVigenciaDocumento(nombre: string): string {
    const profesor = this.profesorDetalle();
    if (!profesor) return 'N/A';
    const doc = profesor.documentos.find((item) => item.nombre.toLowerCase() === nombre.toLowerCase());
    return doc?.vencimiento ?? 'N/A';
  }

  esTipoPagoActual(tipo: string): boolean {
    return this.profesorDetalle()?.tipoPago.toLowerCase() === tipo.toLowerCase();
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
