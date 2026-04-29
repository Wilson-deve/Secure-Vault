import { ReactNode } from 'react';
import './AppShell.css';

interface AppShellProps {
  header: ReactNode;
  sidebar: ReactNode;
  main: ReactNode;
  properties: ReactNode;
  statusBar: ReactNode;
  auditOverlay?: ReactNode;
}

export default function AppShell({ header, sidebar, main, properties, statusBar, auditOverlay }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-header">{header}</header>
      <div className="app-body">
        <aside className="app-sidebar">{sidebar}</aside>
        <main className="app-main">{main}</main>
        <div className="app-properties">{properties}</div>
      </div>
      <footer className="app-statusbar">{statusBar}</footer>
      {auditOverlay}
    </div>
  );
}
