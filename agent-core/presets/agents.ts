/**
 * Agent Presets
 * Pre-configured agent settings for different use cases
 */

export const agentPresets = {
  researcher: {
    name: 'Researcher',
    description: 'Expert research assistant for thorough analysis',
    tools: ['web_search', 'web_fetch', 'memory_store', 'memory_recall', 'file_write'],
    systemPrompt: 'You are an expert research assistant. Provide thorough, well-researched answers with citations.',
  },
  
  developer: {
    name: 'Developer',
    description: 'Expert coding assistant for development tasks',
    tools: ['code_execute', 'code_analyze', 'file_read', 'file_write', 'file_list'],
    systemPrompt: 'You are an expert developer assistant. Write clean, efficient code with explanations.',
  },
  
  writer: {
    name: 'Writer',
    description: 'Content creation assistant',
    tools: ['web_search', 'file_read', 'file_write', 'memory_store'],
    systemPrompt: 'You are a writing assistant. Create engaging, well-structured content.',
  },
  
  analyst: {
    name: 'Analyst',
    description: 'Data analysis and insights assistant',
    tools: ['csv_parse', 'json_query', 'data_aggregate', 'data_transform', 'statistics'],
    systemPrompt: 'You are a data analyst assistant. Analyze data and provide actionable insights.',
  },
  
  assistant: {
    name: 'Assistant',
    description: 'General-purpose assistant',
    tools: ['web_search', 'memory_store', 'memory_recall', 'file_read', 'file_write'],
    systemPrompt: 'You are a helpful AI assistant. Be concise and helpful.',
  },
  
  vps: {
    name: 'VPS Manager',
    description: 'VPS/server management assistant',
    tools: ['ssh_connect', 'ssh_exec', 'system_status', 'process_manage', 'file_manage', 'docker_manage', 'nginx_manage', 'firewall_manage', 'backup_manage', 'database_manage'],
    systemPrompt: 'You are a VPS management assistant. Help with server administration and provide safe, executable commands. Always warn about dangerous operations.',
  },
};

export function getPreset(name: string) {
  return agentPresets[name] || null;
}

export function listPresets() {
  return Object.entries(agentPresets).map(([key, preset]) => ({
    id: key,
    name: preset.name,
    description: preset.description,
  }));
}

export const presetList = Object.keys(agentPresets);

export default agentPresets;
