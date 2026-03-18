# Retroalimentación del flujo y del programa

Fecha: 13/03/2026

Este documento resume lo que falta, mejoras puntuales y propuestas de dashboard por rol, tomando como base `ultima_sesion_del_proceso.txt` y las pantallas actuales.

## 1) Faltantes en el flujo (funcionales)

- Definición clara de estados del flujo por profesor (ej. `cargado`, `contrato_generado`, `contrato_firmado`, `doc_ok`, `factura_cargada`, `validacion_cfdi`, `listo_pago`, `pagado`, `conciliado`, `cancelacion_requerida`). Esto evita ambigüedad en cada etapa.
- Matriz de requisitos por tipo de pago con reglas explícitas (asimilados, empresa, extranjero, honorarios). Hoy están listados, pero falta el “cómo valida el sistema” y qué bloquea el avance.
- Validaciones de documentos y versiones (vigente, fecha límite, formato, tamaño, vencimiento). Falta la lógica de expiración y alertas.
- Reglas de cálculo del tabulador y su fuente (periodo, tipo de programa, alumno equivalente, etc.). El flujo solo dice “se compara con tabulador”, falta el detalle.
- Manejo de incidencias y correcciones (quién corrige, cuánto tiempo, qué pasa si no se corrige). Hoy aparece “incidencias”, pero no el subflujo.
- Control de periodos (2026-1, 2026-2). Falta un módulo de “periodo activo” y su cierre.
- Trazabilidad / auditoría (quién subió qué, cuándo, qué cambió). Es crítico para pagos y CFDI.
- Flujo completo de cancelaciones de CFDI: solicitud, aprobación, evidencia, re-emisión y notificación al profesor.
- Integraciones: SAPO, SAT (validación RFC/CFDI), y banco. Falta describir cuándo y cómo se consumen.
- Acciones fuera de sistema: contabilidad y banca. Falta el paso de conciliación con “acuse” de contabilidad y estados finales.

## 2) Faltantes en pantallas actuales (según el flujo)

- Pantalla explícita de “Validación de requisitos” antes de habilitar factura/pago (el flujo lo menciona, la UI no lo separa como etapa).
- Pantalla para carga de contratos elaborados por Finanzas (está en `proceso.txt` pero no se ve reflejada en UI).
- Pantalla de “estado de documentación” para Finanzas (solo hay vista simple de estatus).
- Pantalla de cancelaciones CFDI (recepción, seguimiento, cierre).
- Pantalla de incidencias por tipo (datos personales, doc fiscal, contrato, factura).
- Vista operativa de “correcciones solicitadas” a profesores (qué falta y fecha límite).

## 3) Hallazgos en UI y código (mejoras inmediatas)

- Duplicado de bloques en `src/app/dashboard-shell.component.html`:
  - Se repite el dashboard del profesor dos veces.
  - Se repite el bloque “Resultado de proceso” en comprobantes.
- Texto con codificación dañada (Ã³, Ã±, etc.) en `ultima_sesion_del_proceso.txt` y varios componentes TS/HTML. Conviene guardar en UTF-8 para evitar caracteres rotos.
- `BusquedaGlobalComponent` tiene ancho fijo `w-[700px]` y texto de atajo con símbolo mal codificado. Sugerencia: ancho responsivo y usar `Ctrl+F` solo cuando aplique.
- Falta ruta o componente visible para `/busqueda` (se navega desde `BusquedaGlobalComponent`, pero no se ve en UI).
- `onInput()` está vacío y puede eliminarse o implementar búsqueda en vivo.
- Los KPIs en dashboards son estáticos. Falta data real o servicios simulados por rol.

## 4) Mejores prácticas que faltan (sistema real)

- Control de permisos por rol a nivel acción (no solo por ruta).
- Validación de archivos (extensión, tamaño, checksum, duplicados).
- Historial de documentos por profesor (versionado y reemplazos).
- Notificaciones con acuse (correo y en-app).
- SLA y alertas de vencimiento (documentos, contratos, facturas).
- Exportables (CSV/PDF) de reportes y conciliaciones.

## 5) Qué poner en los dashboards (por rol)

Administración:
- % de insumo cargado vs esperado
- Incidencias de datos por tipo
- Calidad de datos (RFC, correo, tel, domicilio)
- Periodo activo y fechas clave
- Tiempo promedio de corrección

Finanzas:
- Contratos por estatus
- Expedientes completos vs incompletos
- Facturas en validación SAT
- Listos para pago vs bloqueados
- Alertas de documentos vencidos

Profesor:
- Checklist de documentos con semáforo
- Contratos pendientes de firma
- Facturas rechazadas y motivo
- Próximo pago estimado
- Historial de pagos (periodo, monto, estatus)

Tesorería:
- Pagos listos para dispersión
- Layouts generados (fecha, lote)
- Bank report procesado (éxitos vs fallos)
- Incidencias de renombrado
- Conciliación pendiente

## 6) Ajustes al flujo escrito (recomendados)

- Agregar una sección de “Estados del proceso” con transiciones.
- Separar claramente “validación documental” vs “validación fiscal”.
- Definir qué dispara la generación automática de contrato.
- Aclarar si el profesor puede firmar digitalmente o solo subir PDF.
- Agregar un subflujo de “revisión y corrección” para incidencias.

