#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

async function openBrowser() {
  const open = (await import('open')).default;
  console.log('Opening browser at http://localhost:3000...');
  await open('http://localhost:3000');
}

console.log('Starting Engram UI backend...');

const backendDistPath = path.join(__dirname, '..', 'backend', 'dist', 'main.js');

const backendProcess = spawn('node', [backendDistPath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ENGRAM_DB_PATH: process.env.ENGRAM_DB_PATH || path.join(process.env.HOME || process.env.USERPROFILE, '.engram', 'engram.db')
  }
});

// Wait a second for NestJS to spin up before opening the browser
setTimeout(() => {
  openBrowser().catch(err => console.error('Failed to open browser:', err));
}, 1500);

backendProcess.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
  process.exit(code);
});
