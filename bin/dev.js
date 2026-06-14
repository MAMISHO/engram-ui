const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Simple .env parser
const dotenvPath = path.join(__dirname, '..', '.env');
let port = 3000;
let frontendPort = 4200;
let dbPath = '';

if (fs.existsSync(dotenvPath)) {
  const envContent = fs.readFileSync(dotenvPath, 'utf-8');
  const portMatch = envContent.match(/^PORT=(\d+)/m);
  if (portMatch) port = parseInt(portMatch[1], 10);
  const frontendPortMatch = envContent.match(/^FRONTEND_PORT=(\d+)/m);
  if (frontendPortMatch) frontendPort = parseInt(frontendPortMatch[1], 10);
  const dbMatch = envContent.match(/^ENGRAM_DB_PATH=(.+)/m);
  if (dbMatch) dbPath = dbMatch[1].trim();
}

console.log(`Starting development mode...`);
console.log(`Backend Port: ${port}`);
console.log(`Frontend Port: ${frontendPort}`);

const env = {
  ...process.env,
  PORT: port.toString(),
  ENGRAM_DB_PATH: dbPath || process.env.ENGRAM_DB_PATH
};

// Start Backend
const backend = spawn('npm', ['run', 'start:dev'], {
  cwd: path.join(__dirname, '..', 'backend'),
  stdio: 'inherit',
  env
});

// Start Frontend
const frontend = spawn('npx', ['ng', 'serve', '--port', frontendPort.toString()], {
  cwd: path.join(__dirname, '..', 'frontend'),
  stdio: 'inherit',
  env
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
