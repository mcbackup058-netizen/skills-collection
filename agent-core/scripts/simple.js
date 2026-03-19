#!/usr/bin/env node
/**
 * Step Flash Agent - Ultra Simple Runner
 * The easiest way to use AI - just pass your prompt!
 * 
 * Usage:
 *   node simple.js "your prompt"
 *   node simple.js --vps "check server status"
 * 
 * Last Updated: March 2026
 */

// ============= Configuration =============
const CONFIG = {
  apiKey: process.env.AI_STEP_FLASH_API_KEY || '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',
  model: 'step-ai/step-flash-3.5',
  
  // VPS Configuration
  vps: {
    host: '103.157.27.152',
    username: 'hyperlot99',
    password: '@Dilarang9',
    port: 22,
  },
};

// ============= Presets =============
const PRESETS = {
  default: 'You are a helpful AI assistant.',
  researcher: 'You are a research assistant. Provide thorough, well-researched answers.',
  developer: 'You are an expert developer. Write clean code with explanations.',
  vps: `You are a VPS server assistant. The server details are:
- Host: ${CONFIG.vps.host}
- User: ${CONFIG.vps.username}
- Port: ${CONFIG.vps.port}

Provide exact SSH commands that can be executed. Warn about dangerous operations.`,
};

// ============= Core Functions =============

async function ask(prompt, options = {}) {
  const { preset = 'default', verbose = false } = options;
  const systemPrompt = PRESETS[preset] || PRESETS.default;
  
  if (verbose) {
    console.log(`\n🎯 Mode: ${preset}`);
    console.log(`📝 Prompt: ${prompt}\n`);
  }
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/mcbackup058-netizen/skills-collection',
      'X-Title': 'Step Flash Simple Runner',
    },
    body: JSON.stringify({
      model: CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

// VPS Quick Commands
const VPS_COMMANDS = {
  'status': 'uptime && free -h && df -h',
  'cpu': 'top -bn1 | head -10',
  'memory': 'free -h',
  'disk': 'df -h',
  'docker': 'docker ps -a',
  'nginx': 'systemctl status nginx',
  'processes': 'ps aux --sort=-%mem | head -20',
  'ports': 'ss -tulpn',
  'logs': 'journalctl -n 30 --no-pager',
  'firewall': 'ufw status',
};

function detectVpsCommand(prompt) {
  const lower = prompt.toLowerCase();
  
  for (const [key, command] of Object.entries(VPS_COMMANDS)) {
    if (lower.includes(key)) {
      return {
        key,
        command,
        ssh: `ssh ${CONFIG.vps.username}@${CONFIG.vps.host} "${command}"`,
      };
    }
  }
  return null;
}

// ============= CLI =============

async function main() {
  const args = process.argv.slice(2);
  
  // Help
  if (args.includes('-h') || args.includes('--help') || args.length === 0) {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         🚀 Step Flash Agent - Simple Runner v3.0 🚀           ║
╚═══════════════════════════════════════════════════════════════╝

Usage:
  node simple.js "your prompt"
  node simple.js --vps "check status"

Options:
  --vps          VPS management mode
  --research     Research mode
  --dev          Developer mode
  -v, --verbose  Show detailed output
  -h, --help     Show this help

VPS Quick Commands:
  status, cpu, memory, disk, docker, nginx, processes, ports, logs

Examples:
  node simple.js "What is AI?"
  node simple.js --vps "check memory"
  node simple.js --research "Research quantum computing"
  node simple.js --dev "Create a REST API"
`);
    return;
  }

  // Parse
  let preset = 'default';
  let verbose = false;
  let prompt = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--vps') preset = 'vps';
    else if (args[i] === '--research') preset = 'researcher';
    else if (args[i] === '--dev') preset = 'developer';
    else if (args[i] === '-v' || args[i] === '--verbose') verbose = true;
    else if (!args[i].startsWith('-')) prompt = args[i];
  }

  // VPS Mode - show suggested commands
  if (preset === 'vps') {
    console.log(`\n🖥️  VPS: ${CONFIG.vps.host} (${CONFIG.vps.username})\n`);
    
    const vpsCmd = detectVpsCommand(prompt);
    if (vpsCmd) {
      console.log(`💡 Quick Command [${vpsCmd.key}]:`);
      console.log(`   ${vpsCmd.command}`);
      console.log(`\n📡 SSH Command:`);
      console.log(`   ${vpsCmd.ssh}`);
      console.log(`\n---\n`);
    }
  }

  // Get AI response
  if (prompt) {
    try {
      const response = await ask(prompt, { preset, verbose });
      console.log(`\n🤖 Response:\n`);
      console.log(response);
      console.log('');
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }
}

// Export for programmatic use
module.exports = { ask, CONFIG, VPS_COMMANDS };

// Run CLI
if (require.main === module) {
  main().catch(console.error);
}
