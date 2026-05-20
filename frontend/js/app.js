/**
 * Core Application Logic - Nexus Inventory
 * Handle routing, state management, and analytics.
 */

const app = {
    init: async () => {
        try {
            const response = await fetch('/api/state');
            if (response.ok) {
                window.medData = await response.json();
            }
        } catch (e) {
            console.warn("Backend offline, using offline localStorage state:", e);
        }

        if (window.medData.isLoggedIn) {
            document.getElementById('login-screen').style.display = 'none';
            app.showPage('dashboard');
        }
        console.log("Nexus Inventory System Online.");
    },

    handleLogin: async (e) => {
        e.preventDefault();
        window.medData.isLoggedIn = true;
        await window.saveMedState(window.medData);
        document.getElementById('login-screen').style.display = 'none';
        app.showPage('dashboard');
    },

    showPage: (page) => {
        const content = document.getElementById('content');
        const navItems = document.querySelectorAll('.nav-item');
        
        // Update Active Nav
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('onclick')?.includes(`'${page}'`)) {
                item.classList.add('active');
            }
        });

        // Load Content
        switch(page) {
            case 'dashboard':
                content.innerHTML = UI.renderDashboard(window.medData);
                app.initCharts();
                break;
            case 'products':
                content.innerHTML = UI.renderProducts(window.medData.products);
                break;
            case 'warehouses':
                content.innerHTML = UI.renderWarehouses(window.medData.warehouses);
                break;
            case 'orders':
                content.innerHTML = UI.renderOrders(window.medData.orders);
                break;
            case 'customers':
                content.innerHTML = UI.renderCustomers(window.medData.customers || []);
                break;
            case 'suppliers':
                content.innerHTML = UI.renderSuppliers(window.medData.suppliers);
                break;
            case 'categories':
                content.innerHTML = UI.renderCategories();
                break;
            case 'reports':
                content.innerHTML = UI.renderReports(window.medData);
                app.initReports();
                break;
            case 'settings':
                content.innerHTML = UI.renderSettings();
                break;
            default:
                content.innerHTML = `<div class="fade-in"><h1>Modulo en Desarrollo</h1><p>Esta sección estará disponible en la próxima actualización del Nexo.</p></div>`;
        }

        // Re-initialize Icons
        if (window.lucide) window.lucide.createIcons();
    },

    initReports: () => {
        const downloadBtn = document.getElementById('downloadReport');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                fetch('/api/reportes')
                    .then(async (response) => {
                        if (!response.ok) {
                            throw new Error('Error al generar el reporte');
                        }
                        const contentType = response.headers.get('Content-Type') || '';
                        if (!contentType.includes('application/pdf')) {
                            throw new Error('La respuesta no es un PDF válido');
                        }
                        return response.blob();
                    })
                    .then(blob => {
                        const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = 'reporte.pdf';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Hubo un error al generar el reporte.');
                    });
            });
        }
    },

    openModal: (id) => {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'flex';
    },

    closeModal: (id) => {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'none';
    },

    saveProduct: async (e) => {
        e.preventDefault();
        const newP = {
            id: document.getElementById('prod-sku').value,
            name: document.getElementById('prod-name').value,
            category: document.getElementById('prod-cat').value,
            price: parseFloat(document.getElementById('prod-price').value),
            stock: parseInt(document.getElementById('prod-stock').value),
            warehouse: 'Amazon-MX1', // Default assignment
            rating: 5.0
        };
        
        window.medData.products.unshift(newP);
        await window.saveMedState(window.medData);
        app.closeModal('product-modal');
        app.showPage('products');
    },

    globalSearch: (query) => {
        const q = query.toLowerCase();
        const filtered = window.medData.products.filter(p => 
            p.name.toLowerCase().includes(q) || 
            p.id.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
        
        if (document.getElementById('content').innerHTML.includes('Inventario de Productos')) {
            document.getElementById('content').innerHTML = UI.renderProducts(filtered);
            if (window.lucide) window.lucide.createIcons();
        }
    },

    factoryReset: async () => {
        if(confirm("¡ADVERTENCIA! Se eliminarán todos los datos del inventario Nexus. ¿Continuar?")) {
            localStorage.removeItem('nexus_inventory_v1');
            try {
                await fetch('/api/reset', { method: 'POST' });
            } catch (e) {
                console.error("Could not reset backend state:", e);
            }
            location.reload();
        }
    },

    initCharts: () => {
        const invCtx = document.getElementById('inventoryChart')?.getContext('2d');
        const occCtx = document.getElementById('occupancyChart')?.getContext('2d');

        if (invCtx) {
            new Chart(invCtx, {
                type: 'line',
                data: {
                    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
                    datasets: [{
                        label: 'Entradas',
                        data: [400, 600, 300, 900, 1200, 800, 1100],
                        borderColor: '#FF9900',
                        backgroundColor: 'rgba(255, 153, 0, 0.1)',
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Salidas',
                        data: [300, 500, 450, 700, 1000, 950, 1050],
                        borderColor: '#232F3E',
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        if (occCtx) {
            const wh = window.medData.warehouses || [];
            const colors = ['#FF9900', '#232F3E', '#B12704', '#146EB4', '#00A8E1', '#7B68EE', '#2E8B57', '#CD853F', '#708090', '#DC143C', '#9932CC', '#20B2AA'];
            new Chart(occCtx, {
                type: 'doughnut',
                data: {
                    labels: wh.map(w => w.id),
                    datasets: [{
                        data: wh.map(w => parseInt(w.capacity) || 0),
                        backgroundColor: wh.map((_, i) => colors[i % colors.length])
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }
    }
};

window.app = app;
document.addEventListener('DOMContentLoaded', app.init);
