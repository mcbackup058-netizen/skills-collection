#!/usr/bin/env npx ts-node
/**
 * 🚀 Step Flash Easy Runner - Root Access
 * 
 * Usage:
 *   npx ts-node ask.ts setup YOUR_API_KEY
 *   npx ts-node ask.ts "Your question here"
 */

import { configManager } from './agent-core/smart/config';
import { setup, ask, askStream } from './agent-core/smart/SmartAgent';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║           🤖 Step Flash - Simple AI Assistant            ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Usage:                                                  ║
║                                                          ║
║  First time setup:                                       ║
║    npx ts-node ask.ts setup YOUR_API_KEY                 ║
║                                                          ║
║  Ask anything:                                           ║
║    npx ts-node ask.ts "Your question here"               ║
║                                                          ║
║  Examples:                                               ║
║    npx ts-node ask.ts "What is Python?"                  ║
║    npx ts-node ask.ts "Check my VPS status"              ║
║    npx ts-node ask.ts "Search for AI news"               ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);
    return;
  }
  
  // Setup command
  if (args[0] === 'setup') {
    const apiKey = args[1];
    if (!apiKey) {
      console.error('❌ Please provide your API key:');
      console.error('   npx ts-node ask.ts setup sk-or-v1-YOUR-KEY');
      process.exit(1);
    }
    
    await configManager.init();
    await setup(apiKey);
    console.log('✅ Setup complete! API key saved.');
    console.log('   You can now ask questions:');
    console.log('   npx ts-node ask.ts "Your question here"');
    return;
  }
  
  // Ask question
  const question = args.join(' ');
  
  await configManager.init();
  const apiKey = configManager.getApiKey() || process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error('❌ No API key configured!');
    console.error('   Run: npx ts-node ask.ts setup YOUR_API_KEY');
    process.exit(1);
  }
  
  await setup(apiKey);
  
  console.log(`\n🤔 Thinking...\n`);
  
  // Stream response
  for await (const chunk of askStream(question)) {
    process.stdout.write(chunk);
  }
  console.log('\n');
}

main().catch(console.error);
