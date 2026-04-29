import { FileNode } from '../types';

export function findPath(
  nodes: FileNode[],
  targetId: string,
  currentPath: FileNode[] = []
): FileNode[] | null {
  for (const node of nodes) {
    const newPath = [...currentPath, node];
    if (node.id === targetId) return newPath;
    if (node.children) {
      const result = findPath(node.children, targetId, newPath);
      if (result) return result;
    }
  }
  return null;
}

export function buildBreadcrumbString(path: FileNode[]): string {
  return ['VAULT', ...path.map(n => n.name)].join(' / ');
}

export function buildLocationString(path: FileNode[]): string {
  return '/' + path.map(n => n.name).join('/');
}

export function syntheticDate(id: string): string {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const month = (hash % 12) + 1;
  const day   = (hash % 28) + 1;
  const year  = 2023 + (hash % 2);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function flattenVisible(nodes: FileNode[], expandedIds: Set<string>): FileNode[] {
  const result: FileNode[] = [];
  for (const node of nodes) {
    result.push(node);
    if (node.type === 'folder' && expandedIds.has(node.id) && node.children) {
      result.push(...flattenVisible(node.children, expandedIds));
    }
  }
  return result;
}
