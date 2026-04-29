import { FileNode } from '../../types';
import FileRow from '../explorer/FileRow';
import { syntheticDate } from '../../utils/treeUtils';
import './MainPanel.css';

interface MainPanelProps {
  currentFolder: FileNode | null;
  selectedNode: FileNode | null;
  onSelectNode: (node: FileNode) => void;
  onOpenFolder: (node: FileNode) => void;
}

export default function MainPanel({ currentFolder, selectedNode, onSelectNode, onOpenFolder }: MainPanelProps) {
  const items = currentFolder?.children ?? [];

  return (
    <div className="main-panel">
      {currentFolder ? (
        <>
          <div className="main-panel-title">{currentFolder.name}</div>
          <table className="file-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>TYPE</th>
                <th>SIZE</th>
                <th>DATE MODIFIED</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-folder">This folder is empty</td>
                </tr>
              ) : (
                items.map(item => (
                  <FileRow
                    key={item.id}
                    node={item}
                    isSelected={selectedNode?.id === item.id}
                    dateModified={syntheticDate(item.id)}
                    onClick={() => {
                      if (item.type === 'folder') {
                        onOpenFolder(item);
                      } else {
                        onSelectNode(item);
                      }
                    }}
                  />
                ))
              )}
            </tbody>
          </table>
        </>
      ) : (
        <div className="main-panel-empty">
          <span>Select a folder to view its contents</span>
        </div>
      )}
    </div>
  );
}
