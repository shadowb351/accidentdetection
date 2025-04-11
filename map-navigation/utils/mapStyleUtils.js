module.exports = {
    getStyleForZoom: (zoom) => {
        // Return appropriate map style configuration based on zoom level
        if (zoom < 8) {
            return {
                version: 8,
                sources: {
                    'simple-tiles': {
                        type: 'vector',
                        tiles: ['https://tiles.example.com/{z}/{x}/{y}.mvt'],
                        minzoom: 0,
                        maxzoom: 14
                    }
                },
                layers: [
                    {
                        id: 'background',
                        type: 'background',
                        paint: {
                            'background-color': '#f0f0f0'
                        }
                    },
                    {
                        id: 'countries',
                        type: 'line',
                        source: 'simple-tiles',
                        'source-layer': 'countries',
                        paint: {
                            'line-color': '#cccccc',
                            'line-width': 1
                        }
                    }
                ]
            };
        } else {
            return {
                version: 8,
                sources: {
                    'detailed-tiles': {
                        type: 'vector',
                        tiles: ['https://tiles.example.com/{z}/{x}/{y}.mvt'],
                        minzoom: 8,
                        maxzoom: 22
                    }
                },
                layers: [
                    /* More detailed layers */
                ]
            };
        }
    },
    
    getMarkerStyle: (type) => {
        const styles = {
            crash: {
                color: '#ff0000',
                size: 8,
                icon: 'crash-icon'
            },
            ambulance: {
                color: '#0066ff',
                size: 10,
                icon: 'ambulance-icon',
                pulse: true
            },
            hospital: {
                color: '#00aa00',
                size: 12,
                icon: 'hospital-icon'
            }
        };
        
        return styles[type] || {
            color: '#888888',
            size: 6,
            icon: 'default-marker'
        };
    }
};