import { FileNode } from '../../types';
import FileIcon from '../ui/FileIcon';
import './FileRow.css';

interface FileRowProps {
  node: FileNode;
  isSelected: boolean;
  dateModified: string;
  onClick: () => void;
}

export default function FileRow({ node, isSelected, dateModified, onClick }: FileRowProps) {
  const ext = node.type === 'file' ? getExt(node.name) : 'Folder';

  return (
    <tr
      className={`file-row${isSelected ? ' selected' : ''}`}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') onClick(); }}
    >
      <td className="file-row-name">
        <FileIcon node={node} size={18} active={isSelected} />
        <span>{node.name}</span>
      </td>
      <td className="file-row-type">{ext}</td>
      <td className="file-row-size">{node.size ?? '—'}</td>
      <td className="file-row-date">{dateModified}</td>
    </tr>
  );
}

function getExt(name: string): string {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
}
