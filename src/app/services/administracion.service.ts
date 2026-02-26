import { Injectable, signal } from '@angular/core';
import { Usuario, Rol, Catalogo, CatalogoItem, ReglaNegocio, Integracion, Periodo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  private usuarios = signal<Usuario[]>([]);
  private roles = signal<Rol[]>([]);
  private catalogos = signal<Catalogo[]>([]);
  private reglasNegocio = signal<ReglaNegocio[]>([]);
  private integraciones = signal<Integracion[]>([]);
  private periodos = signal<Periodo[]>([]);

  constructor() {
    this.inicializarDatos();
  }

  private inicializarDatos(): void {
    // Roles iniciales
    this.roles.set([
      {
        id: 1,
        nombre: 'Administrador',
        descripcion: 'Acceso completo al sistema',
        permisos: []
      },
      {
        id: 2,
        nombre: 'Finanzas',
        descripcion: 'Gestión de pagos y autorizaciones',
        permisos: []
      }
    ]);

    // Catálogos iniciales
    this.catalogos.set([
      {
        id: 'periodos',
        nombre: 'Períodos Académicos',
        descripcion: 'Gestión de períodos académicos',
        items: []
      },
      {
        id: 'bancos',
        nombre: 'Bancos',
        descripcion: 'Catálogo de bancos',
        items: [
          { id: 1, codigo: '014', nombre: 'Santander', activo: true },
          { id: 2, codigo: '012', nombre: 'BBVA', activo: true }
        ]
      }
    ]);

    // Integraciones iniciales
    this.integraciones.set([
      {
        id: 'banner',
        nombre: 'Banner',
        tipo: 'banner',
        activa: true,
        configuracion: {
          url: 'https://banner.example.com/api',
          frecuenciaSincronizacion: 'diaria'
        }
      }
    ]);
  }

  // Gestión de Usuarios
  obtenerUsuarios(): Usuario[] {
    return this.usuarios();
  }

  crearUsuario(usuario: Omit<Usuario, 'id' | 'fechaCreacion'>): Usuario {
    const nuevoUsuario: Usuario = {
      id: Date.now(),
      ...usuario,
      fechaCreacion: new Date()
    };

    this.usuarios.update(list => [...list, nuevoUsuario]);
    return nuevoUsuario;
  }

  actualizarUsuario(id: number, cambios: Partial<Usuario>): Usuario | null {
    const usuario = this.usuarios().find(u => u.id === id);
    if (!usuario) return null;

    const usuarioActualizado = { ...usuario, ...cambios };
    this.usuarios.update(list =>
      list.map(u => u.id === id ? usuarioActualizado : u)
    );

    return usuarioActualizado;
  }

  eliminarUsuario(id: number): void {
    this.usuarios.update(list => list.filter(u => u.id !== id));
  }

  // Gestión de Roles
  obtenerRoles(): Rol[] {
    return this.roles();
  }

  crearRol(rol: Omit<Rol, 'id'>): Rol {
    const nuevoRol: Rol = {
      id: Date.now(),
      ...rol
    };

    this.roles.update(list => [...list, nuevoRol]);
    return nuevoRol;
  }

  actualizarRol(id: number, cambios: Partial<Rol>): Rol | null {
    const rol = this.roles().find(r => r.id === id);
    if (!rol) return null;

    const rolActualizado = { ...rol, ...cambios };
    this.roles.update(list =>
      list.map(r => r.id === id ? rolActualizado : r)
    );

    return rolActualizado;
  }

  // Gestión de Catálogos
  obtenerCatalogos(): Catalogo[] {
    return this.catalogos();
  }

  obtenerCatalogoPorId(id: string): Catalogo | undefined {
    return this.catalogos().find(c => c.id === id);
  }

  agregarItemCatalogo(catalogoId: string, item: Omit<CatalogoItem, 'id'>): CatalogoItem {
    const catalogo = this.obtenerCatalogoPorId(catalogoId);
    if (!catalogo) {
      throw new Error('Catálogo no encontrado');
    }

    const nuevoItem: CatalogoItem = {
      id: Date.now(),
      ...item
    };

    catalogo.items.push(nuevoItem);
    this.catalogos.update(list =>
      list.map(c => c.id === catalogoId ? catalogo : c)
    );

    return nuevoItem;
  }

  actualizarItemCatalogo(
    catalogoId: string,
    itemId: number,
    cambios: Partial<CatalogoItem>
  ): void {
    const catalogo = this.obtenerCatalogoPorId(catalogoId);
    if (!catalogo) return;

    const item = catalogo.items.find(i => i.id === itemId);
    if (!item) return;

    Object.assign(item, cambios);
    this.catalogos.update(list =>
      list.map(c => c.id === catalogoId ? catalogo : c)
    );
  }

  // Gestión de Reglas de Negocio
  obtenerReglasNegocio(): ReglaNegocio[] {
    return this.reglasNegocio();
  }

  crearReglaNegocio(regla: Omit<ReglaNegocio, 'id'>): ReglaNegocio {
    const nuevaRegla: ReglaNegocio = {
      id: Date.now(),
      ...regla
    };

    this.reglasNegocio.update(list => [...list, nuevaRegla]);
    return nuevaRegla;
  }

  actualizarReglaNegocio(id: number, cambios: Partial<ReglaNegocio>): ReglaNegocio | null {
    const regla = this.reglasNegocio().find(r => r.id === id);
    if (!regla) return null;

    const reglaActualizada = { ...regla, ...cambios };
    this.reglasNegocio.update(list =>
      list.map(r => r.id === id ? reglaActualizada : r)
    );

    return reglaActualizada;
  }

  // Gestión de Integraciones
  obtenerIntegraciones(): Integracion[] {
    return this.integraciones();
  }

  actualizarIntegracion(id: string, cambios: Partial<Integracion>): Integracion | null {
    const integracion = this.integraciones().find(i => i.id === id);
    if (!integracion) return null;

    const integracionActualizada = { ...integracion, ...cambios };
    this.integraciones.update(list =>
      list.map(i => i.id === id ? integracionActualizada : i)
    );

    return integracionActualizada;
  }

  // Gestión de Períodos
  obtenerPeriodos(): Periodo[] {
    return this.periodos();
  }

  crearPeriodo(periodo: Omit<Periodo, 'id'>): Periodo {
    const nuevoPeriodo: Periodo = {
      id: Date.now(),
      ...periodo
    };

    this.periodos.update(list => [...list, nuevoPeriodo]);
    return nuevoPeriodo;
  }

  obtenerPeriodoActivo(): Periodo | undefined {
    return this.periodos().find(p => p.activo);
  }
}
