/**
 * Scaffold: Azure Visual Designer Blade with Collapsible Side Panel
 *
 * A canvas-based visual designer layout used by Logic Apps, Data Factory,
 * Power Automate, and similar workflow/pipeline editors. Features a
 * drag-to-connect canvas with workflow nodes, connector lines, conditional
 * branching, a designer/code-view toggle, and a config side panel.
 *
 * Layout:
 *   AppFrame → Header → slot="main"
 *     Breadcrumb (full width)
 *     PageHeader (full width, above sidebar)
 *     blade-body:
 *       Collapsible sidebar (left) — CuiSideNav with resource nav sections
 *       Toggle strip — thin chevron column
 *       Content area (right):
 *         Toolbar (Run, Save, Discard, Designer/Code toggle)
 *         Canvas (dot-grid background, workflow nodes, connector lines)
 *         Canvas tools (zoom, fit, undo/redo — bottom-left)
 *         Config side panel (opens on node select)
 *
 * Customization points (TODOs):
 *   - headerTitle — top-level Azure header text
 *   - pageTitle, resourceType — page identity
 *   - breadcrumb[] — breadcrumb trail
 *   - serviceIconKey — azure-icons key for the leading icon
 *   - navSections[] — sidebar nav items (group by heading)
 *   - workflowNodes[] — nodes on the canvas (trigger, action, condition, etc.)
 *   - connectorCategories[] — available connectors for "Add Step"
 */
import { useState } from 'react';
import {
  CuiAppFrame,
  CuiAvatar,
  CuiBreadcrumb,
  CuiBreadcrumbItem,
  CuiButton,
  CuiDivider,
  CuiHeader,
  CuiIcon,
  CuiInput,
  CuiMenu,
  CuiMenuItem,
  CuiNavHeading,
  CuiNavItem,
  CuiPersona,
  CuiPopOver,
  CuiSearchBox,
  CuiSideNav,
  CuiToolbar,
} from '@charm-ux/cui/react';
import CopilotButton from '../experiments/copilot-button';
import { azureIcon } from './azure-icons';
import PageHeader from './PageHeader';
import AzurePortalNav from './PatternAzurePortalNav';

// ─── Types ───

interface NavItemConfig {
  label: string;
  iconName?: string;
  iconUrl?: string;
  selected?: boolean;
}

interface NavSectionConfig {
  heading?: string;
  items: NavItemConfig[];
}

type WorkflowNodeType = 'trigger' | 'action' | 'condition' | 'foreach' | 'scope';

interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  title: string;
  subtitle: string;
  icon: string;
  status?: 'success' | 'failed' | 'skipped' | 'running' | 'pending';
  expanded?: boolean;
  children?: WorkflowNode[];
  config?: Record<string, string>;
}

interface ConnectorCategory {
  label: string;
  connectors: { name: string; icon: string }[];
}

// ─── Data (TODO: customize these) ───

const headerTitle = 'Microsoft Azure';
const pageTitle = 'my-workflow';                    // TODO: resource name
const resourceType = 'Logic app';                   // TODO: resource type
const breadcrumb = ['Home', 'my-resource-group', 'my-workflow']; // TODO
const serviceIconKey = 'logic-app';                 // TODO: azure-icons key

const navSections: NavSectionConfig[] = [
  {
    items: [
      { label: 'Overview', iconUrl: 'https://api.iconify.design/fluent:home-24-regular.svg' },
      { label: 'Activity log', iconUrl: 'https://api.iconify.design/fluent:document-text-24-regular.svg' },
      { label: 'Access control (IAM)', iconUrl: 'https://api.iconify.design/fluent:people-24-regular.svg' },
      { label: 'Tags', iconUrl: 'https://api.iconify.design/fluent:tag-24-regular.svg' },
      { label: 'Diagnose and solve problems', iconUrl: 'https://api.iconify.design/fluent:wrench-24-regular.svg' },
    ],
  },
  {
    heading: 'Development Tools',
    items: [
      { label: 'Designer', iconUrl: 'https://api.iconify.design/fluent:design-ideas-24-regular.svg', selected: true },
      { label: 'Code view', iconUrl: 'https://api.iconify.design/fluent:code-24-regular.svg' },
      { label: 'Versions', iconUrl: 'https://api.iconify.design/fluent:history-24-regular.svg' },
      { label: 'API connections', iconUrl: 'https://api.iconify.design/fluent:plug-connected-24-regular.svg' },
    ],
  },
  {
    heading: 'Run History',
    items: [
      { label: 'Runs history', iconUrl: 'https://api.iconify.design/fluent:clock-24-regular.svg' },
      { label: 'Trigger history', iconUrl: 'https://api.iconify.design/fluent:flash-24-regular.svg' },
    ],
  },
  {
    heading: 'Settings',
    items: [
      { label: 'Workflow settings', iconUrl: 'https://api.iconify.design/fluent:settings-24-regular.svg' },
      { label: 'Properties', iconUrl: 'https://api.iconify.design/fluent:info-24-regular.svg' },
      { label: 'Locks', iconUrl: 'https://api.iconify.design/fluent:lock-closed-24-regular.svg' },
    ],
  },
];

// TODO: define your workflow nodes
const workflowNodes: WorkflowNode[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    title: 'When a HTTP request is received',
    subtitle: 'Request',
    icon: 'https://api.iconify.design/fluent:globe-24-filled.svg',
    status: 'success',
    config: { Method: 'POST', 'Relative path': '/api/trigger' },
  },
  {
    id: 'condition-1',
    type: 'condition',
    title: 'Condition',
    subtitle: 'Control',
    icon: 'https://api.iconify.design/fluent:branch-fork-24-regular.svg',
    status: 'success',
    config: { Expression: "@equals(triggerBody()?['status'], 'approved')" },
    children: [
      {
        id: 'action-true',
        type: 'action',
        title: 'Send an email (V2)',
        subtitle: 'Office 365 Outlook',
        icon: 'https://api.iconify.design/fluent:mail-24-filled.svg',
        status: 'success',
        config: { To: 'user@contoso.com', Subject: 'Request Approved' },
      },
      {
        id: 'action-false',
        type: 'action',
        title: 'Create item',
        subtitle: 'SharePoint',
        icon: 'https://api.iconify.design/fluent:document-add-24-filled.svg',
        status: 'pending',
        config: { 'Site Address': 'https://contoso.sharepoint.com', 'List Name': 'PendingRequests' },
      },
    ],
  },
  {
    id: 'action-response',
    type: 'action',
    title: 'Response',
    subtitle: 'Request',
    icon: 'https://api.iconify.design/fluent:arrow-reply-24-filled.svg',
    status: 'success',
    config: { 'Status Code': '200', Body: '{ "status": "complete" }' },
  },
];

// TODO: define connector categories for the "Add Step" panel
const connectorCategories: ConnectorCategory[] = [
  {
    label: 'Popular',
    connectors: [
      { name: 'HTTP', icon: 'https://api.iconify.design/fluent:globe-24-filled.svg' },
      { name: 'Office 365 Outlook', icon: 'https://api.iconify.design/fluent:mail-24-filled.svg' },
      { name: 'SharePoint', icon: 'https://api.iconify.design/fluent:document-add-24-filled.svg' },
      { name: 'Azure Blob Storage', icon: 'https://api.iconify.design/fluent:storage-24-filled.svg' },
      { name: 'SQL Server', icon: 'https://api.iconify.design/fluent:database-24-filled.svg' },
      { name: 'Teams', icon: 'https://api.iconify.design/fluent:people-team-24-filled.svg' },
    ],
  },
  {
    label: 'Control',
    connectors: [
      { name: 'Condition', icon: 'https://api.iconify.design/fluent:branch-fork-24-regular.svg' },
      { name: 'For each', icon: 'https://api.iconify.design/fluent:arrow-repeat-all-24-regular.svg' },
      { name: 'Switch', icon: 'https://api.iconify.design/fluent:navigation-24-regular.svg' },
      { name: 'Scope', icon: 'https://api.iconify.design/fluent:group-24-regular.svg' },
      { name: 'Terminate', icon: 'https://api.iconify.design/fluent:dismiss-circle-24-regular.svg' },
      { name: 'Delay', icon: 'https://api.iconify.design/fluent:timer-24-regular.svg' },
    ],
  },
];

// ─── Workflow Node Card ───

function WorkflowNodeCard({
  node,
  selected,
  onSelect,
}: {
  node: WorkflowNode;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(node.type === 'trigger');

  return (
    <div
      className={`workflow-node ${node.type} ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(node.id)}
    >
      <div className="node-header">
        <div className="node-icon">
          <CuiIcon url={node.icon} style={{ fontSize: '18px' }} />
        </div>
        <div className="node-title">
          <div className="node-title-text">{node.title}</div>
          <div className="node-subtitle">{node.subtitle}</div>
        </div>
        {node.status && <div className={`node-status ${node.status}`} title={node.status} />}
      </div>
      {expanded && node.config && (
        <div className="node-body">
          {Object.entries(node.config).map(([key, value]) => (
            <div className="node-config-row" key={key}>
              <span className="node-config-label">{key}:</span>
              <span className="node-config-value">{value}</span>
            </div>
          ))}
        </div>
      )}
      <button
        className="node-collapse-btn"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
      >
        <CuiIcon name={expanded ? 'chevron-up' : 'chevron-down'} style={{ fontSize: '12px' }} />
        {expanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
}

// ─── Connector Line ───

function ConnectorLine({ onAdd }: { onAdd?: () => void }) {
  return (
    <div className="connector-line">
      <div className="line" />
      {onAdd && (
        <button className="connector-add-btn" onClick={onAdd} title="Add a step" aria-label="Add a step">
          +
        </button>
      )}
    </div>
  );
}

// ─── Condition Branch ───

function ConditionBranch({
  node,
  selectedId,
  onSelect,
  onAdd,
}: {
  node: WorkflowNode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
}) {
  const trueChild = node.children?.[0];
  const falseChild = node.children?.[1];

  return (
    <div className="condition-branch-container">
      <WorkflowNodeCard node={node} selected={selectedId === node.id} onSelect={onSelect} />
      <ConnectorLine />
      <div className="branch-lanes">
        <div className="branch-lane">
          <span className="branch-label true-branch">True</span>
          <ConnectorLine />
          {trueChild ? (
            <WorkflowNodeCard node={trueChild} selected={selectedId === trueChild.id} onSelect={onSelect} />
          ) : (
            <button className="connector-add-btn" style={{ position: 'relative' }} onClick={onAdd}>+</button>
          )}
          <ConnectorLine onAdd={onAdd} />
        </div>
        <div className="branch-lane">
          <span className="branch-label false-branch">False</span>
          <ConnectorLine />
          {falseChild ? (
            <WorkflowNodeCard node={falseChild} selected={selectedId === falseChild.id} onSelect={onSelect} />
          ) : (
            <button className="connector-add-btn" style={{ position: 'relative' }} onClick={onAdd}>+</button>
          )}
          <ConnectorLine onAdd={onAdd} />
        </div>
      </div>
    </div>
  );
}

// ─── Config Side Panel ───

function ConfigPanel({ node, onClose }: { node: WorkflowNode; onClose: () => void }) {
  return (
    <div className="config-panel">
      <div className="config-panel-header">
        <CuiIcon url={node.icon} style={{ fontSize: '20px' }} />
        <span className="config-panel-title">{node.title}</span>
        <CuiButton appearance="subtle" iconOnly size="small" onClick={onClose}>
          <CuiIcon name="dismiss" />
        </CuiButton>
      </div>
      <div className="config-panel-body">
        {node.config &&
          Object.entries(node.config).map(([key, value]) => (
            <div className="config-field" key={key}>
              <label>{key}</label>
              <CuiInput value={value} style={{ width: '100%' } as any} />
            </div>
          ))}
      </div>
    </div>
  );
}

// ─── Navigation Sidebar ───

function Navigation() {
  return (
    <CuiSideNav size="small">
      {navSections.map((section, si) => (
        <span key={si}>
          {section.heading && <CuiNavHeading>{section.heading}</CuiNavHeading>}
          {section.items.map((item, ii) => (
            <CuiNavItem
              key={ii}
              label={item.label}
              href="#"
              selected={item.selected || undefined}
            >
              {item.iconUrl && <CuiIcon slot="icon" url={item.iconUrl} />}
              {item.iconName && <CuiIcon slot="icon" name={item.iconName} />}
            </CuiNavItem>
          ))}
        </span>
      ))}
    </CuiSideNav>
  );
}

// ─── Styles ───

const styles = `
  body { margin: 0; }

  /* ─── Layout ─── */
  [slot='main'] {
    min-width: 320px;
    padding: 0;
    background: var(--neutral-background2);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .blade-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .blade-sidebar {
    width: 220px;
    min-width: 220px;
    border-right: 1px solid var(--neutral-stroke2);
    background: var(--neutral-background1);
    overflow-y: auto;
    transition: width 0.2s ease, min-width 0.2s ease;
  }
  .blade-sidebar.collapsed {
    width: 0;
    min-width: 0;
    overflow: hidden;
    border-right: none;
  }

  .blade-toggle-strip {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 28px;
    min-width: 28px;
    padding-top: 8px;
    background: var(--neutral-background2);
    border-right: 1px solid var(--neutral-stroke2);
  }

  .blade-content {
    flex: 1;
    overflow: hidden;
    background: var(--neutral-background2);
    display: flex;
    flex-direction: row;
  }

  /* ─── Toolbar no-wrap ─── */
  cui-toolbar { flex-wrap: nowrap; }
  cui-toolbar cui-button,
  cui-toolbar cui-menu cui-button { white-space: nowrap; }
  cui-toolbar cui-button::part(button-control),
  cui-toolbar cui-menu cui-button::part(button-control) { white-space: nowrap; flex-wrap: nowrap; }

  /* ─── Designer Toolbar ─── */
  .designer-toolbar {
    padding: 0 16px;
    border-bottom: 1px solid var(--neutral-stroke2);
    background: var(--neutral-background1);
  }

  /* ─── Canvas ─── */
  .canvas-container {
    flex: 1;
    overflow: auto;
    background: var(--neutral-background3);
    position: relative;
  }
  .canvas-grid {
    background-image: radial-gradient(circle, var(--neutral-stroke3) 1px, transparent 1px);
    background-size: 20px 20px;
    min-height: 100%;
    min-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px 80px;
  }

  /* ─── Workflow Nodes ─── */
  .workflow-node {
    width: 340px;
    background: var(--neutral-background1);
    border: 1.5px solid var(--neutral-stroke2);
    border-radius: var(--border-radius-lg);
    overflow: visible;
    box-shadow: var(--shadow4);
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s, outline-color 0.15s;
    outline: 2px solid transparent;
    outline-offset: 1px;
  }
  .workflow-node:hover {
    border-color: var(--brand-stroke1);
    box-shadow: var(--shadow8);
  }
  .workflow-node:active,
  .workflow-node.selected {
    border-color: var(--brand-stroke1);
    outline: 2px solid var(--brand-stroke1);
    box-shadow: var(--shadow8);
  }
  .node-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: var(--neutral-background1);
    border-bottom: 1px solid var(--neutral-stroke2);
  }
  .node-icon {
    width: 28px;
    height: 28px;
    border-radius: var(--border-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .trigger .node-icon { background: var(--brand-background1); color: white; }
  .action .node-icon  { background: var(--neutral-background4); }
  .condition .node-icon { background: #4285f4; color: white; }

  .node-title { flex: 1; min-width: 0; }
  .node-title-text {
    font-size: var(--font-size-base300);
    font-weight: var(--font-weight-semi-bold);
    color: var(--neutral-foreground1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .node-subtitle {
    font-size: var(--font-size-base100);
    color: var(--neutral-foreground3);
  }

  .node-status { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .node-status.success { background: var(--status-success-foreground1); }
  .node-status.failed  { background: var(--status-danger-foreground1); }
  .node-status.running { background: var(--status-warning-foreground1); animation: pulse 1.5s infinite; }
  .node-status.pending { background: var(--neutral-foreground4); }
  .node-status.skipped { background: var(--neutral-foreground4); }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .node-body {
    padding: 12px 14px;
    font-size: var(--font-size-base200);
    color: var(--neutral-foreground2);
  }
  .node-config-row { display: flex; gap: 8px; padding: 3px 0; }
  .node-config-label {
    color: var(--neutral-foreground3);
    font-weight: var(--font-weight-semi-bold);
    min-width: 80px;
    flex-shrink: 0;
  }
  .node-config-value {
    color: var(--neutral-foreground1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .node-collapse-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 14px;
    font-size: var(--font-size-base100);
    color: var(--brand-foreground-link);
    cursor: pointer;
    border: none;
    background: none;
  }
  .node-collapse-btn:hover { text-decoration: underline; }

  /* ─── Connector Lines ─── */
  .connector-line {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    height: 48px;
  }
  .connector-line .line {
    width: 2px;
    flex: 1;
    background: var(--neutral-stroke1);
  }
  .connector-add-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid var(--neutral-stroke1);
    background: var(--neutral-background1);
    color: var(--neutral-foreground2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: all 0.15s;
    z-index: 1;
    padding: 0;
    line-height: 1;
  }
  .connector-add-btn:hover {
    border-color: var(--brand-stroke1);
    color: var(--brand-foreground1);
    background: var(--brand-background2);
    box-shadow: var(--shadow4);
  }

  /* ─── Condition Branch ─── */
  .condition-branch-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .branch-lanes {
    display: flex;
    gap: 40px;
    justify-content: center;
    position: relative;
    width: 100%;
  }
  .branch-lane {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 340px;
  }
  .branch-label {
    font-size: var(--font-size-base200);
    font-weight: var(--font-weight-semi-bold);
    color: var(--neutral-foreground2);
    padding: 4px 16px;
    border-radius: var(--border-radius-md);
    background: var(--neutral-background1);
    border: 1px solid var(--neutral-stroke2);
  }
  .branch-label.true-branch {
    color: var(--status-success-foreground1);
    border-color: var(--status-success-foreground1);
  }
  .branch-label.false-branch {
    color: var(--status-danger-foreground1);
    border-color: var(--status-danger-foreground1);
  }

  /* ─── Canvas Tools (bottom-left) ─── */
  .canvas-tools {
    position: absolute;
    bottom: 16px;
    left: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    background: var(--neutral-background1);
    border: 1px solid var(--neutral-stroke2);
    border-radius: var(--border-radius-md);
    padding: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14), 0 0 2px rgba(0, 0, 0, 0.12);
    width: 44px;
    overflow: hidden;
  }
  .canvas-tools cui-button {
    width: 44px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .canvas-tools cui-button::part(button-control) {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0;
  }
  .canvas-tools-divider {
    width: 100%;
    height: 1px;
    background: var(--neutral-stroke2);
    flex-shrink: 0;
  }

  /* ─── Config Panel (side) ─── */
  .config-panel {
    width: 360px;
    border-left: 1px solid var(--neutral-stroke2);
    background: var(--neutral-background1);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .config-panel-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--neutral-stroke2);
  }
  .config-panel-title {
    font-size: var(--font-size-base400);
    font-weight: var(--font-weight-semi-bold);
    color: var(--neutral-foreground1);
    flex: 1;
  }
  .config-panel-body { padding: 16px; flex: 1; }
  .config-field { margin-bottom: 16px; }
  .config-field label {
    display: block;
    font-size: var(--font-size-base200);
    font-weight: var(--font-weight-semi-bold);
    color: var(--neutral-foreground2);
    margin-bottom: 4px;
  }
`;

// ─── Main Component ───

export default function ScaffoldDesignerBlade() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'designer' | 'code'>('designer');
  const [showAddPanel, setShowAddPanel] = useState(false);

  const selectedNode = [...workflowNodes, ...(workflowNodes.flatMap(n => n.children || []))]
    .find(n => n.id === selectedNodeId);

  return (
    <>
      <CuiAppFrame skipToMainText="Skip to main content">
        {/* ─── Header ─── */}
        <CuiHeader slot="header" navigationIconLabel="toggle navigation">
          <CuiButton slot="title" appearance="transparent">
            <span className="font-base400">{headerTitle}</span>
          </CuiButton>
          <CuiSearchBox
            slot="search"
            hideLabel
            placeholder="Search resources, services, and docs (G+/)"
          />
          <CopilotButton slot="search" />
          <CuiButton slot="overflow-actions" appearance="subtle" shape="rounded" size="large" iconOnly aria-label="Cloud Shell">
            <CuiIcon url="https://api.iconify.design/fluent:terminal-24-regular.svg" />
          </CuiButton>
          <CuiButton slot="overflow-actions" appearance="subtle" shape="rounded" size="large" iconOnly aria-label="Notifications">
            <CuiIcon name="alert" />
          </CuiButton>
          <CuiButton slot="overflow-actions" appearance="subtle" shape="rounded" size="large" iconOnly aria-label="Settings">
            <CuiIcon name="settings" />
          </CuiButton>
          <CuiButton slot="overflow-actions" appearance="subtle" shape="rounded" size="large" iconOnly aria-label="Help + support">
            <CuiIcon url="https://api.iconify.design/fluent:question-circle-24-regular.svg" />
          </CuiButton>
          <CuiButton slot="overflow-actions" appearance="subtle" shape="rounded" size="large" iconOnly aria-label="Feedback">
            <CuiIcon name="person-feedback" />
          </CuiButton>
          <CuiPopOver slot="actions-end" fixedPlacement>
            <CuiButton slot="anchor" appearance="subtle" shape="rounded" size="large" iconOnly>
              <CuiAvatar size={24} name="Alex Britez" />
            </CuiButton>
            <CuiPersona>
              <CuiAvatar name="Alex Britez" />
              <div slot="primary">Alex Britez</div>
              <div slot="secondary">Available</div>
            </CuiPersona>
            <CuiDivider className="my-xl" />
            <div className="d-flex flex-column align-start">
              <CuiButton appearance="link">Your profile</CuiButton>
              <CuiButton appearance="link">View account</CuiButton>
              <CuiButton appearance="link">Sign Out</CuiButton>
            </div>
          </CuiPopOver>
        </CuiHeader>

        {/* ─── Global Navigation ─── */}
        <AzurePortalNav />

        {/* ─── Main Content ─── */}
        <div slot="main" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Breadcrumb — full width */}
          <div style={{ padding: '4px 16px 0' }}>
            <CuiBreadcrumb label="Navigation" size="small">
              {breadcrumb.map((crumb, i) => (
                <CuiBreadcrumbItem
                  key={i}
                  href="#"
                  active={i === breadcrumb.length - 1 || undefined}
                  current={i === breadcrumb.length - 1 ? 'page' : undefined}
                >
                  {crumb}
                </CuiBreadcrumbItem>
              ))}
            </CuiBreadcrumb>
          </div>

          {/* Title — full width above sidebar */}
          <PageHeader
            icon={azureIcon(serviceIconKey)}
            title={<><strong>{pageTitle}</strong> | Designer</>}
            subtitle={resourceType}
            titleWeight="regular"
            horizontalPadding="16px"
            showFavorite
          />

          {/* ─── Body: sidebar + content ─── */}
          <div className="blade-body">
            <div className={`blade-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
              <Navigation />
            </div>

            <div className="blade-content">
              <div className="blade-toggle-strip">
                <CuiButton
                  appearance="subtle"
                  size="small"
                  iconOnly
                  aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <CuiIcon name={sidebarOpen ? 'chevron-left' : 'arrow-right'} />
                </CuiButton>
              </div>

              {/* Designer content */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Designer Toolbar */}
                <div className="designer-toolbar">
                  <CuiToolbar size="small" label="Designer actions">
                    <CuiMenu>
                      <CuiButton slot="trigger" appearance="subtle" size="small">
                        <CuiIcon slot="start" name="play" />
                        Run
                        <CuiIcon slot="end" name="chevron-down" />
                      </CuiButton>
                      <CuiMenuItem>Run with payload</CuiMenuItem>
                      <CuiMenuItem>Run</CuiMenuItem>
                    </CuiMenu>
                    <CuiDivider orientation="vertical" style={{ height: '20px' }} />
                    <CuiButton appearance="subtle" size="small" disabled>
                      <CuiIcon slot="start" name="save" />
                      Save
                    </CuiButton>
                    <CuiButton appearance="subtle" size="small" disabled>
                      <CuiIcon slot="start" name="dismiss" />
                      Discard
                    </CuiButton>
                    <CuiDivider orientation="vertical" style={{ height: '20px' }} />
                    <CuiButton
                      appearance={viewMode === 'designer' ? 'subtle' : 'outline'}
                      size="small"
                      onClick={() => setViewMode('designer')}
                    >
                      <CuiIcon slot="start" url="https://api.iconify.design/fluent:design-ideas-24-regular.svg" />
                      Designer
                    </CuiButton>
                    <CuiButton
                      appearance={viewMode === 'code' ? 'subtle' : 'outline'}
                      size="small"
                      onClick={() => setViewMode('code')}
                    >
                      <CuiIcon slot="start" url="https://api.iconify.design/fluent:code-24-regular.svg" />
                      Code view
                    </CuiButton>
                  </CuiToolbar>
                </div>

                {/* Canvas + Config Panel */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                  {viewMode === 'designer' ? (
                    <div className="canvas-container">
                      <div className="canvas-grid">
                        {workflowNodes.map((node, i) => (
                          <div key={node.id}>
                            {node.type === 'condition' ? (
                              <ConditionBranch
                                node={node}
                                selectedId={selectedNodeId}
                                onSelect={setSelectedNodeId}
                                onAdd={() => setShowAddPanel(true)}
                              />
                            ) : (
                              <WorkflowNodeCard
                                node={node}
                                selected={selectedNodeId === node.id}
                                onSelect={setSelectedNodeId}
                              />
                            )}
                            {i < workflowNodes.length - 1 && (
                              <ConnectorLine onAdd={() => setShowAddPanel(true)} />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Canvas Tools (bottom-left) */}
                      <div className="canvas-tools">
                        <CuiButton appearance="subtle" iconOnly aria-label="Zoom in">
                          <CuiIcon name="add" />
                        </CuiButton>
                        <div className="canvas-tools-divider" />
                        <CuiButton appearance="subtle" iconOnly aria-label="Zoom out">
                          <CuiIcon name="subtract" />
                        </CuiButton>
                        <div className="canvas-tools-divider" />
                        <CuiButton appearance="subtle" iconOnly aria-label="Fit to screen">
                          <CuiIcon url="https://api.iconify.design/fluent:full-screen-maximize-24-regular.svg" />
                        </CuiButton>
                        <div className="canvas-tools-divider" />
                        <CuiButton appearance="subtle" iconOnly aria-label="Undo">
                          <CuiIcon url="https://api.iconify.design/fluent:arrow-undo-24-regular.svg" />
                        </CuiButton>
                        <div className="canvas-tools-divider" />
                        <CuiButton appearance="subtle" iconOnly aria-label="Redo">
                          <CuiIcon url="https://api.iconify.design/fluent:arrow-redo-24-regular.svg" />
                        </CuiButton>
                      </div>
                    </div>
                  ) : (
                    <div className="canvas-container" style={{ padding: '24px' }}>
                      <pre style={{
                        background: 'var(--neutral-background1)',
                        border: '1px solid var(--neutral-stroke2)',
                        borderRadius: 'var(--border-radius-md)',
                        padding: '20px',
                        fontSize: 'var(--font-size-base200)',
                        color: 'var(--neutral-foreground1)',
                        overflow: 'auto',
                        margin: 0,
                      }}>
                        {/* TODO: replace with your workflow definition JSON */}
                        {JSON.stringify({ definition: { triggers: {}, actions: {} } }, null, 2)}
                      </pre>
                    </div>
                  )}

                  {selectedNode && viewMode === 'designer' && (
                    <ConfigPanel node={selectedNode} onClose={() => setSelectedNodeId(null)} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CuiAppFrame>
      <style>{styles}</style>
    </>
  );
}
