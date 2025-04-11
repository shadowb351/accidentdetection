const mongoose = require('mongoose');

const tileSchema = new mongoose.Schema({
    url: String,
    zoom: Number,
    x: Number,
    y: Number,
    localPath: String
});

const mapCacheSchema = new mongoose.Schema({
    bbox: {
        type: [Number], // [minLon, minLat, maxLon, maxLat]
        required: true
    },
    zoomLevels: {
        type: [Number],
        required: true
    },
    tiles: [tileSchema],
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MapCache', mapCacheSchema);