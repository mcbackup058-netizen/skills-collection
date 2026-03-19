# 🤖 Step Flash Smart Agent - Ultra Simple Interface

> **Just ask anything - AI handles the rest automatically!**

## 🚀 Quick Start (2 Steps!)

### Step 1: Setup API Key (One-time)

```bash
# Using CLI
npx ts-node smart/cli.ts --setup

# Or using easy script
npx ts-node smart/easy.ts setup sk-or-v1-your-api-key

# Or set environment variable
export OPENROUTER_API_KEY=sk-or-v1-your-api-key
```

### Step 2: Ask Anything!

```bash
# Just ask!
npx ts-node smart/cli.ts "What is the weather in Jakarta?"
npx ts-node smart/cli.ts "Check my VPS server status"
npx ts-node smart/cli.ts "Search for latest AI news"
```

**That's it!** The AI automatically detects what skills/tools to use based on your question.

---

## 📖 Usage Examples

### Command Line

```bash
# Interactive mode (chat continuously)
npx ts-node smart/cli.ts

# Single question
npx ts-node smart/cli.ts "Explain quantum computing"

# VPS Management
npx ts-node smart/cli.ts "Check CPU and memory on my VPS"
npx ts-node smart/cli.ts "What services are running on my server?"

# Web Search
npx ts-node smart/cli.ts "What's the latest news about AI?"

# Code Help
npx ts-node smart/cli.ts "Write a Python script to download images"

# Data Analysis
npx ts-node smart/cli.ts "Analyze this CSV data and create a chart"
```

### In Your Code

```typescript
import { setup, ask, askStream, execute } from './smart';

// First time: setup (only once!)
await setup('sk-or-v1-your-api-key');

// Then just ask!
const answer = await ask('What is machine learning?');
console.log(answer);

// Stream response
for await (const chunk of askStream('Tell me a story')) {
  process.stdout.write(chunk);
}

// Execute complex tasks
const result = await execute('Deploy my app to the VPS server');
```

---

## 🛠️ Auto-Detected Skills

The AI automatically detects and uses these skills based on your prompt:

| Skill | Description | Trigger Keywords |
|-------|-------------|------------------|
| **Web Search** | Search internet for information | search, find, what is, latest, news, research |
| **VPS Management** | Manage servers via SSH | vps, server, ssh, status, cpu, memory, service |
| **Code Development** | Write & analyze code | code, program, debug, function, python, javascript |
| **Data Processing** | Analyze & visualize data | data, csv, json, analyze, chart, statistics |
| **File Operations** | Read/write files | file, document, read, write, pdf, docx |
| **Communication** | Send messages | email, slack, discord, notify, message |
| **API Integration** | Make API calls | api, endpoint, rest, graphql, fetch |
| **Database** | Query databases | database, sql, query, mysql, mongodb |
| **AI Generation** | Generate content | generate image, create, tts, audio, video |
| **Task Planning** | Plan complex tasks | plan, organize, todo, step by step |

---

## 📁 File Structure

```
smart/
├── config.ts       # API key persistence
├── SkillDetector.ts # Auto-skill detection
├── SmartAgent.ts   # Main agent class
├── index.ts        # Exports
├── cli.ts          # CLI interface
├── easy.ts         # Super simple runner
├── run.js          # Node.js runner
├── ask.sh          # Unix shell script
├── ask.bat         # Windows batch file
└── README.md       # This file
```

---

## ⚙️ Configuration

Config file is stored at: `~/.stepflash/config.json`

```json
{
  "apiKey": "sk-or-v1-...",
  "model": "step-ai/step-flash-3.5",
  "preferences": {
    "verbose": false,
    "maxTokens": 4096,
    "temperature": 0.7
  },
  "servers": {
    "my-vps": {
      "host": "103.157.27.152",
      "port": 22,
      "username": "hyperlot99",
      "password": "..."
    }
  }
}
```

### Add VPS Server

```bash
# Via CLI
npx ts-node smart/cli.ts --server add myserver 1.2.3.4 user password

# Or in code
import { addServer } from './smart';
await addServer('my-vps', {
  host: '103.157.27.152',
  username: 'hyperlot99',
  password: '@Dilarang9'
});
```

---

## 🎯 API Reference

### Quick Functions

```typescript
// Setup (one-time)
await setup(apiKey: string): Promise<void>

// Ask a question
await ask(prompt: string): Promise<string>

// Stream response
for await (const chunk of askStream(prompt)) { ... }

// Execute complex task
await execute(goal: string): Promise<{ success, result, plan, toolsUsed }>

// Add VPS server
await addServer(name: string, config: {...}): Promise<void>

// List available skills
listSkills(): Array<{ name, description, tools }>

// Quick one-liner (setup + ask)
await quickAsk(prompt: string, apiKey?: string): Promise<string>
```

### SmartAgent Class

```typescript
const agent = new SmartAgent();

// Initialize (auto-loads saved API key)
await agent.init();
// Or with API key
await agent.init('sk-or-v1-...');

// Ask question
const answer = await agent.prompt('Your question');

// Stream
for await (const chunk of agent.promptStream('...')) { ... }

// Execute task
const result = await agent.execute('Deploy the app');

// Get available skills
agent.getAvailableSkills();

// Update config
await agent.updateConfig({ model: 'step-ai/step-flash-3.5' });

// Add server
await agent.addServer('name', { host, username, password });

// Reset conversation
agent.reset();
```

---

## 💡 Examples

### VPS Management

```typescript
await ask('Check my VPS server status at 103.157.27.152');
await ask('What processes are using the most memory?');
await ask('Restart the nginx service');
await ask('Show me the last 50 lines of /var/log/nginx/error.log');
```

### Web Research

```typescript
await ask('What are the latest AI developments in 2026?');
await ask('Compare Python vs JavaScript for web development');
await ask('Find information about climate change solutions');
```

### Code Help

```typescript
await ask('Write a Python function to calculate fibonacci');
await ask('Debug this code: [paste your code]');
await ask('Explain how async/await works in JavaScript');
```

### Data Analysis

```typescript
await ask('Analyze this CSV data: [paste data]');
await ask('Create a bar chart from this data');
await ask('Calculate statistics for these numbers: 1, 5, 3, 7, 2');
```

---

## 🔐 Security Notes

- API keys are stored locally in `~/.stepflash/config.json`
- VPS passwords are stored in plain text (use SSH keys when possible)
- Dangerous commands (rm -rf, shutdown, etc.) require confirmation
- Protected paths (/etc, /root, etc.) have additional safeguards

---

## 📦 Dependencies

```bash
npm install ts-node typescript
```

---

## 📄 License

MIT License - Use freely for any purpose!
