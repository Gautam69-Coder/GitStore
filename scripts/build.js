const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 [GitStore Build] Starting Cloudflare Pages / Production Build...');

try {
  // Step 1: Install client dependencies if not already installed or on CI
  console.log('📦 [GitStore Build] Installing client dependencies (including dev tools)...');
  execSync('npm --prefix client install --include=dev', { stdio: 'inherit' });

  // Step 2: Run Vite build inside client
  console.log('⚡ [GitStore Build] Compiling client with Vite...');
  execSync('npm --prefix client run build', { stdio: 'inherit' });

  // Step 3: Ensure dist exists at root as well for hosting platforms that expect ./dist
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  const rootDist = path.join(__dirname, '..', 'dist');

  if (fs.existsSync(clientDist)) {
    console.log('📋 [GitStore Build] Syncing client/dist to root dist folder...');
    fs.cpSync(clientDist, rootDist, { recursive: true });
  }

  console.log('✅ [GitStore Build] Build finished successfully! Output available in both ./client/dist and ./dist');
} catch (error) {
  console.error('❌ [GitStore Build] Build failed with error:', error.message);
  process.exit(1);
}
