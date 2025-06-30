// Base types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Course Content Types
export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MCQQuestion extends BaseEntity {
  question: string;
  questionImage?: string;
  options: MCQOption[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface CodingQuestion extends BaseEntity {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sampleInput: string;
  sampleOutput: string;
  constraints: string;
  solutionFiles: SolutionFile[];
  tags: string[];
}

export interface SolutionFile {
  id: string;
  name: string;
  content: string;
  language: string;
  type: 'file' | 'folder' | 'image';
  url?: string;
}

export interface VideoContent extends BaseEntity {
  title: string;
  description: string;
  url: string;
  duration: number;
  thumbnail?: string;
  subtitles?: string;
  quality: string[];
}

export interface PDFContent extends BaseEntity {
  title: string;
  description: string;
  url: string;
  pages: number;
  size: number;
}

// Course Item Types
export interface CourseItem extends BaseEntity {
  title: string;
  type: 'video' | 'mcq' | 'coding' | 'pdf';
  content: VideoContent | MCQQuestion | CodingQuestion | PDFContent;
  order: number;
  courseId: string;
  isCompleted?: boolean;
  duration?: number;
}

// Course Types
export interface Course extends BaseEntity {
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  items: CourseItem[];
  totalDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  isPublished: boolean;
  organizationId?: string;
  collectionIds: string[];
  customFields: Record<string, any>;
}

// User Progress Types
export interface MCQAttempt {
  questionId: string;
  selectedOptions: string[];
  isCorrect: boolean;
  attemptedAt: Date;
}

export interface UserProgress {
  courseId: string;
  completedItems: string[];
  mcqAttempts: MCQAttempt[];
  lastAccessedAt: Date;
  progressPercentage: number;
}

// Document types
export interface Document extends BaseEntity {
  title: string;
  content: string;
  type: 'text' | 'markdown' | 'code';
  tags: string[];
  isStarred: boolean;
  folderId?: string;
}

// Project types
export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  type: string;
  size: number;
}

export interface Project extends BaseEntity {
  name: string;
  description: string;
  files: ProjectFile[];
  tags: string[];
  isStarred: boolean;
}

// Code Editor types
export interface CodeFile extends BaseEntity {
  name: string;
  content: string;
  language: string;
  path: string;
  isModified: boolean;
  size?: number;
  encoding?: string;
}

export interface CodeProject extends BaseEntity {
  name: string;
  description: string;
  files: CodeFile[];
  activeFileId: string | null;
  settings?: {
    theme: 'light' | 'dark';
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
    minimap: boolean;
    lineNumbers: boolean;
  };
}

export interface TerminalSession {
  id: string;
  name: string;
  history: string[];
  isActive: boolean;
  workingDirectory?: string;
  environment?: Record<string, string>;
}

// Organization and Collection types
export interface Organization extends BaseEntity {
  name: string;
  description: string;
  logo?: string;
  website?: string;
}

export interface CourseCollection extends BaseEntity {
  name: string;
  description: string;
  courseIds: string[];
  isPublic: boolean;
}

export interface CourseGroup extends BaseEntity {
  name: string;
  description: string;
  courseIds: string[];
  isPublic: boolean;
}

// File System types
export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  parentId?: string;
  children?: FileSystemItem[];
  size?: number;
  lastModified: Date;
}

// Editor Configuration
export interface EditorConfig {
  theme: 'light' | 'dark' | 'high-contrast';
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: 'on' | 'off' | 'wordWrapColumn';
  lineNumbers: 'on' | 'off' | 'relative';
  minimap: boolean;
  autoSave: 'off' | 'afterDelay' | 'onFocusChange';
  formatOnSave: boolean;
  formatOnType: boolean;
}

// Language Support
export interface LanguageDefinition {
  id: string;
  name: string;
  extensions: string[];
  mimeTypes: string[];
  keywords: string[];
  operators: string[];
  brackets: Array<[string, string]>;
  autoClosingPairs: Array<{ open: string; close: string }>;
  surroundingPairs: Array<{ open: string; close: string }>;
  comments: {
    lineComment?: string;
    blockComment?: [string, string];
  };
  snippets: Record<string, string>;
}

// Git Integration
export interface GitRepository {
  id: string;
  name: string;
  url: string;
  branch: string;
  commits: GitCommit[];
  status: GitStatus;
}

export interface GitCommit {
  id: string;
  message: string;
  author: string;
  date: Date;
  hash: string;
}

export interface GitStatus {
  modified: string[];
  added: string[];
  deleted: string[];
  untracked: string[];
}

// Extension System
export interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  main: string;
  contributes: {
    commands?: Command[];
    languages?: LanguageDefinition[];
    themes?: Theme[];
    snippets?: Snippet[];
  };
}

export interface Command {
  command: string;
  title: string;
  category?: string;
  icon?: string;
}

export interface Theme {
  id: string;
  name: string;
  type: 'light' | 'dark' | 'high-contrast';
  colors: Record<string, string>;
  tokenColors: TokenColor[];
}

export interface TokenColor {
  scope: string | string[];
  settings: {
    foreground?: string;
    background?: string;
    fontStyle?: string;
  };
}

export interface Snippet {
  prefix: string;
  body: string | string[];
  description: string;
  scope?: string;
}

// Debugging
export interface DebugConfiguration {
  type: string;
  request: 'launch' | 'attach';
  name: string;
  program?: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  port?: number;
}

export interface Breakpoint {
  id: string;
  file: string;
  line: number;
  condition?: string;
  enabled: boolean;
}

// Search and Replace
export interface SearchOptions {
  query: string;
  isRegex: boolean;
  isCaseSensitive: boolean;
  isWholeWord: boolean;
  includeFiles: string[];
  excludeFiles: string[];
}

export interface SearchResult {
  file: string;
  line: number;
  column: number;
  text: string;
  match: string;
}

// Workspace
export interface Workspace {
  id: string;
  name: string;
  folders: WorkspaceFolder[];
  settings: Record<string, any>;
  extensions: string[];
}

export interface WorkspaceFolder {
  name: string;
  path: string;
}