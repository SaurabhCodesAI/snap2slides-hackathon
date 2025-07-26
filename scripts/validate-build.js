#!/usr/bin/env node

/**
 * Build validator and deployment preparation script
 * Ensures code quality before production deployment
 * Part of the Snap2Slides CI/CD pipeline
 */

const { execSync } = require('child_process');
const path = require('path');

// Project validation steps
async function validateBuild() {
  console.log('🔍 Validating project build...');
  
  try {
    // Type checking
    console.log('📝 Running TypeScript validation...');
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    
    // Linting
    console.log('🔧 Running ESLint checks...');
    execSync('npm run lint', { stdio: 'inherit' });
    
    // Build test
    console.log('🏗️ Testing production build...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('✅ All validation checks passed!');
    return true;
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    return false;
  }
}

// Initialize project repository
async function initializeRepo() {
  console.log('🚀 Initializing project repository...');
  
  try {
    // Initialize git if not already done
    try {
      execSync('git status', { stdio: 'pipe' });
    } catch {
      execSync('git init', { stdio: 'inherit' });
      console.log('📁 Git repository initialized');
    }
    
    // Setup git config for professional commits
    try {
      execSync('git config user.name "Developer"', { stdio: 'pipe' });
      execSync('git config user.email "dev@snap2slides.com"', { stdio: 'pipe' });
    } catch (e) {
      // Config might already be set
    }
    
    return true;
  } catch (error) {
    console.error('❌ Repository initialization failed:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🎯 Snap2Slides Deployment Helper');
  console.log('================================');
  
  // Initialize repository
  const repoReady = await initializeRepo();
  if (!repoReady) {
    process.exit(1);
  }
  
  // Validate build
  const buildValid = await validateBuild();
  if (!buildValid) {
    console.log('⚠️ Build validation failed. Please fix issues before deployment.');
    process.exit(1);
  }
  
  // Load and execute deployment workflow
  console.log('📦 Starting development workflow...');
  try {
    const { executeWorkflow } = require('./deploy-helper');
    await executeWorkflow();
  } catch (error) {
    console.error('❌ Workflow execution failed:', error.message);
    process.exit(1);
  }
  
  console.log('🎉 Deployment preparation completed successfully!');
  console.log('✅ Project is ready for production deployment');
}

if (require.main === module) {
  main().catch(console.error);
}
