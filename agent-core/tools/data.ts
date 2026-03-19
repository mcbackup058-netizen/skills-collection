/**
 * Data Analysis Tools for Step Flash Agent
 * Professional data processing and analysis capabilities
 * Last Updated: March 2026
 */

import { Tool, ToolExecutionResult } from '../types';

// ============= Data Processing Tools =============

export const csvParseTool: Tool = {
  name: 'csv_parse',
  description: 'Parse CSV data into structured JSON. Handles various delimiters and data types.',
  category: 'data',
  parameters: {
    type: 'object',
    properties: {
      data: {
        type: 'string',
        description: 'CSV data as string',
      },
      delimiter: {
        type: 'string',
        description: 'Column delimiter (default: comma)',
        default: ',',
      },
      hasHeader: {
        type: 'boolean',
        description: 'Whether first row is header',
        default: true,
      },
    },
    required: ['data'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const lines = args.data.trim().split('\n');
      const delimiter = args.delimiter || ',';
      const hasHeader = args.hasHeader !== false;
      
      const result: any[] = [];
      let headers: string[] = [];
      
      lines.forEach((line: string, index: number) => {
        const values = line.split(delimiter).map((v: string) => v.trim());
        
        if (index === 0 && hasHeader) {
          headers = values;
          return;
        }
        
        const row: Record<string, any> = {};
        values.forEach((value: string, i: number) => {
          const key = hasHeader ? headers[i] || `col_${i}` : `col_${i}`;
          // Auto-detect type
          if (!isNaN(Number(value))) {
            row[key] = Number(value);
          } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
            row[key] = value.toLowerCase() === 'true';
          } else {
            row[key] = value;
          }
        });
        
        result.push(row);
      });

      return {
        success: true,
        output: {
          data: result,
          rowCount: result.length,
          columns: hasHeader ? headers : Object.keys(result[0] || {}),
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const jsonQueryTool: Tool = {
  name: 'json_query',
  description: 'Query JSON data using JSONPath or simple filter expressions.',
  category: 'data',
  parameters: {
    type: 'object',
    properties: {
      data: {
        type: 'string',
        description: 'JSON data as string',
      },
      query: {
        type: 'string',
        description: 'Query expression (e.g., "$.users[*].name" or "age > 25")',
      },
    },
    required: ['data', 'query'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const data = JSON.parse(args.data);
      const query = args.query;
      
      // Simple query implementation
      let result: any;
      
      if (query.startsWith('$.')) {
        // JSONPath-like query
        const path = query.slice(2).split('.');
        result = data;
        
        for (const key of path) {
          if (key.includes('[*]')) {
            const arrayKey = key.replace('[*]', '');
            result = result[arrayKey] || result;
            if (Array.isArray(result)) {
              result = result.map(item => item);
            }
          } else if (key.includes('[')) {
            const match = key.match(/(\w+)\[(\d+)\]/);
            if (match) {
              result = result[match[1]][parseInt(match[2])];
            }
          } else {
            result = result[key];
          }
        }
      } else {
        // Filter expression
        const arrayData = Array.isArray(data) ? data : [data];
        const filtered = arrayData.filter(item => {
          try {
            // Simple expression evaluation
            const expr = query.replace(/(\w+)/g, (match) => {
              if (item.hasOwnProperty(match)) {
                return typeof item[match] === 'string' ? `"${item[match]}"` : item[match];
              }
              return match;
            });
            return eval(expr);
          } catch {
            return false;
          }
        });
        result = filtered;
      }

      return {
        success: true,
        output: {
          result,
          count: Array.isArray(result) ? result.length : 1,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const dataAggregateTool: Tool = {
  name: 'data_aggregate',
  description: 'Perform aggregation operations on data (sum, avg, count, min, max, group by).',
  category: 'data',
  parameters: {
    type: 'object',
    properties: {
      data: {
        type: 'string',
        description: 'JSON array data as string',
      },
      operation: {
        type: 'string',
        enum: ['sum', 'avg', 'count', 'min', 'max', 'group'],
        description: 'Aggregation operation',
      },
      field: {
        type: 'string',
        description: 'Field to aggregate on',
      },
      groupBy: {
        type: 'string',
        description: 'Field to group by (for group operation)',
      },
    },
    required: ['data', 'operation'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const data = JSON.parse(args.data);
      const { operation, field, groupBy } = args;
      
      if (!Array.isArray(data)) {
        return { success: false, output: null, error: 'Data must be an array' };
      }

      let result: any;

      switch (operation) {
        case 'sum':
          result = data.reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
          break;
        case 'avg':
          const values = data.map(item => Number(item[field]) || 0).filter(v => !isNaN(v));
          result = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
          break;
        case 'count':
          result = data.length;
          break;
        case 'min':
          result = Math.min(...data.map(item => Number(item[field]) || Infinity));
          break;
        case 'max':
          result = Math.max(...data.map(item => Number(item[field]) || -Infinity));
          break;
        case 'group':
          if (!groupBy) {
            return { success: false, output: null, error: 'groupBy field required for group operation' };
          }
          const groups: Record<string, any[]> = {};
          data.forEach(item => {
            const key = String(item[groupBy]);
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
          });
          result = Object.entries(groups).map(([key, items]) => ({
            group: key,
            count: items.length,
            items,
          }));
          break;
        default:
          return { success: false, output: null, error: 'Unknown operation' };
      }

      return {
        success: true,
        output: {
          operation,
          field,
          result,
          totalRecords: data.length,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const dataVisualizeTool: Tool = {
  name: 'data_visualize',
  description: 'Generate visualization specifications (chart configs) from data.',
  category: 'data',
  parameters: {
    type: 'object',
    properties: {
      data: {
        type: 'string',
        description: 'JSON data as string',
      },
      chartType: {
        type: 'string',
        enum: ['bar', 'line', 'pie', 'scatter', 'table'],
        description: 'Type of visualization',
      },
      xAxis: {
        type: 'string',
        description: 'Field for X axis',
      },
      yAxis: {
        type: 'string',
        description: 'Field for Y axis',
      },
      title: {
        type: 'string',
        description: 'Chart title',
      },
    },
    required: ['data', 'chartType'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const data = JSON.parse(args.data);
      const { chartType, xAxis, yAxis, title } = args;

      const chartConfig: any = {
        type: chartType,
        title: title || 'Data Visualization',
        data: Array.isArray(data) ? data : [data],
        options: {},
      };

      if (chartType === 'table') {
        chartConfig.columns = data.length > 0 ? Object.keys(data[0]) : [];
      } else {
        if (xAxis) chartConfig.options.xAxis = xAxis;
        if (yAxis) chartConfig.options.yAxis = yAxis;
      }

      // Generate ASCII preview for terminal
      let asciiPreview = '';
      if (chartType === 'bar' && Array.isArray(data) && xAxis && yAxis) {
        const maxVal = Math.max(...data.map((d: any) => Number(d[yAxis]) || 0));
        data.slice(0, 10).forEach((item: any) => {
          const val = Number(item[yAxis]) || 0;
          const barLen = Math.round((val / maxVal) * 30);
          const bar = '█'.repeat(barLen);
          asciiPreview += `${String(item[xAxis]).padEnd(15)} | ${bar} ${val}\n`;
        });
      }

      return {
        success: true,
        output: {
          chartConfig,
          asciiPreview,
          dataPoints: Array.isArray(data) ? data.length : 1,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const dataTransformTool: Tool = {
  name: 'data_transform',
  description: 'Transform data with mapping, filtering, and sorting operations.',
  category: 'data',
  parameters: {
    type: 'object',
    properties: {
      data: {
        type: 'string',
        description: 'JSON array data as string',
      },
      operations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['map', 'filter', 'sort', 'rename', 'select'] },
            field: { type: 'string' },
            value: { type: 'string' },
            expression: { type: 'string' },
          },
        },
        description: 'Array of transformation operations',
      },
    },
    required: ['data', 'operations'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      let data = JSON.parse(args.data);
      if (!Array.isArray(data)) data = [data];

      for (const op of args.operations) {
        switch (op.type) {
          case 'filter':
            data = data.filter((item: any) => {
              const val = item[op.field];
              if (op.expression === 'equals') return val === op.value;
              if (op.expression === 'contains') return String(val).includes(op.value);
              if (op.expression === 'gt') return Number(val) > Number(op.value);
              if (op.expression === 'lt') return Number(val) < Number(op.value);
              return true;
            });
            break;
          case 'sort':
            data.sort((a: any, b: any) => {
              const aVal = a[op.field];
              const bVal = b[op.field];
              if (typeof aVal === 'number' && typeof bVal === 'number') {
                return op.expression === 'desc' ? bVal - aVal : aVal - bVal;
              }
              return op.expression === 'desc' 
                ? String(bVal).localeCompare(String(aVal))
                : String(aVal).localeCompare(String(bVal));
            });
            break;
          case 'rename':
            data = data.map((item: any) => {
              const newItem = { ...item };
              newItem[op.value] = newItem[op.field];
              delete newItem[op.field];
              return newItem;
            });
            break;
          case 'select':
            data = data.map((item: any) => {
              const newItem: any = {};
              const fields = op.field.split(',');
              fields.forEach((f: string) => {
                const trimmed = f.trim();
                if (item.hasOwnProperty(trimmed)) {
                  newItem[trimmed] = item[trimmed];
                }
              });
              return newItem;
            });
            break;
        }
      }

      return {
        success: true,
        output: {
          data,
          count: data.length,
          operations: args.operations.map((o: any) => o.type),
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

// ============= Statistics Tools =============

export const statisticsTool: Tool = {
  name: 'statistics',
  description: 'Calculate statistical measures (mean, median, mode, std dev, variance).',
  category: 'data',
  parameters: {
    type: 'object',
    properties: {
      data: {
        type: 'string',
        description: 'JSON array of numbers or objects',
      },
      field: {
        type: 'string',
        description: 'Field name if data is array of objects',
      },
    },
    required: ['data'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      let data = JSON.parse(args.data);
      
      if (args.field && Array.isArray(data)) {
        data = data.map((item: any) => Number(item[args.field]));
      }
      
      if (!Array.isArray(data) || data.some(d => typeof d !== 'number')) {
        return { success: false, output: null, error: 'Data must be array of numbers' };
      }

      const sorted = [...data].sort((a, b) => a - b);
      const n = data.length;
      const sum = data.reduce((a, b) => a + b, 0);
      const mean = sum / n;
      
      // Median
      const median = n % 2 === 0
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[Math.floor(n / 2)];
      
      // Mode
      const counts: Record<number, number> = {};
      data.forEach(v => counts[v] = (counts[v] || 0) + 1);
      const maxCount = Math.max(...Object.values(counts));
      const mode = Object.keys(counts).filter(k => counts[Number(k)] === maxCount).map(Number);
      
      // Variance & Std Dev
      const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
      const stdDev = Math.sqrt(variance);
      
      // Quartiles
      const q1 = sorted[Math.floor(n * 0.25)];
      const q3 = sorted[Math.floor(n * 0.75)];
      const iqr = q3 - q1;

      return {
        success: true,
        output: {
          count: n,
          sum: Math.round(sum * 1000) / 1000,
          mean: Math.round(mean * 1000) / 1000,
          median: Math.round(median * 1000) / 1000,
          mode: mode.length === n ? 'No mode' : mode,
          min: sorted[0],
          max: sorted[n - 1],
          range: sorted[n - 1] - sorted[0],
          variance: Math.round(variance * 1000) / 1000,
          stdDev: Math.round(stdDev * 1000) / 1000,
          q1: Math.round(q1 * 1000) / 1000,
          q3: Math.round(q3 * 1000) / 1000,
          iqr: Math.round(iqr * 1000) / 1000,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

// Export all data tools
export const dataTools: Tool[] = [
  csvParseTool,
  jsonQueryTool,
  dataAggregateTool,
  dataVisualizeTool,
  dataTransformTool,
  statisticsTool,
];

export default dataTools;
