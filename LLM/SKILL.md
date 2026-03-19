---
name: LLM
description: Implement large language model (LLM) chat completions using the z-ai-web-dev-sdk. Use this skill when the user needs to build conversational AI applications, chatbots, AI assistants, or any text generation features. Supports multi-turn conversations, system prompts, context management, function calling, structured outputs, and thinking/reasoning modes.
license: MIT
version: 3.0.0
last_updated: 2026-03
---

# LLM (Large Language Model) Skill

This skill guides the implementation of chat completions functionality using the z-ai-web-dev-sdk package, enabling powerful conversational AI and text generation capabilities.

## Skills Path

**Skill Location**: `{project_path}/skills/LLM`

**Reference Scripts**: Example test scripts are available in the `{Skill Location}/scripts/` directory for quick testing and reference. See `{Skill Location}/scripts/chat.ts` for a working example.

## Overview

The LLM skill allows you to build applications that leverage large language models for natural language understanding and generation, including chatbots, AI assistants, content generation, and more.

**IMPORTANT**: z-ai-web-dev-sdk MUST be used in backend code only. Never use it in client-side code.

## 🆕 What's New in 2026

### Latest Features (March 2026)
- **Extended Thinking Mode**: Enhanced chain-of-thought reasoning with step-by-step explanations
- **Function Calling**: Native support for tool/function integration
- **Structured Outputs**: JSON schema validation and guaranteed output formats
- **Vision Integration**: Seamless image understanding in chat
- **Code Interpreter**: Execute code within conversations
- **Streaming Responses**: Real-time response streaming with SSE
- **Multi-modal Input**: Text, images, and documents in same conversation
- **Context Caching**: Efficient handling of long contexts

### Model Capabilities (2026)
| Feature | GLM-4.5 | GLM-4.5-Turbo | GLM-5 |
|---------|---------|---------------|-------|
| Context Window | 128K | 256K | 1M |
| Thinking Mode | ✓ | ✓ | ✓ Enhanced |
| Function Calling | ✓ | ✓ | ✓ |
| Vision | ✓ | ✓ | ✓ |
| Code Execution | ✓ | ✓ | ✓ |
| JSON Mode | ✓ | ✓ | ✓ |
| Speed | Fast | Fastest | Moderate |
| Reasoning | Good | Good | Best |

## Prerequisites

The z-ai-web-dev-sdk package is already installed. Import it as shown in the examples below.

## CLI Usage (For Simple Tasks)

### Basic Chat

```bash
# Simple question
z-ai chat --prompt "What is the capital of France?"

# Save response to file
z-ai chat -p "Explain quantum computing" -o response.json

# Stream the response
z-ai chat -p "Write a short poem" --stream
```

### With Extended Thinking (NEW 2026)

```bash
# Enable extended thinking for complex reasoning
z-ai chat \
  -p "Solve this math problem step by step: What is 15% of 847?" \
  --thinking extended \
  -o solution.json

# Reasoning mode for complex decisions
z-ai chat \
  -p "Analyze the pros and cons of remote work" \
  --thinking chain-of-thought \
  --output analysis.json
```

### With Function Calling (NEW 2026)

```bash
# Use with function definitions
z-ai chat \
  -p "What's the weather in Tokyo?" \
  --functions weather_functions.json \
  -o response.json
```

### CLI Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--prompt, -p` | User message content | Required |
| `--system, -s` | System prompt | Default assistant |
| `--model, -m` | Model selection | auto |
| `--thinking, -t` | Thinking mode: disabled/enabled/extended | disabled |
| `--functions` | Function definitions file | - |
| `--json-mode` | Force JSON output | false |
| `--stream` | Stream response | false |
| `--output, -o` | Output file path | - |
| `--max-tokens` | Maximum output tokens | 4096 |
| `--temperature` | Sampling temperature (0-2) | 0.7 |

## Basic Chat Completions

### Simple Question and Answer

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function askQuestion(question) {
  const zai = await ZAI.create();

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: question
      }
    ]
  });

  return completion.choices[0]?.message?.content;
}

// Usage
const answer = await askQuestion('What is the capital of France?');
console.log('Answer:', answer);
```

### Extended Thinking Mode (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function thinkAndAnswer(question) {
  const zai = await ZAI.create();

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a careful analytical assistant.'
      },
      {
        role: 'user',
        content: question
      }
    ],
    thinking: { 
      type: 'extended', // 'disabled', 'enabled', or 'extended'
      budget_tokens: 2000 // Budget for thinking tokens
    }
  });

  return {
    answer: completion.choices[0]?.message?.content,
    thinking: completion.choices[0]?.message?.thinking, // Reasoning process
    thinking_tokens: completion.usage?.thinking_tokens
  };
}

// Usage
const result = await thinkAndAnswer(
  'If a train leaves Paris at 9 AM going 120 km/h, and another leaves Lyon at 10 AM going 100 km/h, when will they meet?'
);

console.log('Thinking:', result.thinking);
console.log('Answer:', result.answer);
```

### Streaming Responses (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function streamingChat(prompt, onChunk) {
  const zai = await ZAI.create();

  const stream = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt }
    ],
    stream: true
  });

  let fullResponse = '';

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    fullResponse += content;
    
    if (onChunk) {
      onChunk(content, fullResponse);
    }
  }

  return fullResponse;
}

// Usage
const response = await streamingChat(
  'Write a short story about a robot',
  (chunk, full) => {
    process.stdout.write(chunk); // Real-time output
  }
);
```

## Function Calling (NEW 2026)

### Define Functions

```javascript
import ZAI from 'z-ai-web-dev-sdk';

const weatherFunction = {
  name: 'get_weather',
  description: 'Get current weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'City name or coordinates'
      },
      unit: {
        type: 'string',
        enum: ['celsius', 'fahrenheit'],
        description: 'Temperature unit'
      }
    },
    required: ['location']
  }
};

async function chatWithFunctions(userMessage) {
  const zai = await ZAI.create();

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant with access to weather data.'
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    functions: [weatherFunction],
    function_call: 'auto' // Let model decide when to call
  });

  const message = completion.choices[0]?.message;

  // Check if function was called
  if (message?.function_call) {
    const functionName = message.function_call.name;
    const args = JSON.parse(message.function_call.arguments);
    
    console.log(`Function called: ${functionName}`);
    console.log('Arguments:', args);
    
    // Execute function and continue conversation
    const functionResult = await getWeather(args.location, args.unit);
    
    // Send function result back
    const followUp = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userMessage },
        message,
        {
          role: 'function',
          name: functionName,
          content: JSON.stringify(functionResult)
        }
      ]
    });
    
    return followUp.choices[0]?.message?.content;
  }

  return message?.content;
}

// Mock function implementation
async function getWeather(location, unit = 'celsius') {
  // In production, call actual weather API
  return {
    location,
    temperature: 22,
    unit,
    conditions: 'Partly cloudy',
    humidity: 65
  };
}

// Usage
const response = await chatWithFunctions("What's the weather like in Tokyo?");
console.log(response);
```

### Multiple Functions

```javascript
import ZAI from 'z-ai-web-dev-sdk';

const functions = [
  {
    name: 'search_web',
    description: 'Search the web for current information',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' }
      },
      required: ['query']
    }
  },
  {
    name: 'calculate',
    description: 'Perform mathematical calculations',
    parameters: {
      type: 'object',
      properties: {
        expression: { type: 'string', description: 'Math expression to evaluate' }
      },
      required: ['expression']
    }
  },
  {
    name: 'get_current_time',
    description: 'Get current time in a timezone',
    parameters: {
      type: 'object',
      properties: {
        timezone: { 
          type: 'string', 
          description: 'Timezone (e.g., "America/New_York")' 
        }
      }
    }
  }
];
```

## Structured Outputs (NEW 2026)

### JSON Schema Enforcement

```javascript
import ZAI from 'z-ai-web-dev-sdk';

const responseSchema = {
  type: 'object',
  properties: {
    sentiment: {
      type: 'string',
      enum: ['positive', 'negative', 'neutral']
    },
    confidence: {
      type: 'number',
      minimum: 0,
      maximum: 1
    },
    topics: {
      type: 'array',
      items: { type: 'string' }
    },
    summary: { type: 'string' }
  },
  required: ['sentiment', 'confidence', 'topics', 'summary']
};

async function analyzeWithSchema(text) {
  const zai = await ZAI.create();

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a text analysis assistant. Analyze text and return structured JSON.'
      },
      {
        role: 'user',
        content: `Analyze this text: "${text}"`
      }
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'text_analysis',
        schema: responseSchema
      }
    }
  });

  // Guaranteed to match schema
  return JSON.parse(completion.choices[0]?.message?.content);
}

// Usage
const analysis = await analyzeWithSchema(
  'The new product launch was incredibly successful! Sales exceeded expectations.'
);
console.log(analysis);
// Output is guaranteed to match the schema:
// { sentiment: 'positive', confidence: 0.95, topics: ['product', 'sales'], summary: '...' }
```

### Type-Safe Response

```javascript
import ZAI from 'z-ai-web-dev-sdk';

interface CodeReview {
  rating: number;
  issues: Array<{
    line: number;
    severity: 'error' | 'warning' | 'info';
    message: string;
    suggestion: string;
  }>;
  overall_feedback: string;
}

async function reviewCode(code: string): Promise<CodeReview> {
  const zai = await ZAI.create();

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a code reviewer. Analyze code and return structured feedback.'
      },
      {
        role: 'user',
        content: `Review this code:\n\`\`\`javascript\n${code}\n\`\`\``
      }
    ],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(completion.choices[0]?.message?.content);
}
```

## Multi-turn Conversations

### Conversation Manager with Context

```javascript
import ZAI from 'z-ai-web-dev-sdk';

class SmartConversation {
  constructor(options = {}) {
    this.maxTokens = options.maxTokens || 128000;
    this.systemPrompt = options.systemPrompt || 'You are a helpful assistant.';
    this.messages = [];
    this.zai = null;
  }

  async initialize() {
    this.zai = await ZAI.create();
    this.messages = [
      { role: 'system', content: this.systemPrompt }
    ];
  }

  async chat(userMessage, options = {}) {
    // Add user message
    this.messages.push({
      role: 'user',
      content: userMessage
    });

    // Auto-trim if context too long
    this.trimContextIfNeeded();

    const completion = await this.zai.chat.completions.create({
      messages: this.messages,
      thinking: options.thinking ? { type: 'enabled' } : undefined,
      functions: options.functions,
      stream: options.stream || false
    });

    const response = completion.choices[0]?.message;

    // Add assistant response
    this.messages.push({
      role: 'assistant',
      content: response?.content || ''
    });

    return {
      content: response?.content,
      functionCall: response?.function_call,
      usage: completion.usage
    };
  }

  trimContextIfNeeded() {
    // Estimate tokens (rough: 4 chars per token)
    const estimateTokens = (msgs) => 
      msgs.reduce((sum, m) => sum + Math.ceil(m.content.length / 4), 0);

    while (estimateTokens(this.messages) > this.maxTokens && this.messages.length > 3) {
      // Remove oldest messages but keep system prompt
      this.messages = [
        this.messages[0],
        ...this.messages.slice(3)
      ];
    }
  }

  getHistory() {
    return this.messages;
  }

  clear() {
    this.messages = [
      { role: 'system', content: this.systemPrompt }
    ];
  }
}

// Usage
const chat = new SmartConversation({
  systemPrompt: 'You are a helpful coding assistant.',
  maxTokens: 100000
});

await chat.initialize();

const response1 = await chat.chat('What is TypeScript?');
const response2 = await chat.chat('How is it different from JavaScript?');
```

## Advanced Use Cases

### Code Interpreter Integration

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function chatWithCodeExecution(prompt) {
  const zai = await ZAI.create();

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You can execute Python code to solve problems.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    tools: [{
      type: 'code_interpreter'
    }]
  });

  return {
    content: completion.choices[0]?.message?.content,
    codeExecutions: completion.choices[0]?.message?.tool_calls?.filter(
      call => call.type === 'code_interpreter'
    )
  };
}

// Usage
const result = await chatWithCodeExecution(
  'Calculate the first 100 Fibonacci numbers and plot them'
);
```

### Multi-modal Input

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function chatWithImage(text, imagePath) {
  const zai = await ZAI.create();

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }
    ]
  });

  return completion.choices[0]?.message?.content;
}

// Usage
const response = await chatWithImage(
  'What do you see in this image? Describe it in detail.',
  './photo.jpg'
);
```

## Best Practices (2026)

### 1. Prompt Engineering

```javascript
const promptTemplates = {
  // Chain-of-thought prompting
  analyze: `Analyze this step by step:
1. Identify the main components
2. Consider relationships
3. Evaluate implications
4. Draw conclusions

Input: {input}`,

  // Few-shot prompting
  classify: `Classify the sentiment. Examples:
"Great product!" → positive
"Terrible experience" → negative
"It was okay" → neutral

Now classify: "{input}"`,

  // Structured output
  extract: `Extract information as JSON:
{
  "entities": [],
  "dates": [],
  "locations": [],
  "sentiment": ""
}

Text: {input}`
};
```

### 2. Error Handling with Retry

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function robustCompletion(messages, options = {}) {
  const maxRetries = options.retries || 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const zai = await ZAI.create();

      const completion = await zai.chat.completions.create({
        messages,
        ...options
      });

      const content = completion.choices[0]?.message?.content;

      if (!content?.trim()) {
        throw new Error('Empty response');
      }

      return {
        success: true,
        content,
        usage: completion.usage,
        attempts: attempt
      };
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  return {
    success: false,
    error: lastError?.message,
    attempts: maxRetries
  };
}
```

## Common Use Cases

| Use Case | Recommended Model | Features |
|----------|------------------|----------|
| General Chat | GLM-4.5-Turbo | Fast, efficient |
| Complex Reasoning | GLM-5 | Extended thinking |
| Code Generation | GLM-4.5 | Function calling |
| Data Analysis | GLM-5 | Code interpreter |
| Document Q&A | GLM-4.5-Turbo | Large context |
| Customer Support | GLM-4.5-Turbo | Function calling |
| Content Creation | GLM-4.5 | Streaming |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Context too long | Use GLM-4.5-Turbo (256K context) or trim messages |
| Slow responses | Use streaming for perceived speed |
| Inconsistent outputs | Use structured outputs with JSON schema |
| Function not called | Check function definitions and descriptions |
| Hallucination | Use thinking mode for verification |
| Rate limits | Implement exponential backoff |

## Remember

- Always use z-ai-web-dev-sdk in backend code only
- Use `thinking: { type: 'extended' }` for complex reasoning
- Implement streaming for better UX
- Use JSON schema for guaranteed output formats
- Function calling enables tool integration
- Context window up to 1M tokens with GLM-5
- Always validate user input
- Implement proper error handling
