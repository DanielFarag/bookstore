#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app.js';
import debugLib from 'debug';
import { createServer } from 'http';
import { Server } from 'socket.io'; // Import socket.io
import User from '../src/models/user.model.js';

const debug = debugLib('bookstore:server');

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.APP_PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = createServer(app);

/**
 * Create WebSocket server
 */
export const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (change this for production)
    methods: ["GET", "POST"]
  }
});

// WebSocket connection event
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
