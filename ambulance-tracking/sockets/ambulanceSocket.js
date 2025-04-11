const socketIO = require('socket.io');
const AmbulanceAssignment = require('../models/ambulanceAssignment');

let io;

const initialize = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS.split(','),
            methods: ['GET', 'POST']
        }
    });
    
    io.on('connection', (socket) => {
        console.log('New client connected');
        
        // Join ambulance-specific room
        socket.on('join-ambulance', (ambulanceId) => {
            socket.join(`ambulance-${ambulanceId}`);
            console.log(`Ambulance ${ambulanceId} connected`);
        });
        
        // Join emergency-specific room (for hospitals/admins)
        socket.on('join-emergency', (emergencyId) => {
            socket.join(`emergency-${emergencyId}`);
        });
        
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

const emitAmbulanceUpdate = (ambulanceId, updateData) => {
    if (!io) return;
    
    // Send to ambulance-specific room
    io.to(`ambulance-${ambulanceId}`).emit('ambulance-update', updateData);
    
    // If this is part of an assignment, also send to emergency room
    if (updateData.assignment) {
        io.to(`emergency-${updateData.assignment.emergency}`).emit('ambulance-update', updateData);
    }
};

const getIO = () => io;

module.exports = {
    initialize,
    emitAmbulanceUpdate,
    getIO
};