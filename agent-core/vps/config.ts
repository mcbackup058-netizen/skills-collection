/**
 * VPS Configuration
 * Server connection details and settings
 * Last Updated: March 2026
 */

export interface VPSConfig {
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  description?: string;
  tags?: string[];
}

// ============= VPS Servers =============

export const vpsServers: Record<string, VPSConfig> = {
  // Primary VPS - User's server
  primary: {
    name: 'Primary VPS',
    host: '103.157.27.152',
    port: 22,
    username: 'hyperlot99',
    password: '@Dilarang9',
    description: 'Main production server',
    tags: ['production', 'primary'],
  },
};

// ============= Default Server =============

export const defaultServer: VPSConfig = vpsServers.primary;

// ============= Safety Settings =============

export const safetySettings = {
  // Dangerous command patterns
  dangerousPatterns: [
    /^rm\s+-rf\s+\//,
    /^mkfs/,
    /^dd\s+if=/,
    /^:\(\)\{\s*:\|:\s*&\s*\};\s*:/,
    /^chmod\s+777\s+\//,
    /^chown\s+.*\s+\//,
    /^>\s*\//,
    /shutdown/,
    /reboot/,
  ],
  
  // Protected paths
  protectedPaths: [
    '/',
    '/etc',
    '/root',
    '/home',
    '/var',
    '/usr',
    '/bin',
    '/sbin',
    '/boot',
  ],
};

// ============= Helper Functions =============

export function getServer(name: string = 'primary'): VPSConfig | undefined {
  return vpsServers[name];
}

export function listServers(): Array<{ name: string; host: string; description?: string }> {
  return Object.entries(vpsServers).map(([key, config]) => ({
    name: key,
    host: config.host,
    description: config.description,
  }));
}

export function isDangerousCommand(command: string): boolean {
  return safetySettings.dangerousPatterns.some(pattern => pattern.test(command));
}

export function isProtectedPath(path: string): boolean {
  return safetySettings.protectedPaths.some(protected => 
    path === protected || path.startsWith(protected + '/')
  );
}

// ============= Export =============

export default {
  vpsServers,
  defaultServer,
  safetySettings,
  getServer,
  listServers,
  isDangerousCommand,
  isProtectedPath,
};
