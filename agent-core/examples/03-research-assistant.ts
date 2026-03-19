/**
 * Example: Research Assistant Agent
 * A research agent that can search the web, analyze content, and compile reports
 */

import { StepFlashAgent } from '../StepFlashAgent';
import { 
  builtinTools, 
  webSearchTool, 
  webFetchTool, 
  codeAnalyzeTool,
  fileWriteTool,
} from '../tools/builtin';

async function main() {
  const agent = new StepFlashAgent({
    apiKey: process.env.AI_STEP_FLASH_API_KEY || 'sk-or-v1-your-api-key',
    model: 'step-ai/step-flash-3.5',
    maxIterations: 20,
    verbose: true,
  });

  // Register relevant tools for research
  agent.registerTools([
    webSearchTool,
    webFetchTool,
    codeAnalyzeTool,
    fileWriteTool,
  ]);

  console.log('=== Research Assistant Example ===\n');

  const researchTopic = 'The impact of Large Language Models on software development in 2026';

  console.log('Research Topic:', researchTopic);
  console.log('\n--- Starting Research ---\n');

  // Step 1: Search for information
  console.log('Step 1: Searching for information...');
  const searchResult = await agent.chat(
    `Search the web for information about: "${researchTopic}". Find at least 5 relevant sources.`
  );
  console.log('Search Result:', searchResult.content?.substring(0, 500) + '...');

  // Step 2: Analyze and synthesize
  console.log('\nStep 2: Analyzing and synthesizing information...');
  const analysisResult = await agent.chat(
    'Based on the search results, provide a comprehensive analysis of the key findings. ' +
    'Highlight the most important trends and statistics.'
  );
  console.log('Analysis:', analysisResult.content?.substring(0, 500) + '...');

  // Step 3: Generate report
  console.log('\nStep 3: Generating research report...');
  const reportResult = await agent.chat(
    'Generate a formal research report with the following sections:\n' +
    '1. Executive Summary\n' +
    '2. Key Findings\n' +
    '3. Trends Analysis\n' +
    '4. Future Outlook\n' +
    '5. References\n\n' +
    'Include specific data points and examples where available.'
  );
  console.log('Report:', reportResult.content?.substring(0, 1000) + '...');

  // Step 4: Save report
  console.log('\nStep 4: Saving report...');
  const saveResult = await agent.chat(
    'Save the research report to a file called "research_report.md" in the current directory.'
  );
  console.log('Save Result:', saveResult.content);

  console.log('\n=== Research Complete ===');
  console.log('Memory Stats:', agent.getMemory().getStats());
}

main().catch(console.error);
