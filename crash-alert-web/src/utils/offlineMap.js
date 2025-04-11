export class OfflineMapManager {
    constructor() {
      this.cacheName = 'offline-maps-v1';
      this.offlineTiles = new Map();
    }
  
    async cacheTiles(tiles) {
      if (!('caches' in window)) return;
      
      const cache = await caches.open(this.cacheName);
      await Promise.all(
        tiles.map(tile => {
          const url = new URL(tile.url);
          const cacheUrl = `/map-tile/${tile.zoom}/${tile.x}/${tile.y}`;
          this.offlineTiles.set(cacheUrl, tile.url);
          return cache.put(cacheUrl, new Response(JSON.stringify(tile)));
        })
      );
    }
  
    async getCachedTile(zoom, x, y) {
      const cacheUrl = `/map-tile/${zoom}/${x}/${y}`;
      
      if (this.offlineTiles.has(cacheUrl)) {
        const cache = await caches.open(this.cacheName);
        const response = await cache.match(cacheUrl);
        
        if (response) {
          return response.json();
        }
      }
      
      return null;
    }
  
    async clearCache() {
      if ('caches' in window) {
        await caches.delete(this.cacheName);
        this.offlineTiles.clear();
      }
    }
  }
  
  export const offlineMapManager = new OfflineMapManager();