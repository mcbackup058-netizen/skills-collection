/**
 * Quick Start Functions
 * Simple functions for common agent tasks
 * Last Updated: March 2026
 */

import { StepFlashAgent } from './StepFlashAgent';
import { builtinTools } from './tools/builtin';
import { dataTools } from './tools/data';
import { apiTools } from './tools/api';
import { agentPresets, getPreset } from './presets/agents';

// ============= Quick Functions =============

/**
 * One-line agent creation and query
 */
export async function ask(
  question: string,
  options: {
    apiKey?: string;
    preset?: string;
    tools?: boolean;
  } = {}
): Promise<string> {
  const agent = await quickStart(options);
  const response = await agent.chat(question);
  return response.content || '';
}

/**
 * Create and return a configured agent
 */
export async function quickStart(options: {
  apiKey?: string;
  preset?: string;
  tools?: boolean;
  verbose?: boolean;
} = {}): Promise<StepFlashAgent> {
  const apiKey = options.apiKey || 
    process.env.AI_STEP_FLASH_API_KEY || 
    process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      'API key required. Set AI_STEP_FLASH_API_KEY environment variable or pass apiKey option.'
    );
  }

  const preset = options.preset ? getPreset(options.preset) : null;
  
  const agent = new StepFlashAgent({
    apiKey,
    verbose: options.verbose || false,
    memoryEnabled: true,
    ...(preset?.config || {}),
  });

  // Register tools
  if (options.tools) {
    agent.registerTools([...builtinTools, ...dataTools, ...apiTools]);
  } else if (preset) {
    agent.registerTools(preset.tools);
  } else {
    agent.registerTools(builtinTools);
  }

  return agent;
}

/**
 * Interactive chat session
 */
export async function chat(options: {
  apiKey?: string;
  preset?: string;
  onMessage?: (role: string, content: string) => void;
} = {}): Promise<void> {
  const readline = await import('readline');
  const agent = await quickStart(options);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\n> ',
  });

  console.log('\n💬 Chat started. Type "exit" to quit.\n');

  const onMessage = options.onMessage || ((role, content) => {
    if (role === 'assistant') {
      console.log(`\n🤖 ${content}\n`);
    }
  });

  rl.prompt();

  rl.on('line', async (input: string) => {
    const trimmed = input.trim();
    
    if (trimmed.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    if (!trimmed) {
      rl.prompt();
      return;
    }

    onMessage('user', trimmed);

    try {
      const response = await agent.chat(trimmed);
      onMessage('assistant', response.content || '');
    } catch (error) {
      console.error(`\n❌ Error: ${error.message}\n`);
    }

    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\n👋 Goodbye!\n');
    process.exit(0);
  });
}

/**
 * Batch process multiple queries
 */
export async function batch(
  queries: string[],
  options: {
    apiKey?: string;
    parallel?: boolean;
    onProgress?: (completed: number, total: number) => void;
  } = {}
): Promise<string[]> {
  const agent = await quickStart({ apiKey: options.apiKey });
  const results: string[] = [];
  
  if (options.parallel) {
    const promises = queries.map(async (query, index) => {
      const response = await agent.chat(query);
      if (options.onProgress) {
        options.onProgress(index + 1, queries.length);
      }
      return response.content || '';
    });
    return Promise.all(promises);
  }

  for (let i = 0; i < queries.length; i++) {
    const response = await agent.chat(queries[i]);
    results.push(response.content || '');
    if (options.onProgress) {
      options.onProgress(i + 1, queries.length);
    }
  }

  return results;
}

/**
 * Stream response chunks
 */
export async function* stream(
  prompt: string,
  options: {
    apiKey?: string;
  } = {}
): AsyncGenerator<string> {
  const agent = await quickStart({ apiKey: options.apiKey });
  for await (const chunk of agent.chatStream(prompt)) {
    yield chunk;
  }
}

/**
 * Plan and execute a complex task
 */
export async function execute(
  goal: string,
  options: {
    apiKey?: string;
    onTaskStart?: (task: string) => void;
    onTaskComplete?: (task: string, result: string) => void;
  } = {}
): Promise<string> {
  const agent = await quickStart({ apiKey: options.apiKey });
  
  const plan = await agent.plan(goal);
  
  let output = `Plan created with ${plan.tasks.length} tasks:\n`;
  plan.tasks.forEach((task, i) => {
    output += `  ${i + 1}. ${task.description}\n`;
  });
  output += '\n--- Execution ---\n\n';

  const result = await agent.executePlan(plan);
  
  plan.tasks.forEach(task => {
    if (options.onTaskComplete) {
      options.onTaskComplete(task.description, task.status);
    }
    output += `✓ ${task.description}: ${task.status}\n`;
  });

  output += '\n--- Result ---\n';
  output += result.message;

  return output;
}

// CLI entry point
export async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Step Flash Agent - Quick Start

Usage:
  npx ts-node quickstart.ts [options] [query]

Options:
  -h, --help      Show this help
  -p, --preset    Use a preset (researcher, developer, writer, analyst, assistant)
  -t, --tools     Enable all tools
  -v, --verbose   Enable verbose mode

Examples:
  npx ts-node quickstart.ts "What is AI?"
  npx ts-node quickstart.ts -p researcher "Research quantum computing"
  npx ts-node quickstart.ts --interactive
`);
    return;
  }

  const queryIndex = args.findIndex(a => !a.startsWith('-'));
  const query = queryIndex >= 0 ? args[queryIndex] : null;
  
  const preset = args[args.indexOf('-p') + 1] || args[args.indexOf('--preset') + 1];
  const tools = args.includes('-t') || args.includes('--tools');
  const verbose = args.includes('-v') || args.includes('--verbose');

  if (query) {
    const answer = await ask(query, { preset, tools });
    console.log(answer);
  } else {
    await chat({ preset, tools, verbose });
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export default { ask, quickStart, chat, batch, stream, execute };
