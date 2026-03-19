#!/usr/bin/env node
/**
 * Simple Prompt Runner
 * Just input your prompt and get results!
 * Usage: node run.js "your prompt here"
 * Last Updated: March 2026
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// API Key
const API_KEY = process.env.AI_STEP_FLASH_API_KEY || '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';

// Banner
const BANNER = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║    ███████╗████████╗██████╗ ███████╗ ██████╗ ██████╗ ██╗      ║
║    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██╔════╝██╔═══██╗██║      ║
║    ███████╗   ██║   ██████╔╝█████╗  ██║     ██║   ██║██║      ║
║    ╚════██║   ██║   ██╔══██╗██╔══╝  ██║     ██║   ██║██║      ║
║    ███████║   ██║   ██║  ██║███████╗╚██████╗╚██████╔╝███████╗ ║
║    ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝ ║
║                                                               ║
║           🚀 Step Flash Agent - Simple Runner v3.0 🚀         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`;

// Quick prompt function
async function quickPrompt(prompt, options = {}) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/mcbackup058-netizen/skills-collection',
      'X-Title': 'Step Flash Simple Runner',
    },
    body: JSON.stringify({
      model: options.model || 'step-ai/step-flash-3.5',
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(options.preset),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 4096,
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

// System prompts
function getSystemPrompt(preset = 'assistant') {
  const prompts = {
    assistant: `You are a helpful AI assistant. Be concise and helpful.`,
    
    researcher: `You are a research assistant. Provide thorough, well-researched answers with sources when possible.`,
    
    developer: `You are an expert developer assistant. Write clean, efficient code with explanations. Follow best practices.`,
    
    writer: `You are a writing assistant. Help create engaging, well-structured content.`,
    
    analyst: `You are a data analyst assistant. Help analyze data and provide insights.`,
    
    vps: `You are a VPS/server management assistant. Help with:
- SSH commands and server administration
- Docker container management
- Nginx/Apache configuration
- Database management (MySQL, PostgreSQL)
- System monitoring and optimization
- Deployment and automation
- Security and firewall configuration

Provide exact commands that can be executed. Be careful with dangerous operations.`,
  };
  
  return prompts[preset] || prompts.assistant;
}

// VPS Command Generator
function generateVPSCommand(prompt, vpsConfig) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Common VPS commands mapping
  const commandMap = {
    'status|system info|server info': 'uptime && free -h && df -h',
    'cpu usage|cpu': 'top -bn1 | head -20',
    'memory|ram': 'free -h',
    'disk|storage': 'df -h',
    'processes|running': 'ps aux --sort=-%mem | head -20',
    'docker ps|containers': 'docker ps -a',
    'docker images': 'docker images',
    'nginx status': 'systemctl status nginx',
    'nginx restart': 'sudo systemctl restart nginx',
    'nginx logs': 'tail -50 /var/log/nginx/error.log',
    'firewall status|ufw status': 'sudo ufw status verbose',
    'open ports|listening ports': 'ss -tulpn',
    'users|who is logged': 'who && last | head -10',
    'network|connections': 'ss -tunap',
    'logs|system logs': 'journalctl -n 50 --no-pager',
  };

  // Check for matching commands
  for (const [pattern, command] of Object.entries(commandMap)) {
    if (new RegExp(pattern).test(lowerPrompt)) {
      return {
        command,
        sshCommand: `ssh -o StrictHostKeyChecking=no ${vpsConfig.username}@${vpsConfig.host} "${command}"`,
        note: 'Execute this command on your VPS',
      };
    }
  }

  return null;
}

// Main runner
async function main() {
  console.log(BANNER);
  
  const args = process.argv.slice(2);
  
  // Help
  if (args.includes('-h') || args.includes('--help') || args.length === 0) {
    console.log(`
Usage:
  node run.js "your prompt here"
  node run.js --preset researcher "research topic"
  node run.js --vps "show system status"

Options:
  -p, --preset <name>   Use preset (assistant, researcher, developer, writer, analyst, vps)
  -m, --model <model>   Use specific model
  -v, --verbose         Show verbose output
  -h, --help            Show this help
  -i, --interactive     Interactive mode

Presets:
  assistant   General assistant (default)
  researcher  Research and analysis
  developer   Coding and development
  writer      Content creation
  analyst     Data analysis
  vps         VPS/Server management

Examples:
  node run.js "What is machine learning?"
  node run.js --preset researcher "Research quantum computing"
  node run.js --preset developer "Create a REST API in Node.js"
  node run.js --preset vps "Check my server memory usage"
`);
    process.exit(0);
  }

  // Parse options
  let preset = 'assistant';
  let model = 'step-ai/step-flash-3.5';
  let verbose = false;
  let interactive = false;
  let prompt = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-p' || args[i] === '--preset') {
      preset = args[++i];
    } else if (args[i] === '-m' || args[i] === '--model') {
      model = args[++i];
    } else if (args[i] === '-v' || args[i] === '--verbose') {
      verbose = true;
    } else if (args[i] === '-i' || args[i] === '--interactive') {
      interactive = true;
    } else if (!args[i].startsWith('-')) {
      prompt = args[i];
    }
  }

  // VPS mode - check for VPS commands
  if (preset === 'vps' && prompt) {
    const vpsConfig = {
      host: '103.157.27.152',
      username: 'hyperlot99',
      password: '@Dilarang9',
    };

    console.log(`🖥️  VPS Mode: ${vpsConfig.host}`);
    console.log(`📝 Prompt: ${prompt}\n`);

    const vpsCommand = generateVPSCommand(prompt, vpsConfig);
    
    if (vpsCommand) {
      console.log('💡 Suggested Command:\n');
      console.log(`   ${vpsCommand.command}`);
      console.log('\n📡 SSH Command:\n');
      console.log(`   ${vpsCommand.sshCommand}`);
      console.log('\n---\n');
    }
  }

  // Interactive mode
  if (interactive) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '\n> ',
    });

    console.log('💬 Interactive Mode - Type "exit" to quit\n');
    rl.prompt();

    rl.on('line', async (input) => {
      const trimmed = input.trim();
      if (trimmed.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      if (!trimmed) {
        rl.prompt();
        return;
      }

      try {
        process.stdout.write('\n🤖 ');
        const response = await quickPrompt(trimmed, { preset, model });
        console.log(response);
      } catch (error) {
        console.error('❌ Error:', error.message);
      }

      rl.prompt();
    });

    rl.on('close', () => {
      console.log('\n👋 Goodbye!\n');
      process.exit(0);
    });

    return;
  }

  // Single prompt mode
  if (prompt) {
    console.log(`📝 Prompt: ${prompt}`);
    console.log(`🎯 Preset: ${preset}\n`);
    
    try {
      process.stdout.write('🤖 ');
      const response = await quickPrompt(prompt, { preset, model });
      console.log(response);
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }
}

// Run
main().catch(console.error);
