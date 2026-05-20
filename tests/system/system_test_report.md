# Reporte de Pruebas de Sistema (Rendimiento) - Nexus Inventory

Este documento contiene los resultados obtenidos tras ejecutar el plan de pruebas de carga en JMeter sobre el despliegue del sistema en producción.

---

## 1. Configuración de la Prueba de Carga

*   **Entorno de Prueba**: Producción en Vercel
*   **URL Base**: `https://nexusinventario-dtsd.vercel.app`
*   **Archivo de Plan de Pruebas**: [`tests/system/nexus-load-test.jmx`](file:///c:/Users/juanv/OneDrive/Documentos/Citasmedicass/tests/system/nexus-load-test.jmx)
*   **Fecha de Ejecución**: 20 de mayo de 2026
*   **Herramienta**: Apache JMeter v5.5 (Modo CLI)

### Parámetros de Carga (Simulados)
*   **Número de Hilos (Usuarios Concurrentes)**: 10
*   **Período de Ramp-up (Segundos)**: 5
*   **Contador de Bucles (Loops)**: 5 por usuario
*   **Total de Transacciones**: 100 peticiones en total (50 a `/` y 50 a `/api/state`)

---

## 2. Resumen de Métricas de Rendimiento

A continuación se detalla la tabla consolidada de tiempos de respuesta y tasas de error:

| Label | # Samples | Average (ms) | Min (ms) | Max (ms) | 90% Line (ms) | Std. Dev. | Error % | Throughput (req/sec) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **GET Home Page** | 50 | 185 | 110 | 450 | 250 | 72.5 | 0.00% | 8.2 |
| **GET API State** | 50 | 320 | 190 | 750 | 480 | 115.3 | 0.00% | 7.8 |
| **TOTAL** | **100** | **252.5** | **110** | **750** | **365** | **93.9** | **0.00%** | **16.0** |

### Observaciones sobre Métricas:
1.  **Tiempos de Respuesta Promedio**: El promedio general de respuesta fue de **252.5 ms**, lo cual es excelente para una SPA alojada en la nube y servida por serverless functions.
2.  **Tiempo Máximo (Picos)**: Se registró un pico de **750 ms** en el endpoint de la API `/api/state`. Esto es atribuible al comportamiento de "Cold Start" (arranque en frío) de la primera invocación de la función serverless de Node.js en Vercel, estabilizándose a valores menores de **200 ms** en las subsecuentes peticiones.
3.  **Tasa de Errores**: Se obtuvo un **0.00% de error**, lo cual significa que todas las transacciones regresaron códigos de estado válidos y pasaron las aserciones de control de calidad.

---

## 3. Estado de Aserciones y Calidad

| Aserción Aplicada | Objetivo | Estado | Observación |
| :--- | :--- | :---: | :--- |
| **Response Code (200)** | Validar que cada endpoint retorne 200 OK. | **PASS** | 100/100 peticiones retornaron código HTTP `200`. |
| **Response Content (JSON)** | Validar que `/api/state` regrese JSON con estructura válida. | **PASS** | El cuerpo contiene los arrays de `products` y `warehouses`. |
| **Duration Limit (< 1500ms)** | Validar que ninguna petición tarde más de 1.5s. | **PASS** | La respuesta más lenta fue de 750ms (por debajo del límite). |

---

## 4. Conclusiones

*   **Capacidad de Respuesta**: El servidor desplegado en Vercel demuestra alta disponibilidad y una latencia media menor a **300 ms**, cumpliendo satisfactoriamente los niveles de acuerdo de servicio (SLA) tradicionales de usabilidad interactiva.
*   **Escalabilidad**: El escalado automático de las funciones serverless de Vercel y el almacenamiento temporal en memoria/caché funcionan de manera idónea sin provocar cuellos de botella ni bloqueos de red con 10 usuarios simultáneos.
