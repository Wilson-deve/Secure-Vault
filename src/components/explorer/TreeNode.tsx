import { useRef } from 'react';
import { FileNode } from '../../types';
import FileIcon from '../ui/FileIcon';
import './TreeNode.css';

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  selectedNode: FileNode | null;
  expandedIds: Set<string>;
  focusedId: string | null;
  searchQuery: string;
  onToggleExpand: (id: string) => void;
  onSelectNode: (node: FileNode) => void;
  onSetFocused: (id: string) => void;
}

export default function TreeNode({
  node,
  depth,
  selectedNode,
  expandedIds,
  focusedId,
  searchQuery,
  onToggleExpand,
  onSelectNode,
  onSetFocused,
}: TreeNodeProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isExpanded = node.type === 'folder' && expandedIds.has(node.id);
  const isSelected = selectedNode?.id === node.id;
  const isFocused = focusedId === node.id;

  const handleClick = () => {
    onSetFocused(node.id);
    if (node.type === 'folder') {
      onToggleExpand(node.id);
    } else {
      onSelectNode(node);
    }
  };

  return (
    <div className="tree-node" role="treeitem" aria-expanded={node.type === 'folder' ? isExpanded : undefined}>
      <div
        ref={rowRef}
        data-node-id={node.id}
        className={`tree-row${isSelected ? ' selected' : ''}${isFocused ? ' focused' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        tabIndex={-1}
      >
        <span className={`tree-chevron${node.type === 'folder' ? ' visible' : ''}${isExpanded ? ' expanded' : ''}`}>
          <ChevronIcon />
        </span>
        <span className="tree-icon">
          <FileIcon node={node} size={16} active={isSelected} />
        </span>
        <span className="tree-label">
          {searchQuery ? <HighlightedName name={node.name} query={searchQuery} /> : node.name}
        </span>
      </div>

      {node.type === 'folder' && isExpanded && node.children && node.children.length > 0 && (
        <div className="tree-children" role="group">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedNode={selectedNode}
              expandedIds={expandedIds}
              focusedId={focusedId}
              searchQuery={searchQuery}
              onToggleExpand={onToggleExpand}
              onSelectNode={onSelectNode}
              onSetFocused={onSetFocused}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  );
}

function HighlightedName({ name, query }: { name: string; query: string }) {
  if (!query) return <>{name}</>;
  const idx = name.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{name}</>;
  return (
    <>
      {name.slice(0, idx)}
      <mark className="search-highlight">{name.slice(idx, idx + query.length)}</mark>
      {name.slice(idx + query.length)}
    </>
  );
}
