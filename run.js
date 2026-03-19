/**
 * 🚀 Step Flash Agent - Pro Runner with Real Tools
 * Version: 3.4.0
 * 
 * Features:
 * - Interactive chat mode with streaming
 * - Real tool execution (web search, VPS management)
 * - Conversation history with persistence
 * - Special commands
 * - Multi-turn conversations
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// Import tools
const {
  tools,
  toolDescriptions,
  webSearch,
  vpsStatus,
  vpsServices,
  vpsProcesses,
  vpsDocker,
  vpsNginx,
  vpsFirewall,
  vpsFileManager,
  vpsExecute,
  VPS_CONFIG,
} = require('./tools.js');

// ============= Configuration =============

const CONFIG_DIR = path.join(os.homedir(), '.stepflash');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const HISTORY_FILE = path.join(CONFIG_DIR, 'history.json');
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'step-ai/step-flash-3.5';

// Colors
const c = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  bg: {
    blue: '\x1b[44m',
    green: '\x1b[42m',
  },
};

// ============= Utility Functions =============

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadConfig() {
  ensureDir(CONFIG_DIR);
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  }
  return null;
}

function saveConfig(config) {
  ensureDir(CONFIG_DIR);
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

function loadHistory() {
  ensureDir(CONFIG_DIR);
  if (fs.existsSync(HISTORY_FILE)) {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
  }
  return [];
}

function saveHistory(history) {
  ensureDir(CONFIG_DIR);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(-100), null, 2));
}

function log(msg, color = c.reset) {
  console.log(`${color}${msg}${c.reset}`);
}

function printBanner() {
  console.log(`
${c.cyan}╔════════════════════════════════════════════════════════════════╗
${c.cyan}║${c.bright}${c.green}      🤖 Step Flash Agent Pro v3.4.0 - AI Assistant${c.reset}          ${c.cyan}║
${c.cyan}║${c.yellow}      Real Tools • VPS Management • Web Search${c.reset}               ${c.cyan}║
${c.cyan}╠════════════════════════════════════════════════════════════════╣
${c.cyan}║${c.reset}  Commands: /help • /tools • /vps • /history • /clear • /exit ${c.cyan}║
${c.cyan}╚════════════════════════════════════════════════════════════════╝${c.reset}
`);
}

// ============= Tool Detection & Execution =============

const TOOL_PATTERNS = {
  vps_status: {
    patterns: [/vps.*status|server.*status|cek.*vps|status.*server|cpu.*memory|memory.*disk|system.*status/i],
    keywords: ['vps status', 'server status', 'cek vps', 'cpu memory', 'system status'],
  },
  vps_services: {
    patterns: [/service.*running|running.*service|what.*service|list.*service/i],
    keywords: ['services', 'service running', 'what services'],
  },
  vps_docker: {
    patterns: [/docker.*container|container.*docker|docker.*ps|list.*docker/i],
    keywords: ['docker', 'containers', 'docker ps'],
  },
  vps_nginx: {
    patterns: [/nginx.*status|nginx.*log|nginx.*error/i],
    keywords: ['nginx', 'nginx status', 'nginx log'],
  },
  vps_processes: {
    patterns: [/running.*process|process.*running|what.*process|top.*process/i],
    keywords: ['processes', 'running process', 'top process'],
  },
  web_search: {
    patterns: [/search.*for|cari|find.*about|what is the latest|news about|information about|tell me about/i],
    keywords: ['search', 'cari', 'find', 'news', 'information'],
  },
};

function detectTool(prompt) {
  const lower = prompt.toLowerCase();
  
  for (const [toolName, config] of Object.entries(TOOL_PATTERNS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(prompt)) {
        return toolName;
      }
    }
  }
  
  return null;
}

async function executeTool(toolName, prompt) {
  try {
    switch (toolName) {
      case 'vps_status':
        log('\n📊 Checking VPS status...', c.yellow);
        const status = await vpsStatus();
        if (status.success) {
          return formatVpsStatus(status.results);
        }
        return `Error: ${status.error || 'Unknown error'}`;
        
      case 'vps_services':
        log('\n🔧 Listing services...', c.yellow);
        const services = await vpsServices('list');
        return services.success ? services.output : `Error: ${services.error}`;
        
      case 'vps_docker':
        log('\n🐳 Checking Docker...', c.yellow);
        const docker = await vpsDocker('ps');
        return docker.success ? docker.output : `Error: ${docker.error}`;
        
      case 'vps_nginx':
        log('\n🌐 Checking Nginx...', c.yellow);
        const nginx = await vpsNginx('status');
        return nginx.success ? nginx.output : `Error: ${nginx.error}`;
        
      case 'vps_processes':
        log('\n📋 Listing processes...', c.yellow);
        const processes = await vpsProcesses('memory');
        return processes.success ? processes.output : `Error: ${processes.error}`;
        
      case 'web_search':
        const query = prompt.replace(/search|cari|find|for|about|the|latest|news|information/gi, '').trim();
        log(`\n🔍 Searching for: "${query}"...`, c.yellow);
        const search = await webSearch(query);
        return formatSearchResults(search);
        
      default:
        return null;
    }
  } catch (error) {
    return `Tool Error: ${error.message}`;
  }
}

function formatVpsStatus(results) {
  return `
📊 VPS Status Report - ${VPS_CONFIG.host}

${c.bright}Hostname:${c.reset} ${results.hostname}
${c.bright}Uptime:${c.reset} ${results.uptime}
${c.bright}Load:${c.reset} ${results.load}

${c.bright}Memory:${c.reset}
${results.memory}

${c.bright}Disk:${c.reset}
${results.disk}

${c.bright}CPU:${c.reset}
${results.cpu.split('\n').slice(0, 3).join('\n')}
`;
}

function formatSearchResults(search) {
  if (!search.success || search.results.length === 0) {
    return `No results found for "${search.query}"`;
  }
  
  let output = `\n🔍 Search Results for "${search.query}":\n\n`;
  
  search.results.forEach((r, i) => {
    output += `${i + 1}. ${c.bright}${r.title}${c.reset}\n`;
    output += `   ${r.content.substring(0, 200)}${r.content.length > 200 ? '...' : ''}\n`;
    if (r.url) output += `   ${c.dim}${r.url}${c.reset}\n`;
    output += '\n';
  });
  
  return output;
}

// ============= System Prompt =============

function buildSystemPrompt(detectedTool, toolResult) {
  let toolInfo = '';
  
  if (detectedTool && toolResult) {
    toolInfo = `
## Tool Execution Result:
The ${detectedTool} tool was executed. Here's the result:

\`\`\`
${toolResult}
\`\`\`

Use this information to provide a helpful response to the user.
`;
  }

  return `You are Step Flash Agent Pro, a powerful AI assistant with real tool execution capabilities.

## Your Capabilities:
- **VPS Management**: Execute real commands on user's VPS (${VPS_CONFIG.host})
- **Web Search**: Search the web for current information
- **Code Development**: Write, analyze, and debug code
- **Data Analysis**: Analyze and visualize data
- **General Q&A**: Answer any question

## VPS Information:
- Host: ${VPS_CONFIG.host}
- User: ${VPS_CONFIG.username}
- This is a production server - be careful with commands

${toolDescriptions}

## Guidelines:
1. Be helpful, accurate, and concise
2. Use markdown formatting when appropriate
3. Provide actual commands when asked about VPS operations
4. Explain technical concepts simply
5. If you executed a tool, use the result to answer the user's question
${toolInfo}
`;
}

// ============= API Functions =============

async function chatStream(apiKey, messages, onChunk) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/mcbackup058-netizen/skills-collection',
      'X-Title': 'Step Flash Agent Pro',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) onChunk(content);
        } catch (e) {}
      }
    }
  }
}

// ============= Commands =============

const COMMANDS = {
  '/help': () => {
    console.log(`
${c.bright}📚 Available Commands:${c.reset}

  ${c.cyan}/help${c.reset}       Show this help message
  ${c.cyan}/tools${c.reset}      List available tools
  ${c.cyan}/vps${c.reset}        Show VPS information
  ${c.cyan}/status${c.reset}     Quick VPS status check
  ${c.cyan}/history${c.reset}    Show conversation history
  ${c.cyan}/clear${c.reset}      Clear conversation history
  ${c.cyan}/export${c.reset}     Export conversation to file
  ${c.cyan}/config${c.reset}     Show current configuration
  ${c.cyan}/exit${c.reset}       Exit the program

${c.bright}💡 Quick VPS Commands:${c.reset}
  ${c.green}status${c.reset}  - Check VPS status
  ${c.green}docker${c.reset}  - List Docker containers
  ${c.green}nginx${c.reset}   - Check Nginx status
  ${c.green}services${c.reset} - List running services

${c.bright}💡 Just ask anything:${c.reset}
  "Check my VPS status"
  "Search for latest AI news"
  "What services are running?"
`);
  },

  '/tools': () => {
    console.log(`
${c.bright}🛠️ Available Tools:${c.reset}

${c.green}vps_status()${c.reset}
  Get VPS system status (CPU, memory, disk, uptime)

${c.green}vps_services(action, service)${c.reset}
  Manage system services (list, status, start, stop, restart, logs)

${c.green}vps_processes(sortBy)${c.reset}
  List running processes sorted by memory or CPU

${c.green}vps_docker(action, container)${c.reset}
  Manage Docker (ps, images, logs, start, stop, restart, stats)

${c.green}vps_nginx(action, site)${c.reset}
  Manage Nginx (status, test, reload, restart, sites, logs)

${c.green}vps_firewall(action, port)${c.reset}
  Manage UFW firewall (status, allow, deny, ports)

${c.green}vps_file(action, path)${c.reset}
  File operations (list, read, tail, find, disk, du)

${c.green}web_search(query)${c.reset}
  Search the web for current information
`);
  },

  '/vps': () => {
    console.log(`
${c.bright}🖥️ VPS Server Information:${c.reset}

  ${c.cyan}Host:${c.reset}     ${VPS_CONFIG.host}
  ${c.cyan}User:${c.reset}     ${VPS_CONFIG.username}
  ${c.cyan}Port:${c.reset}     ${VPS_CONFIG.port}

${c.bright}Quick Commands:${c.reset}
  ${c.green}status${c.reset}    - Check VPS status
  ${c.green}docker${c.reset}    - List Docker containers
  ${c.green}nginx${c.reset}     - Check Nginx status
  ${c.green}services${c.reset}  - List running services
  ${c.green}processes${c.reset} - Show top processes

${c.bright}SSH Connection:${c.reset}
  ssh ${VPS_CONFIG.username}@${VPS_CONFIG.host}
`);
  },

  '/config': () => {
    const config = loadConfig();
    console.log(`
${c.bright}⚙️ Configuration:${c.reset}

  ${c.cyan}Config File:${c.reset}  ${CONFIG_FILE}
  ${c.cyan}History File:${c.reset}  ${HISTORY_FILE}
  ${c.cyan}Model:${c.reset}         ${MODEL}
  ${c.cyan}API Key:${c.reset}       ${config?.apiKey ? '✅ Configured' : '❌ Not set'}
  ${c.cyan}VPS Host:${c.reset}      ${VPS_CONFIG.host}
`);
  },
};

// ============= Quick VPS Commands =============

async function quickVpsCommand(cmd) {
  switch (cmd.toLowerCase()) {
    case 'status':
      log('\n📊 Checking VPS status...\n', c.yellow);
      const status = await vpsStatus();
      if (status.success) {
        console.log(formatVpsStatus(status.results));
      } else {
        log(`Error: ${status.error}`, c.red);
      }
      return true;
      
    case 'docker':
      log('\n🐳 Docker containers:\n', c.yellow);
      const docker = await vpsDocker('ps');
      console.log(docker.success ? docker.output : `Error: ${docker.error}`);
      return true;
      
    case 'nginx':
      log('\n🌐 Nginx status:\n', c.yellow);
      const nginx = await vpsNginx('status');
      console.log(nginx.success ? nginx.output : `Error: ${nginx.error}`);
      return true;
      
    case 'services':
      log('\n🔧 Running services:\n', c.yellow);
      const services = await vpsServices('list');
      console.log(services.success ? services.output : `Error: ${services.error}`);
      return true;
      
    case 'processes':
      log('\n📋 Top processes:\n', c.yellow);
      const processes = await vpsProcesses('memory');
      console.log(processes.success ? processes.output : `Error: ${processes.error}`);
      return true;
      
    default:
      return false;
  }
}

// ============= Interactive Mode =============

async function interactiveMode(apiKey) {
  printBanner();
  
  const history = loadHistory();
  const messages = history.length > 0 ? history : [];
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  log(`💬 Chat mode - Type your message or command\n`, c.cyan);

  while (true) {
    const input = await question(`${c.green}You:${c.reset} `);
    const trimmed = input.trim();

    if (!trimmed) continue;

    // Check for exit
    if (trimmed.toLowerCase() === '/exit' || trimmed.toLowerCase() === '/quit' || trimmed.toLowerCase() === 'exit') {
      log('\n👋 Goodbye!', c.green);
      rl.close();
      break;
    }
    
    // Check for clear
    if (trimmed.toLowerCase() === '/clear') {
      messages.length = 0;
      saveHistory([]);
      log('✅ History cleared.\n', c.green);
      continue;
    }
    
    // Check for history
    if (trimmed.toLowerCase() === '/history') {
      if (messages.length === 0) {
        log('No history.\n', c.yellow);
      } else {
        log(`\n📜 History (${messages.length} messages):\n`, c.bright);
        messages.slice(-10).forEach((m, i) => {
          const role = m.role === 'user' ? 'You' : 'AI';
          const color = m.role === 'user' ? c.green : c.cyan;
          log(`  ${color}${role}:${c.reset} ${m.content.substring(0, 80)}...`, c.dim);
        });
        console.log();
      }
      continue;
    }
    
    // Check for export
    if (trimmed.toLowerCase() === '/export') {
      const exportFile = path.join(CONFIG_DIR, `chat_${Date.now()}.md`);
      const content = messages.map(m => `**${m.role}**: ${m.content}`).join('\n\n---\n\n');
      fs.writeFileSync(exportFile, `# Chat Export\n\n${content}`);
      log(`✅ Exported to: ${exportFile}\n`, c.green);
      continue;
    }
    
    // Check for commands
    if (COMMANDS[trimmed.toLowerCase()]) {
      COMMANDS[trimmed.toLowerCase()]();
      continue;
    }
    
    // Check for quick VPS commands
    if (await quickVpsCommand(trimmed)) {
      continue;
    }

    // Detect and execute tool
    const detectedTool = detectTool(trimmed);
    let toolResult = null;
    
    if (detectedTool) {
      log(`🔍 Detected: ${detectedTool}`, c.dim);
      toolResult = await executeTool(detectedTool, trimmed);
    }

    // Build messages
    const systemPrompt = buildSystemPrompt(detectedTool, toolResult);
    
    messages.push({ role: 'user', content: trimmed });

    // Get AI response
    log(`\n${c.cyan}AI:${c.reset} `, c.cyan);
    
    let fullResponse = '';
    try {
      await chatStream(apiKey, [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10)
      ], (chunk) => {
        process.stdout.write(chunk);
        fullResponse += chunk;
      });
      
      console.log('\n');
      
      messages.push({ role: 'assistant', content: fullResponse });
      saveHistory(messages);
      
    } catch (error) {
      log(`\n❌ Error: ${error.message}\n`, c.red);
      messages.pop();
    }
  }
}

// ============= Single Query Mode =============

async function singleQuery(apiKey, question) {
  const detectedTool = detectTool(question);
  let toolResult = null;
  
  if (detectedTool) {
    log(`🔍 Detected: ${detectedTool}`, c.dim);
    toolResult = await executeTool(detectedTool, question);
    console.log();
  }

  log('🤔 Thinking...\n', c.yellow);

  const systemPrompt = buildSystemPrompt(detectedTool, toolResult);

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ];
    
    process.stdout.write(c.cyan);
    await chatStream(apiKey, messages, (chunk) => {
      process.stdout.write(chunk);
    });
    process.stdout.write(c.reset + '\n\n');
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, c.red);
    process.exit(1);
  }
}

// ============= Main =============

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printBanner();
    console.log(`
${c.bright}Usage:${c.reset}
  node run.js setup <api_key>    Configure API key
  node run.js "your question"    Ask a single question
  node run.js chat               Start interactive mode
  node run.js status             Quick VPS status
`);
    return;
  }

  // Setup
  if (args[0] === 'setup') {
    const apiKey = args[1];
    if (!apiKey) {
      log('❌ Please provide API key:', c.red);
      log('   node run.js setup sk-or-v1-your-key', c.yellow);
      process.exit(1);
    }
    
    saveConfig({ apiKey, model: MODEL, createdAt: new Date().toISOString() });
    log('✅ Setup complete!', c.green);
    log(`   Config: ${CONFIG_FILE}`, c.cyan);
    log('\n   Start chatting:', c.green);
    log('   node run.js chat', c.yellow);
    return;
  }

  // Load API key
  const config = loadConfig();
  const apiKey = config?.apiKey || process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    log('❌ No API key!', c.red);
    log('   Run: node run.js setup YOUR_API_KEY', c.yellow);
    process.exit(1);
  }

  // Quick VPS commands
  if (['status', 'docker', 'nginx', 'services', 'processes'].includes(args[0].toLowerCase())) {
    await quickVpsCommand(args[0]);
    return;
  }

  // Interactive mode
  if (args[0] === 'chat' || args[0] === '-i' || args[0] === '--interactive') {
    await interactiveMode(apiKey);
    return;
  }

  // Single query
  await singleQuery(apiKey, args.join(' '));
}

main().catch(console.error);
