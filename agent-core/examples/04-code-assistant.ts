/**
 * Example: Code Assistant Agent
 * An agent specialized for code analysis, debugging, and generation
 */

import { StepFlashAgent } from '../StepFlashAgent';
import {
  codeExecuteTool,
  codeAnalyzeTool,
  fileReadTool,
  fileWriteTool,
  fileListTool,
} from '../tools/builtin';

async function main() {
  const agent = new StepFlashAgent({
    apiKey: process.env.AI_STEP_FLASH_API_KEY || 'sk-or-v1-your-api-key',
    model: 'step-ai/step-flash-3.5',
    maxIterations: 15,
    verbose: true,
  });

  // Register code-related tools
  agent.registerTools([
    codeExecuteTool,
    codeAnalyzeTool,
    fileReadTool,
    fileWriteTool,
    fileListTool,
  ]);

  console.log('=== Code Assistant Example ===\n');

  // Example 1: Code Analysis
  console.log('--- Example 1: Code Analysis ---\n');

  const sampleCode = `
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price * items[i].quantity;
  }
  return total;
}

function applyDiscount(total, discountCode) {
  const discounts = {
    'SAVE10': 0.1,
    'SAVE20': 0.2,
    'VIP': 0.3
  };
  return total * (1 - (discounts[discountCode] || 0));
}
`;

  const analysisResult = await agent.chat(
    `Analyze the following code for potential issues, improvements, and security concerns:\n\n\`\`\`javascript\n${sampleCode}\n\`\`\``
  );
  console.log('Analysis:', analysisResult.content);

  // Example 2: Code Generation
  console.log('\n--- Example 2: Code Generation ---\n');

  const generationResult = await agent.chat(
    'Generate a TypeScript function that validates email addresses. ' +
    'Include proper type annotations and JSDoc comments. ' +
    'The function should handle edge cases and return detailed validation results.'
  );
  console.log('Generated Code:', generationResult.content);

  // Example 3: Debug
  console.log('\n--- Example 3: Debugging ---\n');

  const buggyCode = `
async function fetchUserData(userId) {
  const response = await fetch('/api/users/' + userId);
  const data = response.json();
  return data.name;
}
`;

  const debugResult = await agent.chat(
    `This code has bugs. Find and fix them:\n\n\`\`\`javascript\n${buggyCode}\n\`\`\``
  );
  console.log('Debug Result:', debugResult.content);

  // Example 4: Test Generation
  console.log('\n--- Example 4: Test Generation ---\n');

  const testResult = await agent.chat(
    'Generate comprehensive unit tests for the calculateTotal and applyDiscount functions ' +
    'using Jest. Include edge cases and error scenarios.'
  );
  console.log('Tests:', testResult.content?.substring(0, 1500) + '...');

  console.log('\n=== Code Assistant Demo Complete ===');
}

main().catch(console.error);
