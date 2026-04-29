import { FileNode } from '../../types';
import { findPath, buildBreadcrumbString } from '../../utils/treeUtils';
import rawData from '../../data/data.json';
import './Breadcrumb.css';

const allData = rawData as FileNode[];

interface BreadcrumbProps {
  selectedNode: FileNode | null;
}

export default function Breadcrumb({ selectedNode }: BreadcrumbProps) {
  const path = selectedNode ? findPath(allData, selectedNode.id) ?? [] : [];
  const parts = selectedNode
    ? buildBreadcrumbString(path).split(' / ')
    : ['VAULT'];

  return (
    <div className="breadcrumb" aria-label="Current path">
      {parts.map((part, i) => (
        <span key={i} className="breadcrumb-item">
          {i > 0 && <span className="breadcrumb-sep">/</span>}
          <span className={`breadcrumb-name${i === parts.length - 1 ? ' active' : ''}`}>{part}</span>
        </span>
      ))}
    </div>
  );
}
