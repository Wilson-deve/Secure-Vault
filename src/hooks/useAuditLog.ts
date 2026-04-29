import { useState, useCallback } from 'react';
import { AuditEntry, FileNode } from '../types';
import { buildLocationString, findPath } from '../utils/treeUtils';
import rawData from '../data/data.json';

const allData = rawData as FileNode[];

export function useAuditLog() {
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);

  const logAction = useCallback((action: AuditEntry['action'], node: FileNode) => {
    const path = findPath(allData, node.id) ?? [];
    const entry: AuditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      action,
      fileName: node.name,
      filePath: buildLocationString(path),
      userId: 'admin@securevault.com',
    };
    setAuditLog(prev => [entry, ...prev]);
  }, []);

  return { auditLog, logAction };
}
