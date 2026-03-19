/**
 * Example: Task Planning Agent
 * Demonstrates the agent's ability to plan and execute complex tasks
 */

import { StepFlashAgent } from '../StepFlashAgent';
import { builtinTools } from '../tools/builtin';

async function main() {
  const agent = new StepFlashAgent({
    apiKey: process.env.AI_STEP_FLASH_API_KEY || 'sk-or-v1-your-api-key',
    model: 'step-ai/step-flash-3.5',
    maxIterations: 15,
    verbose: true,
  });

  agent.registerTools(builtinTools);

  console.log('=== Task Planning Example ===\n');

  // Define a complex goal
  const goal = `
    Research the latest trends in AI for 2026, 
    then create a summary report highlighting the top 5 trends,
    and finally suggest potential applications for each trend.
  `;

  console.log('Goal:', goal);
  console.log('\n--- Planning Phase ---\n');

  // Create a plan
  const plan = await agent.plan(goal);
  
  console.log('Plan created with', plan.tasks.length, 'tasks:');
  plan.tasks.forEach((task, i) => {
    console.log(`  ${i + 1}. [${task.priority}] ${task.description}`);
  });

  console.log('\n--- Execution Phase ---\n');

  // Execute the plan
  const result = await agent.executePlan(plan);
  
  console.log('Execution completed:', result.success ? '✓' : '✗');
  console.log('Message:', result.message);

  // Show final results
  if (result.plan) {
    console.log('\n--- Task Results ---');
    result.plan.tasks.forEach((task, i) => {
      console.log(`\nTask ${i + 1}: ${task.description}`);
      console.log(`Status: ${task.status}`);
      if (task.result) {
        console.log('Result:', typeof task.result === 'string' 
          ? task.result.substring(0, 200) + '...' 
          : JSON.stringify(task.result, null, 2).substring(0, 200) + '...');
      }
    });
  }
}

main().catch(console.error);
