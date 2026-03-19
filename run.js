/**
 * Simple Node.js Runner - No ts-node required
 * 
 * Usage:
 *   node run.js setup YOUR_API_KEY
 *   node run.js "Your question here"
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_DIR = path.join(os.homedir(), '.stepflash');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Load config
function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  }
  return null;
}

// Save config
function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║           🤖 Step Flash - Simple AI Assistant            ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Usage:                                                  ║
║                                                          ║
║  First time setup:                                       ║
║    node run.js setup YOUR_API_KEY                        ║
║                                                          ║
║  Ask anything:                                           ║
║    node run.js "Your question here"                      ║
║                                                          ║
║  Examples:                                               ║
║    node run.js "What is Python?"                         ║
║    node run.js "Check my VPS status"                     ║
║    node run.js "Search for AI news"                      ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);
    return;
  }

  // Setup command
  if (args[0] === 'setup') {
    const apiKey = args[1];
    if (!apiKey) {
      console.error('❌ Please provide your API key:');
      console.error('   node run.js setup sk-or-v1-YOUR-KEY');
      process.exit(1);
    }
    
    saveConfig({
      apiKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    console.log('✅ Setup complete! API key saved.');
    console.log('   Config file:', CONFIG_FILE);
    console.log('\n   You can now ask questions:');
    console.log('   node run.js "Your question here"');
    return;
  }

  // Check for API key
  const config = loadConfig();
  const apiKey = config?.apiKey || process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error('❌ No API key configured!');
    console.error('   Run: node run.js setup YOUR_API_KEY');
    process.exit(1);
  }

  const question = args.join(' ');
  
  console.log('\n🤔 Thinking...\n');
  
  // Make API call to OpenRouter
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/mcbackup058-netizen/skills-collection',
        'X-Title': 'Step Flash Agent',
      },
      body: JSON.stringify({
        model: 'step-ai/step-flash-3.5',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant. You have access to various capabilities:
- Web search and research
- VPS/Server management (user has server at 103.157.27.152)
- Code development and debugging
- Data analysis and visualization
- File operations

Provide helpful, accurate, and concise responses.`
          },
          { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'No response';
    console.log(content);
    console.log();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
