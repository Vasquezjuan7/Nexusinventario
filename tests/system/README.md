# Pruebas de Sistema con Apache JMeter - Nexus Inventory

Este directorio contiene el script de plan de pruebas de carga y rendimiento de JMeter para validar el comportamiento y los tiempos de respuesta de Nexus Inventory desplegado en Vercel.

## Requisitos Previos

1. **Java Development Kit (JDK)** o Java Runtime Environment (JRE) versión 8 o superior instalado.
2. **Apache JMeter** instalado (versión 5.0 o superior recomendada).
   - Descarga desde [jmeter.apache.org](https://jmeter.apache.org/download_jmeter.cgi).
   - Descomprime y (opcionalmente) agrega la carpeta `bin` de JMeter a las variables de entorno de tu sistema (PATH) para poder ejecutar el comando `jmeter` globalmente.

---

## Ejecución de Pruebas

Se recomienda ejecutar JMeter en **modo CLI (No-GUI)** para no consumir recursos del sistema de prueba y obtener mediciones más precisas de tiempos de respuesta.

### Comando de Ejecución Estándar (Apuntando a Vercel)

Abre la terminal en esta carpeta y ejecuta el siguiente comando:

```bash
jmeter -n -t nexus-load-test.jmx -l results.jtl -e -o dashboard-report -Jhost=tu-app-vercel.vercel.app -Jport=443 -Jprotocol=https
```

#### Explicación de los Parámetros:
- `-n`: Ejecuta JMeter en modo no gráfico (CLI).
- `-t nexus-load-test.jmx`: Especifica el archivo del plan de pruebas.
- `-l results.jtl`: Nombre del archivo de bitácora para guardar los resultados crudos de las peticiones.
- `-e -o dashboard-report`: Genera automáticamente un reporte visual HTML detallado en la carpeta `dashboard-report`.
- `-Jhost=...`: Define dinámicamente el host al que se le aplicará la carga (tu dominio de Vercel).
- `-Jport=443`: Puerto HTTPS estándar para Vercel.
- `-Jprotocol=https`: Protocolo seguro requerido para despliegues en producción.

### Ejecución Local (Para Pruebas de Desarrollo)

Si deseas probar el backend corriendo localmente en el puerto `3000`:

```bash
jmeter -n -t nexus-load-test.jmx -l results_local.jtl -e -o dashboard-report-local -Jhost=localhost -Jport=3000 -Jprotocol=http
```

---

## Estructura de la Carga

El plan de pruebas realiza la siguiente simulación:
- **Hilos (Usuarios Concurrentes)**: 10 usuarios simultáneos.
- **Ramp-up (Tiempo de subida)**: 5 segundos (los 10 usuarios se incorporan gradualmente a lo largo de 5 segundos).
- **Ciclos (Loops)**: 5 iteraciones por usuario.
- **Total de Peticiones**: 100 peticiones en total (50 a la página principal `/` y 50 al endpoint `/api/state`).

---

## Criterios de Aceptación y Validación

El script valida automáticamente:
1. **Response Code Assertion**: Cada petición debe retornar un código de estado `200 OK`.
2. **Response Content Assertion**: El endpoint de la API `/api/state` debe retornar datos JSON válidos que contengan las claves `"products"` y `"warehouses"`.
3. **Duration Assertion**: Cada petición debe completarse en menos de **1.5 segundos (1500 ms)**.

## Visualización de Resultados

Una vez completada la prueba:
1. Se creará la carpeta `dashboard-report` (o la que hayas especificado con `-o`).
2. Abre el archivo `dashboard-report/index.html` en cualquier navegador web.
3. Podrás visualizar gráficos detallados de:
   - Tiempos de respuesta a lo largo del tiempo (Over Time).
   - Porcentaje de errores de las aserciones.
   - Rendimiento (Throughput - peticiones por segundo).
   - Distribución de percentiles de latencia.
