export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  children?: FileNode[];
  dateModified?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  action: 'opened' | 'downloaded' | 'moved' | 'deleted' | 'renamed';
  fileName: string;
  filePath: string;
  userId: string;
}

export interface AppState {
  selectedNode: FileNode | null;
  expandedIds: Set<string>;
  focusedId: string | null;
  searchQuery: string;
  auditLog: AuditEntry[];
}
