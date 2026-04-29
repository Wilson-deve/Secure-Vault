import { useCallback, useEffect } from 'react';
import { FileNode } from '../types';
import { flattenVisible } from '../utils/treeUtils';

interface UseKeyboardNavOptions {
  data: FileNode[];
  expandedIds: Set<string>;
  focusedId: string | null;
  setFocusedId: (id: string) => void;
  onSelectNode: (node: FileNode) => void;
  onExpandFolder: (id: string) => void;
  onCollapseFolder: (id: string) => void;
  treeRef: React.RefObject<HTMLDivElement>;
}

export function useKeyboardNav({
  data,
  expandedIds,
  focusedId,
  setFocusedId,
  onSelectNode,
  onExpandFolder,
  onCollapseFolder,
  treeRef,
}: UseKeyboardNavOptions) {
  const visibleNodes = flattenVisible(data, expandedIds);

  const scrollIntoView = useCallback((id: string) => {
    const el = treeRef.current?.querySelector<HTMLElement>(`[data-node-id="${id}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [treeRef]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!visibleNodes.length) return;

    const currentIdx = focusedId ? visibleNodes.findIndex(n => n.id === focusedId) : -1;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const nextIdx = Math.min(currentIdx + 1, visibleNodes.length - 1);
        const next = visibleNodes[nextIdx];
        if (next) {
          setFocusedId(next.id);
          scrollIntoView(next.id);
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prevIdx = Math.max(currentIdx - 1, 0);
        const prev = visibleNodes[prevIdx];
        if (prev) {
          setFocusedId(prev.id);
          scrollIntoView(prev.id);
        }
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        if (focusedId) {
          const node = visibleNodes.find(n => n.id === focusedId);
          if (node?.type === 'folder' && !expandedIds.has(focusedId)) {
            onExpandFolder(focusedId);
          }
        }
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        if (focusedId) {
          const node = visibleNodes.find(n => n.id === focusedId);
          if (node?.type === 'folder' && expandedIds.has(focusedId)) {
            onCollapseFolder(focusedId);
          }
        }
        break;
      }
      case 'Enter': {
        e.preventDefault();
        if (focusedId) {
          const node = visibleNodes.find(n => n.id === focusedId);
          if (node) {
            if (node.type === 'file') {
              onSelectNode(node);
            } else {
              if (expandedIds.has(node.id)) {
                onCollapseFolder(node.id);
              } else {
                onExpandFolder(node.id);
              }
            }
          }
        }
        break;
      }
    }
  }, [visibleNodes, focusedId, expandedIds, setFocusedId, onSelectNode, onExpandFolder, onCollapseFolder, scrollIntoView]);

  useEffect(() => {
    // If focusedId is no longer visible (e.g. parent collapsed), reset
    if (focusedId && !visibleNodes.find(n => n.id === focusedId)) {
      if (visibleNodes.length > 0) {
        setFocusedId(visibleNodes[0].id);
      }
    }
  }, [visibleNodes, focusedId, setFocusedId]);

  return { handleKeyDown };
}
