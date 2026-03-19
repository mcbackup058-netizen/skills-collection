/**
 * Simple Runner Script
 * Run with: node smart/run.js "Your question here"
 * 
 * Or set API key first:
 * node smart/run.js --setup
 */

const { spawn } = require('child_process');
const path = require('path');

// Run ts-node with the CLI
const args = process.argv.slice(2);
const tsNode = spawn('npx', ['ts-node', path.join(__dirname, 'cli.ts'), ...args], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, '..'),
});

tsNode.on('close', (code) => {
  process.exit(code);
});
