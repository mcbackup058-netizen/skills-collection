/**
 * Type Definitions for Step Flash Agent
 * Comprehensive type definitions for the agent framework
 * Last Updated: March 2026
 */

// ============= Core Agent Types =============

export interface AgentConfig {
  /** OpenRouter API key */
  apiKey: string;
  /** Model to use */
  model?: string;
  /** Maximum planning/execution iterations */
  maxIterations?: number;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Enable verbose logging */
  verbose?: boolean;
  /** Enable memory system */
  memoryEnabled?: boolean;
  /** Temperature for generation */
  temperature?: number;
  /** Tools to register */
  tools?: string[];
  /** System prompt override */
  systemPrompt?: string;
}

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool' | 'function';
  content: string;
  name?: string;
  toolCallId?: string;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface ToolResult {
  toolCallId: string;
  name: string;
  result: any;
  success: boolean;
  error?: string;
}

// ============= Tool Types =============

export interface Tool {
  name: string;
  description: string;
  parameters: JSONSchema;
  execute: (args: Record<string, any>) => Promise<ToolExecutionResult>;
  category?: ToolCategory;
  requiresConfirmation?: boolean;
  dangerous?: boolean;
}

export interface ToolExecutionResult {
  success: boolean;
  output: any;
  error?: string;
  metadata?: Record<string, any>;
}

export type ToolCategory = 
  | 'web' 
  | 'code' 
  | 'file' 
  | 'memory' 
  | 'reasoning' 
  | 'communication'
  | 'data'
  | 'api'
  | 'multimedia'
  | 'system'
  | 'general';

export interface JSONSchema {
  type: string;
  properties?: Record<string, JSONSchema>;
  required?: string[];
  items?: JSONSchema;
  enum?: string[];
  description?: string;
  default?: any;
  [key: string]: any;
}

// ============= Memory Types =============

export interface Memory {
  id: string;
  type: 'short_term' | 'long_term' | 'episodic' | 'semantic';
  content: string;
  embedding?: number[];
  metadata: MemoryMetadata;
  createdAt: Date;
  lastAccessed: Date;
  accessCount: number;
  importance: number;
}

export interface MemoryMetadata {
  source?: string;
  tags?: string[];
  entities?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  conversationId?: string;
  taskId?: string;
  importance?: number;
}

export interface ConversationContext {
  id: string;
  messages: Message[];
  summary?: string;
  entities: Entity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Entity {
  name: string;
  type: string;
  mentions: number;
  lastMentioned: Date;
  properties: Record<string, any>;
}

// ============= Reasoning Types =============

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  priority: number;
  dependencies: string[];
  subtasks: string[];
  assignedTool?: string;
  result?: any;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Plan {
  id: string;
  goal: string;
  tasks: Task[];
  currentTaskIndex: number;
  status: 'drafting' | 'executing' | 'completed' | 'failed';
  reasoning: string;
  createdAt: Date;
}

export interface ReasoningStep {
  id: string;
  type: 'analysis' | 'planning' | 'execution' | 'reflection' | 'correction';
  content: string;
  confidence: number;
  alternatives?: string[];
  chosenPath?: string;
  timestamp: Date;
}

// ============= Agent State =============

export interface AgentState {
  conversationId: string;
  status: AgentStatus;
  currentPlan?: Plan;
  reasoningChain: ReasoningStep[];
  toolHistory: ToolResult[];
  memoryContext: string[];
  iteration: number;
  startTime: Date;
  lastActivity: Date;
}

export type AgentStatus = 
  | 'idle'
  | 'thinking'
  | 'planning'
  | 'executing'
  | 'waiting_for_input'
  | 'waiting_for_confirmation'
  | 'error'
  | 'completed';

// ============= Response Types =============

export interface AgentResponse {
  success: boolean;
  message: string;
  content?: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  reasoning?: ReasoningStep[];
  plan?: Plan;
  memory?: Memory[];
  suggestions?: string[];
  metadata: ResponseMetadata;
}

export interface ResponseMetadata {
  model: string;
  tokensUsed: number;
  iteration: number;
  duration: number;
  toolsUsed: string[];
  status: AgentStatus;
}

// ============= Event Types =============

export type AgentEventType = 
  | 'thinking_start'
  | 'thinking_end'
  | 'tool_call_start'
  | 'tool_call_end'
  | 'memory_update'
  | 'plan_update'
  | 'task_complete'
  | 'error'
  | 'confirmation_required';

export interface AgentEvent {
  type: AgentEventType;
  timestamp: Date;
  data: any;
}

export type AgentEventHandler = (event: AgentEvent) => void | Promise<void>;

// ============= Preset Types =============

export interface PresetAgent {
  name: string;
  description: string;
  systemPrompt: string;
  tools: Tool[];
  config: Partial<AgentConfig>;
  examples: string[];
}

// ============= Config Types =============

export interface AgentConfigPreset {
  model: string;
  maxIterations: number;
  timeout: number;
  temperature: number;
  verbose: boolean;
  memoryEnabled: boolean;
  extendedThinking?: boolean;
  logLevel?: string;
}

export interface TaskTemplate {
  description: string;
  steps: Array<{
    name: string;
    description: string;
  }>;
}

// ============= Utility Types =============

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

// ============= Export All =============

export type {
  // Agent
  AgentConfig,
  Message,
  ToolCall,
  ToolResult,
  Tool,
  ToolExecutionResult,
  ToolCategory,
  JSONSchema,
  // Memory
  Memory,
  MemoryMetadata,
  ConversationContext,
  Entity,
  // Reasoning
  Task,
  Plan,
  ReasoningStep,
  // State
  AgentState,
  AgentStatus,
  // Response
  AgentResponse,
  ResponseMetadata,
  // Events
  AgentEventType,
  AgentEvent,
  AgentEventHandler,
  // Presets
  PresetAgent,
  AgentConfigPreset,
  TaskTemplate,
  // Utils
  LogLevel,
  Logger,
};
