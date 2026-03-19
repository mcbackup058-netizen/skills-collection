/**
 * Auto Skill Detection System
 * AI automatically determines which skills to use based on user prompt
 * No manual skill selection needed!
 */

import { Tool } from '../types';

// ============= Skill Category Definitions =============

export interface SkillCategory {
  name: string;
  description: string;
  keywords: string[];
  tools: string[];
  priority: number;
}

export const skillCategories: SkillCategory[] = [
  // Web & Research
  {
    name: 'web_search',
    description: 'Search the web for information, news, facts',
    keywords: [
      'search', 'cari', 'find', 'temukan', 'look up', 'google', 'internet',
      'what is', 'apa itu', 'who is', 'siapa', 'when', 'kapan', 'where', 'dimana',
      'latest', 'terbaru', 'current', 'terkini', 'news', 'berita', 'update',
      'research', 'riset', 'penelitian', 'information', 'informasi', 'data',
      'market', 'pasar', 'price', 'harga', 'trend', 'tren',
    ],
    tools: ['web_search', 'web_fetch'],
    priority: 8,
  },
  
  // VPS/Server Management
  {
    name: 'vps_management',
    description: 'Manage VPS servers, SSH, system administration',
    keywords: [
      'vps', 'server', 'ssh', 'remote', 'connect', 'login',
      'status', 'monitor', 'cpu', 'memory', 'disk', 'ram',
      'service', 'systemctl', 'restart', 'start', 'stop',
      'log', 'logs', 'error', 'troubleshoot', 'debug',
      'install', 'uninstall', 'update', 'upgrade', 'package',
      'firewall', 'security', 'port', 'network', 'ip',
      'backup', 'restore', 'file', 'directory', 'folder',
      'process', 'kill', 'running', 'performance',
      '103.157.27.152', 'hyperlot99', 'server saya', 'vps saya',
    ],
    tools: ['vps_connect', 'vps_exec', 'vps_status', 'vps_monitor', 'vps_file', 'vps_service'],
    priority: 9,
  },
  
  // Code & Development
  {
    name: 'code_development',
    description: 'Write, analyze, debug, and explain code',
    keywords: [
      'code', 'coding', 'program', 'programming', 'script',
      'function', 'class', 'method', 'variable', 'loop',
      'debug', 'fix', 'error', 'bug', 'issue', 'problem',
      'python', 'javascript', 'typescript', 'node', 'react',
      'api', 'database', 'sql', 'query', 'endpoint',
      'develop', 'build', 'create app', 'website', 'web app',
      'analyze', 'review', 'optimize', 'refactor', 'improve',
      'algorithm', 'logic', 'implement', 'integration',
    ],
    tools: ['code_execute', 'code_analyze', 'file_read', 'file_write'],
    priority: 8,
  },
  
  // Data Processing
  {
    name: 'data_processing',
    description: 'Process, analyze, and visualize data',
    keywords: [
      'data', 'dataset', 'csv', 'json', 'excel', 'xlsx',
      'analyze', 'analysis', 'statistics', 'statistical',
      'chart', 'graph', 'plot', 'visualize', 'visualization',
      'table', 'report', 'summary', 'aggregate', 'calculate',
      'filter', 'sort', 'group', 'transform', 'convert',
      'mean', 'median', 'average', 'sum', 'count', 'percentage',
      'import', 'export', 'parse', 'format',
    ],
    tools: ['csv_parse', 'json_query', 'data_aggregate', 'data_visualize', 'statistics'],
    priority: 7,
  },
  
  // File Operations
  {
    name: 'file_operations',
    description: 'Read, write, and manage files',
    keywords: [
      'file', 'files', 'document', 'folder', 'directory',
      'read', 'write', 'create', 'delete', 'move', 'copy',
      'rename', 'organize', 'manage', 'list', 'find file',
      'pdf', 'docx', 'txt', 'markdown', 'log',
      'upload', 'download', 'save', 'load', 'open',
    ],
    tools: ['file_read', 'file_write', 'file_list', 'file_delete'],
    priority: 6,
  },
  
  // Communication
  {
    name: 'communication',
    description: 'Send messages, emails, notifications',
    keywords: [
      'email', 'mail', 'send email', 'compose',
      'slack', 'discord', 'notify', 'notification', 'alert',
      'message', 'send message', 'chat', 'broadcast',
      'webhook', 'integration', 'notify me', 'remind',
      'contact', 'communicate', 'reach out',
    ],
    tools: ['email_send', 'slack_notify', 'discord_notify', 'http_request'],
    priority: 6,
  },
  
  // API Integration
  {
    name: 'api_integration',
    description: 'Make API calls and integrate services',
    keywords: [
      'api', 'endpoint', 'rest', 'graphql', 'request',
      'fetch', 'call', 'integration', 'connect to',
      'webhook', 'callback', 'response', 'json',
      'oauth', 'authenticate', 'token', 'authorization',
      'http', 'get', 'post', 'put', 'delete',
    ],
    tools: ['http_request', 'graphql_query', 'oauth_connect'],
    priority: 7,
  },
  
  // Database Operations
  {
    name: 'database',
    description: 'Query and manage databases',
    keywords: [
      'database', 'db', 'sql', 'query', 'table',
      'insert', 'update', 'delete', 'select', 'join',
      'mysql', 'postgresql', 'postgres', 'mongodb', 'mongo',
      'record', 'row', 'column', 'schema', 'migration',
      'crud', 'store', 'retrieve', 'persist',
    ],
    tools: ['database_query', 'data_transform'],
    priority: 7,
  },
  
  // AI & Content Generation
  {
    name: 'ai_generation',
    description: 'Generate images, audio, video, and text content',
    keywords: [
      'generate', 'create image', 'make image', 'picture', 'photo',
      'audio', 'speech', 'voice', 'tts', 'text to speech',
      'video', 'animation', 'gif',
      'art', 'design', 'illustration', 'graphic',
      'content', 'write', 'compose', 'draft', 'article',
      'story', 'blog', 'post', 'copy', 'creative',
    ],
    tools: ['image_generate', 'tts', 'video_generate'],
    priority: 5,
  },
  
  // Memory & Context
  {
    name: 'memory',
    description: 'Remember and recall information',
    keywords: [
      'remember', 'recall', 'memorize', 'save to memory',
      'what did i say', 'what did we discuss', 'previous',
      'history', 'past conversation', 'last time',
      'note', 'save note', 'store', 'keep',
      'forget', 'clear memory', 'reset',
    ],
    tools: ['memory_save', 'memory_recall', 'memory_search'],
    priority: 4,
  },
  
  // Task Planning
  {
    name: 'task_planning',
    description: 'Plan and organize complex tasks',
    keywords: [
      'plan', 'planning', 'organize', 'schedule',
      'task', 'tasks', 'todo', 'to-do', 'checklist',
      'step by step', 'breakdown', 'roadmap', 'workflow',
      'priority', 'deadline', 'timeline', 'milestone',
      'project', 'manage', 'coordinate', 'delegate',
    ],
    tools: ['plan_create', 'plan_execute', 'task_list'],
    priority: 5,
  },
];

// ============= Skill Detector Class =============

export class SkillDetector {
  /**
   * Analyze prompt and detect required skills
   */
  static detect(prompt: string): {
    categories: SkillCategory[];
    tools: string[];
    confidence: number;
  } {
    const lowerPrompt = prompt.toLowerCase();
    const detectedCategories: Array<{ category: SkillCategory; score: number }> = [];

    // Score each category
    for (const category of skillCategories) {
      let score = 0;
      
      for (const keyword of category.keywords) {
        if (lowerPrompt.includes(keyword.toLowerCase())) {
          // Exact match gets higher score
          score += keyword.split(' ').length; // Multi-word keywords get more points
        }
      }

      if (score > 0) {
        detectedCategories.push({
          category,
          score: score * category.priority,
        });
      }
    }

    // Sort by score
    detectedCategories.sort((a, b) => b.score - a.score);

    // Take top categories
    const topCategories = detectedCategories.slice(0, 3).map(d => d.category);
    
    // Collect unique tools
    const tools = [...new Set(topCategories.flatMap(c => c.tools))];
    
    // Calculate confidence
    const maxScore = detectedCategories[0]?.score || 0;
    const confidence = Math.min(maxScore / 50, 1);

    return {
      categories: topCategories,
      tools,
      confidence,
    };
  }

  /**
   * Get tool selection prompt for AI
   * This tells the AI which tools are available and relevant
   */
  static getToolSelectionPrompt(prompt: string): string {
    const detection = this.detect(prompt);
    
    if (detection.tools.length === 0) {
      // No specific tools detected, provide all basic tools
      return `
The user's request doesn't seem to require specific tools. 
You can use your general knowledge to help, or ask for clarification if needed.
`;
    }

    const categoryNames = detection.categories.map(c => c.name).join(', ');
    
    return `
## Auto-Detected Relevant Tools

Based on your request, I've identified these relevant capabilities:
**Categories**: ${categoryNames}
**Available Tools**: ${detection.tools.join(', ')}

**Confidence**: ${(detection.confidence * 100).toFixed(0)}%

You can use any of these tools to help complete the task. Use tools when they would be more effective than just providing information.

If you need tools that aren't in this list, let me know and I can enable additional capabilities.
`;
  }

  /**
   * Get all available tools
   */
  static getAllTools(): string[] {
    return [...new Set(skillCategories.flatMap(c => c.tools))];
  }

  /**
   * Get tools by category name
   */
  static getToolsByCategory(categoryName: string): string[] {
    const category = skillCategories.find(c => c.name === categoryName);
    return category?.tools || [];
  }
}

// ============= Export =============

export default SkillDetector;
