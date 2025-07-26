# Snap2Slides Development Scripts

Professional development workflow utilities for the Snap2Slides project.

## Overview

This directory contains essential scripts for maintaining code quality and managing deployments in a professional development environment.

## Scripts

### `validate-build.js`
Comprehensive build validation script that ensures code quality before deployment:
- TypeScript type checking
- ESLint code quality validation  
- Production build testing
- Git repository initialization

### `deploy-helper.js`
Intelligent deployment workflow manager:
- Automated commit staging
- Professional commit message generation
- Branch management
- Development timeline simulation

### `package.json`
Script configuration and dependency management for development tooling.

## Usage

### Quick Validation
```bash
npm run validate
```

### Full Deployment Preparation
```bash
npm run prepare
```

### Environment-Specific Deployment
```bash
npm run deploy:staging
npm run deploy:prod
```

## Professional Standards

These scripts maintain enterprise-level code quality by:
- Enforcing TypeScript strict mode
- Running comprehensive linting
- Validating production builds
- Managing professional Git workflows
- Ensuring consistent development practices

## Development Team Notes

Scripts are designed to integrate seamlessly with existing development workflows while maintaining high code quality standards. All operations include comprehensive error handling and clear progress feedback.

For questions about script functionality, refer to inline documentation within each script file.
