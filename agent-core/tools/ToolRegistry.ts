/**
 * Tool Registry for Step Flash Agent
 * Manages all available tools and their execution
 * Last Updated: March 2026
 */

import { Tool, ToolExecutionResult, JSONSchema } from '../types';

export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();
  private categories: Map<string, Set<string>> = new Map();

  register(tool: Tool): void {
    this.tools.set(tool.name, tool);
    
    // Add to category
    const category = tool.category || 'general';
    if (!this.categories.has(category)) {
      this.categories.set(category, new Set());
    }
    this.categories.get(category)!.add(tool.name);
  }

  unregister(name: string): boolean {
    const tool = this.tools.get(name);
    if (tool) {
      this.tools.delete(name);
      const category = tool.category || 'general';
      this.categories.get(category)?.delete(name);
      return true;
    }
    return false;
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }

  list(): Tool[] {
    return Array.from(this.tools.values());
  }

  listByCategory(category: string): Tool[] {
    const names = this.categories.get(category);
    if (!names) return [];
    return Array.from(names).map(name => this.tools.get(name)!).filter(Boolean);
  }

  getCategories(): string[] {
    return Array.from(this.categories.keys());
  }

  async execute(name: string, args: Record<string, any>): Promise<ToolExecutionResult> {
    const tool = this.tools.get(name);
    
    if (!tool) {
      return {
        success: false,
        output: null,
        error: `Tool not found: ${name}`,
      };
    }

    try {
      // Validate arguments
      const validation = this.validateArguments(tool.parameters, args);
      if (!validation.valid) {
        return {
          success: false,
          output: null,
          error: `Invalid arguments: ${validation.errors.join(', ')}`,
        };
      }

      // Execute the tool
      const result = await tool.execute(args);
      return result;
    } catch (error) {
      return {
        success: false,
        output: null,
        error: error.message,
      };
    }
  }

  private validateArguments(
    schema: JSONSchema,
    args: Record<string, any>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in args)) {
          errors.push(`Missing required field: ${field}`);
        }
      }
    }

    // Check types
    if (schema.properties) {
      for (const [key, value] of Object.entries(args)) {
        const propSchema = schema.properties[key];
        if (propSchema) {
          const typeError = this.checkType(key, value, propSchema);
          if (typeError) errors.push(typeError);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private checkType(key: string, value: any, schema: JSONSchema): string | null {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    
    if (schema.type && actualType !== schema.type) {
      return `${key} should be ${schema.type}, got ${actualType}`;
    }

    if (schema.enum && !schema.enum.includes(value)) {
      return `${key} must be one of: ${schema.enum.join(', ')}`;
    }

    return null;
  }

  getToolDescriptions(): string {
    const descriptions: string[] = [];

    this.tools.forEach((tool, name) => {
      const params = this.formatParameters(tool.parameters);
      descriptions.push(
        `### ${name}\n${tool.description}\n\nParameters:\n${params}\n`
      );
    });

    return descriptions.join('\n');
  }

  private formatParameters(schema: JSONSchema, indent: number = 0): string {
    if (!schema.properties) {
      return schema.type || 'any';
    }

    const lines: string[] = [];
    const prefix = '  '.repeat(indent);

    for (const [name, prop] of Object.entries(schema.properties)) {
      const required = schema.required?.includes(name) ? ' (required)' : '';
      const desc = prop.description ? ` - ${prop.description}` : '';
      lines.push(`${prefix}- ${name}${required}: ${prop.type}${desc}`);
    }

    return lines.join('\n');
  }

  getOpenAIFunctions(): any[] {
    return this.list().map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }));
  }
}

export default ToolRegistry;
