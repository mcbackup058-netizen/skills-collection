/**
 * Memory Manager for Step Flash Agent
 * Handles short-term, long-term, and semantic memory
 * Last Updated: March 2026
 */

import { Memory, MemoryMetadata, Entity, ConversationContext } from '../types';

export class MemoryManager {
  private shortTermMemory: Memory[] = [];
  private longTermMemory: Memory[] = [];
  private entities: Map<string, Entity> = new Map();
  private conversations: Map<string, ConversationContext> = new Map();
  private maxShortTerm: number = 100;
  private maxLongTerm: number = 1000;

  constructor() {}

  // ============= Add Memory =============

  async add(data: {
    type: Memory['type'];
    content: string;
    metadata?: MemoryMetadata;
    embedding?: number[];
  }): Promise<Memory> {
    const memory: Memory = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: data.type,
      content: data.content,
      embedding: data.embedding,
      metadata: data.metadata || {},
      createdAt: new Date(),
      lastAccessed: new Date(),
      accessCount: 0,
      importance: data.metadata?.importance || 5,
    };

    // Extract entities
    const entities = this.extractEntities(data.content);
    entities.forEach(name => {
      if (!this.entities.has(name)) {
        this.entities.set(name, {
          name,
          type: 'unknown',
          mentions: 0,
          lastMentioned: new Date(),
          properties: {},
        });
      }
      const entity = this.entities.get(name)!;
      entity.mentions++;
      entity.lastMentioned = new Date();
    });

    // Store based on type
    switch (data.type) {
      case 'short_term':
        this.shortTermMemory.push(memory);
        if (this.shortTermMemory.length > this.maxShortTerm) {
          this.shortTermMemory.shift();
        }
        break;
      case 'long_term':
        this.longTermMemory.push(memory);
        if (this.longTermMemory.length > this.maxLongTerm) {
          // Remove least important
          this.longTermMemory.sort((a, b) => b.importance - a.importance);
          this.longTermMemory.pop();
        }
        break;
      case 'episodic':
        this.longTermMemory.push(memory);
        break;
      case 'semantic':
        this.longTermMemory.push(memory);
        break;
    }

    return memory;
  }

  // ============= Search Memory =============

  async search(query: string, limit: number = 5): Promise<Memory[]> {
    const queryTerms = query.toLowerCase().split(/\s+/);
    
    // Search in both memory stores
    const allMemories = [...this.shortTermMemory, ...this.longTermMemory];
    
    // Score each memory
    const scored = allMemories.map(memory => {
      const content = memory.content.toLowerCase();
      let score = 0;
      
      // Term frequency
      queryTerms.forEach(term => {
        const matches = content.split(term).length - 1;
        score += matches * 2;
      });
      
      // Boost by importance
      score += memory.importance;
      
      // Boost by recency
      const ageHours = (Date.now() - memory.createdAt.getTime()) / (1000 * 60 * 60);
      score += Math.max(0, 10 - ageHours);
      
      // Boost by access count
      score += Math.min(memory.accessCount, 10);
      
      return { memory, score };
    });
    
    // Sort by score and return top results
    scored.sort((a, b) => b.score - a.score);
    
    const results = scored.slice(0, limit).map(item => {
      item.memory.lastAccessed = new Date();
      item.memory.accessCount++;
      return item.memory;
    });
    
    return results;
  }

  // ============= Get Memory by ID =============

  get(id: string): Memory | undefined {
    let memory = this.shortTermMemory.find(m => m.id === id);
    if (!memory) {
      memory = this.longTermMemory.find(m => m.id === id);
    }
    
    if (memory) {
      memory.lastAccessed = new Date();
      memory.accessCount++;
    }
    
    return memory;
  }

  // ============= Update Memory =============

  update(id: string, updates: Partial<Memory>): boolean {
    let memory = this.shortTermMemory.find(m => m.id === id);
    if (!memory) {
      memory = this.longTermMemory.find(m => m.id === id);
    }
    
    if (memory) {
      Object.assign(memory, updates);
      return true;
    }
    
    return false;
  }

  // ============= Delete Memory =============

  delete(id: string): boolean {
    const stIndex = this.shortTermMemory.findIndex(m => m.id === id);
    if (stIndex !== -1) {
      this.shortTermMemory.splice(stIndex, 1);
      return true;
    }
    
    const ltIndex = this.longTermMemory.findIndex(m => m.id === id);
    if (ltIndex !== -1) {
      this.longTermMemory.splice(ltIndex, 1);
      return true;
    }
    
    return false;
  }

  // ============= Entity Management =============

  private extractEntities(text: string): string[] {
    // Simple entity extraction
    // In production, use NER model
    const entities: string[] = [];
    
    // Extract capitalized words (potential names)
    const names = text.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || [];
    entities.push(...names);
    
    // Extract quoted strings
    const quoted = text.match(/"([^"]+)"|'([^']+)'/g) || [];
    quoted.forEach(q => entities.push(q.replace(/['"]/g, '')));
    
    // Extract emails
    const emails = text.match(/[\w.-]+@[\w.-]+\.\w+/g) || [];
    entities.push(...emails);
    
    // Extract URLs
    const urls = text.match(/https?:\/\/[^\s]+/g) || [];
    entities.push(...urls);
    
    return [...new Set(entities)];
  }

  getEntities(): Entity[] {
    return Array.from(this.entities.values());
  }

  getEntity(name: string): Entity | undefined {
    return this.entities.get(name);
  }

  // ============= Conversation Management =============

  createConversation(id?: string): ConversationContext {
    const conversationId = id || `conv_${Date.now()}`;
    const conversation: ConversationContext = {
      id: conversationId,
      messages: [],
      entities: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.conversations.set(conversationId, conversation);
    return conversation;
  }

  getConversation(id: string): ConversationContext | undefined {
    return this.conversations.get(id);
  }

  addMessageToConversation(conversationId: string, message: any): boolean {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return false;
    
    conversation.messages.push(message);
    conversation.updatedAt = new Date();
    return true;
  }

  // ============= Memory Statistics =============

  getStats(): {
    shortTermCount: number;
    longTermCount: number;
    entityCount: number;
    conversationCount: number;
  } {
    return {
      shortTermCount: this.shortTermMemory.length,
      longTermCount: this.longTermMemory.length,
      entityCount: this.entities.size,
      conversationCount: this.conversations.size,
    };
  }

  // ============= Clear Memory =============

  clear(): void {
    this.shortTermMemory = [];
    this.longTermMemory = [];
    this.entities.clear();
    this.conversations.clear();
  }

  clearShortTerm(): void {
    this.shortTermMemory = [];
  }

  // ============= Export/Import =============

  export(): string {
    const data = {
      shortTerm: this.shortTermMemory,
      longTerm: this.longTermMemory,
      entities: Array.from(this.entities.entries()),
    };
    return JSON.stringify(data, null, 2);
  }

  import(data: string): void {
    try {
      const parsed = JSON.parse(data);
      this.shortTermMemory = parsed.shortTerm || [];
      this.longTermMemory = parsed.longTerm || [];
      this.entities = new Map(parsed.entities || []);
    } catch (error) {
      console.error('Failed to import memory:', error);
    }
  }
}

export default MemoryManager;
