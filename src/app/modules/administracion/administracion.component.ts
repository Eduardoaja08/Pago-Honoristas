import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdministracionService } from '../../services';
import { Usuario, Rol, Catalogo, ReglaNegocio, Integracion, Periodo } from '../../models';
import { IconComponent } from '../../icon.component';
import { ButtonComponent } from '../../shared/buttons/button.component';

@Component({
    selector: 'app-administracion',
    standalone: true,
    imports: [CommonModule, FormsModule, IconComponent, ButtonComponent],
    templateUrl: './administracion.component.html'
})
export class AdministracionComponent implements OnInit {
    tab = signal<'usuarios' | 'catalogos' | 'reglas' | 'integraciones'>('usuarios');

    // Tab: Usuarios
    usuarios = signal<Usuario[]>([]);
    roles = signal<Rol[]>([]);
    mostrandoModalUsuario = signal(false);

    // Tab: Catálogos
    catalogos = signal<Catalogo[]>([]);
    catalogoSeleccionadoId = signal<string | null>(null);

    // Tab: Reglas de Negocio
    reglas = signal<ReglaNegocio[]>([]);

    // Tab: Integraciones
    integraciones = signal<Integracion[]>([]);

    modalInfo = signal<{ titulo: string; mensaje: string } | null>(null);

    constructor(private readonly adminService: AdministracionService) { }

    ngOnInit(): void {
        this.cargarDatos();
    }

    cargarDatos(): void {
        this.usuarios.set(this.adminService.obtenerUsuarios());
        this.roles.set(this.adminService.obtenerRoles());
        this.catalogos.set(this.adminService.obtenerCatalogos());
        this.reglas.set(this.adminService.obtenerReglasNegocio());
        this.integraciones.set(this.adminService.obtenerIntegraciones());

        // Si no hay usuarios dummy, sembrar algunos
        if (this.usuarios().length === 0) {
            this.sembrarDatosDummy();
        }
    }

    private sembrarDatosDummy(): void {
        this.adminService.crearUsuario({
            nombre: 'Eduardo Aja',
            correo: 'eduardo.aja@universidad.edu.mx',
            rol: this.roles()[0],
            activo: true
        });
        this.adminService.crearUsuario({
            nombre: 'Admin Sistema',
            correo: 'admin@universidad.edu.mx',
            rol: this.roles()[0],
            activo: true
        });
        this.adminService.crearUsuario({
            nombre: 'Coordinador Finanzas',
            correo: 'finanzas@universidad.edu.mx',
            rol: this.roles()[1],
            activo: true
        });

        this.adminService.crearReglaNegocio({
            nombre: 'Tope de Horas Semanales',
            descripcion: 'No permitir más de 40 horas por profesor.',
            tipo: 'validacion',
            formula: 'horas <= 40',
            fechaInicio: new Date(),
            prioridad: 1,
            activa: true
        });

        this.usuarios.set(this.adminService.obtenerUsuarios());
        this.reglas.set(this.adminService.obtenerReglasNegocio());
    }

    setTab(tab: 'usuarios' | 'catalogos' | 'reglas' | 'integraciones'): void {
        this.tab.set(tab);
    }

    // --- Acciones Usuarios ---
    toggleEstadoUsuario(usuario: Usuario): void {
        this.adminService.actualizarUsuario(usuario.id, { activo: !usuario.activo });
        this.usuarios.set(this.adminService.obtenerUsuarios());
    }

    // --- Acciones Catálogos ---
    seleccionarCatalogo(id: string): void {
        this.catalogoSeleccionadoId.set(id);
    }

    getCatalogoSeleccionado() {
        return this.catalogos().find(c => c.id === this.catalogoSeleccionadoId());
    }

    // --- Acciones Integraciones ---
    probarConexion(id: string): void {
        alert(`Probando conexión con ${id}... Conexión exitosa.`);
    }

    toggleIntegracion(id: string, activa: boolean): void {
        this.adminService.actualizarIntegracion(id, { activa });
        this.integraciones.set(this.adminService.obtenerIntegraciones());
    }

    abrirModalInfo(titulo: string, mensaje: string): void {
        this.modalInfo.set({ titulo, mensaje });
    }

    cerrarModalInfo(): void {
        this.modalInfo.set(null);
    }
}
