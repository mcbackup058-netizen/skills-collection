/**
 * AI Step Flash 3.5 Configuration
 * Compatible with OpenRouter API
 * Last Updated: March 2026
 */

export const AIStepFlashConfig = {
  // API Configuration
  api: {
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKey: process.env.AI_STEP_FLASH_API_KEY || '',
    defaultModel: 'step-ai/step-flash-3.5',
    // Alternative models available through OpenRouter
    availableModels: [
      'step-ai/step-flash-3.5',
      'step-ai/step-flash-3',
      'step-ai/step-1x',
    ],
  },

  // Model Capabilities
  capabilities: {
    chat: true,
    vision: true,
    functionCalling: true,
    streaming: true,
    jsonMode: true,
    maxContextTokens: 128000,
    maxOutputTokens: 8192,
  },

  // Default Parameters
  defaults: {
    temperature: 0.7,
    max_tokens: 4096,
    top_p: 1,
    stream: false,
  },

  // Rate Limits
  rateLimits: {
    requestsPerMinute: 60,
    tokensPerMinute: 100000,
  },

  // Headers for OpenRouter
  headers: {
    'HTTP-Referer': 'https://github.com/mcbackup058-netizen/skills-collection',
    'X-Title': 'Skills Collection - AI Step Flash 3.5',
  },
};

// Model ID aliases for easier use
export const ModelAliases = {
  'flash-3.5': 'step-ai/step-flash-3.5',
  'flash-3': 'step-ai/step-flash-3',
  'step-1x': 'step-ai/step-1x',
  default: 'step-ai/step-flash-3.5',
};

export type AIStepFlashModel = keyof typeof ModelAliases;
