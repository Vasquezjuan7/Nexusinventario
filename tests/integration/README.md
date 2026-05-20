# Pruebas de Integración con Postman - Nexus Inventory

Este directorio contiene la colección de pruebas de integración de Postman diseñada para validar de manera automatizada el correcto funcionamiento de los endpoints de la API de **Nexus Inventory**.

---

## Colección de Pruebas

El archivo [`nexus_inventory.postman_collection.json`](file:///c:/Users/juanv/OneDrive/Documentos/Citasmedicass/tests/integration/nexus_inventory.postman_collection.json) contiene la especificación de peticiones HTTP, sus payloads y scripts de validación automática.

### Endpoints Documentados y URLs de Prueba

Las URLs asumen que el servidor está corriendo en **local** (`http://localhost:3000`) o en tu entorno de producción en **Vercel** (`https://tu-app-vercel.vercel.app`).

#### 1. Obtener Estado del Inventario
*   **Método**: `GET`
*   **URL**: `{{base_url}}/api/state`
*   **Descripción**: Obtiene la información completa del nexo (productos, almacenes, clientes, órdenes, etc.).
*   **Aserciones Automáticas**:
    *   Código de respuesta: `200 OK`.
    *   Formato de respuesta: JSON.
    *   Verificación de que existan los arreglos de `"products"` y `"warehouses"`.

#### 2. Actualizar Estado del Inventario
*   **Método**: `POST`
*   **URL**: `{{base_url}}/api/state`
*   **Encabezados (Headers)**:
    *   `Content-Type: application/json`
*   **Cuerpo (Body - raw JSON)**:
```json
{
  "isLoggedIn": true,
  "products": [
    {
      "id": "TEST-SKU-999",
      "name": "Dispositivo de Prueba de Integración",
      "category": "Electrónica",
      "price": 199.99,
      "stock": 10,
      "warehouse": "Amazon-MX1",
      "rating": 5.0
    }
  ],
  "warehouses": [
    {
      "id": "Amazon-MX1",
      "location": "Estado de México",
      "capacity": "10%",
      "status": "Active"
    }
  ],
  "customers": [],
  "orders": [],
  "suppliers": [],
  "billing": []
}
```
*   **Aserciones Automáticas**:
    *   Código de respuesta: `200 OK`.
    *   Verificación del mensaje de éxito en la respuesta: `{"success": true, "message": "State saved successfully"}`.

#### 3. Generar Reporte PDF
*   **Método**: `GET`
*   **URL**: `{{base_url}}/api/reportes`
*   **Descripción**: Genera el reporte ejecutivo en PDF y lo transmite como descarga directa.
*   **Aserciones Automáticas**:
    *   Código de respuesta: `200 OK`.
    *   Tipo de contenido en respuesta: `application/pdf`.
    *   Encabezado `Content-Disposition` contiene la descarga del archivo `"reporte.pdf"`.

#### 4. Restablecer Inventario (Factory Reset)
*   **Método**: `POST`
*   **URL**: `{{base_url}}/api/reset`
*   **Descripción**: Borra los datos modificados y restablece el inventario con los datos semilla (`seed.json`).
*   **Aserciones Automáticas**:
    *   Código de respuesta: `200 OK`.
    *   Verificación de que se hayan recargado los productos iniciales por defecto.

---

## ¿Cómo Ejecutar las Pruebas?

### Opción A: Desde la Aplicación de Postman (Interfaz Gráfica)

1. **Importar la Colección**:
   - Abre Postman.
   - Presiona el botón **Import** (en la esquina superior izquierda).
   - Arrastra o selecciona el archivo `nexus_inventory.postman_collection.json` ubicado en esta carpeta.
2. **Configurar la Variable de Entorno**:
   - Selecciona la colección **Nexus Inventory API Integration Tests**.
   - Dirígete a la pestaña **Variables**.
   - Cambia el valor de `base_url` (por defecto es `http://localhost:3000`) si tu servidor está corriendo en otro puerto o en Vercel.
3. **Ejecutar la Colección Completa (Collection Runner)**:
   - Haz clic secundario sobre la colección importada y selecciona **Run collection**.
   - Haz clic en el botón naranja **Run Nexus Inventory API...**.
   - Postman ejecutará las 4 peticiones secuencialmente y mostrará los resultados de los tests automatizados (deberían marcar `PASS` en verde).
4. **Exportar Resultados**:
   - Al terminar el runner, presiona **Export Results** en la esquina superior derecha para guardar el reporte de pruebas en formato JSON.

### Opción B: Desde la Terminal usando Newman (Recomendado para Automatización)

Newman es el ejecutor de colecciones oficial de Postman para la línea de comandos.

1. **Instalar Newman globalmente (opcional)**:
   ```bash
   npm install -g newman
   ```
2. **Correr las pruebas**:
   Ejecuta el siguiente comando en esta carpeta:
   ```bash
   npx newman run nexus_inventory.postman_collection.json --env-var base_url=http://localhost:3000
   ```
   *Nota: Reemplaza `http://localhost:3000` con tu URL de Vercel si deseas probar contra producción.*

3. Newman mostrará una tabla resumida en la terminal con el estado de cada test y las estadísticas de ejecución.
