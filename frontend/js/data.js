/**
 * Data Layer for Nexus Inventory
 * Handles state and persistence for Products, Orders, and Warehouses.
 */

const initialState = typeof window !== 'undefined' && window.NEXUS_SEED
    ? window.NEXUS_SEED
    : { isLoggedIn: false, products: [], warehouses: [], customers: [], orders: [], suppliers: [], billing: [] };

// State Persistence logic
window.saveMedState = async (state) => {
    // Save to local storage as offline backup
    localStorage.setItem('nexus_inventory_v1', JSON.stringify(state));
    
    // Save to backend API
    try {
        await fetch('/api/state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(state)
        });
    } catch (e) {
        console.warn("Could not save to backend server (offline):", e);
    }
};

window.loadOfflineState = () => {
    const saved = localStorage.getItem('nexus_inventory_v1');
    return saved ? JSON.parse(saved) : initialState;
};

// Global state initialized to offline fallback until app.init updates it
window.medData = window.loadOfflineState();

