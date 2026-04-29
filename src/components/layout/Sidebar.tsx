import { FileNode } from '../../types';
import TreeNode from '../explorer/TreeNode';
import './Sidebar.css';

interface SidebarProps {
  nodes: FileNode[];
  selectedNode: FileNode | null;
  expandedIds: Set<string>;
  focusedId: string | null;
  searchQuery: string;
  onToggleExpand: (id: string) => void;
  onSelectNode: (node: FileNode) => void;
  onSetFocused: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  treeRef: React.RefObject<HTMLDivElement>;
}

export default function Sidebar({
  nodes,
  selectedNode,
  expandedIds,
  focusedId,
  searchQuery,
  onToggleExpand,
  onSelectNode,
  onSetFocused,
  onKeyDown,
  treeRef,
}: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebar-label">VAULT EXPLORER</div>
      <div
        className="sidebar-tree"
        ref={treeRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="tree"
        aria-label="File tree"
      >
        {nodes.map(node => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
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
    </div>
  );
}
