const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'data', 'db.json');
const seedPath = path.join(__dirname, 'data', 'seed.json');

const { readDb: readDbUtil, writeDb: writeDbUtil } = require('./utils/db');

const defaultState = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

// Helper wrappers using local paths
const readDb = () => readDbUtil(dbPath, defaultState);
const writeDb = (state) => writeDbUtil(dbPath, state);


// --- API Endpoints ---

// Get complete state
app.get('/api/state', async (req, res) => {
    const state = await readDb();
    res.json(state);
});

// Update complete state
app.post('/api/state', async (req, res) => {
    const newState = req.body;
    if (!newState) {
        return res.status(400).json({ error: 'Invalid state data' });
    }
    const success = await writeDb(newState);
    if (success) {
        res.json({ success: true, message: 'State saved successfully' });
    } else {
        res.status(500).json({ error: 'Failed to write to database' });
    }
});

// Reset database state to defaults
app.post('/api/reset', async (req, res) => {
    const success = await writeDb(defaultState);
    if (success) {
        res.json(defaultState);
    } else {
        res.status(500).json({ error: 'Failed to reset state' });
    }
});

// Generar PDF (debe ir antes del catch-all y del static fallback)
app.get('/api/reportes', async (req, res) => {
    try {
        const state = await readDb();
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="reporte.pdf"');
        doc.pipe(res);

        doc.fontSize(20).text('Reporte - Nexus Inventory', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString('es-ES', { dateStyle: 'long' })}`, { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(14).text('Resumen General', { underline: true });
        doc.fontSize(11).text(
            `Productos: ${state.products.length}  |  Almacenes: ${state.warehouses.length}  |  ` +
            `Clientes: ${(state.customers || []).length}  |  Pedidos: ${state.orders.length}  |  ` +
            `Proveedores: ${state.suppliers.length}`
        );
        doc.moveDown();

        const addSection = (title, lines) => {
            doc.fontSize(13).text(title, { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(10);
            lines.forEach(line => doc.text(line));
            doc.moveDown();
        };

        addSection('Productos (top 10 por stock)', state.products
            .sort((a, b) => b.stock - a.stock)
            .slice(0, 10)
            .map(p => `• ${p.id} - ${p.name} | $${p.price} | Stock: ${p.stock} | ${p.warehouse}`));

        addSection('Almacenes', state.warehouses
            .map(w => `• ${w.id} - ${w.location} | Capacidad: ${w.capacity} | ${w.status}`));

        addSection('Pedidos recientes', state.orders
            .slice(0, 10)
            .map(o => `• ${o.id} - ${o.customer} | ${o.product} | $${o.amount} | ${o.status}`));

        addSection('Proveedores', state.suppliers
            .slice(0, 10)
            .map(s => `• ${s.name} - ${s.category} | Lead time: ${s.leadTime}`));

        doc.fontSize(9).fillColor('#666666').text('Generado automáticamente por Nexus Inventory.', { align: 'center' });
        doc.end();
    } catch (err) {
        console.error('Error al generar PDF:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error al generar el reporte PDF' });
        }
    }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Fallback SPA (solo rutas que no sean API)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`  NEXUS INVENTORY SERVER ONLINE          `);
    console.log(`  Local: http://localhost:${PORT}        `);
    console.log(`=========================================`);
});
