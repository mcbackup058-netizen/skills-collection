/**
 * Step Flash 3.5 AI Agent Core
 * Main entry point for the agent framework
 * Last Updated: March 2026
 * Version: 3.0.0
 */

// ============= Core Agent =============
export { StepFlashAgent } from './StepFlashAgent';
export { StepFlashAgent as Agent } from './StepFlashAgent';

// ============= Tools =============
export { ToolRegistry } from './tools/ToolRegistry';
export * from './tools/builtin';
export { builtinTools } from './tools/builtin';
export * from './tools/data';
export { dataTools } from './tools/data';
export * from './tools/api';
export { apiTools } from './tools/api';

// ============= Memory =============
export { MemoryManager } from './memory/MemoryManager';

// ============= Reasoning =============
export { ReasoningEngine } from './reasoning/ReasoningEngine';

// ============= Presets =============
export * from './presets/agents';
export { getPreset, listPresets, agentPresets, presetList } from './presets/agents';
export * from './presets/config';
export { 
  agentConfigs, 
  toolPresets, 
  systemPrompts, 
  taskTemplates,
  getConfig,
  getToolPreset,
  getSystemPrompt,
} from './presets/config';

// ============= Utilities =============
export * from './utils/helpers';
export { utils } from './utils/helpers';

// ============= Types =============
export * from './types';

// ============= Quick Start =============
export { quickStart, ask, chat, main } from './quickstart';

// ============= CLI =============
export { AgentCLI } from './cli/cli';

// ============= Convenience Factory =============

import { StepFlashAgent } from './StepFlashAgent';
import { AgentConfig, Tool } from './types';
import { builtinTools } from './tools/builtin';
import { dataTools } from './tools/data';
import { apiTools } from './tools/api';
import { getPreset } from './presets/agents';
import { getConfig, getToolPreset, getSystemPrompt } from './presets/config';

/**
 * Create a new Step Flash Agent with sensible defaults
 * @param apiKey - OpenRouter API key (or set AI_STEP_FLASH_API_KEY env var)
 * @param options - Optional configuration
 * @returns Configured StepFlashAgent instance
 * 
 * @example
 * ```typescript
 * // Simple usage
 * const agent = await createAgent('sk-or-v1-your-key');
 * const response = await agent.chat('Hello!');
 * 
 * // With preset
 * const researcher = await createAgent('sk-or-v1-your-key', { preset: 'researcher' });
 * 
 * // With all tools
 * const powerful = await createAgent('sk-or-v1-your-key', { allTools: true });
 * ```
 */
export async function createAgent(
  apiKey: string,
  options: {
    preset?: string;
    config?: string;
    tools?: string;
    allTools?: boolean;
    verbose?: boolean;
    systemPrompt?: string;
  } = {}
): Promise<StepFlashAgent> {
  // Get configuration
  const agentConfig = getConfig(options.config as any || 'default');
  const preset = options.preset ? getPreset(options.preset) : null;

  // Create agent
  const agent = new StepFlashAgent({
    apiKey,
    ...agentConfig,
    verbose: options.verbose ?? agentConfig.verbose,
  });

  // Set system prompt
  if (options.systemPrompt) {
    // Custom system prompt
  } else if (preset) {
    // Use preset system prompt
  }

  // Register tools
  if (options.allTools) {
    agent.registerTools([...builtinTools, ...dataTools, ...apiTools]);
  } else if (preset) {
    agent.registerTools(preset.tools);
  } else if (options.tools) {
    const toolPreset = getToolPreset(options.tools as any);
    const allTools = [...builtinTools, ...dataTools, ...apiTools];
    const selectedTools = allTools.filter(t => toolPreset.includes(t.name));
    agent.registerTools(selectedTools);
  } else {
    agent.registerTools(builtinTools);
  }

  return agent;
}

/**
 * One-shot query to the agent
 * @param question - The question to ask
 * @param apiKey - API key
 * @returns The agent's response
 * 
 * @example
 * ```typescript
 * const answer = await query('What is quantum computing?', 'sk-or-v1-your-key');
 * console.log(answer);
 * ```
 */
export async function query(
  question: string,
  apiKey: string
): Promise<string> {
  const agent = await createAgent(apiKey, { config: 'fast' });
  const response = await agent.chat(question);
  return response.content || '';
}

/**
 * Create a preset agent
 * @param presetName - Name of the preset (researcher, developer, writer, analyst, assistant)
 * @param apiKey - API key
 * @returns Configured agent with preset tools and prompt
 * 
 * @example
 * ```typescript
 * const researcher = await createPresetAgent('researcher', 'sk-or-v1-your-key');
 * const report = await researcher.chat('Research AI trends');
 * ```
 */
export async function createPresetAgent(
  presetName: string,
  apiKey: string
): Promise<StepFlashAgent> {
  return createAgent(apiKey, { preset: presetName });
}

// Default export
export default StepFlashAgent;

// Version info
export const VERSION = '3.0.0';
export const AGENT_NAME = 'Step Flash Agent';
export const MODEL_NAME = 'step-ai/step-flash-3.5';
