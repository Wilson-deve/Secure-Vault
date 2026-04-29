import { AuditEntry } from '../../types';
import './AuditOverlay.css';

interface AuditOverlayProps {
  auditLog: AuditEntry[];
  onClose: () => void;
}

export default function AuditOverlay({ auditLog, onClose }: AuditOverlayProps) {
  return (
    <div className="audit-overlay" role="dialog" aria-modal="true" aria-label="Global audit log">
      <div className="audit-overlay-backdrop" onClick={onClose} />
      <div className="audit-overlay-panel">
        <div className="audit-overlay-header">
          <h2 className="audit-overlay-title">Audit Log</h2>
          <button className="audit-overlay-close" onClick={onClose} aria-label="Close audit log">
            <CloseIcon />
          </button>
        </div>
        {auditLog.length === 0 ? (
          <div className="audit-overlay-empty">No audit entries recorded yet.</div>
        ) : (
          <div className="audit-overlay-table-wrapper">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>TIMESTAMP</th>
                  <th>USER</th>
                  <th>ACTION</th>
                  <th>FILE</th>
                  <th>PATH</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map(entry => (
                  <tr key={entry.id}>
                    <td className="audit-ts">{formatFull(entry.timestamp)}</td>
                    <td className="audit-user">{entry.userId}</td>
                    <td>
                      <span className={`activity-badge action-${entry.action}`}>{entry.action}</span>
                    </td>
                    <td className="audit-file">{entry.fileName}</td>
                    <td className="audit-path">{entry.filePath}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function formatFull(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
