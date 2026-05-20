/**
 * UI Components for Nexus Inventory
 * Amazon-style Logistics Dashboard
 */

const UI = {
    renderReports: (state) => {
        return `
            <div class="fade-in" id="reportes">
                <h1>Reportes</h1>
                <p>Genera un reporte en formato PDF con toda la información relevante.</p>
                <button id="downloadReport">Descargar Reporte PDF</button>
            </div>
        `;
    },
    renderDashboard: (state) => {
        const totalItems = state.products.reduce((acc, p) => acc + p.stock, 0);
        const pendingOrders = state.orders.filter(o => o.status === 'Processing').length;
        
        return `
            <div class="fade-in">
                <h1 style="margin-bottom: 1.5rem;">Resumen Logístico</h1>
                <div class="stats-grid">
                    <div class="stat-card">
                        <span class="stat-label">Stock Total</span>
                        <span class="stat-value">${totalItems.toLocaleString()}</span>
                        <div style="font-size: 0.8rem; color: var(--success);">+1,205 esta semana</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-label">Pedidos Pendientes</span>
                        <span class="stat-value">${pendingOrders}</span>
                        <div style="font-size: 0.8rem; color: #f59e0b;">Requiere despacho</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-label">Ingresos Mensuales</span>
                        <span class="stat-value">$42,500</span>
                        <div style="font-size: 0.8rem; color: var(--success);">+8% vs mes anterior</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-label">Almacenes Activos</span>
                        <span class="stat-value">${state.warehouses.length}</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-label">Clientes Registrados</span>
                        <span class="stat-value">${(state.customers || []).length}</span>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
                    <div class="stat-card">
                        <h3>Flujo de Inventario (Unidades)</h3>
                        <div style="height: 300px; position: relative; margin-top: 1rem;">
                            <canvas id="inventoryChart"></canvas>
                        </div>
                    </div>
                    <div class="stat-card">
                        <h3>Ocupación de Almacén</h3>
                        <div style="height: 300px; position: relative; margin-top: 1rem;">
                            <canvas id="occupancyChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="stat-card" style="margin-top: 1.5rem; padding: 0;">
                    <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between;">
                        <h3>Pedidos en Tiempo Real</h3>
                        <button class="btn" style="padding: 4px 12px; font-size: 0.8rem;">Ver todos</button>
                    </div>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="text-align: left; background: #fafafa; border-bottom: 1px solid var(--border); color: var(--text-muted);">
                                <th style="padding: 1rem;">ID Pedido</th>
                                <th style="padding: 1rem;">Cliente</th>
                                <th style="padding: 1rem;">Producto</th>
                                <th style="padding: 1rem;">Monto</th>
                                <th style="padding: 1rem;">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.orders.map(order => `
                                <tr style="border-bottom: 1px solid var(--border);">
                                    <td style="padding: 1rem; font-weight: 600;">#${order.id}</td>
                                    <td style="padding: 1rem;">${order.customer}</td>
                                    <td style="padding: 1rem;">${order.product}</td>
                                    <td style="padding: 1rem;">$${order.amount.toFixed(2)}</td>
                                    <td style="padding: 1rem;">
                                        <span style="padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; 
                                              background: ${order.status === 'Shipped' ? '#dcfce7' : order.status === 'Delivered' ? '#dbeafe' : '#fef9c3'}; 
                                              color: ${order.status === 'Shipped' ? '#166534' : order.status === 'Delivered' ? '#1e40af' : '#854d0e'};">
                                            ${order.status}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderProducts: (products) => {
        return `
            <div class="fade-in">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h1>Inventario de Productos</h1>
                    <button class="btn btn-primary" onclick="app.openModal('product-modal')">+ Cargar Producto</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
                    ${products.map(p => `
                        <div class="stat-card" style="padding: 0; overflow: hidden;">
                            <div style="height: 150px; background: #f8f8f8; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--border);">
                                <i data-lucide="package" style="width: 50px; height: 50px; color: var(--border);"></i>
                            </div>
                            <div style="padding: 1.5rem;">
                                <div style="display: flex; justify-content: space-between; align-items: start;">
                                    <h3 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--secondary);">${p.name}</h3>
                                    <span style="font-size: 0.7rem; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${p.id}</span>
                                </div>
                                <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">${p.category} | ${p.warehouse}</p>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-size: 1.25rem; font-weight: 700;">$${p.price}</span>
                                    <span style="color: ${p.stock < 100 ? 'var(--error)' : 'var(--success)'}; font-weight: 600;">${p.stock} dispon.</span>
                                </div>
                                <div style="margin-top: 1rem; height: 4px; background: #eee; border-radius: 2px; overflow: hidden;">
                                    <div style="width: ${Math.min(100, (p.stock/1000)*100)}%; height: 100%; background: var(--primary);"></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderWarehouses: (warehouses) => {
        return `
            <div class="fade-in">
                <h1>Red de Almacenes (Nodes)</h1>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">Monitoreo de capacidad en tiempo real.</p>
                <div style="display: grid; gap: 1.5rem;">
                    ${warehouses.map(w => `
                        <div class="stat-card" style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h3 style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i data-lucide="map-pin" style="color: var(--primary);"></i> ${w.id}
                                </h3>
                                <p style="color: var(--text-muted); font-size: 0.9rem;">${w.location}</p>
                            </div>
                            <div style="text-align: right; width: 300px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem;">
                                    <span>Capacidad Utilizada</span>
                                    <span style="font-weight: 600;">${w.capacity}</span>
                                </div>
                                <div style="height: 10px; background: #eee; border-radius: 5px; overflow: hidden;">
                                    <div style="width: ${w.capacity}; height: 100%; background: ${parseInt(w.capacity) > 90 ? 'var(--error)' : 'var(--success)'};"></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderOrders: (orders) => {
        return `
            <div class="fade-in">
                <h1>Gestión de Despacho</h1>
                <div class="stat-card" style="margin-top: 2rem;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="text-align: left; border-bottom: 1px solid var(--border);">
                                <th style="padding: 1rem;">ID</th>
                                <th style="padding: 1rem;">Fecha</th>
                                <th style="padding: 1rem;">Cliente</th>
                                <th style="padding: 1rem;">Total</th>
                                <th style="padding: 1rem;">Estado de Envío</th>
                                <th style="padding: 1rem;">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.map(o => `
                                <tr style="border-bottom: 1px solid var(--border);">
                                    <td style="padding: 1rem;">${o.id}</td>
                                    <td style="padding: 1rem;">${o.date}</td>
                                    <td style="padding: 1rem;">${o.customer}</td>
                                    <td style="padding: 1rem; font-weight: 700;">$${o.amount}</td>
                                    <td style="padding: 1rem;">
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <i data-lucide="${o.status === 'Shipped' ? 'package-check' : 'package-2'}" style="width: 16px; color: ${o.status === 'Shipped' ? 'var(--success)' : '#f59e0b'};"></i>
                                            ${o.status}
                                        </div>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <button class="btn" style="padding: 4px 8px; font-size: 0.75rem;">Detalles</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderCustomers: (customers) => {
        return `
            <div class="fade-in">
                <h1>Directorio de Clientes</h1>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">${customers.length} clientes activos en la red Nexus.</p>
                <div class="stat-card" style="margin-top: 1rem;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="text-align: left; border-bottom: 1px solid var(--border); color: var(--text-muted);">
                                <th style="padding: 1rem;">ID</th>
                                <th style="padding: 1rem;">Nombre</th>
                                <th style="padding: 1rem;">Email</th>
                                <th style="padding: 1rem;">Teléfono</th>
                                <th style="padding: 1rem;">Ciudad</th>
                                <th style="padding: 1rem;">Pedidos</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${customers.map(c => `
                                <tr style="border-bottom: 1px solid var(--border);">
                                    <td style="padding: 1rem; font-weight: 600;">${c.id}</td>
                                    <td style="padding: 1rem;">${c.name}</td>
                                    <td style="padding: 1rem;">${c.email}</td>
                                    <td style="padding: 1rem;">${c.phone}</td>
                                    <td style="padding: 1rem;">${c.city}</td>
                                    <td style="padding: 1rem;">
                                        <span style="background: #e2e8f0; padding: 2px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">${c.ordersCount}</span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderSuppliers: (suppliers) => {
        return `
            <div class="fade-in">
                <h1>Directorio de Proveedores</h1>
                <div style="margin-top: 2rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                    ${suppliers.map(s => `
                        <div class="stat-card">
                            <h3 style="color: var(--primary); margin-bottom: 0.5rem;">${s.name}</h3>
                            <p><strong>Especialidad:</strong> ${s.category}</p>
                            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">Lead Time: ${s.leadTime}</p>
                            <button class="btn" style="width: 100%; margin-top: 1rem; font-size: 0.8rem;">Contactar</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderCategories: () => {
        const cats = ['Electrónica', 'Hogar', 'Ropa', 'Libros', 'Juguetes', 'Deportes'];
        return `
            <div class="fade-in">
                <h1>Categorías Globales</h1>
                <div style="margin-top: 2rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem;">
                    ${cats.map(c => `
                        <div class="stat-card" style="text-align: center; cursor: pointer;">
                            <i data-lucide="layers" style="margin: 0 auto 1rem; color: var(--primary);"></i>
                            <h3>${c}</h3>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">${Math.floor(Math.random()*200)} SKU's</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderSettings: () => {
        return `
            <div class="fade-in">
                <h1>Configuración de Nexus</h1>
                <div class="stats-grid" style="margin-top: 2rem;">
                    <div class="stat-card">
                        <h3>Mantenimiento</h3>
                        <p style="font-size: 0.9rem; margin-bottom: 1.5rem; color: var(--text-muted);">Limpia el Nexo de datos temporales para procesos nuevos.</p>
                        <button class="btn btn-primary" onclick="app.factoryReset()" style="width: 100%;">Hard Reset</button>
                    </div>
                </div>
            </div>
        `;
    }
};

window.UI = UI;
