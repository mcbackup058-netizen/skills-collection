/**
 * Agent Configuration Presets
 * Pre-configured settings for different use cases
 */

export const agentConfigs = {
  default: {
    model: 'step-ai/step-flash-3.5',
    maxIterations: 10,
    timeout: 120000,
    temperature: 0.7,
    verbose: false,
    memoryEnabled: true,
  },
  
  fast: {
    model: 'step-ai/step-flash-3',
    maxIterations: 5,
    timeout: 60000,
    temperature: 0.5,
    verbose: false,
    memoryEnabled: false,
  },
  
  deep: {
    model: 'step-ai/step-flash-3.5',
    maxIterations: 20,
    timeout: 300000,
    temperature: 0.3,
    verbose: true,
    memoryEnabled: true,
    extendedThinking: true,
  },
  
  creative: {
    model: 'step-ai/step-flash-3.5',
    maxIterations: 15,
    timeout: 180000,
    temperature: 0.9,
    verbose: false,
    memoryEnabled: true,
  },
  
  precise: {
    model: 'step-ai/step-flash-3.5',
    maxIterations: 15,
    timeout: 180000,
    temperature: 0.1,
    verbose: true,
    memoryEnabled: true,
  },
};

export const toolPresets = {
  minimal: ['web_search', 'memory_store', 'memory_recall'],
  
  standard: [
    'web_search', 'web_fetch', 'code_execute', 'file_read', 
    'file_write', 'memory_store', 'memory_recall', 'reasoning_chain'
  ],
  
  full: [
    'web_search', 'web_fetch', 'code_execute', 'code_analyze',
    'file_read', 'file_write', 'file_list', 'file_manage',
    'memory_store', 'memory_recall', 'reasoning_chain', 'decision_make',
    'csv_parse', 'json_query', 'data_aggregate', 'data_visualize', 
    'data_transform', 'statistics', 'http_request', 'notify', 'ask_user'
  ],
  
  vps: [
    'ssh_connect', 'ssh_exec', 'system_status', 'process_manage',
    'file_manage', 'docker_manage', 'nginx_manage', 'firewall_manage',
    'backup_manage', 'database_manage', 'git_deploy', 'notify'
  ],
};

export const systemPrompts = {
  general: 'You are a helpful AI assistant. Be concise and helpful.',
  
  researcher: 'You are an expert research assistant. Provide thorough, well-researched answers with citations when possible.',
  
  developer: 'You are an expert developer assistant. Write clean, efficient code with explanations.',
  
  writer: 'You are a writing assistant. Create engaging, well-structured content.',
  
  analyst: 'You are a data analyst assistant. Analyze data and provide insights.',
  
  vps: 'You are a VPS/server management assistant. Help with server administration. Always warn about dangerous operations. Provide exact commands that can be executed.',
};

export const taskTemplates = {
  research: {
    description: 'Research a topic',
    steps: ['search', 'analyze', 'verify', 'report'],
  },
  
  codeReview: {
    description: 'Review code',
    steps: ['analyze', 'security', 'performance', 'report'],
  },
  
  dataAnalysis: {
    description: 'Analyze data',
    steps: ['load', 'explore', 'analyze', 'visualize', 'report'],
  },
  
  deployment: {
    description: 'Deploy application',
    steps: ['prepare', 'build', 'deploy', 'verify', 'monitor'],
  },
};

export function getConfig(name: string = 'default') {
  return agentConfigs[name] || agentConfigs.default;
}

export function getToolPreset(name: string = 'standard') {
  return toolPresets[name] || toolPresets.standard;
}

export function getSystemPrompt(name: string = 'general') {
  return systemPrompts[name] || systemPrompts.general;
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
