#!/usr/bin/env node
/**
 * Step Flash Smart CLI
 * Ultra-simple command line interface
 * 
 * Usage:
 *   npx ts-node smart/cli.ts "Your question here"
 *   npx ts-node smart/cli.ts --setup
 *   npx ts-node smart/cli.ts --server add myserver 1.2.3.4 user pass
 */

import * as readline from 'readline';
import { SmartAgent, setup, ask, askStream, listSkills, addServer, getStoredApiKey, configManager } from './index';

// ============= CLI Colors =============
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
};

function log(message: string, color: string = colors.reset): void {
  console.log(`${color}${message}${colors.reset}`);
}

function printBanner(): void {
  console.log(`
${colors.cyan}╔══════════════════════════════════════════════════════════╗
${colors.cyan}║${colors.bright}${colors.green}     🤖 Step Flash Smart Agent - AI Assistant${colors.reset}          ${colors.cyan}║
${colors.cyan}║${colors.yellow}     Just ask anything, AI handles the rest!${colors.reset}              ${colors.cyan}║
${colors.cyan}╚══════════════════════════════════════════════════════════╝${colors.reset}
`);
}

function printHelp(): void {
  console.log(`
${colors.bright}Usage:${colors.reset}
  npx ts-node cli.ts "Your question"          Ask a question
  npx ts-node cli.ts                          Start interactive mode
  npx ts-node cli.ts --setup                  Configure API key
  npx ts-node cli.ts --skills                 List available skills
  npx ts-node cli.ts --server add <name> <host> <user> <pass>   Add VPS server

${colors.bright}Examples:${colors.reset}
  npx ts-node cli.ts "What is the weather in Jakarta?"
  npx ts-node cli.ts "Check my VPS server status"
  npx ts-node cli.ts "Search for latest AI news"
  npx ts-node cli.ts "Write a Python script to scrape a website"

${colors.bright}Options:${colors.reset}
  --setup              Configure API key (first time setup)
  --skills             List all available AI skills
  --server             Manage VPS servers
  --help, -h           Show this help message
  --version, -v        Show version

${colors.bright}First Time Setup:${colors.reset}
  1. Get your API key from OpenRouter (https://openrouter.ai)
  2. Run: npx ts-node cli.ts --setup
  3. Enter your API key when prompted
  4. You're ready to go!

${colors.bright}Environment Variable:${colors.reset}
  You can also set OPENROUTER_API_KEY environment variable
`);
}

// ============= Interactive Input =============

async function promptForInput(promptText: string, hidden: boolean = false): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    if (hidden) {
      // Hide input for passwords
      process.stdout.write(promptText);
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      
      let password = '';
      process.stdin.on('data', (char: string) => {
        switch (char) {
          case '\n':
          case '\r':
          case '\u0004': // Ctrl+D
            process.stdin.setRawMode(false);
            process.stdout.write('\n');
            resolve(password);
            break;
          case '\u0003': // Ctrl+C
            process.exit();
            break;
          case '\u007F': // Backspace
            password = password.slice(0, -1);
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(promptText + '*'.repeat(password.length));
            break;
          default:
            password += char;
            process.stdout.write('*');
            break;
        }
      });
    } else {
      rl.question(promptText, (answer) => {
        rl.close();
        resolve(answer);
      });
    }
  });
}

// ============= Setup Command =============

async function runSetup(): Promise<void> {
  printBanner();
  
  // Check if already configured
  await configManager.init();
  const existingKey = configManager.getApiKey();
  
  if (existingKey) {
    log('\n✅ API key is already configured!', colors.green);
    log(`   Config file: ${configManager.getConfigPath()}`, colors.cyan);
    
    const change = await promptForInput('\nDo you want to update it? (y/N): ');
    if (change.toLowerCase() !== 'y') {
      log('\n✨ Setup complete! You can now use the CLI.', colors.green);
      return;
    }
  }

  log('\n📝 API Key Setup', colors.bright + colors.cyan);
  log('─'.repeat(40), colors.cyan);
  log('\nGet your API key from: https://openrouter.ai/keys', colors.yellow);
  
  const apiKey = await promptForInput('\nEnter your OpenRouter API key: ', true);
  
  if (!apiKey || !apiKey.startsWith('sk-or-v1-')) {
    log('\n❌ Invalid API key format. Key should start with "sk-or-v1-"', colors.red);
    process.exit(1);
  }

  await setup(apiKey);
  log('\n✅ API key saved successfully!', colors.green);
  log(`   Config file: ${configManager.getConfigPath()}`, colors.cyan);
  log('\n✨ You can now use the CLI! Just run:', colors.green);
  log('   npx ts-node cli.ts "Your question here"', colors.yellow);
}

// ============= Skills Command =============

async function showSkills(): Promise<void> {
  printBanner();
  
  const skills = listSkills();
  
  log('\n🛠️  Available AI Skills\n', colors.bright + colors.cyan);
  log('The AI will automatically use these skills based on your question:\n', colors.yellow);
  
  for (const skill of skills) {
    log(`  ${colors.green}● ${skill.name}${colors.reset}`, colors.bright);
    log(`    ${skill.description}`, colors.cyan);
    log(`    Tools: ${skill.tools.join(', ')}\n`, colors.reset);
  }
}

// ============= Server Command =============

async function manageServer(args: string[]): Promise<void> {
  const action = args[0];
  
  if (action === 'add') {
    const [name, host, username, password] = args.slice(1);
    
    if (!name || !host || !username || !password) {
      log('\n❌ Usage: --server add <name> <host> <username> <password>', colors.red);
      process.exit(1);
    }
    
    await configManager.init();
    await addServer(name, { host, username, password, port: 22 });
    
    log(`\n✅ Server "${name}" added successfully!`, colors.green);
    log(`   Host: ${host}`, colors.cyan);
    log(`   User: ${username}`, colors.cyan);
  } else {
    log('\n❌ Unknown server action. Use: --server add', colors.red);
  }
}

// ============= Ask Command =============

async function askQuestion(question: string): Promise<void> {
  printBanner();
  
  try {
    await configManager.init();
    const apiKey = configManager.getApiKey() || process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      log('\n❌ No API key configured!', colors.red);
      log('   Run: npx ts-node cli.ts --setup', colors.yellow);
      process.exit(1);
    }
    
    // Initialize and ask
    await setup(apiKey);
    
    log(`\n${colors.cyan}❓ Question:${colors.reset} ${question}`, colors.bright);
    log(`\n${colors.yellow}🤔 Thinking...${colors.reset}\n`);
    
    // Stream response
    process.stdout.write(colors.green);
    for await (const chunk of askStream(question)) {
      process.stdout.write(chunk);
    }
    process.stdout.write(colors.reset + '\n\n');
    
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// ============= Interactive Mode =============

async function interactiveMode(): Promise<void> {
  printBanner();
  
  await configManager.init();
  const apiKey = configManager.getApiKey() || process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    log('\n❌ No API key configured!', colors.red);
    log('   Run: npx ts-node cli.ts --setup', colors.yellow);
    process.exit(1);
  }
  
  await setup(apiKey);
  
  log('💬 Interactive Mode - Type your questions (Ctrl+C to exit)\n', colors.bright + colors.cyan);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  const askQuestion = async () => {
    rl.question(`${colors.cyan}You: ${colors.reset}`, async (question) => {
      if (!question.trim()) {
        askQuestion();
        return;
      }
      
      if (question.toLowerCase() === 'exit' || question.toLowerCase() === 'quit') {
        log('\n👋 Goodbye!', colors.green);
        rl.close();
        return;
      }
      
      try {
        process.stdout.write(`\n${colors.yellow}AI: ${colors.reset}`);
        
        for await (const chunk of askStream(question)) {
          process.stdout.write(chunk);
        }
        
        process.stdout.write('\n\n');
      } catch (error) {
        log(`\n❌ Error: ${error.message}\n`, colors.red);
      }
      
      askQuestion();
    });
  };
  
  askQuestion();
}

// ============= Main CLI =============

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  // No arguments - interactive mode
  if (args.length === 0) {
    await interactiveMode();
    return;
  }
  
  // Parse flags
  const flag = args[0];
  
  switch (flag) {
    case '--setup':
      await runSetup();
      break;
      
    case '--skills':
      await showSkills();
      break;
      
    case '--server':
      await manageServer(args.slice(1));
      break;
      
    case '--help':
    case '-h':
      printBanner();
      printHelp();
      break;
      
    case '--version':
    case '-v':
      console.log('Step Flash Smart Agent v3.2.0');
      break;
      
    default:
      // Treat as question
      const question = args.join(' ');
      await askQuestion(question);
  }
}

// Run CLI
main().catch(console.error);
