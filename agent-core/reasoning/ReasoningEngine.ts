/**
 * Reasoning Engine for Step Flash Agent
 * Provides multi-step reasoning and planning capabilities
 * Last Updated: March 2026
 */

import { Plan, Task, ReasoningStep } from '../types';

export class ReasoningEngine {
  private reasoningHistory: ReasoningStep[] = [];
  private maxHistory: number = 100;

  constructor() {}

  // ============= Plan Parsing =============

  parsePlan(response: string, goal: string): Plan {
    const tasks = this.extractTasks(response);
    
    return {
      id: `plan_${Date.now()}`,
      goal,
      tasks,
      currentTaskIndex: 0,
      status: 'drafting',
      reasoning: response,
      createdAt: new Date(),
    };
  }

  private extractTasks(response: string): Task[] {
    const tasks: Task[] = [];
    
    // Try to parse as JSON array first
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          parsed.forEach((item, index) => {
            tasks.push({
              id: `task_${index}`,
              description: typeof item === 'string' ? item : item.description || item.task,
              status: 'pending',
              priority: item.priority || 10 - index,
              dependencies: item.dependencies || [],
              subtasks: item.subtasks || [],
              createdAt: new Date(),
            });
          });
        }
      }
    } catch (e) {
      // Fall back to text parsing
    }

    // Text-based task extraction
    if (tasks.length === 0) {
      const lines = response.split('\n');
      let taskIndex = 0;
      
      lines.forEach(line => {
        // Match numbered items
        const numberedMatch = line.match(/^\s*(\d+)[.)\]]\s*(.+)$/);
        if (numberedMatch) {
          tasks.push({
            id: `task_${taskIndex++}`,
            description: numberedMatch[2].trim(),
            status: 'pending',
            priority: 10 - taskIndex,
            dependencies: [],
            subtasks: [],
            createdAt: new Date(),
          });
        }
        
        // Match bullet points
        const bulletMatch = line.match(/^\s*[-*•]\s*(.+)$/);
        if (bulletMatch) {
          tasks.push({
            id: `task_${taskIndex++}`,
            description: bulletMatch[1].trim(),
            status: 'pending',
            priority: 10 - taskIndex,
            dependencies: [],
            subtasks: [],
            createdAt: new Date(),
          });
        }
      });
    }

    return tasks;
  }

  // ============= Chain of Thought =============

  async chainOfThought(
    problem: string,
    steps: number = 5
  ): Promise<ReasoningStep[]> {
    const chain: ReasoningStep[] = [];
    
    const templates = [
      { type: 'analysis', prompt: 'First, let me understand the problem:' },
      { type: 'planning', prompt: 'Next, I need to plan my approach:' },
      { type: 'execution', prompt: 'Now, I will execute the plan:' },
      { type: 'reflection', prompt: 'Let me check my work:' },
      { type: 'correction', prompt: 'I should verify and correct if needed:' },
    ];

    for (let i = 0; i < Math.min(steps, templates.length); i++) {
      chain.push({
        id: `step_${i}`,
        type: templates[i].type as ReasoningStep['type'],
        content: `${templates[i].prompt}\n${problem}`,
        confidence: 0.8 - (i * 0.05),
        timestamp: new Date(),
      });
    }

    this.reasoningHistory.push(...chain);
    return chain;
  }

  // ============= Problem Decomposition =============

  decomposeProblem(problem: string): {
    subproblems: string[];
    dependencies: Map<string, string[]>;
    approach: string;
  } {
    const subproblems: string[] = [];
    const dependencies = new Map<string, string[]>();
    
    // Simple decomposition based on sentences and conjunctions
    const sentences = problem.split(/[.!?]+/).filter(s => s.trim());
    
    sentences.forEach((sentence, index) => {
      // Split on conjunctions
      const parts = sentence.split(/\s+(?:and|but|or|then|after|before)\s+/i);
      parts.forEach(part => {
        const trimmed = part.trim();
        if (trimmed.length > 10) {
          subproblems.push(trimmed);
        }
      });
    });

    // Create simple dependency chain
    for (let i = 1; i < subproblems.length; i++) {
      dependencies.set(subproblems[i], [subproblems[i - 1]]);
    }

    return {
      subproblems,
      dependencies,
      approach: 'sequential',
    };
  }

  // ============= Decision Making =============

  makeDecision(
    options: string[],
    criteria: string[],
    weights: number[] = []
  ): {
    selected: string;
    scores: Record<string, number>;
    reasoning: string;
  } {
    const normalizedWeights = this.normalizeWeights(criteria.length, weights);
    const scores: Record<string, number> = {};
    
    // Simple scoring (in production, use actual evaluation)
    options.forEach((option, index) => {
      let score = 0;
      criteria.forEach((_, cIndex) => {
        // Simple heuristic: earlier options and earlier criteria score higher
        score += (options.length - index) * normalizedWeights[cIndex] * 0.1;
      });
      scores[option] = Math.round(score * 100) / 100;
    });

    // Find best option
    let selected = options[0];
    let maxScore = 0;
    Object.entries(scores).forEach(([option, score]) => {
      if (score > maxScore) {
        maxScore = score;
        selected = option;
      }
    });

    return {
      selected,
      scores,
      reasoning: `Selected "${selected}" with score ${maxScore} based on ${criteria.length} criteria`,
    };
  }

  private normalizeWeights(count: number, weights: number[]): number[] {
    if (weights.length === count) {
      const sum = weights.reduce((a, b) => a + b, 0);
      return weights.map(w => w / sum);
    }
    
    // Equal weights
    return Array(count).fill(1 / count);
  }

  // ============= Hypothesis Testing =============

  generateHypotheses(observations: string[]): {
    hypotheses: string[];
    confidence: number[];
  } {
    const hypotheses: string[] = [];
    const confidence: number[] = [];

    observations.forEach((obs, index) => {
      // Generate simple hypothesis based on observation
      hypotheses.push(`Based on "${obs.substring(0, 50)}...", I hypothesize that...`);
      confidence.push(0.5 + (index * 0.1));
    });

    return { hypotheses, confidence };
  }

  // ============= Self-Correction =============

  analyzeMistake(
    attemptedAction: string,
    result: string,
    error?: string
  ): {
    rootCause: string;
    correction: string;
    prevention: string;
  } {
    const errorPatterns: Record<string, { cause: string; fix: string }> = {
      'not found': {
        cause: 'Resource or data was not available',
        fix: 'Verify resource exists before accessing',
      },
      'timeout': {
        cause: 'Operation took too long',
        fix: 'Implement timeout handling or optimize the operation',
      },
      'permission': {
        cause: 'Insufficient permissions',
        fix: 'Request necessary permissions or use alternative approach',
      },
      'syntax': {
        cause: 'Invalid syntax in code or command',
        fix: 'Validate syntax before execution',
      },
    };

    let rootCause = 'Unknown error occurred';
    let correction = 'Review the action and try an alternative approach';
    
    // Match error patterns
    const errorLower = (error || result).toLowerCase();
    for (const [pattern, info] of Object.entries(errorPatterns)) {
      if (errorLower.includes(pattern)) {
        rootCause = info.cause;
        correction = info.fix;
        break;
      }
    }

    return {
      rootCause,
      correction,
      prevention: `Before attempting "${attemptedAction.substring(0, 50)}...", ${correction.toLowerCase()}`,
    };
  }

  // ============= History Management =============

  addReasoningStep(step: ReasoningStep): void {
    this.reasoningHistory.push(step);
    
    // Trim history if needed
    if (this.reasoningHistory.length > this.maxHistory) {
      this.reasoningHistory.shift();
    }
  }

  getHistory(): ReasoningStep[] {
    return [...this.reasoningHistory];
  }

  getLastSteps(count: number = 5): ReasoningStep[] {
    return this.reasoningHistory.slice(-count);
  }

  clearHistory(): void {
    this.reasoningHistory = [];
  }

  // ============= Plan Optimization =============

  optimizePlan(plan: Plan): Plan {
    // Sort tasks by priority and dependencies
    const sortedTasks = this.topologicalSort(plan.tasks);
    
    // Identify parallelizable tasks
    const parallelGroups = this.identifyParallelGroups(sortedTasks);
    
    return {
      ...plan,
      tasks: sortedTasks,
      reasoning: `Optimized plan with ${parallelGroups.length} parallel execution groups`,
    };
  }

  private topologicalSort(tasks: Task[]): Task[] {
    // Simple topological sort based on dependencies
    const sorted: Task[] = [];
    const remaining = [...tasks];
    const completed = new Set<string>();

    while (remaining.length > 0) {
      const ready = remaining.filter(task => 
        task.dependencies.every(dep => completed.has(dep))
      );

      if (ready.length === 0) {
        // Circular dependency - just add remaining tasks
        sorted.push(...remaining);
        break;
      }

      ready.forEach(task => {
        sorted.push(task);
        completed.add(task.id);
        const index = remaining.indexOf(task);
        remaining.splice(index, 1);
      });
    }

    return sorted;
  }

  private identifyParallelGroups(tasks: Task[]): Task[][] {
    const groups: Task[][] = [];
    let currentGroup: Task[] = [];
    const completed = new Set<string>();

    tasks.forEach(task => {
      const depsCompleted = task.dependencies.every(dep => completed.has(dep));
      
      if (depsCompleted && currentGroup.length < 3) {
        currentGroup.push(task);
      } else {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [task];
      }
      
      completed.add(task.id);
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }
}

export default ReasoningEngine;
