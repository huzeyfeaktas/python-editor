export interface User {
  id: string
  username: string
  email: string
  created_at: string
}

export interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder' | 'project'
  content?: string
  children?: FileItem[]
  parent_id?: string
  path: string
  is_open?: boolean
  language?: string
}

export interface EditorContextType {
  files: FileItem[]
  activeFile: FileItem | null
  openFiles: FileItem[]
  output: string
  isRunning: boolean
  currentProject: FileItem | null
  createFile: (name: string, parent_id?: string, content?: string, fileType?: string, language?: string) => void
  createFolder: (name: string, parent_id?: string) => void
  openFile: (file: FileItem) => void
  closeFile: (fileId: string) => void
  saveFile: (fileId: string, content: string) => void
  deleteFile: (fileId: string) => void
  runCode: (code: string, language?: string) => Promise<void>
  loadFiles: (projectId?: string) => Promise<void>
  renameFile: (fileId: string, newName: string) => void
  clearOutput: () => void
  refreshEditor: () => Promise<void>
}

export interface ExecutionResult {
  output: string
  error?: string
  execution_time: number
  success: boolean
}

export interface ThemeContextType {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
