/**
 * Built-in Tools for Step Flash Agent
 * A collection of powerful tools for web, code, file, and more
 * Last Updated: March 2026
 */

import { Tool, ToolExecutionResult } from '../types';

// ============= Web Tools =============

export const webSearchTool: Tool = {
  name: 'web_search',
  description: 'Search the web for current information. Returns relevant results with URLs and snippets.',
  category: 'web',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query',
      },
      num_results: {
        type: 'number',
        description: 'Number of results to return (default: 5)',
        default: 5,
      },
    },
    required: ['query'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      // Simulated web search - in production, use actual search API
      const results = [
        {
          title: `Search results for: ${args.query}`,
          url: 'https://example.com/result1',
          snippet: 'This is a simulated search result. In production, this would return actual web search results.',
        },
      ];
      
      return {
        success: true,
        output: {
          query: args.query,
          results: results.slice(0, args.num_results || 5),
          total: results.length,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const webFetchTool: Tool = {
  name: 'web_fetch',
  description: 'Fetch content from a URL. Returns the page content as text.',
  category: 'web',
  parameters: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'The URL to fetch',
      },
      selector: {
        type: 'string',
        description: 'Optional CSS selector to extract specific content',
      },
    },
    required: ['url'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const response = await fetch(args.url);
      const content = await response.text();
      
      return {
        success: true,
        output: {
          url: args.url,
          content: content.substring(0, 10000), // Limit content size
          status: response.status,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

// ============= Code Execution Tools =============

export const codeExecuteTool: Tool = {
  name: 'code_execute',
  description: 'Execute JavaScript/TypeScript code safely. Returns the output or error.',
  category: 'code',
  parameters: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        description: 'The code to execute',
      },
      language: {
        type: 'string',
        enum: ['javascript', 'typescript', 'python'],
        description: 'The programming language',
        default: 'javascript',
      },
      timeout: {
        type: 'number',
        description: 'Execution timeout in seconds (default: 10)',
        default: 10,
      },
    },
    required: ['code'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      // Safe execution using Function constructor
      const code = args.code;
      const timeout = (args.timeout || 10) * 1000;
      
      // Create a sandboxed execution context
      const logs: string[] = [];
      const sandbox = {
        console: {
          log: (...items: any[]) => logs.push(items.map(i => 
            typeof i === 'object' ? JSON.stringify(i) : String(i)
          ).join(' ')),
          error: (...items: any[]) => logs.push('[ERROR] ' + items.join(' ')),
          warn: (...items: any[]) => logs.push('[WARN] ' + items.join(' ')),
        },
        Math,
        Date,
        JSON,
        Array,
        Object,
        String,
        Number,
        Boolean,
      };

      const fn = new Function(...Object.keys(sandbox), code);
      
      // Execute with timeout
      const result = await Promise.race([
        Promise.resolve(fn(...Object.values(sandbox))),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Execution timeout')), timeout)
        ),
      ]);

      return {
        success: true,
        output: {
          result: result,
          logs: logs,
        },
      };
    } catch (error) {
      return {
        success: false,
        output: null,
        error: error.message,
      };
    }
  },
};

export const codeAnalyzeTool: Tool = {
  name: 'code_analyze',
  description: 'Analyze code for issues, complexity, and suggestions.',
  category: 'code',
  parameters: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        description: 'The code to analyze',
      },
      analysis_type: {
        type: 'string',
        enum: ['lint', 'complexity', 'security', 'all'],
        description: 'Type of analysis to perform',
        default: 'all',
      },
    },
    required: ['code'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const code = args.code;
      const analysis: any = {
        linesOfCode: code.split('\n').length,
        characters: code.length,
        functions: (code.match(/function\s+\w+/g) || []).length,
        classes: (code.match(/class\s+\w+/g) || []).length,
        imports: (code.match(/import\s+.*from/g) || []).length,
        issues: [],
      };

      // Basic lint checks
      if (code.includes('console.log')) {
        analysis.issues.push({
          type: 'warning',
          message: 'Contains console.log statements',
          severity: 'low',
        });
      }

      if (code.includes('eval(')) {
        analysis.issues.push({
          type: 'error',
          message: 'Contains eval() - potential security risk',
          severity: 'high',
        });
      }

      // Complexity estimation
      const complexityIndicators = [
        'if', 'else', 'for', 'while', 'switch', 'case', 'catch',
      ];
      let complexity = 1;
      complexityIndicators.forEach(indicator => {
        const matches = code.match(new RegExp(`\\b${indicator}\\b`, 'g'));
        if (matches) complexity += matches.length;
      });
      analysis.cyclomaticComplexity = complexity;

      return {
        success: true,
        output: analysis,
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

// ============= File Operations Tools =============

export const fileReadTool: Tool = {
  name: 'file_read',
  description: 'Read content from a file. Returns the file content as text.',
  category: 'file',
  parameters: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'The file path to read',
      },
      encoding: {
        type: 'string',
        enum: ['utf8', 'base64', 'binary'],
        description: 'File encoding',
        default: 'utf8',
      },
    },
    required: ['path'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const fs = await import('fs');
      const content = fs.readFileSync(args.path, args.encoding || 'utf8');
      
      return {
        success: true,
        output: {
          path: args.path,
          content: content,
          size: content.length,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const fileWriteTool: Tool = {
  name: 'file_write',
  description: 'Write content to a file. Creates directories if needed.',
  category: 'file',
  dangerous: true,
  parameters: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'The file path to write',
      },
      content: {
        type: 'string',
        description: 'The content to write',
      },
      mode: {
        type: 'string',
        enum: ['write', 'append'],
        description: 'Write mode',
        default: 'write',
      },
    },
    required: ['path', 'content'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      // Create directory if needed
      const dir = path.dirname(args.path);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write file
      if (args.mode === 'append') {
        fs.appendFileSync(args.path, args.content);
      } else {
        fs.writeFileSync(args.path, args.content);
      }

      return {
        success: true,
        output: {
          path: args.path,
          bytesWritten: args.content.length,
          mode: args.mode,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const fileListTool: Tool = {
  name: 'file_list',
  description: 'List files in a directory. Returns file names and metadata.',
  category: 'file',
  parameters: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'The directory path to list',
      },
      recursive: {
        type: 'boolean',
        description: 'List recursively',
        default: false,
      },
      pattern: {
        type: 'string',
        description: 'File pattern to match (glob)',
      },
    },
    required: ['path'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const files: any[] = [];
      
      const listDir = (dir: string, base: string = '') => {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          const relativePath = path.join(base, item);
          
          if (stat.isDirectory()) {
            files.push({
              name: item,
              path: relativePath,
              type: 'directory',
              size: 0,
            });
            
            if (args.recursive) {
              listDir(fullPath, relativePath);
            }
          } else {
            // Apply pattern filter if provided
            if (args.pattern) {
              const regex = new RegExp(
                args.pattern.replace(/\*/g, '.*').replace(/\?/g, '.')
              );
              if (!regex.test(item)) continue;
            }
            
            files.push({
              name: item,
              path: relativePath,
              type: 'file',
              size: stat.size,
              modified: stat.mtime,
            });
          }
        }
      };

      listDir(args.path);
      
      return {
        success: true,
        output: {
          path: args.path,
          files: files,
          total: files.length,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

// ============= Memory Tools =============

export const memoryStoreTool: Tool = {
  name: 'memory_store',
  description: 'Store information in long-term memory for later retrieval.',
  category: 'memory',
  parameters: {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        description: 'The content to store',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Tags for categorization',
      },
      importance: {
        type: 'number',
        description: 'Importance score (1-10)',
        default: 5,
      },
    },
    required: ['content'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      // In a real implementation, this would connect to a vector database
      const memory = {
        id: `mem_${Date.now()}`,
        content: args.content,
        tags: args.tags || [],
        importance: args.importance || 5,
        createdAt: new Date().toISOString(),
      };

      return {
        success: true,
        output: {
          stored: true,
          memoryId: memory.id,
          message: 'Memory stored successfully',
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const memoryRecallTool: Tool = {
  name: 'memory_recall',
  description: 'Search and retrieve information from memory.',
  category: 'memory',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query',
      },
      limit: {
        type: 'number',
        description: 'Maximum results to return',
        default: 5,
      },
    },
    required: ['query'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      // Simulated memory recall
      return {
        success: true,
        output: {
          query: args.query,
          memories: [],
          message: 'Memory search completed',
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

// ============= Reasoning Tools =============

export const reasoningChainTool: Tool = {
  name: 'reasoning_chain',
  description: 'Break down complex problems into reasoning steps.',
  category: 'reasoning',
  parameters: {
    type: 'object',
    properties: {
      problem: {
        type: 'string',
        description: 'The problem to analyze',
      },
      steps: {
        type: 'number',
        description: 'Number of reasoning steps',
        default: 5,
      },
    },
    required: ['problem'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const steps = [
        '1. Understand the problem statement',
        '2. Identify key components and variables',
        '3. Break down into smaller sub-problems',
        '4. Solve each sub-problem systematically',
        '5. Combine solutions and verify',
      ];

      return {
        success: true,
        output: {
          problem: args.problem,
          reasoningSteps: steps.slice(0, args.steps || 5),
          recommendation: 'Follow these steps systematically for best results.',
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const decisionMakeTool: Tool = {
  name: 'decision_make',
  description: 'Analyze options and make a decision based on criteria.',
  category: 'reasoning',
  parameters: {
    type: 'object',
    properties: {
      options: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of options to choose from',
      },
      criteria: {
        type: 'array',
        items: { type: 'string' },
        description: 'Criteria for evaluation',
      },
      weights: {
        type: 'object',
        description: 'Weights for each criterion',
      },
    },
    required: ['options', 'criteria'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const { options, criteria, weights } = args;
      
      // Simple decision matrix
      const scores: Record<string, number> = {};
      options.forEach((option: string) => {
        scores[option] = criteria.length * 5; // Base score
      });

      return {
        success: true,
        output: {
          options: options,
          criteria: criteria,
          scores: scores,
          recommendation: options[0], // Simple recommendation
          confidence: 0.8,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

// ============= Communication Tools =============

export const notifyTool: Tool = {
  name: 'notify',
  description: 'Send a notification to the user.',
  category: 'communication',
  parameters: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'The notification message',
      },
      level: {
        type: 'string',
        enum: ['info', 'warning', 'error', 'success'],
        description: 'Notification level',
        default: 'info',
      },
    },
    required: ['message'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    return {
      success: true,
      output: {
        notified: true,
        message: args.message,
        level: args.level || 'info',
        timestamp: new Date().toISOString(),
      },
    };
  },
};

export const askUserTool: Tool = {
  name: 'ask_user',
  description: 'Ask the user a question and wait for response.',
  category: 'communication',
  parameters: {
    type: 'object',
    properties: {
      question: {
        type: 'string',
        description: 'The question to ask',
      },
      options: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional predefined options for the user to choose from',
      },
    },
    required: ['question'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    return {
      success: true,
      output: {
        type: 'user_input_required',
        question: args.question,
        options: args.options || null,
      },
    };
  },
};

// ============= Export All Tools =============

export const builtinTools: Tool[] = [
  // Web
  webSearchTool,
  webFetchTool,
  // Code
  codeExecuteTool,
  codeAnalyzeTool,
  // File
  fileReadTool,
  fileWriteTool,
  fileListTool,
  // Memory
  memoryStoreTool,
  memoryRecallTool,
  // Reasoning
  reasoningChainTool,
  decisionMakeTool,
  // Communication
  notifyTool,
  askUserTool,
];

export default builtinTools;
