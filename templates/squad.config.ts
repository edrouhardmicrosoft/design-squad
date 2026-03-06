import type { SquadConfig } from '@bradygaster/squad';

/**
 * Squad Configuration for Design Squad
 * 
 * Core team: Oracle, Researcher, Planner, Builder
 * Helpers: Figma (MCP), Copilot (background tasks)
 */
const config: SquadConfig = {
  version: '1.0.0',
  
  models: {
    defaultModel: 'claude-sonnet-4.5',
    defaultTier: 'standard',
    taskRules: [
      {
        outputType: 'code',
        model: 'gpt-5.3-codex',
        conditions: {
          workType: ['implementation', 'feature-dev', 'bug-fix', 'refactoring']
        }
      },
      {
        outputType: 'analysis',
        model: 'gpt-5.4',
        conditions: {
          workType: ['deep-analysis', 'architecture']
        }
      },
      {
        outputType: 'decision',
        model: 'gpt-5.4',
        conditions: {
          workType: ['deep-analysis', 'architecture']
        }
      }
    ],
    fallbackChains: {
      premium: ['gpt-5.4', 'gpt-5.3-codex', 'claude-opus-4.6', 'gpt-5.2-codex', 'claude-opus-4.5'],
      standard: ['claude-sonnet-4.5', 'gpt-5.2-codex', 'claude-sonnet-4', 'gpt-5.2'],
      fast: ['claude-haiku-4.5', 'gpt-5.1-codex-mini', 'gpt-4.1', 'gpt-5-mini']
    },
    preferSameProvider: true,
    respectTierCeiling: true,
    nuclearFallback: {
      enabled: false,
      model: 'claude-haiku-4.5',
      maxRetriesBeforeNuclear: 3
    }
  },
  
  routing: {
    rules: [
      {
        workType: 'deep-analysis',
        agents: ['@oracle'],
        confidence: 'high'
      },
      {
        workType: 'research',
        agents: ['@researcher'],
        confidence: 'high'
      },
      {
        workType: 'planning',
        agents: ['@planner'],
        confidence: 'high'
      },
      {
        workType: 'implementation',
        agents: ['@builder'],
        confidence: 'high'
      },
      {
        workType: 'documentation',
        agents: ['@scribe'],
        confidence: 'high'
      }
    ],
    governance: {
      eagerByDefault: true,
      scribeAutoRuns: true,
      allowRecursiveSpawn: false
    }
  },
  
  casting: {
    allowlistUniverses: [],
    overflowStrategy: 'generic',
    universeCapacity: {}
  },
  
  platforms: {
    vscode: {
      disableModelSelection: false,
      scribeMode: 'sync'
    }
  }
};

export default config;
