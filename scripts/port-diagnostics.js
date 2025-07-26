// Port monitoring and diagnostics utility
// Helps debug port conflicts and provides useful information

const { getCommonPorts, isPortAvailable } = require('../lib/port-manager');
const { networkInterfaces } = require('os');

/**
 * Check status of common development ports
 */
async function checkCommonPorts() {
  console.log('🔍 Checking common development ports...\n');
  
  const commonPorts = getCommonPorts();
  const results = [];
  
  for (const port of commonPorts) {
    const available = await isPortAvailable(port);
    const status = available ? '✅ Available' : '❌ Busy';
    console.log(`Port ${port}: ${status}`);
    
    results.push({
      port,
      available,
      status: available ? 'available' : 'busy'
    });
  }
  
  return results;
}

/**
 * Get network interface information
 */
function getNetworkInfo() {
  console.log('\n🌐 Network interfaces:');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    const interfaces = nets[name];
    
    for (const net of interfaces) {
      if (net.family === 'IPv4') {
        const type = net.internal ? 'localhost' : 'network';
        console.log(`  ${name}: ${net.address} (${type})`);
      }
    }
  }
}

/**
 * Find and suggest available ports
 */
async function suggestPorts(count = 5) {
  console.log(`\n💡 Suggesting ${count} available ports:`);
  const suggestions = [];
  
  let port = 3000;
  let found = 0;
  
  while (found < count && port < 9000) {
    if (await isPortAvailable(port)) {
      console.log(`  ${port} - Available`);
      suggestions.push(port);
      found++;
    }
    port++;
  }
  
  return suggestions;
}

/**
 * Run full port diagnostics
 */
async function runDiagnostics() {
  console.log('🔧 Snap2Slides Port Diagnostics\n');
  console.log('='.repeat(50));
  
  try {
    // Check common ports
    const portStatus = await checkCommonPorts();
    
    // Show network info
    getNetworkInfo();
    
    // Suggest alternatives
    await suggestPorts();
    
    // Summary
    const availablePorts = portStatus.filter(p => p.available).length;
    const busyPorts = portStatus.filter(p => !p.available).length;
    
    console.log('\n📊 Summary:');
    console.log(`  Available ports: ${availablePorts}`);
    console.log(`  Busy ports: ${busyPorts}`);
    
    if (busyPorts > availablePorts) {
      console.log('\n⚠️  Many ports are busy. Consider:');
      console.log('  - Closing unused development servers');
      console.log('  - Restarting your terminal');
      console.log('  - Using: npm run dev:clean');
    } else {
      console.log('\n✅ Port situation looks good!');
    }
    
  } catch (error) {
    console.error('❌ Diagnostics failed:', error.message);
  }
}

/**
 * Monitor a specific port for changes
 */
async function monitorPort(port, duration = 30000) {
  console.log(`👁️  Monitoring port ${port} for ${duration/1000} seconds...`);
  console.log('Press Ctrl+C to stop\n');
  
  let lastStatus = await isPortAvailable(port);
  console.log(`Initial status: ${lastStatus ? 'Available' : 'Busy'}`);
  
  const interval = setInterval(async () => {
    const currentStatus = await isPortAvailable(port);
    
    if (currentStatus !== lastStatus) {
      const timestamp = new Date().toLocaleTimeString();
      const status = currentStatus ? 'became available' : 'became busy';
      console.log(`[${timestamp}] Port ${port} ${status}`);
      lastStatus = currentStatus;
    }
  }, 2000);
  
  // Stop monitoring after duration
  setTimeout(() => {
    clearInterval(interval);
    console.log('\n✅ Monitoring stopped');
    process.exit(0);
  }, duration);
  
  // Handle Ctrl+C
  process.on('SIGINT', () => {
    clearInterval(interval);
    console.log('\n👋 Monitoring stopped by user');
    process.exit(0);
  });
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const arg = process.argv[3];
  
  switch (command) {
    case 'check':
      checkCommonPorts();
      break;
      
    case 'suggest':
      suggestPorts(parseInt(arg) || 5);
      break;
      
    case 'monitor':
      monitorPort(parseInt(arg) || 3000);
      break;
      
    case 'network':
      getNetworkInfo();
      break;
      
    case 'full':
    default:
      runDiagnostics();
      break;
  }
}

module.exports = {
  checkCommonPorts,
  getNetworkInfo,
  suggestPorts,
  runDiagnostics,
  monitorPort
};
