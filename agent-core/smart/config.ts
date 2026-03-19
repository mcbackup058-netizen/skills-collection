/**
 * Smart Configuration System
 * Manages persistent API key and settings
 * One-time setup, then just prompt and go!
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// ============= Configuration Types =============

export interface SmartConfig {
  apiKey: string;
  model?: string;
  defaultServer?: string;
  preferences?: {
    verbose?: boolean;
    autoSave?: boolean;
    maxTokens?: number;
    temperature?: number;
  };
  servers?: Record<string, {
    host: string;
    port: number;
    username: string;
    password?: string;
    privateKey?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

// ============= Configuration Manager =============

const CONFIG_DIR = path.join(os.homedir(), '.stepflash');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export class ConfigManager {
  private config: SmartConfig | null = null;

  /**
   * Initialize configuration
   * Creates config directory if not exists
   */
  async init(): Promise<void> {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    
    if (fs.existsSync(CONFIG_FILE)) {
      this.config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    }
  }

  /**
   * Check if API key is configured
   */
  hasApiKey(): boolean {
    return !!this.config?.apiKey;
  }

  /**
   * Get current configuration
   */
  getConfig(): SmartConfig | null {
    return this.config;
  }

  /**
   * Get API key
   */
  getApiKey(): string | null {
    return this.config?.apiKey || null;
  }

  /**
   * Set API key (and save)
   */
  async setApiKey(apiKey: string): Promise<void> {
    if (!this.config) {
      this.config = {
        apiKey,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      this.config.apiKey = apiKey;
      this.config.updatedAt = new Date().toISOString();
    }
    
    this.save();
  }

  /**
   * Update configuration
   */
  async updateConfig(updates: Partial<SmartConfig>): Promise<void> {
    if (!this.config) {
      this.config = {
        apiKey: '',
        ...updates,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      this.config = {
        ...this.config,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
    
    this.save();
  }

  /**
   * Add or update server
   */
  async addServer(name: string, config: {
    host: string;
    port?: number;
    username: string;
    password?: string;
    privateKey?: string;
  }): Promise<void> {
    if (!this.config) {
      this.config = { apiKey: '' };
    }
    
    if (!this.config.servers) {
      this.config.servers = {};
    }
    
    this.config.servers[name] = {
      port: 22,
      ...config,
    };
    this.config.updatedAt = new Date().toISOString();
    
    this.save();
  }

  /**
   * Get server configuration
   */
  getServer(name: string = 'default'): SmartConfig['servers'] extends Record<string, infer T> ? T : undefined {
    return this.config?.servers?.[name] as any;
  }

  /**
   * Save configuration to file
   */
  private save(): void {
    if (this.config) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
    }
  }

  /**
   * Clear all configuration
   */
  clear(): void {
    this.config = null;
    if (fs.existsSync(CONFIG_FILE)) {
      fs.unlinkSync(CONFIG_FILE);
    }
  }

  /**
   * Get config file path
   */
  getConfigPath(): string {
    return CONFIG_FILE;
  }
}

// ============= Singleton Instance =============

export const configManager = new ConfigManager();

// ============= Quick Functions =============

/**
 * Check if setup is complete
 */
export async function isSetupComplete(): Promise<boolean> {
  await configManager.init();
  return configManager.hasApiKey();
}

/**
 * Get stored API key
 */
export async function getStoredApiKey(): Promise<string | null> {
  await configManager.init();
  return configManager.getApiKey();
}

/**
 * Save API key for future use
 */
export async function saveApiKey(apiKey: string): Promise<void> {
  await configManager.init();
  await configManager.setApiKey(apiKey);
}

export default ConfigManager;
