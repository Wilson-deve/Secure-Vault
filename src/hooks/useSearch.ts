import { useMemo } from 'react';
import { FileNode } from '../types';

interface SearchResult {
  filteredData: FileNode[];
  searchExpandedIds: Set<string>;
}

function matchesQuery(name: string, query: string): boolean {
  return name.toLowerCase().includes(query.toLowerCase());
}

function filterTree(nodes: FileNode[], query: string): { filtered: FileNode[]; expandIds: string[] } {
  const expandIds: string[] = [];
  const filtered: FileNode[] = [];

  for (const node of nodes) {
    if (node.type === 'folder' && node.children) {
      const childResult = filterTree(node.children, query);
      const selfMatches = matchesQuery(node.name, query);
      if (selfMatches || childResult.filtered.length > 0) {
        filtered.push({ ...node, children: childResult.filtered });
        expandIds.push(node.id, ...childResult.expandIds);
      }
    } else {
      if (matchesQuery(node.name, query)) {
        filtered.push(node);
      }
    }
  }

  return { filtered, expandIds };
}

export function useSearch(query: string, data: FileNode[]): SearchResult {
  return useMemo(() => {
    if (!query.trim()) {
      return { filteredData: data, searchExpandedIds: new Set<string>() };
    }
    const { filtered, expandIds } = filterTree(data, query.trim());
    return { filteredData: filtered, searchExpandedIds: new Set(expandIds) };
  }, [query, data]);
}
