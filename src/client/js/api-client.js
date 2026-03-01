/**
 * Enchantment Engine - Web API Client
 * JavaScript client for communicating with the backend server
 * Version: 3.0.0
 */

class EnchantmentAPI {
    constructor(baseUrl = 'http://localhost:8080') {
        this.baseUrl = baseUrl;
        this.timeout = 30000; // 30 seconds
    }

    /**
     * Generic request method
     */
    async request(method, path, body = null) {
        const url = this.baseUrl + path;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                return {
                    success: response.ok,
                    status: response.status,
                    data: data
                };
            } else {
                const text = await response.text();
                return {
                    success: response.ok,
                    status: response.status,
                    data: text
                };
            }
        } catch (error) {
            console.error('API request failed:', error);
            return {
                success: false,
                status: 0,
                error: error.message
            };
        }
    }

    // ========================================
    // FILE OPERATIONS
    // ========================================

    /**
     * List files in a directory
     */
    async listFiles(directory = 'src') {
        const response = await this.request('GET', `/api/files?dir=${encodeURIComponent(directory)}`);
        return response.success ? response.data.files : [];
    }

    /**
     * Read file content
     */
    async readFile(path) {
        const response = await this.request('GET', `/api/file?path=${encodeURIComponent(path)}`);
        return response.success ? response.data : null;
    }

    /**
     * Save file content
     */
    async saveFile(path, content) {
        const response = await this.request('POST', '/api/file', { path, content });
        return response.success;
    }

    /**
     * Delete file
     */
    async deleteFile(path) {
        const response = await this.request('DELETE', `/api/file?path=${encodeURIComponent(path)}`);
        return response.success;
    }

    /**
     * Create new file
     */
    async newFile(path) {
        const response = await this.request('POST', '/api/file/new', { path });
        return response.success;
    }

    /**
     * Rename/move file
     */
    async renameFile(oldPath, newPath) {
        const response = await this.request('POST', '/api/file/rename', { oldPath, newPath });
        return response.success;
    }

    // ========================================
    // PROJECT OPERATIONS
    // ========================================

    /**
     * Get project information
     */
    async getProjectInfo() {
        const response = await this.request('GET', '/api/project/info');
        return response.success ? response.data : null;
    }

    /**
     * Save project settings
     */
    async saveProjectSettings(settings) {
        const response = await this.request('POST', '/api/project/settings', settings);
        return response.success;
    }

    // ========================================
    // BUILD OPERATIONS
    // ========================================

    /**
     * Build assets
     */
    async buildAssets() {
        const response = await this.request('POST', '/api/build/assets');
        return response.success ? response.data : null;
    }

    /**
     * Build ROM
     */
    async buildRom() {
        const response = await this.request('POST', '/api/build/rom');
        return response.success ? response.data : null;
    }

    /**
     * Build everything (assets + ROM)
     */
    async buildAll() {
        const response = await this.request('POST', '/api/build/all');
        return response.success ? response.data : null;
    }

    /**
     * Clean build
     */
    async cleanBuild() {
        const response = await this.request('POST', '/api/build/clean');
        return response.success ? response.data : null;
    }

    /**
     * Get build status
     */
    async getBuildStatus() {
        const response = await this.request('GET', '/api/build/status');
        return response.success ? response.data : null;
    }

    // ========================================
    // ASSET OPERATIONS
    // ========================================

    /**
     * List all assets
     */
    async listAssets() {
        const response = await this.request('GET', '/api/assets/list');
        return response.success ? response.data : null;
    }

    /**
     * Get tile assets
     */
    async getTiles() {
        const response = await this.request('GET', '/api/assets/tiles');
        return response.success ? response.data : [];
    }

    /**
     * Get map assets
     */
    async getMaps() {
        const response = await this.request('GET', '/api/assets/maps');
        return response.success ? response.data : [];
    }

    /**
     * Get sprite assets
     */
    async getSprites() {
        const response = await this.request('GET', '/api/assets/sprites');
        return response.success ? response.data : [];
    }

    // ========================================
    // ROM OPERATIONS
    // ========================================

    /**
     * Download ROM file
     */
    async downloadRom() {
        try {
            const response = await fetch(this.baseUrl + '/api/rom');
            if (response.ok) {
                const blob = await response.blob();
                
                // Create download link
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'game.gbc';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('ROM download failed:', error);
            return false;
        }
    }

    /**
     * Get ROM information
     */
    async getRomInfo() {
        const response = await this.request('GET', '/api/rom/info');
        return response.success ? response.data : null;
    }

    // ========================================
    // DEBUG OPERATIONS
    // ========================================

    /**
     * Get debug symbols
     */
    async getDebugSymbols() {
        const response = await this.request('GET', '/api/debug/symbols');
        return response.success ? response.data : null;
    }

    /**
     * Set breakpoint
     */
    async setBreakpoint(address) {
        const response = await this.request('POST', '/api/debug/breakpoint', { address });
        return response.success;
    }

    // ========================================
    // TOOLS OPERATIONS
    // ========================================

    /**
     * Tile editor action
     */
    async tileEditorAction(action, data) {
        const response = await this.request('POST', '/api/tools/tile-editor', { action, data });
        return response.success ? response.data : null;
    }

    /**
     * Map editor action
     */
    async mapEditorAction(action, data) {
        const response = await this.request('POST', '/api/tools/map-editor', { action, data });
        return response.success ? response.data : null;
    }

    /**
     * Sprite editor action
     */
    async spriteEditorAction(action, data) {
        const response = await this.request('POST', '/api/tools/sprite-editor', { action, data });
        return response.success ? response.data : null;
    }

    // ========================================
    // SYSTEM OPERATIONS
    // ========================================

    /**
     * Get system status
     */
    async getSystemStatus() {
        const response = await this.request('GET', '/api/system/status');
        return response.success ? response.data : null;
    }

    /**
     * Get system version
     */
    async getSystemVersion() {
        const response = await this.request('GET', '/api/system/version');
        return response.success ? response.data : null;
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    /**
     * Check if server is running
     */
    async ping() {
        try {
            const response = await this.request('GET', '/api/system/status');
            return response.success;
        } catch {
            return false;
        }
    }

    /**
     * Set base URL
     */
    setBaseUrl(url) {
        this.baseUrl = url;
    }

    /**
     * Set timeout
     */
    setTimeout(ms) {
        this.timeout = ms;
    }
}

// Create global API instance
const api = new EnchantmentAPI();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnchantmentAPI;
}
