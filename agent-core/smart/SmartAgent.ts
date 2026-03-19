/**
 * Smart Agent - Ultra-Simple Interface
 * Just input prompt, AI handles everything automatically!
 * 
 * Usage:
 *   const agent = new SmartAgent(); // API key loaded automatically
 *   const result = await agent.prompt("Your question here");
 * 
 * Or even simpler:
 *   const answer = await ask("What is the weather?");
 */

import { StepFlashAgent } from '../StepFlashAgent';
import { ConfigManager, configManager, getStoredApiKey, saveApiKey, SmartConfig } from './config';
import { SkillDetector, skillCategories, SkillCategory } from './SkillDetector';
import { builtinTools } from '../tools/builtin';
import { dataTools } from '../tools/data';
import { apiTools } from '../tools/api';
import { vpsTools } from '../tools/vps';
import { Tool, AgentResponse } from '../types';

// All available tools
const ALL_TOOLS = [...builtinTools, ...dataTools, ...apiTools, ...vpsTools];

// ============= Smart Agent Class =============

export class SmartAgent {
  private agent: StepFlashAgent | null = null;
  private config: SmartConfig | null = null;
  private initialized = false;

  /**
   * Initialize the agent
   * Automatically loads saved API key
   */
  async init(apiKey?: string): Promise<void> {
    // Initialize config manager
    await configManager.init();
    
    // Get API key from parameter or stored config
    const key = apiKey || configManager.getApiKey();
    
    if (!key) {
      throw new Error(`
╔══════════════════════════════════════════════════════════╗
║           API Key Required - First Time Setup            ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Please provide your OpenRouter API key:                 ║
║                                                          ║
║  Usage:                                                  ║
║    agent.init("sk-or-v1-your-api-key")                   ║
║                                                          ║
║  Or use the setup function:                              ║
║    await setup("sk-or-v1-your-api-key")                  ║
║                                                          ║
║  Your key will be saved for future use!                  ║
╚══════════════════════════════════════════════════════════╝
      `);
    }

    // Save API key if provided
    if (apiKey) {
      await saveApiKey(apiKey);
    }

    this.config = configManager.getConfig();

    // Create agent
    this.agent = new StepFlashAgent({
      apiKey: key,
      model: this.config?.model || 'step-ai/step-flash-3.5',
      verbose: this.config?.preferences?.verbose || false,
      memoryEnabled: true,
    });

    // Register all tools
    this.agent.registerTools(ALL_TOOLS);
    
    this.initialized = true;
  }

  /**
   * Ensure agent is initialized
   */
  private async ensureInit(): Promise<void> {
    if (!this.initialized || !this.agent) {
      await this.init();
    }
  }

  /**
   * Main prompt interface - Just ask anything!
   * AI will automatically detect and use relevant skills
   */
  async prompt(userPrompt: string): Promise<string> {
    await this.ensureInit();

    // Detect relevant skills
    const detection = SkillDetector.detect(userPrompt);
    
    // Build enhanced prompt with skill context
    const enhancedPrompt = this.buildEnhancedPrompt(userPrompt, detection);

    // Get response
    const response = await this.agent!.chat(enhancedPrompt);

    return response.content || response.message;
  }

  /**
   * Build enhanced prompt with auto-detected skills
   */
  private buildEnhancedPrompt(userPrompt: string, detection: {
    categories: SkillCategory[];
    tools: string[];
    confidence: number;
  }): string {
    const skillContext = SkillDetector.getToolSelectionPrompt(userPrompt);
    
    return `${userPrompt}

---
${skillContext}

Remember: You have all these tools available. Use them proactively to complete tasks more effectively. Execute tools when needed, don't just describe what you would do.`;
  }

  /**
   * Chat with streaming output
   */
  async *promptStream(userPrompt: string): AsyncGenerator<string> {
    await this.ensureInit();

    const detection = SkillDetector.detect(userPrompt);
    const enhancedPrompt = this.buildEnhancedPrompt(userPrompt, detection);

    for await (const chunk of this.agent!.chatStream(enhancedPrompt)) {
      yield chunk;
    }
  }

  /**
   * Interactive conversation
   */
  async converse(messages: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string> {
    await this.ensureInit();
    
    // Get last user message
    const lastMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastMessage) {
      throw new Error('No user message found');
    }

    const detection = SkillDetector.detect(lastMessage.content);
    const enhancedPrompt = this.buildEnhancedPrompt(lastMessage.content, detection);

    // Replace last message with enhanced version
    const enhancedMessages = messages.map((m, i) => {
      if (i === messages.length - 1 && m.role === 'user') {
        return { role: 'user' as const, content: enhancedPrompt };
      }
      return m;
    });

    const response = await this.agent!.converse(
      enhancedMessages.map(m => ({ role: m.role, content: m.content }))
    );

    return response.content || response.message;
  }

  /**
   * Execute a task with planning
   */
  async execute(goal: string): Promise<{
    success: boolean;
    result: string;
    plan?: any;
    toolsUsed: string[];
  }> {
    await this.ensureInit();

    // Create plan
    const plan = await this.agent!.plan(goal);
    
    // Execute plan
    const response = await this.agent!.executePlan(plan);

    return {
      success: response.success,
      result: response.message,
      plan: response.plan,
      toolsUsed: response.metadata?.toolsUsed || [],
    };
  }

  /**
   * Get available skills/categories
   */
  getAvailableSkills(): Array<{ name: string; description: string; tools: string[] }> {
    return skillCategories.map(c => ({
      name: c.name,
      description: c.description,
      tools: c.tools,
    }));
  }

  /**
   * Update configuration
   */
  async updateConfig(updates: Partial<SmartConfig>): Promise<void> {
    await configManager.updateConfig(updates);
    this.config = configManager.getConfig();
    
    // Re-initialize agent if needed
    if (updates.apiKey || updates.model) {
      this.initialized = false;
      await this.init();
    }
  }

  /**
   * Add VPS server configuration
   */
  async addServer(name: string, config: {
    host: string;
    port?: number;
    username: string;
    password?: string;
    privateKey?: string;
  }): Promise<void> {
    await configManager.addServer(name, config);
  }

  /**
   * Get agent instance (for advanced usage)
   */
  getAgent(): StepFlashAgent | null {
    return this.agent;
  }

  /**
   * Reset conversation
   */
  reset(): void {
    this.agent?.reset();
  }
}

// ============= Singleton Instance =============

export const smartAgent = new SmartAgent();

// ============= Ultra-Simple Functions =============

/**
 * Setup API key (one-time)
 * 
 * @example
 * await setup("sk-or-v1-your-api-key");
 */
export async function setup(apiKey: string): Promise<void> {
  await smartAgent.init(apiKey);
  console.log('✅ API key saved! You can now use ask() without providing the key.');
}

/**
 * Ask anything - Just prompt!
 * 
 * @example
 * const answer = await ask("What is the weather in Jakarta?");
 * const result = await ask("Check my VPS server status");
 */
export async function ask(prompt: string): Promise<string> {
  return smartAgent.prompt(prompt);
}

/**
 * Stream response
 * 
 * @example
 * for await (const chunk of askStream("Tell me a story")) {
 *   process.stdout.write(chunk);
 * }
 */
export async function* askStream(prompt: string): AsyncGenerator<string> {
  yield* smartAgent.promptStream(prompt);
}

/**
 * Execute a complex task with planning
 * 
 * @example
 * const result = await execute("Deploy my app to the VPS server");
 */
export async function execute(goal: string): Promise<{
  success: boolean;
  result: string;
  plan?: any;
  toolsUsed: string[];
}> {
  return smartAgent.execute(goal);
}

/**
 * Add VPS server
 * 
 * @example
 * await addServer("my-vps", {
 *   host: "103.157.27.152",
 *   username: "hyperlot99",
 *   password: "@Dilarang9"
 * });
 */
export async function addServer(name: string, config: {
  host: string;
  port?: number;
  username: string;
  password?: string;
  privateKey?: string;
}): Promise<void> {
  return smartAgent.addServer(name, config);
}

/**
 * Get list of available skills
 */
export function listSkills(): Array<{ name: string; description: string; tools: string[] }> {
  return smartAgent.getAvailableSkills();
}

// ============= Quick One-Liner =============

/**
 * One-liner: Ask with API key (first time)
 * Subsequent calls can use ask() without API key
 * 
 * @example
 * // First time
 * const answer = await quickAsk("Hello!", "sk-or-v1-your-api-key");
 * 
 * // After that, just:
 * const answer = await ask("Hello!");
 */
export async function quickAsk(prompt: string, apiKey?: string): Promise<string> {
  if (apiKey) {
    await setup(apiKey);
  }
  return ask(prompt);
}

export default SmartAgent;
