// Custom Next.js server with automatic port switching
// This server will automatically find available ports and gracefully handle conflicts

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { createPortConfig } = require('./lib/port-manager');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';

// Configuration
const serverConfig = {
  preferredPort: parseInt(process.env.PORT) || 3000,
  enableAutoSwitch: true,
  maxAttempts: 50
};

async function startServer() {
  console.log('🚀 Starting Snap2Slides server with smart port management...');
  
  try {
    // Get available port configuration
    const portConfig = await createPortConfig(serverConfig);
    console.log(portConfig.message);
    
    // Create Next.js app
    const app = next({ dev, hostname, port: portConfig.port });
    const handle = app.getRequestHandler();
    
    // Prepare the Next.js app
    await app.prepare();
    console.log('📦 Next.js application prepared successfully');
    
    // Create HTTP server
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('❌ Error handling request:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });
    
    // Enhanced error handling
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${portConfig.port} became busy after we checked it!`);
        console.log('🔄 This can happen in rare cases. Restarting with a new port...');
        
        // Restart with a different port
        setTimeout(() => {
          startServer();
        }, 1000);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
    
    // Start listening
    server.listen(portConfig.port, (err) => {
      if (err) {
        console.error('❌ Failed to start server:', err);
        throw err;
      }
      
      console.log(`\n🎉 Snap2Slides is ready!`);
      console.log(`📍 Local: ${portConfig.url}`);
      console.log(`🌐 Network: http://${getLocalIPAddress()}:${portConfig.port}`);
      
      if (!portConfig.wasPreferred) {
        console.log(`\n💡 Note: Port ${serverConfig.preferredPort} was busy, so we used ${portConfig.port} instead.`);
        console.log(`   This is completely normal and the app works exactly the same!`);
      }
      
      console.log(`\n🛠️  Ready for development - start uploading images to create presentations!`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n👋 Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('\n👋 Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    
    if (error.message.includes('Could not find an available port')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('  1. Close other development servers');
      console.log('  2. Restart your terminal');
      console.log('  3. Check for applications using many ports');
      console.log('  4. Try: npm run dev:clean');
    }
    
    process.exit(1);
  }
}

/**
 * Get local IP address for network access
 */
function getLocalIPAddress() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  
  return 'localhost';
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = { startServer };
