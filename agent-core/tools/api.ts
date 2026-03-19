/**
 * API Integration Tools for Step Flash Agent
 * Connect to external APIs and services
 * Last Updated: March 2026
 */

import { Tool, ToolExecutionResult } from '../types';

// ============= HTTP Request Tools =============

export const httpRequestTool: Tool = {
  name: 'http_request',
  description: 'Make HTTP requests to any API endpoint. Supports GET, POST, PUT, DELETE methods.',
  category: 'api',
  parameters: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'The URL to request',
      },
      method: {
        type: 'string',
        enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        description: 'HTTP method',
        default: 'GET',
      },
      headers: {
        type: 'object',
        description: 'Request headers as key-value pairs',
      },
      body: {
        type: 'object',
        description: 'Request body (for POST/PUT/PATCH)',
      },
      timeout: {
        type: 'number',
        description: 'Request timeout in seconds',
        default: 30,
      },
    },
    required: ['url'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        (args.timeout || 30) * 1000
      );

      const response = await fetch(args.url, {
        method: args.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...args.headers,
        },
        body: args.body ? JSON.stringify(args.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return {
        success: response.ok,
        output: {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          data,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const graphqlQueryTool: Tool = {
  name: 'graphql_query',
  description: 'Execute GraphQL queries against a GraphQL endpoint.',
  category: 'api',
  parameters: {
    type: 'object',
    properties: {
      endpoint: {
        type: 'string',
        description: 'GraphQL endpoint URL',
      },
      query: {
        type: 'string',
        description: 'GraphQL query string',
      },
      variables: {
        type: 'object',
        description: 'Query variables',
      },
      headers: {
        type: 'object',
        description: 'Additional headers',
      },
    },
    required: ['endpoint', 'query'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      const response = await fetch(args.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...args.headers,
        },
        body: JSON.stringify({
          query: args.query,
          variables: args.variables || {},
        }),
      });

      const result = await response.json();

      return {
        success: !result.errors,
        output: {
          data: result.data,
          errors: result.errors,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

// ============= Database Tools =============

export const databaseQueryTool: Tool = {
  name: 'database_query',
  description: 'Execute database queries (supports SQLite, PostgreSQL, MySQL patterns).',
  category: 'api',
  dangerous: true,
  parameters: {
    type: 'object',
    properties: {
      connection: {
        type: 'string',
        description: 'Database connection string or identifier',
      },
      query: {
        type: 'string',
        description: 'SQL query to execute',
      },
      params: {
        type: 'array',
        items: { type: 'string' },
        description: 'Query parameters',
      },
    },
    required: ['query'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    // This is a simulation - in production, connect to actual database
    return {
      success: true,
      output: {
        message: 'Database query simulation',
        query: args.query,
        params: args.params,
        rowsAffected: 0,
        rows: [],
        note: 'In production, this would execute against an actual database',
      },
    };
  },
};

// ============= Email Tools =============

export const emailSendTool: Tool = {
  name: 'email_send',
  description: 'Send emails via configured SMTP service.',
  category: 'api',
  dangerous: true,
  parameters: {
    type: 'object',
    properties: {
      to: {
        type: 'string',
        description: 'Recipient email address',
      },
      subject: {
        type: 'string',
        description: 'Email subject',
      },
      body: {
        type: 'string',
        description: 'Email body (plain text or HTML)',
      },
      cc: {
        type: 'string',
        description: 'CC recipients (comma-separated)',
      },
      isHtml: {
        type: 'boolean',
        description: 'Whether body is HTML',
        default: false,
      },
    },
    required: ['to', 'subject', 'body'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    // Simulation - in production, connect to email service
    return {
      success: true,
      output: {
        messageId: `email_${Date.now()}`,
        to: args.to,
        subject: args.subject,
        status: 'queued',
        note: 'In production, this would send via SMTP or email API',
      },
    };
  },
};

// ============= Cloud Service Tools =============

export const cloudStorageTool: Tool = {
  name: 'cloud_storage',
  description: 'Interact with cloud storage services (S3, GCS, Azure Blob).',
  category: 'api',
  parameters: {
    type: 'object',
    properties: {
      provider: {
        type: 'string',
        enum: ['s3', 'gcs', 'azure', 'local'],
        description: 'Storage provider',
      },
      action: {
        type: 'string',
        enum: ['list', 'upload', 'download', 'delete', 'info'],
        description: 'Action to perform',
      },
      bucket: {
        type: 'string',
        description: 'Bucket/container name',
      },
      key: {
        type: 'string',
        description: 'Object key/path',
      },
      data: {
        type: 'string',
        description: 'Data to upload (base64 or text)',
      },
    },
    required: ['provider', 'action'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    // Simulation
    const { provider, action, bucket, key } = args;
    
    const result: any = {
      provider,
      action,
      bucket,
      key,
    };

    switch (action) {
      case 'list':
        result.objects = [
          { key: 'example/file1.txt', size: 1024, lastModified: new Date().toISOString() },
          { key: 'example/file2.txt', size: 2048, lastModified: new Date().toISOString() },
        ];
        break;
      case 'upload':
        result.status = 'uploaded';
        result.url = `${provider}://${bucket}/${key}`;
        break;
      case 'download':
        result.data = 'Simulated file content';
        result.size = 100;
        break;
      case 'delete':
        result.status = 'deleted';
        break;
      case 'info':
        result.metadata = {
          contentType: 'text/plain',
          size: 1024,
          lastModified: new Date().toISOString(),
        };
        break;
    }

    return {
      success: true,
      output: result,
    };
  },
};

// ============= Notification Tools =============

export const slackNotifyTool: Tool = {
  name: 'slack_notify',
  description: 'Send notifications to Slack channels via webhook.',
  category: 'api',
  parameters: {
    type: 'object',
    properties: {
      webhook: {
        type: 'string',
        description: 'Slack webhook URL',
      },
      channel: {
        type: 'string',
        description: 'Channel to post to (optional, uses webhook default)',
      },
      message: {
        type: 'string',
        description: 'Message text',
      },
      blocks: {
        type: 'array',
        description: 'Slack blocks for rich formatting',
      },
    },
    required: ['message'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      if (args.webhook) {
        const response = await fetch(args.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: args.message,
            channel: args.channel,
            blocks: args.blocks,
          }),
        });

        return {
          success: response.ok,
          output: { status: 'sent', message: args.message },
        };
      }

      return {
        success: true,
        output: {
          status: 'simulated',
          message: args.message,
          note: 'No webhook provided - simulation mode',
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

export const discordNotifyTool: Tool = {
  name: 'discord_notify',
  description: 'Send notifications to Discord channels via webhook.',
  category: 'api',
  parameters: {
    type: 'object',
    properties: {
      webhook: {
        type: 'string',
        description: 'Discord webhook URL',
      },
      message: {
        type: 'string',
        description: 'Message content',
      },
      embed: {
        type: 'object',
        description: 'Discord embed object for rich formatting',
      },
    },
    required: ['message'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    try {
      if (args.webhook) {
        const response = await fetch(args.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: args.message,
            embeds: args.embed ? [args.embed] : undefined,
          }),
        });

        return {
          success: response.ok,
          output: { status: 'sent', message: args.message },
        };
      }

      return {
        success: true,
        output: {
          status: 'simulated',
          message: args.message,
        },
      };
    } catch (error) {
      return { success: false, output: null, error: error.message };
    }
  },
};

// ============= OAuth Tools =============

export const oauthConnectTool: Tool = {
  name: 'oauth_connect',
  description: 'Initiate OAuth flow for connecting external services.',
  category: 'api',
  parameters: {
    type: 'object',
    properties: {
      provider: {
        type: 'string',
        enum: ['google', 'github', 'microsoft', 'slack', 'discord'],
        description: 'OAuth provider',
      },
      scopes: {
        type: 'array',
        items: { type: 'string' },
        description: 'OAuth scopes to request',
      },
      redirectUri: {
        type: 'string',
        description: 'Redirect URI after auth',
      },
    },
    required: ['provider'],
  },
  execute: async (args: Record<string, any>): Promise<ToolExecutionResult> => {
    const oauthUrls: Record<string, string> = {
      google: 'https://accounts.google.com/o/oauth2/v2/auth',
      github: 'https://github.com/login/oauth/authorize',
      microsoft: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      slack: 'https://slack.com/oauth/v2/authorize',
      discord: 'https://discord.com/api/oauth2/authorize',
    };

    return {
      success: true,
      output: {
        provider: args.provider,
        authUrl: oauthUrls[args.provider],
        scopes: args.scopes || [],
        message: 'OAuth flow initiated. User needs to authorize the application.',
      },
    };
  },
};

// Export all API tools
export const apiTools: Tool[] = [
  httpRequestTool,
  graphqlQueryTool,
  databaseQueryTool,
  emailSendTool,
  cloudStorageTool,
  slackNotifyTool,
  discordNotifyTool,
  oauthConnectTool,
];

export default apiTools;
