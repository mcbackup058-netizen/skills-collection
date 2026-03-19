/**
 * Helper Utilities
 * Common utility functions for the agent
 * Last Updated: March 2026
 */

// ============= ID Generation =============

export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ============= String Utilities =============

export function truncate(str: string, maxLength: number = 100): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractCodeBlocks(text: string): Array<{ language: string; code: string }> {
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  const blocks: Array<{ language: string; code: string }> = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
    });
  }

  return blocks;
}

export function extractJSON(text: string): any[] {
  const results: any[] = [];
  const jsonRegex = /\{[\s\S]*?\}|\[[\s\S]*?\]/g;
  let match;

  while ((match = jsonRegex.exec(text)) !== null) {
    try {
      results.push(JSON.parse(match[0]));
    } catch {
      // Skip invalid JSON
    }
  }

  return results;
}

// ============= Date/Time Utilities =============

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  if (seconds > 0) {
    return `${seconds}s`;
  }
  return `${ms}ms`;
}

export function formatTimestamp(date: Date = new Date()): string {
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

// ============= Validation =============

export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function isValidEmail(str: string): boolean {
  return /^[\w.-]+@[\w.-]+\.\w+$/.test(str);
}

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

// ============= Async Utilities =============

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await sleep(delay * attempt);
      }
    }
  }

  throw lastError;
}

export async function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), ms)
    ),
  ]);
}

// ============= Logging =============

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export function createLogger(name: string, level: LogLevel = 'info') {
  const levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  const shouldLog = (lvl: LogLevel) => levels[lvl] >= levels[level];

  const format = (lvl: LogLevel, message: string): string => {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${lvl.toUpperCase()}] [${name}] ${message}`;
  };

  return {
    debug: (msg: string, ...args: any[]) => 
      shouldLog('debug') && console.debug(format('debug', msg), ...args),
    info: (msg: string, ...args: any[]) => 
      shouldLog('info') && console.info(format('info', msg), ...args),
    warn: (msg: string, ...args: any[]) => 
      shouldLog('warn') && console.warn(format('warn', msg), ...args),
    error: (msg: string, ...args: any[]) => 
      shouldLog('error') && console.error(format('error', msg), ...args),
  };
}

// ============= Export Utils Object =============

export const utils = {
  // ID
  generateId,
  generateUUID,
  // String
  truncate,
  capitalize,
  slugify,
  extractCodeBlocks,
  extractJSON,
  // Date/Time
  formatDuration,
  formatTimestamp,
  // Validation
  isValidUrl,
  isValidEmail,
  isValidJSON,
  // Async
  sleep,
  retry,
  timeout,
  // Logging
  createLogger,
};

export default utils;
