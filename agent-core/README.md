# 🤖 Step Flash 3.5 AI Agent Core

A powerful, production-ready AI Agent framework built on **AI Step Flash 3.5** via OpenRouter. Transform Step Flash 3.5 into an intelligent agent capable of planning, reasoning, tool use, and autonomous task execution.

## ✨ Features

### Core Capabilities
- 🧠 **Intelligent Reasoning** - Multi-step reasoning with chain-of-thought
- 📋 **Task Planning** - Automatic decomposition of complex goals into actionable plans
- 🔧 **Tool Integration** - Built-in tools for web, code, files, and more
- 💾 **Memory System** - Short-term, long-term, and semantic memory
- 🔄 **Self-Correction** - Automatic error detection and correction
- 📊 **Streaming Responses** - Real-time response streaming

### Built-in Tools
| Category | Tools |
|----------|-------|
| **Web** | web_search, web_fetch |
| **Code** | code_execute, code_analyze |
| **File** | file_read, file_write, file_list |
| **Memory** | memory_store, memory_recall |
| **Reasoning** | reasoning_chain, decision_make |
| **Communication** | notify, ask_user |

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/mcbackup058-netizen/skills-collection.git
cd skills-collection/agent-core

# Install dependencies
npm install

# Set your API key
export AI_STEP_FLASH_API_KEY=sk-or-v1-your-api-key
```

### Basic Usage

```typescript
import { StepFlashAgent } from './StepFlashAgent';
import { builtinTools } from './tools/builtin';

// Create the agent
const agent = new StepFlashAgent({
  apiKey: process.env.AI_STEP_FLASH_API_KEY,
  model: 'step-ai/step-flash-3.5',
  maxIterations: 10,
  verbose: true,
});

// Register tools
agent.registerTools(builtinTools);

// Chat with the agent
const response = await agent.chat('Help me plan a web scraping project');
console.log(response.content);
```

### CLI Usage

```bash
# Start interactive CLI
npm run cli

# Or directly
ts-node cli/cli.ts
```

## 📖 Documentation

### Creating an Agent

```typescript
import { StepFlashAgent } from './StepFlashAgent';

const agent = new StepFlashAgent({
  apiKey: 'sk-or-v1-your-api-key',  // Required
  model: 'step-ai/step-flash-3.5',  // Optional, default shown
  maxIterations: 10,                 // Optional, default: 10
  timeout: 120000,                   // Optional, default: 120s
  verbose: false,                    // Optional, default: false
  memoryEnabled: true,               // Optional, default: true
});
```

### Registering Tools

```typescript
import { builtinTools } from './tools/builtin';
import { Tool } from './types';

// Register all built-in tools
agent.registerTools(builtinTools);

// Register a custom tool
const myTool: Tool = {
  name: 'my_custom_tool',
  description: 'Description of what this tool does',
  category: 'general',
  parameters: {
    type: 'object',
    properties: {
      input: { type: 'string', description: 'Input parameter' },
    },
    required: ['input'],
  },
  execute: async (args) => {
    // Your tool logic here
    return { success: true, output: 'Result' };
  },
};

agent.registerTool(myTool);
```

### Planning & Execution

```typescript
// Create a plan for a goal
const plan = await agent.plan('Build a REST API for a todo application');

console.log('Tasks:');
plan.tasks.forEach((task, i) => {
  console.log(`${i + 1}. ${task.description} (priority: ${task.priority})`);
});

// Execute the plan
const result = await agent.executePlan(plan);

console.log('Execution completed:', result.success ? '✓' : '✗');
```

### Memory Management

```typescript
const memory = agent.getMemory();

// Add a memory
await memory.add({
  type: 'long_term',
  content: 'User prefers dark mode in all applications',
  metadata: { tags: ['preference', 'ui'] },
});

// Search memories
const results = await memory.search('user preferences');

// Get stats
console.log(memory.getStats());
```

### Event Handling

```typescript
// Listen to agent events
agent.on('thinking_start', (event) => {
  console.log('Agent is thinking...');
});

agent.on('tool_call_start', (event) => {
  console.log(`Using tool: ${event.data.tool}`);
});

agent.on('tool_call_end', (event) => {
  console.log(`Tool result: ${event.data.result.success ? 'Success' : 'Failed'}`);
});

agent.on('error', (event) => {
  console.error('Error:', event.data.error);
});
```

### Streaming Responses

```typescript
// Stream response chunks
for await (const chunk of agent.chatStream('Write a poem about AI')) {
  process.stdout.write(chunk);
}
```

## 📁 Project Structure

```
agent-core/
├── StepFlashAgent.ts      # Main agent class
├── types.ts               # TypeScript type definitions
├── tools/
│   ├── ToolRegistry.ts    # Tool management
│   └── builtin.ts         # Built-in tools
├── memory/
│   └── MemoryManager.ts   # Memory system
├── reasoning/
│   └── ReasoningEngine.ts # Reasoning capabilities
├── cli/
│   └── cli.ts             # Command-line interface
└── examples/
    ├── 01-simple-chat.ts
    ├── 02-task-planning.ts
    ├── 03-research-assistant.ts
    └── 04-code-assistant.ts
```

## 🔧 Configuration

### Environment Variables

```bash
# Required
AI_STEP_FLASH_API_KEY=sk-or-v1-your-api-key

# Optional
AI_STEP_FLASH_MODEL=step-ai/step-flash-3.5
AI_STEP_FLASH_VERBOSE=true
AI_STEP_FLASH_MAX_ITERATIONS=15
```

### Agent Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | required | OpenRouter API key |
| `model` | string | 'step-ai/step-flash-3.5' | Model to use |
| `maxIterations` | number | 10 | Max planning/execution iterations |
| `timeout` | number | 120000 | Request timeout in ms |
| `verbose` | boolean | false | Enable verbose logging |
| `memoryEnabled` | boolean | true | Enable memory system |

## 🎯 Use Cases

### 1. Research Assistant
```typescript
const agent = new StepFlashAgent(config);
agent.registerTools([webSearchTool, webFetchTool, fileWriteTool]);

const result = await agent.plan('Research AI trends in 2026 and create a report');
await agent.executePlan(result.plan);
```

### 2. Code Assistant
```typescript
const agent = new StepFlashAgent(config);
agent.registerTools([codeExecuteTool, codeAnalyzeTool, fileReadTool, fileWriteTool]);

await agent.chat('Analyze my codebase and suggest improvements');
```

### 3. Task Automation
```typescript
const agent = new StepFlashAgent(config);
agent.registerTools(builtinTools);

await agent.chat(`
  1. Search for the latest Node.js best practices
  2. Create a summary document
  3. Save it to best-practices.md
`);
```

## 📊 Performance

| Metric | Value |
|--------|-------|
| Average response time | 2-5 seconds |
| Tool execution overhead | < 100ms |
| Memory query time | < 50ms |
| Max context window | 128K tokens |
| Max output tokens | 8,192 |

## 🔐 Security Considerations

1. **API Key Protection** - Never expose your API key in client-side code
2. **Tool Validation** - Tools validate all input parameters
3. **Execution Sandbox** - Code execution runs in a sandboxed environment
4. **Dangerous Tools** - Tools marked as `dangerous` require confirmation
5. **Rate Limiting** - Implement rate limiting for production use

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key required" | Set AI_STEP_FLASH_API_KEY environment variable |
| "Tool not found" | Ensure tool is registered with `registerTool()` |
| "Timeout exceeded" | Increase `timeout` in agent config |
| "Max iterations reached" | Increase `maxIterations` or simplify the task |
| Empty responses | Check model availability on OpenRouter |

## 📝 License

MIT License - See LICENSE file for details.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

**Built with ❤️ for the AI community**

**Repository**: https://github.com/mcbackup058-netizen/skills-collection

**Last Updated**: March 2026 | **Version**: 3.0.0
