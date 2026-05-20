const fs = require('fs');
const path = require('path');
const { readDb, writeDb } = require('../utils/db');

// Mock fs and fs.promises
jest.mock('fs', () => ({
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    promises: {
        readFile: jest.fn(),
        writeFile: jest.fn()
    }
}));

describe('Database Utility Functions', () => {
    const mockDbPath = path.join('mock', 'data', 'db.json');
    const mockDefaultState = { items: [1, 2, 3] };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('readDb', () => {
        it('should return defaultState and write it to dbPath if database file does not exist', async () => {
            fs.existsSync.mockReturnValue(false);
            fs.promises.writeFile.mockResolvedValue(true);

            const result = await readDb(mockDbPath, mockDefaultState);

            expect(fs.existsSync).toHaveBeenCalledWith(mockDbPath);
            expect(fs.promises.writeFile).toHaveBeenCalledWith(
                mockDbPath,
                JSON.stringify(mockDefaultState, null, 2),
                'utf8'
            );
            expect(result).toEqual(mockDefaultState);
        });

        it('should read and parse database content if file exists', async () => {
            const mockSavedState = { items: [9, 9] };
            fs.existsSync.mockReturnValue(true);
            fs.promises.readFile.mockResolvedValue(JSON.stringify(mockSavedState));

            const result = await readDb(mockDbPath, mockDefaultState);

            expect(fs.existsSync).toHaveBeenCalledWith(mockDbPath);
            expect(fs.promises.readFile).toHaveBeenCalledWith(mockDbPath, 'utf8');
            expect(result).toEqual(mockSavedState);
        });

        it('should return defaultState and log error if reading fails', async () => {
            fs.existsSync.mockReturnValue(true);
            fs.promises.readFile.mockRejectedValue(new Error('Read error'));
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await readDb(mockDbPath, mockDefaultState);

            expect(consoleSpy).toHaveBeenCalled();
            expect(result).toEqual(mockDefaultState);
            consoleSpy.mockRestore();
        });
    });

    describe('writeDb', () => {
        it('should create directories if they do not exist and write file', async () => {
            // First existsSync call: check if parent directory exists (false)
            fs.existsSync.mockReturnValue(false);
            fs.promises.writeFile.mockResolvedValue(true);

            const testState = { ok: true };
            const success = await writeDb(mockDbPath, testState);

            const expectedDir = path.dirname(mockDbPath);
            expect(fs.existsSync).toHaveBeenCalledWith(expectedDir);
            expect(fs.mkdirSync).toHaveBeenCalledWith(expectedDir, { recursive: true });
            expect(fs.promises.writeFile).toHaveBeenCalledWith(
                mockDbPath,
                JSON.stringify(testState, null, 2),
                'utf8'
            );
            expect(success).toBe(true);
        });

        it('should write file directly if parent directory already exists', async () => {
            // First existsSync call: check if parent directory exists (true)
            fs.existsSync.mockReturnValue(true);
            fs.promises.writeFile.mockResolvedValue(true);

            const testState = { ok: true };
            const success = await writeDb(mockDbPath, testState);

            const expectedDir = path.dirname(mockDbPath);
            expect(fs.existsSync).toHaveBeenCalledWith(expectedDir);
            expect(fs.mkdirSync).not.toHaveBeenCalled();
            expect(fs.promises.writeFile).toHaveBeenCalledWith(
                mockDbPath,
                JSON.stringify(testState, null, 2),
                'utf8'
            );
            expect(success).toBe(true);
        });

        it('should return false and log error if writing fails', async () => {
            fs.existsSync.mockReturnValue(true);
            fs.promises.writeFile.mockRejectedValue(new Error('Write error'));
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const testState = { ok: true };
            const success = await writeDb(mockDbPath, testState);

            expect(consoleSpy).toHaveBeenCalled();
            expect(success).toBe(false);
            consoleSpy.mockRestore();
        });
    });
});
