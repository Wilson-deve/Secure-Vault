import { useState } from 'react';
import { FileNode, AuditEntry } from '../../types';
import ActivityLog from '../audit/ActivityLog';
import FileIcon from '../ui/FileIcon';
import { buildLocationString, findPath, syntheticDate } from '../../utils/treeUtils';
import rawData from '../../data/data.json';
import './PropertiesPanel.css';

const allData = rawData as FileNode[];

interface PropertiesPanelProps {
  selectedNode: FileNode | null;
  auditLog: AuditEntry[];
  onDownload: () => void;
  onRename: () => void;
}

export default function PropertiesPanel({ selectedNode, auditLog, onDownload, onRename }: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<'properties' | 'activity'>('properties');

  const isOpen = selectedNode !== null;
  const path = selectedNode ? findPath(allData, selectedNode.id) ?? [] : [];
  const location = selectedNode ? buildLocationString(path) : '';
  const dateModified = selectedNode ? syntheticDate(selectedNode.id) : '';

  return (
    <div className={`properties-panel${isOpen ? ' open' : ''}`}>
      {selectedNode && (
        <>
          <div className="props-header">
            <div className="props-file-icon">
              <FileIcon node={selectedNode} size={40} />
            </div>
            <div className="props-file-name">{selectedNode.name}</div>
          </div>

          <div className="props-tabs">
            <button
              className={`props-tab${activeTab === 'properties' ? ' active' : ''}`}
              onClick={() => setActiveTab('properties')}
            >
              Properties
            </button>
            <button
              className={`props-tab${activeTab === 'activity' ? ' active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
          </div>

          {activeTab === 'properties' ? (
            <div className="props-content">
              <div className="props-row">
                <span className="props-label">NAME</span>
                <span className="props-value">{selectedNode.name}</span>
              </div>
              <div className="props-row">
                <span className="props-label">TYPE</span>
                <span className="props-value">{selectedNode.type === 'file' ? getExtension(selectedNode.name).toUpperCase() + ' File' : 'Folder'}</span>
              </div>
              {selectedNode.size && (
                <div className="props-row">
                  <span className="props-label">SIZE</span>
                  <span className="props-value">{selectedNode.size}</span>
                </div>
              )}
              <div className="props-row">
                <span className="props-label">MODIFIED</span>
                <span className="props-value">{dateModified}</span>
              </div>
              <div className="props-row">
                <span className="props-label">LOCATION</span>
                <span className="props-value props-location">{location}</span>
              </div>

              <div className="props-actions">
                {selectedNode.type === 'file' && (
                  <button className="props-btn props-btn-primary" onClick={onDownload}>
                    <DownloadIcon /> Download
                  </button>
                )}
                <button className="props-btn" onClick={onRename}>
                  <RenameIcon /> Rename
                </button>
              </div>
            </div>
          ) : (
            <ActivityLog auditLog={auditLog} selectedNode={selectedNode} />
          )}
        </>
      )}
    </div>
  );
}

function getExtension(name: string): string {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : 'unknown';
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function RenameIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
