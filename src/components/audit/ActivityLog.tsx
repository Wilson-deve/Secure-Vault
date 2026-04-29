import { AuditEntry, FileNode } from '../../types';
import './ActivityLog.css';

interface ActivityLogProps {
  auditLog: AuditEntry[];
  selectedNode: FileNode | null;
}

export default function ActivityLog({ auditLog, selectedNode }: ActivityLogProps) {
  const entries = selectedNode
    ? auditLog.filter(e => e.fileName === selectedNode.name)
    : auditLog;

  if (entries.length === 0) {
    return (
      <div className="activity-log-empty">
        No activity recorded for this file.
      </div>
    );
  }

  return (
    <div className="activity-log">
      {entries.map(entry => (
        <div key={entry.id} className="activity-entry">
          <div className="activity-dot" data-action={entry.action} />
          <div className="activity-body">
            <div className="activity-top">
              <span className="activity-time">{formatTime(entry.timestamp)}</span>
              <span className={`activity-badge action-${entry.action}`}>{entry.action}</span>
              <span className="activity-user">(you)</span>
            </div>
            <div className="activity-file">{entry.fileName}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${String(hour).padStart(2, '0')}:${m} ${ampm}`;
}
