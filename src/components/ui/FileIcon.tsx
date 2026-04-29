import { FileNode } from '../../types';
import './FileIcon.css';

interface FileIconProps {
  node: FileNode;
  size?: number;
  active?: boolean;
}

export default function FileIcon({ node, size = 20, active = false }: FileIconProps) {
  if (node.type === 'folder') {
    return <FolderIcon size={size} active={active} />;
  }
  const ext = getExt(node.name);
  return <ExtIcon ext={ext} size={size} />;
}

function getExt(name: string): string {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

function FolderIcon({ size, active }: { size: number; active: boolean }) {
  const color = active ? 'var(--color-accent-blue)' : 'var(--color-text-muted)';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" />
    </svg>
  );
}

interface ExtIconProps {
  ext: string;
  size: number;
}

function ExtIcon({ ext, size }: ExtIconProps) {
  const fontSize = Math.max(8, Math.round(size * 0.3));

  switch (ext) {
    case 'pdf':
      return <BadgeIcon label="PDF" color="var(--color-accent-red)" size={size} fontSize={fontSize} />;
    case 'docx':
    case 'doc':
      return <BadgeIcon label="DOC" color="var(--color-accent-blue)" size={size} fontSize={fontSize} />;
    case 'xlsx':
    case 'xls':
      return <BadgeIcon label="XLS" color="var(--color-accent-teal)" size={size} fontSize={fontSize} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
      return <ImageIcon size={size} />;
    case 'txt':
      return <TextIcon size={size} />;
    case 'yaml':
    case 'yml':
      return <GearIcon size={size} />;
    case 'sh':
      return <TerminalIcon size={size} />;
    case 'ttf':
    case 'otf':
      return <FontIcon size={size} fontSize={fontSize} />;
    default:
      return <GenericFileIcon size={size} />;
  }
}

function BadgeIcon({ label, color, size, fontSize }: { label: string; color: string; size: number; fontSize: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="18" height="20" rx="2" fill="var(--color-surface-2)" stroke={color} strokeWidth="1.5" />
      <rect x="3" y="14" width="18" height="8" rx="0" fill={color} />
      <text x="12" y="21" textAnchor="middle" fill="white" fontSize={fontSize} fontFamily="var(--font-mono)" fontWeight="bold">{label}</text>
    </svg>
  );
}

function ImageIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-warn)" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="var(--color-accent-warn)" stroke="none" />
      <polyline points="21,15 16,10 5,21" />
    </svg>
  );
}

function TextIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function GearIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-teal)" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function TerminalIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-teal)" strokeWidth="1.5">
      <polyline points="4,17 10,11 4,5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function FontIcon({ size, fontSize }: { size: number; fontSize: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <text x="12" y="18" textAnchor="middle" fill="var(--color-accent-warn)" fontSize={fontSize + 4} fontFamily="var(--font-sans)" fontWeight="bold">Aa</text>
    </svg>
  );
}

function GenericFileIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" />
    </svg>
  );
}
