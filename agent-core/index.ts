/**
 * Step Flash 3.5 AI Agent Core
 * Main entry point for the agent framework
 * Last Updated: March 2026
 * Version: 3.1.0
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

// ============= VPS Tools =============
export * from './vps/tools';
export { vpsTools } from './vps/tools';
export * from './vps/config';
export { 
  vpsServers, 
  defaultServer, 
  getServer, 
  listServers,
  isDangerousCommand,
} from './vps/config';

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

// ============= Types =============
export * from './types';

// ============= Convenience Factory =============

import { StepFlashAgent } from './StepFlashAgent';
import { builtinTools } from './tools/builtin';
import { dataTools } from './tools/data';
import { apiTools } from './tools/api';
import { vpsTools } from './vps/tools';
import { getConfig, getToolPreset } from './presets/config';

// All available tools
export const allTools = [...builtinTools, ...dataTools, ...apiTools, ...vpsTools];

/**
 * Create a new Step Flash Agent with sensible defaults
 * @param apiKey - OpenRouter API key
 * @param options - Optional configuration
 */
export async function createAgent(
  apiKey: string,
  options: {
    preset?: string;
    config?: string;
    tools?: string;
    allTools?: boolean;
    vpsMode?: boolean;
    verbose?: boolean;
    systemPrompt?: string;
  } = {}
): Promise<StepFlashAgent> {
  const agentConfig = getConfig(options.config as any || 'default');

  const agent = new StepFlashAgent({
    apiKey,
    ...agentConfig,
    verbose: options.verbose ?? agentConfig.verbose,
  });

  // Register tools
  if (options.allTools || options.vpsMode) {
    agent.registerTools(allTools);
  } else {
    agent.registerTools(builtinTools);
  }

  return agent;
}

/**
 * One-shot query to the agent
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
 * Create a VPS management agent
 */
export async function createVpsAgent(
  apiKey: string
): Promise<StepFlashAgent> {
  return createAgent(apiKey, { 
    vpsMode: true, 
    preset: 'vps',
    config: 'default' 
  });
}

// Default export
export default StepFlashAgent;

// Version info
export const VERSION = '3.1.0';
export const AGENT_NAME = 'Step Flash Agent';
export const MODEL_NAME = 'step-ai/step-flash-3.5';
