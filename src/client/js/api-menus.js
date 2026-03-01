/**
 * Enchantment Engine - API-Integrated Menu System
 * Menu handlers that use the new REST API
 * Version: 3.0.0
 */

class EnchantmentMenus {
    constructor(apiClient) {
        this.api = apiClient;
        this.currentFile = null;
        this.projectInfo = null;
    }

    // ========================================
    // FILE MENU HANDLERS
    // ========================================

    async handleFileNew() {
        const fileName = prompt('Enter new file name:', 'newfile.c');
        if (!fileName) return;

        const path = `src/${fileName}`;
        const success = await this.api.newFile(path);
        
        if (success) {
            this.showNotification('File created successfully', 'success');
            this.currentFile = path;
            await this.loadFile(path);
        } else {
            this.showNotification('Failed to create file', 'error');
        }
    }

    async handleFileOpen() {
        const files = await this.api.listFiles('src');
        if (!files || files.length === 0) {
            this.showNotification('No files found', 'warning');
            return;
        }

        // Show file picker dialog
        const file = await this.showFilePicker(files);
        if (file) {
            await this.loadFile(`src/${file}`);
        }
    }

    async handleFileSave() {
        if (!this.currentFile) {
            this.showNotification('No file open', 'warning');
            return;
        }

        const content = this.getEditorContent();
        const success = await this.api.saveFile(this.currentFile, content);
        
        if (success) {
            this.showNotification('File saved successfully', 'success');
        } else {
            this.showNotification('Failed to save file', 'error');
        }
    }

    async handleFileSaveAs() {
        const fileName = prompt('Save as:', this.currentFile || 'newfile.c');
        if (!fileName) return;

        const content = this.getEditorContent();
        const success = await this.api.saveFile(fileName, content);
        
        if (success) {
            this.currentFile = fileName;
            this.showNotification('File saved successfully', 'success');
        } else {
            this.showNotification('Failed to save file', 'error');
        }
    }

    async handleFileDelete() {
        if (!this.currentFile) {
            this.showNotification('No file selected', 'warning');
            return;
        }

        if (!confirm(`Delete ${this.currentFile}?`)) return;

        const success = await this.api.deleteFile(this.currentFile);
        
        if (success) {
            this.showNotification('File deleted successfully', 'success');
            this.currentFile = null;
            this.clearEditor();
        } else {
            this.showNotification('Failed to delete file', 'error');
        }
    }

    async handleFileRename() {
        if (!this.currentFile) {
            this.showNotification('No file selected', 'warning');
            return;
        }

        const newName = prompt('Rename to:', this.currentFile);
        if (!newName || newName === this.currentFile) return;

        const success = await this.api.renameFile(this.currentFile, newName);
        
        if (success) {
            this.showNotification('File renamed successfully', 'success');
            this.currentFile = newName;
        } else {
            this.showNotification('Failed to rename file', 'error');
        }
    }

    // ========================================
    // PROJECT MENU HANDLERS
    // ========================================

    async handleProjectInfo() {
        const info = await this.api.getProjectInfo();
        if (info) {
            this.projectInfo = info;
            this.showProjectInfoDialog(info);
        } else {
            this.showNotification('Failed to get project info', 'error');
        }
    }

    async handleProjectSettings() {
        const settings = await this.showSettingsDialog();
        if (settings) {
            const success = await this.api.saveProjectSettings(settings);
            if (success) {
                this.showNotification('Settings saved successfully', 'success');
            } else {
                this.showNotification('Failed to save settings', 'error');
            }
        }
    }

    // ========================================
    // BUILD MENU HANDLERS
    // ========================================

    async handleBuildAssets() {
        this.showNotification('Building assets...', 'info');
        this.showBuildOutput('Building assets...\n');
        
        const result = await this.api.buildAssets();
        
        if (result && result.success) {
            this.showBuildOutput(result.output || 'Assets built successfully');
            this.showNotification('Assets built successfully', 'success');
        } else {
            this.showBuildOutput('Asset build failed');
            this.showNotification('Asset build failed', 'error');
        }
    }

    async handleBuildRom() {
        this.showNotification('Building ROM...', 'info');
        this.showBuildOutput('Building ROM...\n');
        
        const result = await this.api.buildRom();
        
        if (result && result.success) {
            this.showBuildOutput(result.output || 'ROM built successfully');
            this.showNotification('ROM built successfully', 'success');
        } else {
            this.showBuildOutput('ROM build failed');
            this.showNotification('ROM build failed', 'error');
        }
    }

    async handleBuildAll() {
        this.showNotification('Building all...', 'info');
        this.showBuildOutput('Building all...\n');
        
        const result = await this.api.buildAll();
        
        if (result && result.success) {
            this.showBuildOutput('=== Assets ===\n' + (result.assetsOutput || ''));
            this.showBuildOutput('\n=== ROM ===\n' + (result.romOutput || ''));
            this.showNotification('Build completed successfully', 'success');
        } else {
            this.showBuildOutput('Build failed');
            this.showNotification('Build failed', 'error');
        }
    }

    async handleBuildClean() {
        this.showNotification('Cleaning build...', 'info');
        
        const result = await this.api.cleanBuild();
        
        if (result && result.success) {
            this.showNotification('Build cleaned successfully', 'success');
        } else {
            this.showNotification('Clean failed', 'error');
        }
    }

    async handleBuildStatus() {
        const status = await this.api.getBuildStatus();
        if (status) {
            this.showBuildStatusDialog(status);
        } else {
            this.showNotification('Failed to get build status', 'error');
        }
    }

    // ========================================
    // ASSETS MENU HANDLERS
    // ========================================

    async handleAssetsView() {
        const assets = await this.api.listAssets();
        if (assets) {
            this.showAssetsDialog(assets);
        } else {
            this.showNotification('Failed to list assets', 'error');
        }
    }

    async handleTilesView() {
        const tiles = await this.api.getTiles();
        if (tiles) {
            this.showTilesDialog(tiles);
        } else {
            this.showNotification('Failed to get tiles', 'error');
        }
    }

    async handleMapsView() {
        const maps = await this.api.getMaps();
        if (maps) {
            this.showMapsDialog(maps);
        } else {
            this.showNotification('Failed to get maps', 'error');
        }
    }

    async handleSpritesView() {
        const sprites = await this.api.getSprites();
        if (sprites) {
            this.showSpritesDialog(sprites);
        } else {
            this.showNotification('Failed to get sprites', 'error');
        }
    }

    // ========================================
    // ROM MENU HANDLERS
    // ========================================

    async handleRomDownload() {
        this.showNotification('Downloading ROM...', 'info');
        
        const success = await this.api.downloadRom();
        
        if (success) {
            this.showNotification('ROM downloaded successfully', 'success');
        } else {
            this.showNotification('ROM download failed', 'error');
        }
    }

    async handleRomInfo() {
        const info = await this.api.getRomInfo();
        if (info) {
            this.showRomInfoDialog(info);
        } else {
            this.showNotification('Failed to get ROM info', 'error');
        }
    }

    // ========================================
    // DEBUG MENU HANDLERS
    // ========================================

    async handleDebugSymbols() {
        const symbols = await this.api.getDebugSymbols();
        if (symbols) {
            this.showDebugSymbolsDialog(symbols);
        } else {
            this.showNotification('No debug symbols available', 'warning');
        }
    }

    async handleDebugBreakpoint() {
        const address = prompt('Enter breakpoint address (hex):', '0x0000');
        if (!address) return;

        const success = await this.api.setBreakpoint(address);
        
        if (success) {
            this.showNotification(`Breakpoint set at ${address}`, 'success');
        } else {
            this.showNotification('Failed to set breakpoint', 'error');
        }
    }

    // ========================================
    // TOOLS MENU HANDLERS
    // ========================================

    async handleTileEditor() {
        const tiles = await this.api.getTiles();
        if (tiles && tiles.length > 0) {
            // Open tile editor with first tile
            const result = await this.api.tileEditorAction('load', tiles[0]);
            if (result && result.success) {
                this.showNotification('Tile editor opened', 'success');
                // Open tile editor UI
                this.openTileEditor(tiles[0]);
            }
        } else {
            this.showNotification('No tiles available', 'warning');
        }
    }

    async handleMapEditor() {
        const maps = await this.api.getMaps();
        if (maps && maps.length > 0) {
            // Open map editor with first map
            const result = await this.api.mapEditorAction('load', maps[0]);
            if (result && result.success) {
                this.showNotification('Map editor opened', 'success');
                // Open map editor UI
                this.openMapEditor(maps[0]);
            }
        } else {
            this.showNotification('No maps available', 'warning');
        }
    }

    async handleSpriteEditor() {
        const sprites = await this.api.getSprites();
        if (sprites && sprites.length > 0) {
            // Open sprite editor with first sprite
            const result = await this.api.spriteEditorAction('load', sprites[0]);
            if (result && result.success) {
                this.showNotification('Sprite editor opened', 'success');
                // Open sprite editor UI
                this.openSpriteEditor(sprites[0]);
            }
        } else {
            this.showNotification('No sprites available', 'warning');
        }
    }

    // ========================================
    // SYSTEM MENU HANDLERS
    // ========================================

    async handleSystemStatus() {
        const status = await this.api.getSystemStatus();
        if (status) {
            this.showSystemStatusDialog(status);
        } else {
            this.showNotification('Failed to get system status', 'error');
        }
    }

    async handleSystemVersion() {
        const version = await this.api.getSystemVersion();
        if (version) {
            this.showVersionDialog(version);
        } else {
            this.showNotification('Failed to get version info', 'error');
        }
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    async loadFile(path) {
        const content = await this.api.readFile(path);
        if (content !== null) {
            this.currentFile = path;
            this.setEditorContent(content);
            this.showNotification(`Loaded: ${path}`, 'success');
        } else {
            this.showNotification(`Failed to load: ${path}`, 'error');
        }
    }

    getEditorContent() {
        const editor = document.getElementById('code-editor');
        return editor ? editor.value : '';
    }

    setEditorContent(content) {
        const editor = document.getElementById('code-editor');
        if (editor) {
            editor.value = content;
        }
    }

    clearEditor() {
        this.setEditorContent('');
    }

    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196F3'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showBuildOutput(output) {
        const outputPanel = document.getElementById('build-output');
        if (outputPanel) {
            outputPanel.textContent += output + '\n';
            outputPanel.scrollTop = outputPanel.scrollHeight;
        } else {
            console.log('Build output:', output);
        }
    }

    async showFilePicker(files) {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'file-picker-dialog';
            dialog.innerHTML = `
                <div class="dialog-overlay"></div>
                <div class="dialog-content">
                    <h3>Select File</h3>
                    <select id="file-select" size="10" style="width: 100%; margin: 10px 0;">
                        ${files.map(f => `<option value="${f}">${f}</option>`).join('')}
                    </select>
                    <div class="dialog-buttons">
                        <button id="file-open-btn">Open</button>
                        <button id="file-cancel-btn">Cancel</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dialog);
            
            document.getElementById('file-open-btn').onclick = () => {
                const select = document.getElementById('file-select');
                resolve(select.value);
                dialog.remove();
            };
            
            document.getElementById('file-cancel-btn').onclick = () => {
                resolve(null);
                dialog.remove();
            };
        });
    }

    showProjectInfoDialog(info) {
        alert(`Project Information:\n\nName: ${info.name}\nPath: ${info.path}\nType: ${info.type}\nBuild System: ${info.buildSystem}`);
    }

    showBuildStatusDialog(status) {
        alert(`Build Status:\n\nBuilding: ${status.building}\nLast Build: ${status.lastBuild}\nStatus: ${status.status}`);
    }

    showAssetsDialog(assets) {
        const message = `Assets:\n\nTiles: ${assets.tiles?.length || 0}\nMaps: ${assets.maps?.length || 0}\nSprites: ${assets.sprites?.length || 0}`;
        alert(message);
    }

    showTilesDialog(tiles) {
        alert(`Tiles (${tiles.length}):\n\n${tiles.join('\n')}`);
    }

    showMapsDialog(maps) {
        alert(`Maps (${maps.length}):\n\n${maps.join('\n')}`);
    }

    showSpritesDialog(sprites) {
        alert(`Sprites (${sprites.length}):\n\n${sprites.join('\n')}`);
    }

    showRomInfoDialog(info) {
        alert(`ROM Information:\n\nName: ${info.name}\nSize: ${info.size} bytes\nType: ${info.type}`);
    }

    showDebugSymbolsDialog(symbols) {
        alert(`Debug Symbols:\n\n${symbols}`);
    }

    showSystemStatusDialog(status) {
        alert(`System Status:\n\nStatus: ${status.status}\nVersion: ${status.version}\nUptime: ${status.uptime}\nProject: ${status.projectPath}\nPort: ${status.port}`);
    }

    showVersionDialog(version) {
        alert(`${version.name}\n\nVersion: ${version.version}\nBuild: ${version.build}\nCompiler: ${version.compiler}\nPlatform: ${version.platform}`);
    }

    async showSettingsDialog() {
        // Simple settings dialog - can be enhanced
        const compiler = prompt('Compiler:', 'GBDK-2020');
        const target = prompt('Target:', 'GameBoyColor');
        
        if (compiler && target) {
            return { compiler, target };
        }
        return null;
    }

    openTileEditor(tileName) {
        console.log('Opening tile editor for:', tileName);
        // Implement tile editor UI
    }

    openMapEditor(mapName) {
        console.log('Opening map editor for:', mapName);
        // Implement map editor UI
    }

    openSpriteEditor(spriteName) {
        console.log('Opening sprite editor for:', spriteName);
        // Implement sprite editor UI
    }
}

// Create global menus instance
const menus = new EnchantmentMenus(api);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnchantmentMenus;
}
