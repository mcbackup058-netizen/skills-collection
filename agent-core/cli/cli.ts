#!/usr/bin/env node
/**
 * Step Flash Agent CLI
 * Command-line interface for interacting with the AI agent
 * Last Updated: March 2026
 */

import * as readline from 'readline';
import { StepFlashAgent } from './StepFlashAgent';
import { builtinTools } from './tools/builtin';
import chalk from 'chalk';

// ASCII Art Banner
const BANNER = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║    ███████╗████████╗██████╗ ███████╗ ██████╗ ██████╗ ██╗     ║
║    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██╔════╝██╔═══██╗██║     ║
║    ███████╗   ██║   ██████╔╝█████╗  ██║     ██║   ██║██║     ║
║    ╚════██║   ██║   ██╔══██╗██╔══╝  ██║     ██║   ██║██║     ║
║    ███████║   ██║   ██║  ██║███████╗╚██████╗╚██████╔╝███████╗║
║    ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝║
║                                                               ║
║              🤖 Step Flash 3.5 AI Agent v3.0.0               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`;

interface CLIConfig {
  apiKey: string;
  model?: string;
  verbose?: boolean;
  maxIterations?: number;
}

export class AgentCLI {
  private agent: StepFlashAgent;
  private rl: readline.Interface;
  private verbose: boolean;
  private running: boolean = false;

  constructor(config: CLIConfig) {
    this.verbose = config.verbose || false;
    
    // Initialize agent
    this.agent = new StepFlashAgent({
      apiKey: config.apiKey,
      model: config.model || 'step-ai/step-flash-3.5',
      maxIterations: config.maxIterations || 10,
      verbose: this.verbose,
      memoryEnabled: true,
    });

    // Register built-in tools
    this.agent.registerTools(builtinTools);

    // Setup event handlers
    this.setupEventHandlers();

    // Create readline interface
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '\n👤 You: ',
    });
  }

  private setupEventHandlers(): void {
    this.agent.on('thinking_start', (event) => {
      if (this.verbose) {
        console.log(chalk.gray('\n💭 Thinking...'));
      }
    });

    this.agent.on('thinking_end', (event) => {
      if (this.verbose) {
        console.log(chalk.gray('✅ Thinking complete'));
      }
    });

    this.agent.on('tool_call_start', (event) => {
      console.log(chalk.cyan(`\n🔧 Using tool: ${event.data.tool}`));
    });

    this.agent.on('tool_call_end', (event) => {
      const { result } = event.data;
      if (result.success) {
        console.log(chalk.green('✓ Tool executed successfully'));
      } else {
        console.log(chalk.red(`✗ Tool failed: ${result.error}`));
      }
    });

    this.agent.on('error', (event) => {
      console.log(chalk.red(`\n❌ Error: ${event.data.error}`));
    });
  }

  async start(): Promise<void> {
    console.log(chalk.blue(BANNER));
    console.log(chalk.white('Type your message and press Enter to chat.'));
    console.log(chalk.white('Commands: /help, /clear, /stats, /plan, /quit\n'));

    this.running = true;
    this.rl.prompt();

    this.rl.on('line', async (line: string) => {
      const input = line.trim();
      
      if (!input) {
        this.rl.prompt();
        return;
      }

      // Handle commands
      if (input.startsWith('/')) {
        await this.handleCommand(input);
        this.rl.prompt();
        return;
      }

      // Process message
      try {
        const response = await this.agent.chat(input);
        
        console.log(chalk.magenta('\n🤖 Agent:'));
        console.log(chalk.white(response.content));
        
        if (this.verbose && response.toolCalls?.length) {
          console.log(chalk.gray(`\n[Tools used: ${response.metadata.toolsUsed.join(', ')}]`));
          console.log(chalk.gray(`[Tokens: ${response.metadata.tokensUsed}, Duration: ${response.metadata.duration}ms]`));
        }
      } catch (error) {
        console.log(chalk.red(`\n❌ Error: ${error.message}`));
      }

      this.rl.prompt();
    });

    this.rl.on('close', () => {
      console.log(chalk.blue('\n👋 Goodbye!'));
      process.exit(0);
    });
  }

  private async handleCommand(command: string): Promise<void> {
    const [cmd, ...args] = command.slice(1).split(' ');

    switch (cmd.toLowerCase()) {
      case 'help':
        this.showHelp();
        break;

      case 'clear':
        this.agent.reset();
        console.log(chalk.green('✓ Memory cleared'));
        break;

      case 'stats':
        const stats = this.agent.getMemory().getStats();
        console.log(chalk.cyan('\n📊 Agent Statistics:'));
        console.log(chalk.white(`  Short-term memories: ${stats.shortTermCount}`));
        console.log(chalk.white(`  Long-term memories: ${stats.longTermCount}`));
        console.log(chalk.white(`  Entities tracked: ${stats.entityCount}`));
        console.log(chalk.white(`  Conversations: ${stats.conversationCount}`));
        break;

      case 'plan':
        if (args.length === 0) {
          console.log(chalk.yellow('Usage: /plan <goal>'));
          break;
        }
        const goal = args.join(' ');
        console.log(chalk.cyan(`\n📋 Creating plan for: ${goal}`));
        const plan = await this.agent.plan(goal);
        console.log(chalk.white('\nPlan:'));
        plan.tasks.forEach((task, i) => {
          console.log(chalk.white(`  ${i + 1}. ${task.description} (priority: ${task.priority})`));
        });
        break;

      case 'execute':
        console.log(chalk.cyan('\n⚡ Executing plan...'));
        const result = await this.agent.executePlan();
        console.log(chalk.white(`\nResult: ${result.message}`));
        break;

      case 'tools':
        const tools = this.agent.getTools().list();
        console.log(chalk.cyan('\n🛠️ Available Tools:'));
        tools.forEach(tool => {
          console.log(chalk.white(`  • ${tool.name}: ${tool.description}`));
        });
        break;

      case 'quit':
      case 'exit':
        this.rl.close();
        break;

      default:
        console.log(chalk.yellow(`Unknown command: ${cmd}. Type /help for available commands.`));
    }
  }

  private showHelp(): void {
    console.log(chalk.cyan('\n📚 Available Commands:'));
    console.log(chalk.white('  /help          - Show this help message'));
    console.log(chalk.white('  /clear         - Clear agent memory'));
    console.log(chalk.white('  /stats         - Show agent statistics'));
    console.log(chalk.white('  /plan <goal>   - Create a plan for a goal'));
    console.log(chalk.white('  /execute       - Execute the current plan'));
    console.log(chalk.white('  /tools         - List available tools'));
    console.log(chalk.white('  /quit          - Exit the agent'));
  }

  stop(): void {
    this.running = false;
    this.rl.close();
  }
}

// ============= Main Entry Point =============

async function main() {
  const apiKey = process.env.AI_STEP_FLASH_API_KEY || process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error(chalk.red('Error: AI_STEP_FLASH_API_KEY or OPENROUTER_API_KEY environment variable is required'));
    console.error(chalk.yellow('Set it with: export AI_STEP_FLASH_API_KEY=your-api-key'));
    process.exit(1);
  }

  const cli = new AgentCLI({
    apiKey,
    model: process.env.AI_STEP_FLASH_MODEL,
    verbose: process.env.AI_STEP_FLASH_VERBOSE === 'true',
    maxIterations: parseInt(process.env.AI_STEP_FLASH_MAX_ITERATIONS || '10'),
  });

  await cli.start();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export default AgentCLI;
