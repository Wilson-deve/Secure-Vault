import { useState, useRef, useCallback, useEffect } from 'react';
import { FileNode } from './types';
import rawData from './data/data.json';
import AppShell from './components/layout/AppShell';
import Sidebar from './components/layout/Sidebar';
import MainPanel from './components/layout/MainPanel';
import PropertiesPanel from './components/layout/PropertiesPanel';
import Breadcrumb from './components/explorer/Breadcrumb';
import SearchBar from './components/search/SearchBar';
import AuditOverlay from './components/audit/AuditOverlay';
import { useAuditLog } from './hooks/useAuditLog';
import { useSearch } from './hooks/useSearch';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { findPath } from './utils/treeUtils';
import './styles/global.css';
import './App.css';

const baseData = rawData as FileNode[];

export default function App() {
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuditOverlay, setShowAuditOverlay] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<FileNode | null>(null);
  const [prevExpandedIds, setPrevExpandedIds] = useState<Set<string>>(new Set());

  const treeRef = useRef<HTMLDivElement>(null);
  const { auditLog, logAction } = useAuditLog();
  const { filteredData, searchExpandedIds } = useSearch(searchQuery, baseData);

  const activeExpandedIds = searchQuery ? new Set([...expandedIds, ...searchExpandedIds]) : expandedIds;

  const handleSelectNode = useCallback((node: FileNode) => {
    setSelectedNode(node);
    setFocusedId(node.id);
    if (node.type === 'file') {
      logAction('opened', node);
      // Sync main panel to show the file's parent folder contents
      const path = findPath(baseData, node.id);
      if (path && path.length >= 2) {
        const parent = path[path.length - 2];
        setCurrentFolder(parent);
      }
    }
  }, [logAction]);

  const handleOpenFolder = useCallback((node: FileNode) => {
    setCurrentFolder(node);
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.add(node.id);
      return next;
    });
    setFocusedId(node.id);
  }, []);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // update currentFolder when a folder is expanded via tree click
        const node = findNodeById(baseData, id);
        if (node) setCurrentFolder(node);
      }
      return next;
    });
  }, []);

  const handleExpandFolder = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    const node = findNodeById(baseData, id);
    if (node) setCurrentFolder(node);
  }, []);

  const handleCollapseFolder = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleDownload = useCallback(() => {
    if (selectedNode) logAction('downloaded', selectedNode);
  }, [selectedNode, logAction]);

  const handleRename = useCallback(() => {
    if (!selectedNode) return;
    const newName = window.prompt('Enter new name:', selectedNode.name);
    if (newName && newName !== selectedNode.name) {
      logAction('renamed', selectedNode);
    }
  }, [selectedNode, logAction]);

  // F2 rename shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F2' && selectedNode) {
        handleRename();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selectedNode, handleRename]);

  // Preserve expand state when search is cleared
  const handleSearchChange = useCallback((q: string) => {
    if (!q && searchQuery) {
      setExpandedIds(prevExpandedIds);
    } else if (q && !searchQuery) {
      setPrevExpandedIds(expandedIds);
    }
    setSearchQuery(q);
  }, [searchQuery, expandedIds, prevExpandedIds]);

  const { handleKeyDown } = useKeyboardNav({
    data: filteredData,
    expandedIds: activeExpandedIds,
    focusedId,
    setFocusedId,
    onSelectNode: handleSelectNode,
    onExpandFolder: handleExpandFolder,
    onCollapseFolder: handleCollapseFolder,
    treeRef,
  });

  const selectedCount = selectedNode ? 1 : 0;

  const header = (
    <>
      <div className="sv-logo" aria-label="SecureVault">SV</div>
      <Breadcrumb selectedNode={selectedNode} />
      <SearchBar value={searchQuery} onChange={handleSearchChange} />
      <div className="header-actions">
        <button
          className="header-btn"
          onClick={() => setShowAuditOverlay(true)}
          title="View audit log"
          aria-label="Open audit log"
        >
          <ClockIcon />
        </button>
        <button className="header-btn" title="Settings" aria-label="Settings">
          <GearIcon />
        </button>
        <div className="header-avatar" aria-label="User">A</div>
      </div>
    </>
  );

  const statusBar = (
    <>
      <span className="status-left">
        {selectedCount === 0
          ? '0 ITEMS SELECTED'
          : `${selectedCount} ITEM${selectedCount !== 1 ? 'S' : ''} SELECTED`}
      </span>
      <span className="status-center">
        <span className="status-dot" />
        SECURE CONNECTION
      </span>
      <span className="status-right">SERVER: SV-NODE-04</span>
    </>
  );

  return (
    <>
      <AppShell
        header={header}
        sidebar={
          <Sidebar
            nodes={filteredData}
            selectedNode={selectedNode}
            expandedIds={activeExpandedIds}
            focusedId={focusedId}
            searchQuery={searchQuery}
            onToggleExpand={handleToggleExpand}
            onSelectNode={handleSelectNode}
            onSetFocused={setFocusedId}
            onKeyDown={handleKeyDown}
            treeRef={treeRef}
          />
        }
        main={
          <MainPanel
            currentFolder={currentFolder}
            selectedNode={selectedNode}
            onSelectNode={handleSelectNode}
            onOpenFolder={handleOpenFolder}
          />
        }
        properties={
          <PropertiesPanel
            selectedNode={selectedNode}
            auditLog={auditLog}
            onDownload={handleDownload}
            onRename={handleRename}
          />
        }
        statusBar={statusBar}
        auditOverlay={
          showAuditOverlay ? (
            <AuditOverlay auditLog={auditLog} onClose={() => setShowAuditOverlay(false)} />
          ) : undefined
        }
      />
    </>
  );
}

function findNodeById(nodes: FileNode[], id: string): FileNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNodeById(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
