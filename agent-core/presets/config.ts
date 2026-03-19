/**
 * Preset Configurations
 * Ready-to-use agent configurations
 * Last Updated: March 2026
 */

export const agentConfigs = {
  // Default configuration
  default: {
    model: 'step-ai/step-flash-3.5',
    maxIterations: 10,
    timeout: 120000,
    temperature: 0.7,
    verbose: false,
    memoryEnabled: true,
  },

  // Fast configuration (lower quality, faster)
  fast: {
    model: 'step-ai/step-flash-3',
    maxIterations: 5,
    timeout: 60000,
    temperature: 0.5,
    verbose: false,
    memoryEnabled: false,
  },

  // Deep thinking configuration (higher quality)
  deep: {
    model: 'step-ai/step-flash-3.5',
    maxIterations: 20,
    timeout: 300000,
    temperature: 0.3,
    verbose: true,
    memoryEnabled: true,
    extendedThinking: true,
  },

  // Creative configuration
  creative: {
    model: 'step-ai/step-flash-3.5',
    maxIterations: 15,
    timeout: 180000,
    temperature: 0.9,
    verbose: false,
    memoryEnabled: true,
  },

  // Precise configuration (factual tasks)
  precise: {
    model: 'step-ai/step-flash-3.5',
    maxIterations: 15,
    timeout: 180000,
    temperature: 0.1,
    verbose: true,
    memoryEnabled: true,
  },

  // Debug configuration
  debug: {
    model: 'step-ai/step-flash-3.5',
    maxIterations: 10,
    timeout: 300000,
    temperature: 0.5,
    verbose: true,
    memoryEnabled: true,
    logLevel: 'debug',
  },
};

// Tool preset configurations
export const toolPresets = {
  minimal: ['web_search', 'memory_store', 'memory_recall'],
  
  standard: [
    'web_search',
    'web_fetch',
    'code_execute',
    'file_read',
    'file_write',
    'memory_store',
    'memory_recall',
    'reasoning_chain',
  ],
  
  full: [
    // Web
    'web_search',
    'web_fetch',
    // Code
    'code_execute',
    'code_analyze',
    // Files
    'file_read',
    'file_write',
    'file_list',
    // Memory
    'memory_store',
    'memory_recall',
    // Reasoning
    'reasoning_chain',
    'decision_make',
    // Data
    'csv_parse',
    'json_query',
    'data_aggregate',
    'statistics',
    // API
    'http_request',
    // Communication
    'notify',
    'ask_user',
  ],

  researcher: [
    'web_search',
    'web_fetch',
    'memory_store',
    'memory_recall',
    'file_write',
    'data_aggregate',
    'statistics',
    'reasoning_chain',
  ],

  developer: [
    'code_execute',
    'code_analyze',
    'file_read',
    'file_write',
    'file_list',
    'http_request',
    'memory_store',
    'memory_recall',
  ],

  writer: [
    'web_search',
    'file_read',
    'file_write',
    'memory_store',
    'memory_recall',
    'reasoning_chain',
  ],

  analyst: [
    'csv_parse',
    'json_query',
    'data_aggregate',
    'data_transform',
    'data_visualize',
    'statistics',
    'file_read',
    'file_write',
    'http_request',
  ],
};

// System prompts for different use cases
export const systemPrompts = {
  general: `You are a helpful AI assistant powered by Step Flash 3.5. 
You are knowledgeable, helpful, and always aim to provide accurate and useful responses.
When you don't know something, admit it honestly.`,

  researcher: `You are an expert research assistant. Your goal is to:
- Find and verify information from multiple sources
- Synthesize complex information into clear summaries
- Identify patterns and insights
- Provide well-structured research reports with citations
Always be thorough, objective, and cite your sources.`,

  developer: `You are an expert software developer assistant. Your goal is to:
- Write clean, efficient, well-documented code
- Debug and fix software issues
- Explain technical concepts clearly
- Follow best practices and design patterns
Always consider security, performance, and maintainability.`,

  writer: `You are an expert writing assistant. Your goal is to:
- Create engaging, well-structured content
- Adapt tone and style for different audiences
- Edit and improve existing content
- Follow writing best practices
Be creative, clear, and impactful.`,

  analyst: `You are an expert data analyst assistant. Your goal is to:
- Analyze data and find insights
- Create visualizations and reports
- Identify trends and patterns
- Provide actionable recommendations
Be thorough, accurate, and data-driven.`,

  assistant: `You are a helpful personal assistant. Your goal is to:
- Help with tasks and organization
- Provide information and summaries
- Maintain context across conversations
- Be proactive and anticipate needs
Be friendly, efficient, and reliable.`,
};

// Task templates
export const taskTemplates = {
  research: {
    description: 'Research a topic and create a report',
    steps: [
      { name: 'search', description: 'Search for information on the topic' },
      { name: 'analyze', description: 'Analyze and synthesize findings' },
      { name: 'verify', description: 'Verify key facts and claims' },
      { name: 'report', description: 'Create structured report' },
    ],
  },

  codeReview: {
    description: 'Review code for issues and improvements',
    steps: [
      { name: 'analyze', description: 'Analyze code structure and patterns' },
      { name: 'security', description: 'Check for security issues' },
      { name: 'performance', description: 'Identify performance improvements' },
      { name: 'report', description: 'Generate review report' },
    ],
  },

  dataAnalysis: {
    description: 'Analyze data and generate insights',
    steps: [
      { name: 'load', description: 'Load and validate data' },
      { name: 'explore', description: 'Explore data patterns' },
      { name: 'analyze', description: 'Perform statistical analysis' },
      { name: 'visualize', description: 'Create visualizations' },
      { name: 'report', description: 'Generate insights report' },
    ],
  },

  contentCreation: {
    description: 'Create content from research',
    steps: [
      { name: 'research', description: 'Research the topic' },
      { name: 'outline', description: 'Create content outline' },
      { name: 'draft', description: 'Write initial draft' },
      { name: 'refine', description: 'Edit and polish content' },
    ],
  },
};

export type AgentConfigKey = keyof typeof agentConfigs;
export type ToolPresetKey = keyof typeof toolPresets;
export type SystemPromptKey = keyof typeof systemPrompts;

export function getConfig(key: AgentConfigKey = 'default') {
  return agentConfigs[key];
}

export function getToolPreset(key: ToolPresetKey = 'standard') {
  return toolPresets[key];
}

export function getSystemPrompt(key: SystemPromptKey = 'general') {
  return systemPrompts[key];
}

export default {
  agentConfigs,
  toolPresets,
  systemPrompts,
  taskTemplates,
  getConfig,
  getToolPreset,
  getSystemPrompt,
};
