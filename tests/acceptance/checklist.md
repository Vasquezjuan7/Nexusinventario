# Pruebas de Aceptación - Nexus Inventory

Este documento contiene el checklist de criterios de aceptación y casos de prueba funcionales para verificar que las características principales del sistema **Nexus Inventory** funcionan correctamente de acuerdo con los requerimientos del usuario.

---

## 1. Módulo de Autenticación (Acceso al Nexo)

| ID | Caso de Prueba | Pasos de Ejecución | Criterio de Aceptación (Resultado Esperado) | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Inicio de Sesión Exitoso | 1. Acceder a la URL de la aplicación.<br>2. Dejar las credenciales predeterminadas (`admin@nexus.com` y token de acceso).<br>3. Presionar "Entrar al Nexo". | El formulario valida correctamente, la pantalla de login desaparece y se muestra el Dashboard principal. | `[ ]` |
| **TC-02** | Persistencia de Sesión | 1. Iniciar sesión exitosamente (TC-01).<br>2. Recargar la página (F5) o abrir en una nueva pestaña. | La sesión se mantiene iniciada; el sistema detecta `isLoggedIn: true` en el estado persistido y abre el Dashboard directamente. | `[ ]` |

---

## 2. Dashboard e Indicadores (Visualización de Datos)

| ID | Caso de Prueba | Pasos de Ejecución | Criterio de Aceptación (Resultado Esperado) | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **TC-03** | Resumen de Métricas | 1. Estar en la página de "Dashboard".<br>2. Observar las métricas de inventario. | Se visualiza la cantidad correcta de productos, almacenes, clientes, pedidos y proveedores basada en la base de datos actual. | `[ ]` |
| **TC-04** | Carga de Gráficos | 1. Navegar al Dashboard.<br>2. Observar la sección de gráficos. | Se inicializan correctamente los gráficos de Chart.js: "Entradas y Salidas de Inventario" (líneas) y "Ocupación de Almacenes" (dona). | `[ ]` |

---

## 3. Gestión de Inventario (Productos)

| ID | Caso de Prueba | Pasos de Ejecución | Criterio de Aceptación (Resultado Esperado) | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **TC-05** | Búsqueda Global | 1. Ir a la pestaña "Productos".<br>2. Escribir un SKU (ej. `SKU-001`) o término (ej. `Echo`) en el buscador superior. | La tabla de productos se filtra dinámicamente mostrando solo los elementos que coincidan con la búsqueda. | `[ ]` |
| **TC-06** | Registro de Nuevo Producto | 1. Ir a "Productos".<br>2. Presionar "+ Registrar Producto".<br>3. Llenar los campos: Nombre, SKU, Categoría, Stock inicial y Precio.<br>4. Presionar "Registrar Producto". | El producto se inserta al inicio de la lista de productos en el estado local, se envía al backend (`/api/state`) y se cierra el modal. | `[ ]` |

---

## 4. Visualización de Módulos Operativos

| ID | Caso de Prueba | Pasos de Ejecución | Criterio de Aceptación (Resultado Esperado) | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **TC-07** | Listado de Almacenes | 1. Ir a la pestaña "Almacenes". | Se muestra la lista de almacenes disponibles, ubicaciones, porcentaje de capacidad y estados (ej. `Active`, `Full`). | `[ ]` |
| **TC-08** | Seguimiento de Pedidos | 1. Ir a la pestaña "Pedidos". | Se visualizan los registros de órdenes con ID de pedido, cliente, producto, monto final, fecha y estado de envío. | `[ ]` |

---

## 5. Reportes y Exportación de Datos

| ID | Caso de Prueba | Pasos de Ejecución | Criterio de Aceptación (Resultado Esperado) | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **TC-09** | Descarga de Reporte PDF | 1. Ir a la pestaña "Reportes".<br>2. Presionar el botón "Descargar Reporte PDF". | Se consume el endpoint de backend `/api/reportes` y se descarga automáticamente un archivo de tipo PDF con el resumen de inventario y estadísticas. | `[ ]` |

---

## 6. Configuración y Restablecimiento

| ID | Caso de Prueba | Pasos de Ejecución | Criterio de Aceptación (Resultado Esperado) | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **TC-10** | Restablecimiento de Fábrica | 1. Ir a la pestaña "Configuración".<br>2. Presionar el botón "Factory Reset".<br>3. Aceptar la confirmación del navegador. | Se borra el `localStorage`, se envía petición de reset al backend (`/api/reset`) y se recarga la página mostrando nuevamente la pantalla de login. | `[ ]` |

---

## Registro de Evidencias (Ejecución de Pruebas)

Al ejecutar las pruebas en el entorno de producción (desplegado en Vercel) o local:
1. Validar que cada uno de los casos de prueba pase satisfactoriamente (`PASS`).
2. En caso de fallar, documentar el error en la columna "Estado" (`FAIL`) junto con el error arrojado por el navegador o servidor.
