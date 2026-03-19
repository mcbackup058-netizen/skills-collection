/**
 * 🔧 Real Tools for Step Flash Agent
 * Actually executes real operations
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ============= Web Search Tool =============

async function webSearch(query, numResults = 5) {
  try {
    // Using DuckDuckGo API (free, no API key needed)
    const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
    const data = await response.json();
    
    const results = [];
    
    // Get instant answer
    if (data.Abstract) {
      results.push({
        type: 'answer',
        title: data.Heading || 'Instant Answer',
        content: data.Abstract,
        url: data.AbstractURL,
      });
    }
    
    // Get related topics
    if (data.RelatedTopics) {
      for (const topic of data.RelatedTopics.slice(0, numResults)) {
        if (topic.Text && topic.FirstURL) {
          results.push({
            type: 'topic',
            title: topic.Text.split(' - ')[0] || 'Related',
            content: topic.Text,
            url: topic.FirstURL,
          });
        }
      }
    }
    
    return {
      success: true,
      query,
      results,
      message: results.length > 0 
        ? `Found ${results.length} results for "${query}"`
        : `No results found for "${query}"`,
    };
    
  } catch (error) {
    return {
      success: false,
      query,
      results: [],
      error: error.message,
    };
  }
}

// ============= VPS Connection Tool =============

const VPS_CONFIG = {
  host: '103.157.27.152',
  port: 22,
  username: 'hyperlot99',
  password: '@Dilarang9',
};

function buildSSHCommand(command, options = {}) {
  const { host, port, username, password } = { ...VPS_CONFIG, ...options };
  
  // Using sshpass for password-based SSH
  return `sshpass -p '${password}' ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 -p ${port} ${username}@${host} "${command.replace(/"/g, '\\"')}"`;
}

async function vpsExecute(command, options = {}) {
  try {
    const sshCommand = buildSSHCommand(command, options);
    
    // Check if sshpass is available
    try {
      execSync('which sshpass', { stdio: 'ignore' });
    } catch {
      return {
        success: false,
        command,
        error: 'sshpass not installed. Install with: apt-get install sshpass',
      };
    }
    
    const result = execSync(sshCommand, {
      encoding: 'utf-8',
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });
    
    return {
      success: true,
      command,
      output: result.trim(),
      timestamp: new Date().toISOString(),
    };
    
  } catch (error) {
    return {
      success: false,
      command,
      error: error.message,
      stderr: error.stderr?.toString() || '',
    };
  }
}

// ============= VPS Status Tools =============

async function vpsStatus() {
  const commands = {
    hostname: 'hostname',
    uptime: 'uptime',
    cpu: "top -bn1 | head -5",
    memory: 'free -h',
    disk: 'df -h',
    load: 'cat /proc/loadavg',
    os: 'cat /etc/os-release | head -5',
  };
  
  const results = {};
  
  for (const [key, cmd] of Object.entries(commands)) {
    const result = await vpsExecute(cmd);
    results[key] = result.success ? result.output : `Error: ${result.error}`;
  }
  
  return {
    success: true,
    server: VPS_CONFIG.host,
    results,
    timestamp: new Date().toISOString(),
  };
}

async function vpsServices(action = 'list', service = null) {
  let command;
  
  switch (action) {
    case 'list':
      command = 'systemctl list-units --type=service --state=running --no-pager | head -20';
      break;
    case 'status':
      command = service ? `systemctl status ${service} --no-pager` : 'systemctl list-units --type=service --state=running --no-pager';
      break;
    case 'start':
      command = `sudo systemctl start ${service}`;
      break;
    case 'stop':
      command = `sudo systemctl stop ${service}`;
      break;
    case 'restart':
      command = `sudo systemctl restart ${service}`;
      break;
    case 'logs':
      command = service ? `journalctl -u ${service} -n 50 --no-pager` : 'journalctl -n 50 --no-pager';
      break;
    default:
      command = 'systemctl list-units --type=service --state=running --no-pager | head -20';
  }
  
  return vpsExecute(command);
}

async function vpsProcesses(sortBy = 'memory') {
  const sortFlag = sortBy === 'memory' ? '-%mem' : '-%cpu';
  const command = `ps aux --sort=${sortFlag} | head -15`;
  return vpsExecute(command);
}

async function vpsDocker(action = 'ps', container = null, options = '') {
  let command;
  
  switch (action) {
    case 'ps':
      command = 'docker ps -a';
      break;
    case 'images':
      command = 'docker images';
      break;
    case 'logs':
      command = `docker logs --tail 100 ${container}`;
      break;
    case 'start':
      command = `docker start ${container}`;
      break;
    case 'stop':
      command = `docker stop ${container}`;
      break;
    case 'restart':
      command = `docker restart ${container}`;
      break;
    case 'stats':
      command = 'docker stats --no-stream';
      break;
    default:
      command = 'docker ps -a';
  }
  
  return vpsExecute(command);
}

async function vpsNginx(action = 'status', site = null) {
  let command;
  
  switch (action) {
    case 'status':
      command = 'systemctl status nginx --no-pager';
      break;
    case 'test':
      command = 'sudo nginx -t';
      break;
    case 'reload':
      command = 'sudo systemctl reload nginx';
      break;
    case 'restart':
      command = 'sudo systemctl restart nginx';
      break;
    case 'sites':
      command = 'ls -la /etc/nginx/sites-enabled/';
      break;
    case 'logs':
      command = site 
        ? `tail -50 /var/log/nginx/${site}.log`
        : 'tail -50 /var/log/nginx/error.log';
      break;
    default:
      command = 'systemctl status nginx --no-pager';
  }
  
  return vpsExecute(command);
}

async function vpsFirewall(action = 'status', port = null) {
  let command;
  
  switch (action) {
    case 'status':
      command = 'sudo ufw status verbose';
      break;
    case 'allow':
      command = `sudo ufw allow ${port}`;
      break;
    case 'deny':
      command = `sudo ufw deny ${port}`;
      break;
    case 'ports':
      command = 'sudo netstat -tlnp';
      break;
    default:
      command = 'sudo ufw status verbose';
  }
  
  return vpsExecute(command);
}

async function vpsFileManager(action, path, destination = null) {
  let command;
  
  switch (action) {
    case 'list':
      command = `ls -lah ${path || '~'}`;
      break;
    case 'read':
      command = `cat ${path}`;
      break;
    case 'tail':
      command = `tail -50 ${path}`;
      break;
    case 'find':
      command = `find ~ -name "${path}" 2>/dev/null`;
      break;
    case 'disk':
      command = 'df -h';
      break;
    case 'du':
      command = `du -sh ${path || '~'}/* 2>/dev/null | sort -hr | head -10`;
      break;
    default:
      command = `ls -lah ${path || '~'}`;
  }
  
  return vpsExecute(command);
}

// ============= Export Tools =============

const tools = {
  web_search: webSearch,
  vps_exec: vpsExecute,
  vps_status: vpsStatus,
  vps_services: vpsServices,
  vps_processes: vpsProcesses,
  vps_docker: vpsDocker,
  vps_nginx: vpsNginx,
  vps_firewall: vpsFirewall,
  vps_file: vpsFileManager,
};

// Tool descriptions for AI
const toolDescriptions = `
## Available Tools:

1. **web_search(query)** - Search the web for information
   Example: web_search("latest AI news")

2. **vps_status()** - Get VPS system status (CPU, memory, disk)
   Example: vps_status()

3. **vps_services(action, service)** - Manage system services
   Actions: list, status, start, stop, restart, logs
   Example: vps_services("status", "nginx")

4. **vps_processes(sortBy)** - List running processes
   Sort by: memory, cpu
   Example: vps_processes("memory")

5. **vps_docker(action, container)** - Manage Docker
   Actions: ps, images, logs, start, stop, restart, stats
   Example: vps_docker("logs", "my-container")

6. **vps_nginx(action, site)** - Manage Nginx
   Actions: status, test, reload, restart, sites, logs
   Example: vps_nginx("status")

7. **vps_firewall(action, port)** - Manage UFW firewall
   Actions: status, allow, deny, ports
   Example: vps_firewall("status")

8. **vps_file(action, path)** - File operations
   Actions: list, read, tail, find, disk, du
   Example: vps_file("list", "/var/log")
`;

module.exports = {
  tools,
  toolDescriptions,
  webSearch,
  vpsExecute,
  vpsStatus,
  vpsServices,
  vpsProcesses,
  vpsDocker,
  vpsNginx,
  vpsFirewall,
  vpsFileManager,
  VPS_CONFIG,
};
