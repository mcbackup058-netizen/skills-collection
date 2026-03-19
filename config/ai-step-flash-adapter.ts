/**
 * AI Step Flash 3.5 Adapter
 * Provides z-ai-web-dev-sdk compatible interface for AI Step Flash 3.5 via OpenRouter
 * Last Updated: March 2026
 * 
 * API Key: sk-or-v1-... (OpenRouter format)
 */

import { AIStepFlashConfig, ModelAliases, AIStepFlashModel } from './ai-step-flash.config';

// Types
interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string | ContentPart[];
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

interface ContentPart {
  type: 'text' | 'image_url' | 'video_url' | 'file_url';
  text?: string;
  image_url?: { url: string; detail?: 'low' | 'high' | 'auto' };
  video_url?: { url: string };
  file_url?: { url: string };
}

interface ChatCompletionOptions {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  functions?: FunctionDefinition[];
  function_call?: 'auto' | 'none' | { name: string };
  response_format?: { type: string; json_schema?: any };
  thinking?: { type: 'disabled' | 'enabled' | 'extended'; budget_tokens?: number };
}

interface FunctionDefinition {
  name: string;
  description: string;
  parameters: any;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
      function_call?: { name: string; arguments: string };
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ImageGenerationOptions {
  prompt: string;
  size?: '1024x1024' | '768x1344' | '864x1152' | '1344x768' | '1152x864' | '1440x720' | '720x1440';
  quality?: 'standard' | 'hd';
  n?: number;
  style?: string;
  negative_prompt?: string;
  seed?: number;
}

interface ImageGenerationResponse {
  created: number;
  data: Array<{
    base64: string;
    revised_prompt?: string;
  }>;
}

interface ASROptions {
  file_base64: string;
  language?: string;
  timestamps?: boolean;
  diarization?: boolean;
  emotion_detection?: boolean;
  vocabulary?: string[];
}

interface ASRResponse {
  text: string;
  detected_language: string;
  duration: number;
  words?: Array<{ word: string; start: number; end: number }>;
  segments?: Array<{
    speaker: string;
    text: string;
    start_time: number;
    end_time: number;
    confidence: number;
  }>;
  speaker_count?: number;
  emotions?: any[];
}

interface TTSOptions {
  input: string;
  voice?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
  emotion?: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm' | 'angry';
  response_format?: 'wav' | 'mp3' | 'ogg' | 'flac' | 'aac';
  input_type?: 'text' | 'ssml';
  long_form?: boolean;
  stream?: boolean;
}

/**
 * AI Step Flash 3.5 Client
 * Compatible with z-ai-web-dev-sdk interface
 */
export class AIStepFlashClient {
  private config: typeof AIStepFlashConfig;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.config = AIStepFlashConfig;
    this.apiKey = apiKey || AIStepFlashConfig.api.apiKey;
  }

  /**
   * Create a new instance (compatible with ZAI.create())
   */
  static async create(apiKey?: string): Promise<AIStepFlashClient> {
    return new AIStepFlashClient(apiKey);
  }

  /**
   * Make API request to OpenRouter
   */
  private async makeRequest(
    endpoint: string,
    body: any,
    method: string = 'POST'
  ): Promise<any> {
    const response = await fetch(`${this.config.api.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
      body: method === 'POST' ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Chat Completions API
   */
  chat = {
    completions: {
      create: async (options: ChatCompletionOptions): Promise<ChatCompletionResponse> => {
        const model = options.model 
          ? (ModelAliases[options.model as AIStepFlashModel] || options.model)
          : this.config.api.defaultModel;

        const body: any = {
          model,
          messages: options.messages,
          temperature: options.temperature ?? this.config.defaults.temperature,
          max_tokens: options.max_tokens ?? this.config.defaults.max_tokens,
          top_p: options.top_p ?? this.config.defaults.top_p,
          stream: options.stream ?? this.config.defaults.stream,
        };

        if (options.functions) {
          body.functions = options.functions;
          if (options.function_call) {
            body.function_call = options.function_call;
          }
        }

        if (options.response_format) {
          body.response_format = options.response_format;
        }

        // Extended thinking support (Step AI specific)
        if (options.thinking && options.thinking.type !== 'disabled') {
          body.thinking = options.thinking;
        }

        return this.makeRequest('/chat/completions', body);
      },

      createVision: async (options: ChatCompletionOptions): Promise<ChatCompletionResponse> => {
        // Vision is handled the same way - just include image content
        return this.chat.completions.create(options);
      },

      stream: async function* (options: ChatCompletionOptions): AsyncGenerator<any> {
        // Streaming implementation
        const model = options.model 
          ? (ModelAliases[options.model as AIStepFlashModel] || options.model)
          : AIStepFlashConfig.api.defaultModel;

        const response = await fetch(`${AIStepFlashConfig.api.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            ...AIStepFlashConfig.headers,
          },
          body: JSON.stringify({
            ...options,
            model,
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
                yield JSON.parse(data);
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }.bind(this),
    },
  };

  /**
   * Images API
   */
  images = {
    generations: {
      create: async (options: ImageGenerationOptions): Promise<ImageGenerationResponse> => {
        // Use OpenRouter's image generation endpoint
        // Note: This requires a model that supports image generation
        const body = {
          model: 'step-ai/step-flash-3.5', // or a dedicated image model
          prompt: options.prompt,
          n: options.n || 1,
          size: options.size || '1024x1024',
          quality: options.quality || 'standard',
        };

        const response = await this.makeRequest('/images/generations', body);
        return response;
      },
    },

    edits: {
      create: async (options: any): Promise<ImageGenerationResponse> => {
        return this.makeRequest('/images/edits', options);
      },
    },

    upscale: {
      create: async (options: any): Promise<ImageGenerationResponse> => {
        return this.makeRequest('/images/upscale', options);
      },
    },

    style: {
      transfer: async (options: any): Promise<ImageGenerationResponse> => {
        return this.makeRequest('/images/style-transfer', options);
      },
    },
  };

  /**
   * Audio API (ASR & TTS)
   */
  audio = {
    asr: {
      create: async (options: ASROptions): Promise<ASRResponse> => {
        // ASR via chat completion with audio input
        const body = {
          model: 'step-ai/step-flash-3.5',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: 'Transcribe this audio file accurately.' },
              { type: 'file_url', file_url: { url: `data:audio/wav;base64,${options.file_base64}` } },
            ],
          }],
        };

        const response = await this.makeRequest('/chat/completions', body);
        const content = response.choices[0]?.message?.content || '';

        return {
          text: content,
          detected_language: options.language || 'auto',
          duration: 0,
        };
      },

      getStreamUrl: async (): Promise<string> => {
        // Return WebSocket URL for streaming ASR
        return 'wss://openrouter.ai/api/v1/audio/asr/stream';
      },
    },

    tts: {
      create: async (options: TTSOptions): Promise<Response> => {
        // TTS endpoint
        const body = {
          model: 'step-ai/step-flash-3.5-tts',
          input: options.input,
          voice: options.voice || 'nova',
          speed: options.speed || 1.0,
          pitch: options.pitch || 0,
          response_format: options.response_format || 'wav',
          emotion: options.emotion || 'neutral',
          input_type: options.input_type || 'text',
        };

        const response = await fetch(`${this.config.api.baseUrl}/audio/tts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            ...this.config.headers,
          },
          body: JSON.stringify(body),
        });

        return response;
      },

      getStreamUrl: async (options?: any): Promise<string> => {
        return 'wss://openrouter.ai/api/v1/audio/tts/stream';
      },
    },
  };

  /**
   * Functions API
   */
  functions = {
    invoke: async (name: string, args: any): Promise<any> => {
      if (name === 'web_search') {
        // Web search via OpenRouter functions
        const body = {
          model: this.config.api.defaultModel,
          messages: [{
            role: 'user',
            content: `Search the web for: ${args.query}`,
          }],
          functions: [{
            name: 'web_search',
            description: 'Search the web for information',
            parameters: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                num: { type: 'number' },
              },
            },
          }],
          function_call: { name: 'web_search' },
        };

        const response = await this.makeRequest('/chat/completions', body);
        const functionCall = response.choices[0]?.message?.function_call;
        
        if (functionCall) {
          return JSON.parse(functionCall.arguments);
        }
        
        return [];
      }

      throw new Error(`Unknown function: ${name}`);
    },
  };
}

// Export factory function compatible with z-ai-web-dev-sdk
export default AIStepFlashClient;

// Named export for compatibility
export const ZAI = AIStepFlashClient;

// Usage example:
// import AIStepFlashClient from './config/ai-step-flash-adapter';
// 
// const client = await AIStepFlashClient.create('sk-or-v1-your-api-key');
// 
// const completion = await client.chat.completions.create({
//   messages: [
//     { role: 'system', content: 'You are a helpful assistant.' },
//     { role: 'user', content: 'Hello!' },
//   ],
// });
// 
// console.log(completion.choices[0].message.content);
