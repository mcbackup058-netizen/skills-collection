/**
 * VPS Management Tools for Step Flash Agent
 * Tools for managing VPS, deployment, and server operations
 * Last Updated: March 2026
 */

import { Tool, ToolExecutionResult } from '../types';

// ============= SSH Tools =============

export const sshConnectTool: Tool = {
  name: 'ssh_connect',
  description: 'Connect to a remote server via SSH. Execute commands on the server.',
  category: 'system',
  dangerous: true,
  parameters: {
    type: 'object',
    properties: {
      host: {
        type: 'string',
        description: 'Server hostname or IP address',
      },
      port: {
        type: 'number',
        description: 'SSH port (default: 22)',
        default: 22,
      },
      username: {
        type: 'string',
        description: 'SSH username',
      },
      password: {
        type: 'string',
        description: 'SSH password (use with caution)',
      },
      command: {
        type: 'string',
        description: 'Command to execute on the server',
      },
    },
    required: ['host', 'username', 'command'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const { host, port = 22, username, password, command } = args;
      
      // Using sshpass for password-based SSH (would need to be installed)
      // For key-based auth, password is not needed
      const sshCommand = password 
        ? `sshpass -p '${password}' ssh -o StrictHostKeyChecking=no -p ${port} ${username}@${host} "${command}"`
        : `ssh -o StrictHostKeyChecking=no -p ${port} ${username}@${host} "${command}"`;
      
      // Note: In production, use proper SSH library like node-ssh
      // This is a simulation for the tool definition
      
      return {
        success: true,
        output: {
          host,
          port,
          username,
          command,
          result: 'Command executed successfully (simulation)',
          stdout: '',
          stderr: '',
          exitCode: 0,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const sshExecTool: Tool = {
  name: 'ssh_exec',
  description: 'Execute commands on a connected VPS server.',
  category: 'system',
  dangerous: true,
  parameters: {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description: 'Command to execute',
      },
      sudo: {
        type: 'boolean',
        description: 'Run with sudo privileges',
        default: false,
      },
      timeout: {
        type: 'number',
        description: 'Command timeout in seconds',
        default: 30,
      },
    },
    required: ['command'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const { command, sudo, timeout } = args;
      const fullCommand = sudo ? `sudo ${command}` : command;
      
      // Execute command simulation
      return {
        success: true,
        output: {
          command: fullCommand,
          stdout: '',
          stderr: '',
          exitCode: 0,
          executionTime: 0,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

// ============= System Monitoring Tools =============

export const systemStatusTool: Tool = {
  name: 'system_status',
  description: 'Get VPS system status: CPU, memory, disk, network.',
  category: 'system',
  parameters: {
    type: 'object',
    properties: {
      detailed: {
        type: 'boolean',
        description: 'Get detailed status information',
        default: false,
      },
    },
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      // Commands to get system status
      const commands = {
        cpu: 'top -bn1 | head -5',
        memory: 'free -h',
        disk: 'df -h',
        network: 'ip addr show',
        uptime: 'uptime',
        processes: 'ps aux --sort=-%mem | head -10',
      };

      return {
        success: true,
        output: {
          commands,
          message: 'Execute these commands via SSH to get system status',
          example: 'ssh_exec with command: "free -h && df -h && uptime"',
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const processManageTool: Tool = {
  name: 'process_manage',
  description: 'Manage processes on the VPS: list, kill, start services.',
  category: 'system',
  dangerous: true,
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['list', 'kill', 'start', 'stop', 'restart', 'status'],
        description: 'Action to perform',
      },
      process: {
        type: 'string',
        description: 'Process name or PID',
      },
      service: {
        type: 'string',
        description: 'Service name (for service actions)',
      },
    },
    required: ['action'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const { action, process, service } = args;
      let command = '';

      switch (action) {
        case 'list':
          command = 'ps aux --sort=-%mem | head -20';
          break;
        case 'kill':
          command = `kill -9 ${process}`;
          break;
        case 'start':
          command = `systemctl start ${service}`;
          break;
        case 'stop':
          command = `systemctl stop ${service}`;
          break;
        case 'restart':
          command = `systemctl restart ${service}`;
          break;
        case 'status':
          command = service ? `systemctl status ${service}` : 'ps aux';
          break;
      }

      return {
        success: true,
        output: {
          action,
          command,
          message: `Execute via ssh_exec: "${command}"`,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

// ============= File Management Tools =============

export const fileManageTool: Tool = {
  name: 'file_manage',
  description: 'Manage files on VPS: list, copy, move, delete, create directories.',
  category: 'file',
  dangerous: true,
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['list', 'copy', 'move', 'delete', 'mkdir', 'chmod', 'chown', 'find'],
        description: 'File action to perform',
      },
      path: {
        type: 'string',
        description: 'File or directory path',
      },
      destination: {
        type: 'string',
        description: 'Destination path (for copy/move)',
      },
      permissions: {
        type: 'string',
        description: 'Permissions (for chmod, e.g., 755)',
      },
      owner: {
        type: 'string',
        description: 'Owner (for chown, e.g., user:group)',
      },
      pattern: {
        type: 'string',
        description: 'Search pattern (for find)',
      },
    },
    required: ['action', 'path'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const { action, path, destination, permissions, owner, pattern } = args;
      let command = '';

      switch (action) {
        case 'list':
          command = `ls -la ${path}`;
          break;
        case 'copy':
          command = `cp -r ${path} ${destination}`;
          break;
        case 'move':
          command = `mv ${path} ${destination}`;
          break;
        case 'delete':
          command = `rm -rf ${path}`;
          break;
        case 'mkdir':
          command = `mkdir -p ${path}`;
          break;
        case 'chmod':
          command = `chmod ${permissions} ${path}`;
          break;
        case 'chown':
          command = `chown ${owner} ${path}`;
          break;
        case 'find':
          command = `find ${path} -name "${pattern}"`;
          break;
      }

      return {
        success: true,
        output: {
          action,
          command,
          path,
          message: `Execute via ssh_exec: "${command}"`,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

// ============= Deployment Tools =============

export const gitDeployTool: Tool = {
  name: 'git_deploy',
  description: 'Deploy applications from Git repository on VPS.',
  category: 'system',
  dangerous: true,
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['clone', 'pull', 'status', 'checkout', 'reset'],
        description: 'Git action to perform',
      },
      repo: {
        type: 'string',
        description: 'Repository URL (for clone)',
      },
      branch: {
        type: 'string',
        description: 'Branch name',
        default: 'main',
      },
      directory: {
        type: 'string',
        description: 'Project directory',
      },
    },
    required: ['action'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const { action, repo, branch, directory } = args;
      let command = '';

      switch (action) {
        case 'clone':
          command = `git clone -b ${branch} ${repo} ${directory || ''}`;
          break;
        case 'pull':
          command = `cd ${directory} && git pull origin ${branch}`;
          break;
        case 'status':
          command = `cd ${directory} && git status`;
          break;
        case 'checkout':
          command = `cd ${directory} && git checkout ${branch}`;
          break;
        case 'reset':
          command = `cd ${directory} && git reset --hard origin/${branch}`;
          break;
      }

      return {
        success: true,
        output: {
          action,
          command,
          message: `Execute via ssh_exec: "${command}"`,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const dockerManageTool: Tool = {
  name: 'docker_manage',
  description: 'Manage Docker containers on VPS: run, stop, logs, ps, build.',
  category: 'system',
  dangerous: true,
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['ps', 'run', 'stop', 'start', 'restart', 'logs', 'build', 'exec', 'rm', 'images'],
        description: 'Docker action to perform',
      },
      container: {
        type: 'string',
        description: 'Container name or ID',
      },
      image: {
        type: 'string',
        description: 'Docker image name',
      },
      options: {
        type: 'string',
        description: 'Additional Docker options',
      },
      command: {
        type: 'string',
        description: 'Command to run (for exec/run)',
      },
    },
    required: ['action'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const { action, container, image, options, command } = args;
      let cmd = '';

      switch (action) {
        case 'ps':
          cmd = 'docker ps -a';
          break;
        case 'run':
          cmd = `docker run -d ${options || ''} --name ${container} ${image} ${command || ''}`;
          break;
        case 'stop':
          cmd = `docker stop ${container}`;
          break;
        case 'start':
          cmd = `docker start ${container}`;
          break;
        case 'restart':
          cmd = `docker restart ${container}`;
          break;
        case 'logs':
          cmd = `docker logs --tail 100 ${container}`;
          break;
        case 'build':
          cmd = `docker build -t ${image} .`;
          break;
        case 'exec':
          cmd = `docker exec ${container} ${command}`;
          break;
        case 'rm':
          cmd = `docker rm -f ${container}`;
          break;
        case 'images':
          cmd = 'docker images';
          break;
      }

      return {
        success: true,
        output: {
          action,
          command: cmd,
          message: `Execute via ssh_exec: "${cmd}"`,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const nginxManageTool: Tool = {
  name: 'nginx_manage',
  description: 'Manage Nginx on VPS: configure, reload, test config.',
  category: 'system',
  dangerous: true,
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['status', 'start', 'stop', 'restart', 'reload', 'test', 'sites', 'logs'],
        description: 'Nginx action to perform',
      },
      site: {
        type: 'string',
        description: 'Site name (for site-specific actions)',
      },
    },
    required: ['action'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const { action, site } = args;
      let command = '';

      switch (action) {
        case 'status':
          command = 'systemctl status nginx';
          break;
        case 'start':
          command = 'systemctl start nginx';
          break;
        case 'stop':
          command = 'systemctl stop nginx';
          break;
        case 'restart':
          command = 'systemctl restart nginx';
          break;
        case 'reload':
          command = 'systemctl reload nginx';
          break;
        case 'test':
          command = 'nginx -t';
          break;
        case 'sites':
          command = 'ls -la /etc/nginx/sites-available /etc/nginx/sites-enabled';
          break;
        case 'logs':
          command = site 
            ? `tail -50 /var/log/nginx/${site}.log`
            : 'tail -50 /var/log/nginx/access.log /var/log/nginx/error.log';
          break;
      }

      return {
        success: true,
        output: {
          action,
          command,
          message: `Execute via ssh_exec: "${command}"`,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const firewallManageTool: Tool = {
  name: 'firewall_manage',
  description: 'Manage UFW firewall on VPS: allow/deny ports, enable/disable.',
  category: 'system',
  dangerous: true,
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['status', 'enable', 'disable', 'allow', 'deny', 'delete', 'reset'],
        description: 'Firewall action to perform',
      },
      port: {
        type: 'string',
        description: 'Port number or service name',
      },
      protocol: {
        type: 'string',
        enum: ['tcp', 'udp', 'both'],
        description: 'Protocol',
        default: 'tcp',
      },
      from: {
        type: 'string',
        description: 'Source IP address',
      },
    },
    required: ['action'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const { action, port, protocol, from } = args;
      let command = '';

      switch (action) {
        case 'status':
          command = 'ufw status verbose';
          break;
        case 'enable':
          command = 'ufw enable';
          break;
        case 'disable':
          command = 'ufw disable';
          break;
        case 'allow':
          const protoFlag = protocol !== 'both' ? `/${protocol}` : '';
          command = from 
            ? `ufw allow from ${from} to any port ${port}${protoFlag}`
            : `ufw allow ${port}${protoFlag}`;
          break;
        case 'deny':
          command = `ufw deny ${port}`;
          break;
        case 'delete':
          command = `ufw delete allow ${port}`;
          break;
        case 'reset':
          command = 'ufw reset';
          break;
      }

      return {
        success: true,
        output: {
          action,
          command: `sudo ${command}`,
          message: `Execute via ssh_exec with sudo: "${command}"`,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const backupTool: Tool = {
  name: 'backup_manage',
  description: 'Create and manage backups on VPS.',
  category: 'system',
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['create', 'list', 'restore', 'delete'],
        description: 'Backup action to perform',
      },
      source: {
        type: 'string',
        description: 'Source path to backup',
      },
      destination: {
        type: 'string',
        description: 'Backup destination path',
      },
      name: {
        type: 'string',
        description: 'Backup name',
      },
    },
    required: ['action'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const { action, source, destination, name } = args;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      let command = '';

      switch (action) {
        case 'create':
          const backupName = name || `backup_${timestamp}`;
          command = `tar -czf ${destination || '/backup'}/${backupName}.tar.gz ${source}`;
          break;
        case 'list':
          command = `ls -lh ${destination || '/backup'}/`;
          break;
        case 'restore':
          command = `tar -xzf ${destination}/${name}.tar.gz -C /`;
          break;
        case 'delete':
          command = `rm ${destination}/${name}.tar.gz`;
          break;
      }

      return {
        success: true,
        output: {
          action,
          command,
          message: `Execute via ssh_exec: "${command}"`,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

// ============= Database Tools =============

export const databaseManageTool: Tool = {
  name: 'database_manage',
  description: 'Manage databases on VPS: MySQL/MariaDB, PostgreSQL.',
  category: 'system',
  dangerous: true,
  parameters: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['mysql', 'postgresql'],
        description: 'Database type',
      },
      action: {
        type: 'string',
        enum: ['status', 'start', 'stop', 'restart', 'databases', 'backup', 'users'],
        description: 'Database action',
      },
      database: {
        type: 'string',
        description: 'Database name',
      },
      output: {
        type: 'string',
        description: 'Output file for backup',
      },
    },
    required: ['type', 'action'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const { type, action, database, output } = args;
      let command = '';
      const service = type === 'mysql' ? 'mysql' : 'postgresql';

      switch (action) {
        case 'status':
          command = `systemctl status ${service}`;
          break;
        case 'start':
          command = `systemctl start ${service}`;
          break;
        case 'stop':
          command = `systemctl stop ${service}`;
          break;
        case 'restart':
          command = `systemctl restart ${service}`;
          break;
        case 'databases':
          command = type === 'mysql'
            ? 'mysql -e "SHOW DATABASES;"'
            : 'psql -l';
          break;
        case 'backup':
          const backupFile = output || `/backup/${database}_${Date.now()}.sql`;
          command = type === 'mysql'
            ? `mysqldump ${database} > ${backupFile}`
            : `pg_dump ${database} > ${backupFile}`;
          break;
        case 'users':
          command = type === 'mysql'
            ? 'mysql -e "SELECT User, Host FROM mysql.user;"'
            : 'psql -c "\\du"';
          break;
      }

      return {
        success: true,
        output: {
          type,
          action,
          command,
          message: `Execute via ssh_exec: "${command}"`,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

// Export all VPS tools
export const vpsTools: Tool[] = [
  sshConnectTool,
  sshExecTool,
  systemStatusTool,
  processManageTool,
  fileManageTool,
  gitDeployTool,
  dockerManageTool,
  nginxManageTool,
  firewallManageTool,
  backupTool,
  databaseManageTool,
];

export default vpsTools;
