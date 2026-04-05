/**
 * Shared Types for AI Content Management Tool
 */

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  favoriteTemplates?: string[];
}

export type TaskType = 'presentation' | 'card' | 'lesson' | 'news' | 'official' | 'image_prompt';

export type OutputFormat = 'markdown' | 'yaml' | 'json' | 'canva' | 'image_prompt';

export interface Template {
  id: string;
  name: string;
  type: TaskType;
  system_instruction: string;
  prompt_template: string;
  outputFormat: OutputFormat;
  isActive: boolean;
  version: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'pdf' | 'news' | 'role' | 'lexicon' | 'policy' | 'text' | 'web' | 'file' | 'url';
  description: string;
  content: string;
  url?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  userId: string;
  taskName: string;
  taskType: TaskType;
  topic: string;
  keywords: string;
  audience: string;
  tone?: string;
  style?: string;
  format: OutputFormat;
  extraConstraints?: string;
  selectedTemplateId: string;
  selectedDataSources: string[];
  result: string;
  modelOutput: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt?: string;
}

export interface SystemSettings {
  defaultModel: string;
  safetySettings: {
    harassment: string;
    hateSpeech: string;
    sexuallyExplicit: string;
    dangerousContent: string;
  };
  defaultOutputFormat: OutputFormat;
  enabledTaskTypes: TaskType[];
  defaultSystemPrompt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}
