/**
 * 🚀 ONE-LINE USAGE - Simplest Possible Interface
 * 
 * Quick Start:
 *   1. npx ts-node smart/easy.ts setup YOUR_API_KEY
 *   2. npx ts-node smart/easy.ts "What is the weather?"
 * 
 * That's it! Just 2 steps.
 */

import { configManager } from './config';
import { setup, ask, askStream } from './SmartAgent';

async function main() {
  const args = process.argv.slice(2);
  
  // No args - show help
  if (args.length === 0) {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║           🤖 Step Flash - Simple AI Assistant            ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Usage:                                                  ║
║                                                          ║
║  First time setup:                                       ║
║    npx ts-node smart/easy.ts setup YOUR_API_KEY          ║
║                                                          ║
║  Ask anything:                                           ║
║    npx ts-node smart/easy.ts "Your question here"        ║
║                                                          ║
║  Examples:                                               ║
║    npx ts-node smart/easy.ts "What is Python?"           ║
║    npx ts-node smart/easy.ts "Check my VPS status"       ║
║    npx ts-node smart/easy.ts "Search for AI news"        ║
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
      console.error('   npx ts-node smart/easy.ts setup sk-or-v1-YOUR-KEY');
      process.exit(1);
    }
    
    await configManager.init();
    await setup(apiKey);
    console.log('✅ Setup complete! You can now ask questions.');
    return;
  }
  
  // Ask question
  const question = args.join(' ');
  
  await configManager.init();
  const apiKey = configManager.getApiKey() || process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error('❌ No API key configured!');
    console.error('   Run: npx ts-node smart/easy.ts setup YOUR_API_KEY');
    process.exit(1);
  }
  
  await setup(apiKey);
  
  // Stream response
  for await (const chunk of askStream(question)) {
    process.stdout.write(chunk);
  }
  console.log();
}

main().catch(console.error);
