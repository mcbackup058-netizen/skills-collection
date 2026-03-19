/**
 * Type Definitions for Step Flash Agent
 */

// ============= Core Agent Types =============

export interface AgentConfig {
  apiKey: string;
  model?: string;
  maxIterations?: number;
  timeout?: number;
  verbose?: boolean;
  memoryEnabled?: boolean;
  temperature?: number;
  tools?: string[];
  systemPrompt?: string;
  baseURL?: string;
}

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool' | 'function';
  content: string | ContentPart[];
  name?: string;
  toolCallId?: string;
  toolCalls?: ToolCall[];
}

export interface ContentPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string };
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
  category?: string;
  requiresConfirmation?: boolean;
  dangerous?: boolean;
}

export interface ToolExecutionResult {
  success: boolean;
  output: any;
  error?: string;
  metadata?: Record<string, any>;
}

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

// ============= Agent State =============

export interface AgentState {
  conversationId: string;
  status: AgentStatus;
  messages: Message[];
  toolHistory: ToolResult[];
  iteration: number;
  startTime: Date;
  lastActivity: Date;
}

export type AgentStatus = 
  | 'idle'
  | 'thinking'
  | 'executing'
  | 'waiting_for_input'
  | 'error'
  | 'completed';

// ============= Response Types =============

export interface AgentResponse {
  success: boolean;
  message: string;
  content?: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
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
  | 'error';

export interface AgentEvent {
  type: AgentEventType;
  timestamp: Date;
  data: any;
}

export type AgentEventHandler = (event: AgentEvent) => void | Promise<void>;

// ============= Memory Types =============

export interface Memory {
  id: string;
  type: 'short_term' | 'long_term' | 'episodic' | 'semantic';
  content: string;
  embedding?: number[];
  metadata: Record<string, any>;
  createdAt: Date;
  lastAccessed: Date;
  accessCount: number;
  importance: number;
}

// ============= VPS Types =============

export interface VPSConfig {
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  description?: string;
  tags?: string[];
}

export interface SSHResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  command: string;
  duration: number;
}

export interface SystemInfo {
  hostname: string;
  os: string;
  kernel: string;
  uptime: string;
  cpu: CPUInfo;
  memory: MemoryInfo;
  disk: DiskInfo[];
  network: NetworkInfo;
}

export interface CPUInfo {
  model: string;
  cores: number;
  usage: number;
  loadAverage: [number, number, number];
}

export interface MemoryInfo {
  total: number;
  used: number;
  free: number;
  cached: number;
  swapTotal: number;
  swapUsed: number;
}

export interface DiskInfo {
  filesystem: string;
  size: number;
  used: number;
  available: number;
  mountPoint: string;
  usagePercent: number;
}

export interface NetworkInfo {
  interfaces: NetworkInterface[];
  connections: number;
}

export interface NetworkInterface {
  name: string;
  ip: string;
  mac: string;
  rxBytes: number;
  txBytes: number;
}
