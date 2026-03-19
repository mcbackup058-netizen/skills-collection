/**
 * Example: Simple Chat Agent
 * A basic example showing how to use Step Flash Agent for chat
 */

import { StepFlashAgent } from '../StepFlashAgent';
import { builtinTools } from '../tools/builtin';

async function main() {
  // Initialize the agent with your API key
  const agent = new StepFlashAgent({
    apiKey: process.env.AI_STEP_FLASH_API_KEY || 'sk-or-v1-your-api-key',
    model: 'step-ai/step-flash-3.5',
    verbose: true,
    memoryEnabled: true,
  });

  // Register built-in tools
  agent.registerTools(builtinTools);

  // Simple chat
  console.log('=== Simple Chat Example ===\n');

  const response1 = await agent.chat('Hello! Can you introduce yourself?');
  console.log('Agent:', response1.content);

  const response2 = await agent.chat('What tools do you have available?');
  console.log('Agent:', response2.content);

  const response3 = await agent.chat('Can you help me analyze some code?');
  console.log('Agent:', response3.content);

  // Show stats
  console.log('\n=== Memory Stats ===');
  const memory = agent.getMemory();
  console.log(memory.getStats());
}

main().catch(console.error);
