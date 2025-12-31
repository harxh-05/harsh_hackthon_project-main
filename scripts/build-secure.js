#!/usr/bin/env node

/**
 * Secure build script for AgriFarmAI Crop Recommendation System
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Validate project root is within expected bounds
if (!projectRoot.includes('harsh_hackthon_project')) {
  console.error('❌ Invalid project root detected');
  process.exit(1);
}

console.log('🔒 Starting secure build process for AgriFarmAI...');

// Backup original .env file with path validation
const envPath = path.resolve(projectRoot, '.env');
const envBackupPath = path.resolve(projectRoot, '.env.backup');

// Validate paths are within project directory
if (!envPath.startsWith(projectRoot) || !envBackupPath.startsWith(projectRoot)) {
  console.error('❌ Path traversal attempt detected');
  process.exit(1);
}

if (fs.existsSync(envPath)) {
  fs.copyFileSync(envPath, envBackupPath);
  console.log('✅ Backed up .env file');
}

try {
  // Create production .env with minimal variables
  const productionEnv = `# Production build - API keys secured
VITE_APP_ENV=production
VITE_BUILD_TIME=${new Date().toISOString()}
`;

  fs.writeFileSync(envPath, productionEnv);
  console.log('✅ Created secure production .env');

  // Run the build
  console.log('🏗️  Building AgriFarmAI application...');
  execSync('npm run build', { stdio: 'inherit', cwd: projectRoot });
  console.log('✅ Build completed successfully');

  // Verify no API keys in build
  const distPath = path.resolve(projectRoot, 'dist');
  const assetsPath = path.resolve(distPath, 'assets');
  
  // Validate paths
  if (!distPath.startsWith(projectRoot) || !assetsPath.startsWith(distPath)) {
    console.error('❌ Invalid build path detected');
    process.exit(1);
  }
  
  if (fs.existsSync(distPath) && fs.existsSync(assetsPath)) {
    const jsFiles = fs.readdirSync(assetsPath)
      .filter(file => file.endsWith('.js') && !file.includes('..'));
    
    let credentialsFound = false;
    jsFiles.forEach(file => {
      const filePath = path.resolve(assetsPath, file);
      if (!filePath.startsWith(assetsPath)) {
        console.warn(`⚠️  Skipping invalid file path: ${file}`);
        return;
      }
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('hf_') || content.includes('sk-')) {
        console.warn(`⚠️  API credentials found in ${file}`);
        credentialsFound = true;
      }
    });

    if (!credentialsFound) {
      console.log('✅ No API credentials found in build files');
    }
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Restore original .env file
  if (fs.existsSync(envBackupPath)) {
    fs.copyFileSync(envBackupPath, envPath);
    fs.unlinkSync(envBackupPath);
    console.log('✅ Restored original .env file');
  }
}

console.log('🎉 Secure build process completed!');