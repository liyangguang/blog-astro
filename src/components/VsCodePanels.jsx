import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import styles from './VsCodePanels.module.css';

export function VsCodePanels ({mainContent}) {
  return <div className={styles.wrapper}>
    <PanelGroup autoSaveId="yg-panel" direction="horizontal">
      <Panel minSize={10} className={styles.sidebar} defaultSize={20}>
        <PanelGroup direction="vertical">
          <Panel minSize={20} defaultSize={80}>
            Nav
          </Panel>
          <PanelResizeHandle className={`${styles.handle} ${styles.forVertical}`} />
          <Panel minSize={10} defaultSize={20}>
            Contact
          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle className={`${styles.handle} ${styles.forHorizontal}`} />
      <Panel minSize={20} className={styles.editor} defaultSize={80}>
        <div className={styles.scrollable}>
          {mainContent}
        </div>
      </Panel>
    </PanelGroup>
  </div>;
}
