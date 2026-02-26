# Estructura del Proyecto - Plataforma de Pago a Honoristas

Este documento describe la estructura completa del proyecto basada en las especificaciones del archivo `pantallas.txt`.

## 📁 Estructura de Carpetas

```
src/app/
├── models/                    # Modelos e interfaces TypeScript
│   ├── profesor.model.ts
│   ├── asignacion.model.ts
│   ├── pago.model.ts
│   ├── fiscal.model.ts
│   ├── bancario.model.ts
│   ├── contabilidad.model.ts
│   ├── administracion.model.ts
│   ├── dashboard.model.ts
│   └── index.ts
├── services/                  # Servicios de negocio
│   ├── profesores.service.ts
│   ├── asignacion.service.ts
│   ├── calculo-pagos.service.ts
│   ├── fiscal.service.ts
│   ├── bancario.service.ts
│   ├── contabilidad.service.ts
│   ├── administracion.service.ts
│   ├── dashboard.service.ts
│   └── index.ts
├── modules/                   # Componentes de módulos
│   └── dashboard/
│       └── dashboard.component.ts
├── shared/                    # Componentes compartidos
│   ├── periodo-selector/
│   │   └── periodo-selector.component.ts
│   └── busqueda-global/
│       └── busqueda-global.component.ts
├── dashboard-shell.component.ts    # Componente principal del shell
├── dashboard-shell.component.html
├── app.routes.ts              # Configuración de rutas
└── icon.component.ts          # Componente de iconos
```

## 🎯 Módulos Implementados

### 1. Dashboard / Inicio ✅
- **Componente**: `DashboardComponent`
- **Servicio**: `DashboardService`
- **Funcionalidades**:
  - KPIs principales (Total a pagar, Profesores activos, Pagos programados, Incidencias críticas)
  - Gráfica de avance por etapa (embudo)
  - Tareas pendientes del usuario
  - Incidencias críticas

### 2. Profesores (M1) ⏳
- **Servicio**: `ProfesoresService` ✅
- **Modelos**: `Profesor`, `DatosFiscales`, `DatosBancarios`, `Documento` ✅
- **Pendiente**: Componentes de UI

### 3. Asignación Académica (M2 y M3) ⏳
- **Servicio**: `AsignacionService` ✅
- **Modelos**: `VersionInsumo`, `Sincronizacion`, `ConflictoAsignacion` ✅
- **Pendiente**: Componentes de UI

### 4. Cálculo y Pagos (M4) ⏳
- **Servicio**: `CalculoPagosService` ✅
- **Modelos**: `ProcesoCalculo`, `FiltroPago`, `FormatoPagoAgrupado` ✅
- **Pendiente**: Componentes de UI

### 5. Cumplimiento Fiscal (M5 y M6) ⏳
- **Servicio**: `FiscalService` ✅
- **Modelos**: `ValidacionFiscal`, `Contrato`, `EmisionCFDI` ✅
- **Pendiente**: Componentes de UI

### 6. Operación Bancaria (M7) ⏳
- **Servicio**: `BancarioService` ✅
- **Modelos**: `LayoutBancario`, `Dispersión`, `ArchivoRetorno` ✅
- **Pendiente**: Componentes de UI

### 7. Contabilidad y Reportes (M8) ⏳
- **Servicio**: `ContabilidadService` ✅
- **Modelos**: `Reporte`, `PolizaContable`, `LogAuditoria` ✅
- **Pendiente**: Componentes de UI

### 8. Administración ⏳
- **Servicio**: `AdministracionService` ✅
- **Modelos**: `Usuario`, `Rol`, `Catalogo`, `ReglaNegocio`, `Integracion`, `Periodo` ✅
- **Pendiente**: Componentes de UI

## 🔧 Componentes Compartidos

### Selector de Período Global ✅
- **Componente**: `PeriodoSelectorComponent`
- **Ubicación**: Barra superior global
- **Funcionalidad**: Afecta todas las vistas del sistema

### Búsqueda Global ✅
- **Componente**: `BusquedaGlobalComponent`
- **Ubicación**: Barra superior global
- **Funcionalidad**: Búsqueda por profesor, RFC, CRN, folio, UUID

## 📋 Funcionalidades Implementadas

### Servicios (Backend lógico)
- ✅ Gestión de profesores (CRUD, validación CLABE, documentos)
- ✅ Sincronización con Banner y carga manual de asignaciones
- ✅ Detección de conflictos y validaciones
- ✅ Cálculo de pagos con progreso
- ✅ Gestión de CFDI (timbrado, cancelación, recepción)
- ✅ Generación de dispersiones bancarias
- ✅ Conciliación bancaria
- ✅ Generación de reportes y pólizas contables
- ✅ Auditoría y logs
- ✅ Gestión de usuarios, roles y permisos
- ✅ Catálogos y reglas de negocio
- ✅ Configuración de integraciones

### Modelos de Datos
- ✅ Todas las entidades principales definidas
- ✅ Interfaces TypeScript completas
- ✅ Relaciones entre entidades

## 🚀 Próximos Pasos

Para completar la implementación según las especificaciones:

1. **Componentes de UI para cada módulo**:
   - Listados con filtros y búsqueda
   - Formularios de alta/edición
   - Wizards para procesos complejos
   - Tablas con edición inline
   - Vistas de detalle

2. **Integración con APIs**:
   - Reemplazar datos simulados con llamadas reales
   - Manejo de errores y estados de carga
   - Autenticación y autorización

3. **Mejoras de UX**:
   - Notificaciones en tiempo real
   - Modales y diálogos de confirmación
   - Indicadores de progreso
   - Validaciones en formularios

4. **Testing**:
   - Pruebas unitarias de servicios
   - Pruebas de componentes
   - Pruebas de integración

## 📝 Notas Técnicas

- **Framework**: Angular 21.1.0
- **Estilos**: Tailwind CSS 4.2.0
- **Estado**: Signals de Angular (reactive state)
- **Arquitectura**: Standalone components
- **Rutas**: Configuradas según especificaciones

## 🔗 Rutas Configuradas

- `/` - Dashboard principal
- `/profesores` - Módulo de Profesores
- `/asignacion-academica` - Módulo de Asignación Académica
- `/calculo-pagos` - Módulo de Cálculo y Pagos
- `/cumplimiento-fiscal` - Módulo de Cumplimiento Fiscal
- `/operacion-bancaria` - Módulo de Operación Bancaria
- `/contabilidad-reportes` - Módulo de Contabilidad y Reportes
- `/administracion` - Módulo de Administración
- `/settings` - Configuración
- `/help` - Soporte
- `/logout` - Cerrar sesión
