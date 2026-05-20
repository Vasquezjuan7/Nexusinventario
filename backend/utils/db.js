const fs = require('fs');
const path = require('path');

/**
 * Reads database state from the specified path, falling back to defaultState.
 * If the file does not exist, it initializes it with defaultState.
 * 
 * @param {string} dbPath - Absolute path to the database file.
 * @param {object} defaultState - The fallback state.
 * @returns {Promise<object>} The database state.
 */
const getActualDbPath = (dbPath) => {
    if (process.env.VERCEL) {
        return path.join('/tmp', path.basename(dbPath));
    }
    return dbPath;
};

const readDb = async (dbPath, defaultState) => {
    const actualDbPath = getActualDbPath(dbPath);
    try {
        if (!fs.existsSync(actualDbPath)) {
            // Initialize with default state if file doesn't exist
            await writeDb(dbPath, defaultState);
            return defaultState;
        }
        const data = await fs.promises.readFile(actualDbPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading database:", err);
        return defaultState;
    }
};

/**
 * Writes the database state to the specified path.
 * 
 * @param {string} dbPath - Absolute path to the database file.
 * @param {object} state - The state to write.
 * @returns {Promise<boolean>} True if successful, false otherwise.
 */
const writeDb = async (dbPath, state) => {
    const actualDbPath = getActualDbPath(dbPath);
    try {
        // Ensure parent directory exists
        const dir = path.dirname(actualDbPath);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        await fs.promises.writeFile(actualDbPath, JSON.stringify(state, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error("Error writing database:", err);
        return false;
    }
};

module.exports = {
    readDb,
    writeDb
};
