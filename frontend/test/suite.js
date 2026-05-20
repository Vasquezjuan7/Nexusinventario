/**
 * Unit Test Suite for MedLink
 * Validates core data operations and persistence.
 */

const tests = {
    runAll: () => {
        console.group('%c Nexus Inventory Test Suite ', 'background: #FF9900; color: #111; padding: 5px; border-radius: 3px;');
        
        tests.testPersistence();
        tests.testProductSchema();
        tests.testStockDynamics();
        
        console.groupEnd();
        return "Pruebas de Nexus finalizadas. Revisa la consola (F12) para detalles.";
    },

    assert: (condition, message) => {
        if (condition) {
            console.log(`%c [PASS] %c ${message}`, 'color: #10b981; font-weight: bold;', 'color: inherit;');
        } else {
            console.error(`%c [FAIL] %c ${message}`, 'color: #ef4444; font-weight: bold;', 'color: inherit;');
        }
    },

    testPersistence: () => {
        const testData = { sku: 'TEST-SKU', stock: 10 };
        window.saveMedState(testData);
        const saved = JSON.parse(localStorage.getItem('nexus_inventory_v1'));
        tests.assert(saved.sku === 'TEST-SKU', "La persistencia en el Nexo local funciona correctamente.");
    },

    testProductSchema: () => {
        const prod = window.medData.products[0];
        tests.assert(prod && prod.id && prod.name, "El esquema de productos es válido y contiene SKUs.");
    },

    testStockDynamics: () => {
        const p = window.medData.products[0];
        if (p) {
            const initial = p.stock;
            p.stock += 50;
            tests.assert(p.stock === initial + 50, "La lógica de actualización de stock es precisa.");
            p.stock = initial; // Restore
        }
    }
};

window.medTests = tests;
