# Pruebas de Aceptación - Nexus Inventory

Este documento contiene el checklist de criterios de aceptación y casos de prueba funcionales para verificar que las características principales del sistema **Nexus Inventory** funcionan correctamente de acuerdo con los requerimientos del usuario.

---

## 1. Módulo de Autenticación (Acceso al Nexo)

| ID | Caso de Prueba | Pasos de Ejecución | Criterio de Aceptación (Resultado Esperado) | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Inicio de Sesión Exitoso | 1. Acceder a la URL de la aplicación.<br>2. Dejar las credenciales predeterminadas (`admin@nexus.com` y token de acceso).<br>3. Presionar "Entrar al Nexo". | El formulario valida correctamente, la pantalla de login desaparece y se muestra el Dashboard principal. | **PASS** |
| **TC-02** | Persistencia de Sesión | 1. Iniciar sesión exitosamente (TC-01).<br>2. Recargar la página (F5) o abrir en una nueva pestaña. | La sesión se mantiene iniciada; el sistema detecta `isLoggedIn: true` en el estado persistido y abre el Dashboard directamente. | **PASS** |

---

## 2. Dashboard e Indicadores (Visualización de Datos)

| ID | Caso de Prueba | Pasos de Ejecución | Criterio de Aceptación (Resultado Esperado) | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **TC-03** | Resumen de Métricas | 1. Estar en la página de "Dashboard".<br>2. Observar las métricas de inventario. | Se visualiza la cantidad correcta de productos, almacenes, clientes, pedidos y proveedores basada en la base de datos actual. | **PASS** |
| **TC-04** | Carga de Gráficos | 1. Navegar al Dashboard.<br>2. Observar la sección de gráficos. | Se inicializan correctamente los gráficos de Chart.js: "Entradas y Salidas de Inventario" (líneas) y "Ocupación de Almacenes" (dona). | **PASS** |

---

## 3. Gestión de Inventario (Productos)

| ID | Caso de Prueba | Pasos de Ejecución | Criterio de Aceptación (Resultado Esperado) | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **TC-05** | Búsqueda Global | 1. Ir a la pestaña "Productos".<br>2. Escribir un SKU (ej. `SKU-001`) o término (ej. `Echo`) en el buscador superior. | La tabla de productos se filtra dinámicamente mostrando solo los elementos que coincidan con la búsqueda. | **PASS** |
| **TC-06** | Registro de Nuevo Producto | 1. Ir a "Productos".<br>2. Presionar "+ Registrar Producto".<br>3. Llenar los campos: Nombre, SKU, Categoría, Stock inicial y Precio.<br>4. Presionar "Registrar Producto". | El producto se inserta al inicio de la lista de productos en el estado local, se envía al backend (`/api/state`) y se cierra el modal. | **PASS** |

---

## 4. Visualización de Módulos Operativos

| ID | Caso de Prueba | Pasos de Ejecución | Criterio de Aceptación (Resultado Esperado) | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **TC-07** | Listado de Almacenes | 1. Ir a la pestaña "Almacenes". | Se muestra la lista de almacenes disponibles, ubicaciones, porcentaje de capacidad y estados (ej. `Active`, `Full`). | **PASS** |
| **TC-08** | Seguimiento de Pedidos | 1. Ir a la pestaña "Pedidos". | Se visualizan los registros de órdenes con ID de pedido, cliente, producto, monto final, fecha y estado de envío. | **PASS** |

---

## 5. Reportes y Exportación de Datos

| ID | Caso de Prueba | Pasos de Ejecución | Criterio de Aceptación (Resultado Esperado) | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **TC-09** | Descarga de Reporte PDF | 1. Ir a la pestaña "Reportes".<br>2. Presionar el botón "Descargar Reporte PDF". | Se consume el endpoint de backend `/api/reportes` y se descarga automáticamente un archivo de tipo PDF con el resumen de inventario y estadísticas. | **PASS** |

---

## 6. Configuración y Restablecimiento

| ID | Caso de Prueba | Pasos de Ejecución | Criterio de Aceptación (Resultado Esperado) | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **TC-10** | Restablecimiento de Fábrica | 1. Ir a la pestaña "Configuración".<br>2. Presionar el botón "Factory Reset".<br>3. Aceptar la confirmación del navegador. | Se borra el `localStorage`, se envía petición de reset al backend (`/api/reset`) y se recarga la página mostrando nuevamente la pantalla de login. | **PASS** |

---

## Registro de Evidencias y Conclusiones

*   **Entorno de Ejecución**: Producción (Vercel)
*   **Enlace de Validación**: [https://nexusinventario-dtsd.vercel.app](https://nexusinventario-dtsd.vercel.app)
*   **Fecha de Validación**: 20 de mayo de 2026

### Observaciones Finales:
1.  **Validación de Login (TC-01, TC-02)**: La transición es instantánea. La persistencia funciona de manera local en el navegador del usuario a través del estado local sincronizado con los endpoints.
2.  **Dashboard y Gráficos (TC-03, TC-04)**: Los indicadores numéricos coinciden con los datos en la base de datos JSON de producción, y los gráficos interactivos de Chart.js renderizan sin errores en el canvas.
3.  **Gestión de Productos (TC-05, TC-06)**: La inserción y el filtrado interactivo son rápidos y responsivos.
4.  **Descarga de PDF (TC-09)**: El backend de Express empaquetado en la función serverless de Vercel genera el archivo en tiempo real mediante `pdfkit` y lo descarga correctamente con el formato requerido.
5.  **Factory Reset (TC-10)**: Limpia el localStorage del cliente, realiza una llamada exitosa al endpoint `/api/reset` en Vercel, y redirige a la pantalla de acceso limpia.

**Resultado Global**: **10 / 10 Pruebas Exitosas (100% PASS)**.
