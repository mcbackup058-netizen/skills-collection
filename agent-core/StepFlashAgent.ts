/**
 * AI Step Flash 3.5 Agent Core
 * A powerful AI agent framework with tool use, memory, and reasoning capabilities
 * Last Updated: March 2026
 */

import {
  AgentConfig,
  Message,
  ToolCall,
  ToolResult,
  Tool,
  AgentState,
  AgentStatus,
  AgentResponse,
  AgentEvent,
  AgentEventHandler,
  ReasoningStep,
  Plan,
  Task,
} from './types';
import { ToolRegistry } from './tools/ToolRegistry';
import { MemoryManager } from './memory/MemoryManager';
import { ReasoningEngine } from './reasoning/ReasoningEngine';

// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = 'step-ai/step-flash-3.5';

export class StepFlashAgent {
  private config: AgentConfig;
  private state: AgentState;
  private tools: ToolRegistry;
  private memory: MemoryManager;
  private reasoning: ReasoningEngine;
  private eventHandlers: Map<string, AgentEventHandler[]> = new Map();
  
  constructor(config: AgentConfig) {
    this.config = {
      model: DEFAULT_MODEL,
      maxIterations: 10,
      timeout: 120000,
      verbose: false,
      memoryEnabled: true,
      ...config,
    };

    this.tools = new ToolRegistry();
    this.memory = new MemoryManager();
    this.reasoning = new ReasoningEngine();
    
    this.state = this.initializeState();
  }

  private initializeState(): AgentState {
    return {
      conversationId: this.generateId(),
      status: 'idle',
      reasoningChain: [],
      toolHistory: [],
      memoryContext: [],
      iteration: 0,
      startTime: new Date(),
      lastActivity: new Date(),
    };
  }

  private generateId(): string {
    return `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============= Event Handling =============

  on(event: string, handler: AgentEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  private emit(type: string, data: any): void {
    const handlers = this.eventHandlers.get(type) || [];
    const event: AgentEvent = {
      type: type as any,
      timestamp: new Date(),
      data,
    };
    handlers.forEach(handler => handler(event));
  }

  // ============= Tool Management =============

  registerTool(tool: Tool): void {
    this.tools.register(tool);
  }

  registerTools(tools: Tool[]): void {
    tools.forEach(tool => this.registerTool(tool));
  }

  // ============= Core Chat Functionality =============

  async chat(userMessage: string, context?: Message[]): Promise<AgentResponse> {
    const startTime = Date.now();
    this.state.status = 'thinking';
    this.emit('thinking_start', { message: userMessage });

    try {
      // Build messages
      const messages: Message[] = this.buildMessages(userMessage, context);

      // Get relevant memories
      if (this.config.memoryEnabled) {
        const memories = await this.memory.search(userMessage, 5);
        this.state.memoryContext = memories.map(m => m.content);
      }

      // Make API call
      const response = await this.makeAPICall(messages);
      
      // Process response
      const result = await this.processResponse(response, startTime);
      
      // Save to memory
      if (this.config.memoryEnabled) {
        await this.memory.add({
          type: 'short_term',
          content: `User: ${userMessage}\nAssistant: ${result.content}`,
          metadata: { conversationId: this.state.conversationId },
        });
      }

      this.state.status = 'completed';
      this.emit('thinking_end', { result });

      return result;
    } catch (error) {
      this.state.status = 'error';
      this.emit('error', { error: error.message });
      throw error;
    }
  }

  private buildMessages(userMessage: string, context?: Message[]): Message[] {
    const systemPrompt = this.buildSystemPrompt();
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Add memory context
    if (this.state.memoryContext.length > 0) {
      messages.push({
        role: 'system',
        content: `Relevant context from memory:\n${this.state.memoryContext.join('\n')}`,
      });
    }

    // Add previous context
    if (context) {
      messages.push(...context);
    }

    // Add user message
    messages.push({ role: 'user', content: userMessage });

    return messages;
  }

  private buildSystemPrompt(): string {
    const toolDescriptions = this.tools.getToolDescriptions();
    
    return `You are a powerful AI Agent powered by Step Flash 3.5. You have access to various tools and capabilities to help users accomplish complex tasks.

## Your Capabilities

### Available Tools
${toolDescriptions}

### Your Reasoning Process
1. **Analyze**: Understand the user's request and identify the core problem
2. **Plan**: Break down complex tasks into manageable steps
3. **Execute**: Use tools effectively to accomplish each step
4. **Reflect**: Review your work and make improvements if needed
5. **Respond**: Provide clear, helpful responses to the user

### Guidelines
- Always think step by step before taking action
- Use tools when they can help accomplish the task more effectively
- Be transparent about your reasoning process
- If a task is complex, create a plan first
- Ask for clarification if the request is ambiguous
- Admit when you don't know something
- Prioritize user safety and ethical considerations

### Response Format
When you need to use tools, format your response as:
\`\`\`tool
{
  "name": "tool_name",
  "arguments": { ... }
}
\`\`\`

You can use multiple tools in sequence. After each tool use, I will provide the result and you can continue.

Remember: You are helpful, harmless, and honest. Always strive to provide the best possible assistance to users.`;
  }

  private async makeAPICall(messages: Message[]): Promise<any> {
    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/mcbackup058-netizen/skills-collection',
        'X-Title': 'Step Flash Agent',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
          name: m.name,
        })),
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  private async processResponse(response: any, startTime: number): Promise<AgentResponse> {
    const content = response.choices[0]?.message?.content || '';
    const toolCalls = this.extractToolCalls(content);
    
    let toolResults: ToolResult[] = [];
    
    if (toolCalls.length > 0) {
      this.state.status = 'executing';
      toolResults = await this.executeTools(toolCalls);
    }

    // Add reasoning step
    const reasoningStep: ReasoningStep = {
      id: this.generateId(),
      type: 'analysis',
      content: content.substring(0, 500),
      confidence: 0.9,
      timestamp: new Date(),
    };
    this.state.reasoningChain.push(reasoningStep);

    return {
      success: true,
      message: content,
      content: this.cleanContent(content),
      toolCalls,
      toolResults,
      reasoning: this.state.reasoningChain.slice(-5),
      metadata: {
        model: this.config.model || DEFAULT_MODEL,
        tokensUsed: response.usage?.total_tokens || 0,
        iteration: this.state.iteration,
        duration: Date.now() - startTime,
        toolsUsed: toolResults.map(r => r.name),
        status: this.state.status,
      },
    };
  }

  private extractToolCalls(content: string): ToolCall[] {
    const toolCalls: ToolCall[] = [];
    const regex = /```tool\n([\s\S]*?)```/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      try {
        const toolData = JSON.parse(match[1].trim());
        toolCalls.push({
          id: this.generateId(),
          type: 'function',
          function: {
            name: toolData.name,
            arguments: JSON.stringify(toolData.arguments || {}),
          },
        });
      } catch (e) {
        // Skip invalid tool calls
      }
    }

    return toolCalls;
  }

  private async executeTools(toolCalls: ToolCall[]): Promise<ToolResult[]> {
    const results: ToolResult[] = [];

    for (const call of toolCalls) {
      this.emit('tool_call_start', { tool: call.function.name });
      
      try {
        const args = JSON.parse(call.function.arguments);
        const result = await this.tools.execute(call.function.name, args);
        
        results.push({
          toolCallId: call.id,
          name: call.function.name,
          result: result.output,
          success: result.success,
          error: result.error,
        });

        this.state.toolHistory.push(results[results.length - 1]);
      } catch (error) {
        results.push({
          toolCallId: call.id,
          name: call.function.name,
          result: null,
          success: false,
          error: error.message,
        });
      }

      this.emit('tool_call_end', { 
        tool: call.function.name, 
        result: results[results.length - 1] 
      });
    }

    return results;
  }

  private cleanContent(content: string): string {
    // Remove tool call blocks for display
    return content.replace(/```tool\n[\s\S]*?```/g, '').trim();
  }

  // ============= Multi-Turn Conversation =============

  async converse(
    messages: Message[],
    onProgress?: (chunk: string) => void
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    this.state.status = 'thinking';

    const systemPrompt = this.buildSystemPrompt();
    const allMessages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    // Iterative execution loop
    let currentMessages = [...allMessages];
    let iteration = 0;
    let finalResponse: AgentResponse | null = null;

    while (iteration < (this.config.maxIterations || 10)) {
      this.state.iteration = iteration;
      
      const response = await this.makeAPICall(currentMessages);
      const content = response.choices[0]?.message?.content || '';
      
      const toolCalls = this.extractToolCalls(content);
      
      if (toolCalls.length === 0) {
        // No more tools to call, we're done
        finalResponse = await this.processResponse(response, startTime);
        break;
      }

      // Execute tools
      const toolResults = await this.executeTools(toolCalls);

      // Add assistant message with tool calls
      currentMessages.push({
        role: 'assistant',
        content: content,
      });

      // Add tool results
      for (const result of toolResults) {
        currentMessages.push({
          role: 'tool',
          content: JSON.stringify(result.result || result.error),
          name: result.name,
          toolCallId: result.toolCallId,
        });
      }

      if (onProgress) {
        onProgress(`[Tool: ${toolResults.map(r => r.name).join(', ')}]\n`);
      }

      iteration++;
    }

    if (!finalResponse) {
      finalResponse = {
        success: false,
        message: 'Maximum iterations reached without completion',
        metadata: {
          model: this.config.model || DEFAULT_MODEL,
          tokensUsed: 0,
          iteration,
          duration: Date.now() - startTime,
          toolsUsed: this.state.toolHistory.map(h => h.name),
          status: 'error',
        },
      };
    }

    this.state.status = 'completed';
    return finalResponse;
  }

  // ============= Planning & Execution =============

  async plan(goal: string): Promise<Plan> {
    this.state.status = 'planning';
    
    const planningPrompt = `Create a detailed plan to accomplish the following goal:

Goal: ${goal}

Break this down into specific, actionable tasks. For each task, specify:
1. Task description
2. Priority (1-10, 10 being highest)
3. Dependencies on other tasks
4. Required tools (if any)

Format your response as a JSON array of tasks.`;

    const response = await this.chat(planningPrompt);
    
    const plan = this.reasoning.parsePlan(response.content || '', goal);
    this.state.currentPlan = plan;
    
    return plan;
  }

  async executePlan(plan?: Plan): Promise<AgentResponse> {
    const activePlan = plan || this.state.currentPlan;
    if (!activePlan) {
      throw new Error('No plan to execute');
    }

    const results: Task[] = [];
    
    for (const task of activePlan.tasks) {
      if (task.status !== 'pending') continue;
      
      task.status = 'in_progress';
      this.emit('task_complete', { task });

      try {
        const response = await this.chat(task.description);
        task.result = response;
        task.status = 'completed';
        task.completedAt = new Date();
      } catch (error) {
        task.status = 'failed';
        task.error = error.message;
      }

      results.push(task);
      this.emit('task_complete', { task });
    }

    activePlan.status = 'completed';
    
    return {
      success: results.every(r => r.status === 'completed'),
      message: 'Plan execution completed',
      plan: activePlan,
      metadata: {
        model: this.config.model || DEFAULT_MODEL,
        tokensUsed: 0,
        iteration: this.state.iteration,
        duration: 0,
        toolsUsed: [],
        status: 'completed',
      },
    };
  }

  // ============= Streaming Response =============

  async *chatStream(userMessage: string): AsyncGenerator<string> {
    const messages = this.buildMessages(userMessage);
    
    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/mcbackup058-netizen/skills-collection',
        'X-Title': 'Step Flash Agent',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        temperature: 0.7,
        max_tokens: 4096,
        stream: true,
      }),
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content || '';
            if (content) yield content;
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }

  // ============= Utility Methods =============

  getState(): AgentState {
    return { ...this.state };
  }

  getMemory(): MemoryManager {
    return this.memory;
  }

  getTools(): ToolRegistry {
    return this.tools;
  }

  reset(): void {
    this.state = this.initializeState();
    this.memory.clear();
  }

  setSystemPrompt(prompt: string): void {
    // Custom system prompt can be set
    this.emit('memory_update', { type: 'system_prompt', prompt });
  }
}

export default StepFlashAgent;
