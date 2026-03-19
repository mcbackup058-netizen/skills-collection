/**
 * Step Flash 3.5 AI Agent Core
 * Main entry point for the agent framework
 * Last Updated: March 2026
 */

// Core Agent
export { StepFlashAgent } from './StepFlashAgent';
export { StepFlashAgent as Agent } from './StepFlashAgent';

// Tools
export { ToolRegistry } from './tools/ToolRegistry';
export * from './tools/builtin';
export { builtinTools } from './tools/builtin';

// Memory
export { MemoryManager } from './memory/MemoryManager';

// Reasoning
export { ReasoningEngine } from './reasoning/ReasoningEngine';

// Types
export * from './types';

// CLI
export { AgentCLI } from './cli/cli';

// Convenience factory function
import { StepFlashAgent } from './StepFlashAgent';
import { AgentConfig } from './types';
import { builtinTools } from './tools/builtin';

/**
 * Create a new Step Flash Agent with sensible defaults
 */
export async function createAgent(
  apiKey: string,
  options: Partial<AgentConfig> = {}
): Promise<StepFlashAgent> {
  const agent = new StepFlashAgent({
    apiKey,
    model: 'step-ai/step-flash-3.5',
    maxIterations: 10,
    verbose: false,
    memoryEnabled: true,
    ...options,
  });

  // Register built-in tools by default
  agent.registerTools(builtinTools);

  return agent;
}

// Default export
export default StepFlashAgent;
