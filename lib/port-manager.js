// Port Manager - Automatically finds available ports
// This ensures the app can always start even if the default port is busy

const net = require('net');

/**
 * Check if a port is available
 * @param {number} port - Port number to check
 * @returns {Promise<boolean>} - True if port is available
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Find the next available port starting from a given port
 * @param {number} startPort - Starting port number
 * @param {number} maxAttempts - Maximum number of ports to try
 * @returns {Promise<number>} - Available port number
 */
async function findAvailablePort(startPort = 3000, maxAttempts = 50) {
  console.log(`🔍 Looking for available port starting from ${startPort}...`);
  
  for (let port = startPort; port < startPort + maxAttempts; port++) {
    const available = await isPortAvailable(port);
    
    if (available) {
      if (port !== startPort) {
        console.log(`✅ Port ${startPort} was busy, switched to port ${port}`);
        console.log(`🌐 Your app will be available at: http://localhost:${port}`);
      } else {
        console.log(`✅ Port ${port} is available and ready!`);
      }
      return port;
    } else {
      console.log(`⚠️  Port ${port} is busy, trying next...`);
    }
  }
  
  throw new Error(`❌ Could not find an available port after trying ${maxAttempts} ports starting from ${startPort}`);
}

/**
 * Get a list of commonly used ports to avoid conflicts
 * @returns {Array<number>} - Array of port numbers to avoid
 */
function getCommonPorts() {
  return [
    3000, // Default Next.js
    3001, // Alternative Next.js
    4000, // Common dev server
    5000, // Common dev server
    8000, // Common dev server
    8080, // Common web server
    9000, // Common dev tools
  ];
}

/**
 * Smart port selection that avoids common conflicts
 * @param {number} preferredPort - Preferred port number
 * @returns {Promise<number>} - Available port number
 */
async function getSmartPort(preferredPort = 3000) {
  // First, try the preferred port
  if (await isPortAvailable(preferredPort)) {
    return preferredPort;
  }
  
  // If preferred port is busy, try some smart alternatives
  const smartAlternatives = [
    preferredPort + 1,    // 3001 if 3000 is busy
    preferredPort + 10,   // 3010 if 3000 is busy
    preferredPort + 100,  // 3100 if 3000 is busy
    4000, 4001, 4002,     // 4xxx range
    5000, 5001, 5002,     // 5xxx range
    8000, 8001, 8002,     // 8xxx range
  ];
  
  console.log(`🔄 Port ${preferredPort} is busy, trying smart alternatives...`);
  
  for (const port of smartAlternatives) {
    if (await isPortAvailable(port)) {
      console.log(`✅ Found available port: ${port}`);
      return port;
    }
  }
  
  // If none of the smart alternatives work, use the general finder
  console.log(`🔍 Smart alternatives didn't work, scanning for any available port...`);
  return findAvailablePort(preferredPort + 1000); // Start from a higher range
}

/**
 * Create a port configuration for the application
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Port configuration
 */
async function createPortConfig(options = {}) {
  const {
    preferredPort = 3000,
    enableAutoSwitch = true,
    maxAttempts = 50
  } = options;
  
  try {
    let finalPort;
    
    if (enableAutoSwitch) {
      finalPort = await getSmartPort(preferredPort);
    } else {
      if (await isPortAvailable(preferredPort)) {
        finalPort = preferredPort;
      } else {
        throw new Error(`Port ${preferredPort} is not available and auto-switch is disabled`);
      }
    }
    
    return {
      port: finalPort,
      url: `http://localhost:${finalPort}`,
      wasPreferred: finalPort === preferredPort,
      message: finalPort === preferredPort 
        ? `🎉 Starting on preferred port ${finalPort}`
        : `🔄 Switched from ${preferredPort} to ${finalPort}`
    };
  } catch (error) {
    console.error('❌ Port configuration failed:', error.message);
    throw error;
  }
}

module.exports = {
  isPortAvailable,
  findAvailablePort,
  getSmartPort,
  createPortConfig,
  getCommonPorts
};
