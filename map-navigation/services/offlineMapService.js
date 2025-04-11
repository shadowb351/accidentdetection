const MapCache = require('../models/mapCache');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

module.exports = {
    cacheTiles: async (tiles) => {
        try {
            // Ensure cache directory exists
            const cacheDir = path.join(__dirname, '../../offline-map-cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            // Download and compress each tile
            const cachedTiles = [];
            
            for (const tile of tiles) {
                const tilePath = this.getTilePath(tile);
                const compressedTile = await this.downloadAndCompressTile(tile.url);
                
                fs.writeFileSync(tilePath, compressedTile);
                cachedTiles.push({
                    ...tile,
                    localPath: tilePath
                });
            }
            
            // Update cache record
            const cacheRecord = new MapCache({
                tiles: cachedTiles,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
            });
            
            await cacheRecord.save();
            
            return cacheRecord;
        } catch (error) {
            console.error('Error caching tiles:', error);
            throw error;
        }
    },
    
    downloadAndCompressTile: async (url) => {
        // Implementation would download tile and compress it
        // This is a simplified example
        return Buffer.from('compressed-tile-data');
    },
    
    getTilePath: (tile) => {
        return path.join(
            __dirname,
            '../../offline-map-cache',
            `${tile.zoom}-${tile.x}-${tile.y}.mvt.gz`
        );
    },
    
    getCachedTile: async (zoom, x, y) => {
        try {
            const tilePath = this.getTilePath({ zoom, x, y });
            
            if (fs.existsSync(tilePath)) {
                const compressedData = fs.readFileSync(tilePath);
                return zlib.gunzipSync(compressedData);
            }
            
            return null;
        } catch (error) {
            console.error('Error getting cached tile:', error);
            throw error;
        }
    },
    
    clearExpiredCache: async () => {
        // Implementation would periodically clear expired cache
    }
};