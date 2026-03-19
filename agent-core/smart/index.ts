/**
 * Smart Agent Index - Ultra Simple Interface
 * Import everything from one place
 * 
 * Quick Start:
 *   import { ask, setup } from './smart';
 *   
 *   // First time: set API key
 *   await setup("sk-or-v1-your-api-key");
 *   
 *   // Then just ask!
 *   const answer = await ask("What is the weather?");
 */

// ============= Configuration =============
export {
  ConfigManager,
  configManager,
  SmartConfig,
  isSetupComplete,
  getStoredApiKey,
  saveApiKey,
} from './config';

// ============= Skill Detection =============
export {
  SkillDetector,
  skillCategories,
  SkillCategory,
} from './SkillDetector';

// ============= Smart Agent =============
export {
  SmartAgent,
  smartAgent,
  setup,
  ask,
  askStream,
  execute,
  addServer,
  listSkills,
  quickAsk,
} from './SmartAgent';

// Default export
export { SmartAgent as default } from './SmartAgent';
