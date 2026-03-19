---
name: agent-core
description: A powerful AI Agent framework built on AI Step Flash 3.5 via OpenRouter. Transform Step Flash 3.5 into an intelligent agent with planning, reasoning, tool use, memory, and autonomous task execution capabilities.
license: MIT
version: 3.0.0
last_updated: 2026-03
compatible_with:
  - AI Step Flash 3.5 (OpenRouter)
  - z-ai-web-dev-sdk
features:
  - multi_step_reasoning
  - task_planning
  - tool_integration
  - memory_system
  - self_correction
  - streaming_responses
---

# AI Agent Core - Step Flash 3.5

Transform AI Step Flash 3.5 into a powerful AI Agent with advanced capabilities.

## 🎯 Overview

This module provides a complete AI Agent framework that wraps AI Step Flash 3.5 with:
- Intelligent reasoning and chain-of-thought processing
- Automatic task planning and decomposition
- Tool integration for extended capabilities
- Memory management (short-term, long-term, semantic)
- Self-correction and error handling
- Streaming response support

## 🚀 Quick Start

```typescript
import { createAgent } from './agent-core';

// Create agent with your OpenRouter API key
const agent = await createAgent('sk-or-v1-your-api-key');

// Chat with the agent
const response = await agent.chat('Help me plan a project');
console.log(response.content);

// Plan and execute complex tasks
const plan = await agent.plan('Build a REST API');
await agent.executePlan(plan);
```

## 🔧 Built-in Tools

| Tool | Description |
|------|-------------|
| `web_search` | Search the web for information |
| `web_fetch` | Fetch content from URLs |
| `code_execute` | Execute JavaScript/TypeScript code |
| `code_analyze` | Analyze code for issues |
| `file_read` | Read file contents |
| `file_write` | Write to files |
| `file_list` | List directory contents |
| `memory_store` | Store information in memory |
| `memory_recall` | Retrieve from memory |
| `reasoning_chain` | Multi-step reasoning |
| `decision_make` | Decision analysis |
| `notify` | Send notifications |
| `ask_user` | Request user input |

## 📋 Agent Capabilities

### Multi-Step Reasoning
```typescript
// Agent automatically breaks down complex problems
const result = await agent.chat(`
  Research AI trends, analyze the data, 
  and create a comprehensive report
`);
```

### Task Planning
```typescript
// Create structured plans for complex goals
const plan = await agent.plan('Launch a startup');

// Review and modify plan
plan.tasks.forEach(task => {
  console.log(task.description, task.priority);
});

// Execute plan step by step
await agent.executePlan(plan);
```

### Tool Use
```typescript
// Agent automatically selects and uses appropriate tools
await agent.chat(`
  Search for the latest TypeScript features,
  analyze the code examples, and save a summary
`);
```

### Memory Management
```typescript
// Agent remembers context across conversations
const memory = agent.getMemory();

// Add important information
await memory.add({
  type: 'long_term',
  content: 'User prefers functional programming',
  metadata: { tags: ['preference', 'coding'] }
});

// Search memories
const relevant = await memory.search('user coding preferences');
```

## 📁 File Structure

```
agent-core/
├── index.ts              # Main exports
├── StepFlashAgent.ts     # Core agent implementation
├── types.ts              # TypeScript definitions
├── tools/
│   ├── ToolRegistry.ts   # Tool management
│   └── builtin.ts        # Built-in tools
├── memory/
│   └── MemoryManager.ts  # Memory system
├── reasoning/
│   └── ReasoningEngine.ts # Reasoning engine
├── cli/
│   └── cli.ts            # CLI interface
├── examples/
│   ├── 01-simple-chat.ts
│   ├── 02-task-planning.ts
│   ├── 03-research-assistant.ts
│   └── 04-code-assistant.ts
└── README.md             # Documentation
```

## 🎮 CLI Usage

```bash
# Set API key
export AI_STEP_FLASH_API_KEY=sk-or-v1-your-api-key

# Start interactive CLI
npm run cli

# Commands available:
# /help     - Show help
# /clear    - Clear memory
# /stats    - Show statistics
# /plan     - Create a plan
# /tools    - List tools
# /quit     - Exit
```

## 🔌 Creating Custom Tools

```typescript
import { Tool } from './types';

const myTool: Tool = {
  name: 'database_query',
  description: 'Query a database',
  category: 'data',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'SQL query' },
      database: { type: 'string', description: 'Database name' }
    },
    required: ['query']
  },
  execute: async (args) => {
    // Your implementation
    return {
      success: true,
      output: { rows: [] }
    };
  }
};

agent.registerTool(myTool);
```

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| Response Time | 2-5 seconds |
| Tool Execution | < 100ms |
| Memory Query | < 50ms |
| Context Window | 128K tokens |
| Max Output | 8,192 tokens |

## ⚠️ Important Notes

1. **API Key Required** - Set `AI_STEP_FLASH_API_KEY` environment variable
2. **Backend Only** - Never use in client-side code
3. **Rate Limits** - OpenRouter has rate limits; implement caching
4. **Memory Persistence** - Memory is in-memory by default; implement persistence for production

## 📚 Examples

See the `examples/` directory for complete examples:
- Simple Chat
- Task Planning
- Research Assistant
- Code Assistant

---

**Repository**: https://github.com/mcbackup058-netizen/skills-collection

**Last Updated**: March 2026 | **Version**: 3.0.0
