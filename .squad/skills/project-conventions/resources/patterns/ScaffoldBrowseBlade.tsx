/**
 * Scaffold: Azure Browse Blade with Collapsible Side Panel
 *
 * Combines the Browse Page pattern (toolbar, filter pills, checkbox data table)
 * with the Service Blade collapsible sidebar. The page title spans full width
 * above the sidebar, and the toolbar + filters + table live inside the content
 * area to the right of the collapsible nav.
 *
 * Layout:
 *   AppFrame → Header → slot="main"
 *     Breadcrumb (full width)
 *     PageHeader (full width, above sidebar)
 *     blade-body:
 *       Collapsible sidebar (left) — CuiSideNav with toggle
 *       Content area (right):
 *         Toolbar
 *         Divider
 *         Filter row (search + filter pills)
 *         Info bar
 *         Data table (checkbox, sortable columns)
 *
 * Customization points (TODOs):
 *   - serviceName, pageTitle, pageSubtitle — page identity
 *   - serviceIconKey — azure-icons key for the leading icon
 *   - navSections[] — sidebar nav items
 *   - filters[] — filter dropdown definitions
 *   - columns[] — table column definitions
 *   - rows[] — table data
 *   - copilotSuggestions — inline Copilot prompts
 */
import { useState } from 'react';
import {
  CuiAppFrame,
  CuiAvatar,
  CuiBreadcrumb,
  CuiBreadcrumbItem,
  CuiButton,
  CuiCheckbox,
  CuiDivider,
  CuiHeader,
  CuiIcon,
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

interface NavItem {
  label: string;
  name?: string;
  azureIconKey?: string;
}

interface FilterDef {
  label: string;
  options: string[];
}

interface ColumnDef {
  key: string;
  label: string;
  width?: string;
}

interface ResourceRow {
  id: string;
  name: string;
  [key: string]: string;
}

// ─── Data (TODO: customize these) ───

const serviceName = 'Cost Management';
const pageTitle = 'Budgets';
const pageSubtitle = 'Microsoft';
const serviceIconKey = 'cost-management';

const navSections: { heading: string | null; items: NavItem[] }[] = [
  {
    heading: null,
    items: [
      { label: 'Overview', name: 'navigation' },
      { label: 'Cost analysis', name: 'data-trending' },
      { label: 'Cost alerts', azureIconKey: 'cost-alerts' },
      { label: 'Budgets', name: 'calculator' },
      { label: 'Advisor recommendations', azureIconKey: 'advisor' },
    ],
  },
  {
    heading: 'Settings',
    items: [
      { label: 'Configuration', name: 'settings' },
      { label: 'Properties', name: 'info' },
    ],
  },
];

const filters: FilterDef[] = [
  { label: 'Subscription', options: ['all'] },
  { label: 'Time period', options: ['Current month', 'Last 30 days', 'Last 3 months'] },
];

const columns: ColumnDef[] = [
  { key: 'name', label: 'Name' },
  { key: 'amount', label: 'Budget amount' },
  { key: 'spent', label: 'Current spend' },
  { key: 'status', label: 'Status' },
  { key: 'resetPeriod', label: 'Reset period' },
];

const rows: ResourceRow[] = [
  { id: '1', name: 'Monthly Dev Budget', amount: '$500.00', spent: '$342.18', status: 'Active', resetPeriod: 'Monthly' },
  { id: '2', name: 'Production Infra', amount: '$2,000.00', spent: '$1,847.50', status: 'Warned', resetPeriod: 'Monthly' },
  { id: '3', name: 'Staging Environment', amount: '$300.00', spent: '$98.42', status: 'Active', resetPeriod: 'Monthly' },
  { id: '4', name: 'Q1 Marketing Campaign', amount: '$5,000.00', spent: '$5,120.00', status: 'Exceeded', resetPeriod: 'Quarterly' },
  { id: '5', name: 'AI/ML Experimentation', amount: '$1,000.00', spent: '$0.00', status: 'Disabled', resetPeriod: 'Monthly' },
];

const copilotSuggestions = [
  'Which budgets are close to being exceeded?',
  'Show me spending trends over the last 3 months.',
];

// ─── Styles ───

const styles = `
  body { margin: 0; }

  [slot='main'] {
    min-width: 320px;
    padding: 0;
    background: var(--neutral-background2);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* ─── Body: sidebar + content ─── */
  .blade-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* Collapsible sidebar */
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

  /* Toggle strip — thin column between sidebar and content */
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

  /* Content area — flex row: toggle strip + scrollable content */
  .blade-content {
    flex: 1;
    overflow: hidden;
    background: var(--neutral-background2);
    display: flex;
    flex-direction: row;
  }

  /* ─── Filter row ─── */
  .browse-filter-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    flex-wrap: wrap;
  }
  .browse-filter-search {
    min-width: 200px;
    flex: 0 1 280px;
  }
  .browse-filter-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border: 1px solid var(--neutral-stroke1);
    border-radius: var(--border-radius-md);
    background: var(--neutral-background1);
    font-size: 12px;
    color: var(--neutral-foreground2);
    cursor: pointer;
    white-space: nowrap;
    font-family: inherit;
  }
  .browse-filter-pill:hover {
    border-color: var(--neutral-stroke1-hover);
    background: var(--subtle-background-hover);
  }
  .browse-filter-pill .pill-label {
    color: var(--neutral-foreground3);
  }
  .browse-filter-pill .pill-operator {
    color: var(--neutral-foreground3);
    font-size: 11px;
  }
  .browse-filter-pill .pill-value {
    font-weight: var(--font-weight-semi-bold);
    color: var(--neutral-foreground1);
  }
  .browse-add-filter {
    font-size: 12px;
    color: var(--brand-foreground-link);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 6px;
    font-family: inherit;
  }
  .browse-add-filter:hover {
    text-decoration: underline;
  }

  /* ─── Data table ─── */
  .browse-table-container {
    flex: 1;
    overflow: auto;
    padding: 0 24px 24px;
  }
  table.browse-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    table-layout: auto;
  }
  .browse-table thead {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .browse-table th {
    text-align: left;
    padding: 8px 12px;
    font-weight: var(--font-weight-semi-bold);
    color: var(--neutral-foreground2);
    background: var(--neutral-background2);
    border-bottom: 1px solid var(--neutral-stroke1);
    white-space: nowrap;
    font-size: 12px;
    user-select: none;
    cursor: pointer;
  }
  .browse-table th:hover {
    color: var(--neutral-foreground1);
  }
  .browse-table th .sort-icon {
    font-size: 10px;
    margin-left: 4px;
    opacity: 0.5;
  }
  .browse-table td {
    padding: 8px 12px;
    color: var(--neutral-foreground1);
    border-bottom: 1px solid var(--neutral-stroke2);
    vertical-align: middle;
    font-size: 13px;
  }
  .browse-table tr:hover td {
    background: var(--subtle-background-hover);
  }
  .browse-table .resource-name {
    color: var(--brand-foreground-link);
    text-decoration: none;
    cursor: pointer;
  }
  .browse-table .resource-name:hover {
    text-decoration: underline;
  }
  .browse-table .resource-name-cell {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .browse-table .resource-name-cell img {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  .browse-table .checkbox-cell {
    width: 36px;
    padding-left: 4px;
  }

  /* Status badge */
  .browse-status-active {
    color: var(--status-success-foreground1);
  }
  .browse-status-disabled {
    color: var(--neutral-foreground3);
  }
  .browse-status-warned {
    color: var(--status-warning-foreground1);
  }
  .browse-status-exceeded {
    color: var(--status-danger-foreground1);
  }

  /* ─── Info bar ─── */
  .browse-info-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 24px;
    font-size: 12px;
    color: var(--neutral-foreground3);
  }

  /* Toolbar overrides — prevent word wrapping (::part pierces shadow DOM) */
  cui-toolbar {
    flex-wrap: nowrap;
  }
  cui-toolbar cui-button,
  cui-toolbar cui-menu cui-button {
    white-space: nowrap;
  }
  cui-toolbar cui-button::part(button-control),
  cui-toolbar cui-menu cui-button::part(button-control) {
    white-space: nowrap;
    flex-wrap: nowrap;
  }
`;

// ─── Component ───

export default function ScaffoldBrowseBlade() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedNav, setSelectedNav] = useState(pageTitle);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [filterText, setFilterText] = useState('');

  const allSelected = selectedRows.size === rows.length && rows.length > 0;
  const someSelected = selectedRows.size > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(rows.map(r => r.id)));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredRows = filterText
    ? rows.filter(r =>
        Object.values(r).some(v => v.toLowerCase().includes(filterText.toLowerCase()))
      )
    : rows;

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'browse-status-active';
      case 'disabled': return 'browse-status-disabled';
      case 'warned': return 'browse-status-warned';
      case 'exceeded': return 'browse-status-exceeded';
      default: return '';
    }
  };

  return (
    <>
      <CuiAppFrame skipToMainText="Skip to main content">
        {/* ─── Header ─── */}
        <CuiHeader slot="header" navigationIconLabel="toggle navigation">
          <CuiButton slot="title" appearance="transparent">
            <span className="font-base400">Microsoft Azure</span>
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
              <div slot="primary">alexbritez@microsoft.co...</div>
              <div slot="secondary">MICROSOFT (MICROSOFT.ONM...)</div>
            </CuiPersona>
            <CuiDivider className="my-xl" />
            <div className="d-flex flex-column align-start">
              <CuiButton appearance="link">Your profile</CuiButton>
              <CuiButton appearance="link">View account</CuiButton>
              <CuiButton appearance="link">Sign Out</CuiButton>
            </div>
          </CuiPopOver>
        </CuiHeader>

        {/* ─── Global Navigation (hamburger menu) ─── */}
        <AzurePortalNav />

        {/* ─── Main ─── */}
        <div slot="main" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Breadcrumb — full width */}
          <div style={{ padding: '4px 16px 0' }}>
            <CuiBreadcrumb label="Navigation" size="small">
              <CuiBreadcrumbItem href="#">Home</CuiBreadcrumbItem>
              <CuiBreadcrumbItem active current="page">{serviceName}</CuiBreadcrumbItem>
            </CuiBreadcrumb>
          </div>

          {/* Title — full width above sidebar */}
          <PageHeader
            icon={azureIcon(serviceIconKey)}
            title={<><strong>{serviceName}</strong> | {pageTitle}</>}
            subtitle={pageSubtitle}
            titleWeight="regular"
            horizontalPadding="16px"
            showFavorite
            copilotSuggestions={copilotSuggestions}
          />

          {/* ─── Body: sidebar + content ─── */}
          <div className="blade-body">
            {/* Collapsible service sidebar */}
            <div className={`blade-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
              <CuiSideNav size="small">
                {navSections.map((section, si) => (
                  <span key={si}>
                    {section.heading && <CuiNavHeading>{section.heading}</CuiNavHeading>}
                    {section.items.map((item) => (
                      <CuiNavItem
                        key={item.label}
                        label={item.label}
                        href="#"
                        selected={selectedNav === item.label ? true : undefined}
                        onClick={() => setSelectedNav(item.label)}
                      >
                        {item.name ? (
                          <CuiIcon slot="icon" name={item.name} />
                        ) : (
                          <CuiIcon slot="icon" url={azureIcon(item.azureIconKey!)} />
                        )}
                      </CuiNavItem>
                    ))}
                  </span>
                ))}
              </CuiSideNav>
            </div>

            {/* Content area */}
            <div className="blade-content">
              {/* Sidebar toggle strip */}
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

              {/* Main content */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Toolbar */}
                <div style={{ padding: '0 24px' }}>
                <CuiToolbar size="small" label="Actions">
                  <CuiButton appearance="subtle" size="small">
                    <CuiIcon slot="start" name="add" />
                    Add
                  </CuiButton>

                  <CuiDivider orientation="vertical" style={{ height: '20px' }} />

                  <CuiMenu>
                    <CuiButton slot="trigger" appearance="subtle" size="small">
                      Manage view
                      <CuiIcon slot="end" name="chevron-down" />
                    </CuiButton>
                    <CuiMenuItem>Save view</CuiMenuItem>
                    <CuiMenuItem>Save view as...</CuiMenuItem>
                    <CuiMenuItem>Reset to default</CuiMenuItem>
                  </CuiMenu>

                  <CuiButton appearance="subtle" size="small">
                    <CuiIcon slot="start" name="edit" />
                    Edit columns
                  </CuiButton>

                  <CuiDivider orientation="vertical" style={{ height: '20px' }} />

                  <CuiButton appearance="subtle" size="small">Refresh</CuiButton>
                  <CuiButton appearance="subtle" size="small">
                    <CuiIcon slot="start" name="arrow-download" />
                    Export to CSV
                  </CuiButton>

                  <CuiDivider orientation="vertical" style={{ height: '20px' }} />

                  {selectedRows.size > 0 && (
                    <>
                      <CuiButton appearance="subtle" size="small">
                        <CuiIcon slot="start" name="delete" />
                        Delete
                      </CuiButton>
                      <CuiDivider orientation="vertical" style={{ height: '20px' }} />
                    </>
                  )}

                  <CuiButton appearance="subtle" size="small">Feedback</CuiButton>
                </CuiToolbar>
              </div>

              <CuiDivider style={{ margin: 0 }} />

              {/* Filter row */}
              <div className="browse-filter-row">
                <div className="browse-filter-search">
                  <CuiSearchBox
                    hideLabel
                    placeholder="Filter for any field..."
                    size="small"
                    onInput={(e: any) => setFilterText(e.target.value ?? '')}
                  />
                </div>
                {filters.map(f => (
                  <button key={f.label} className="browse-filter-pill">
                    <span className="pill-label">{f.label}</span>
                    <span className="pill-operator">==</span>
                    <span className="pill-value">{f.options[0]}</span>
                    <CuiIcon name="chevron-down" style={{ fontSize: '10px' }} />
                  </button>
                ))}
                <button className="browse-add-filter">Add filter</button>
              </div>

              {/* Info bar */}
              <div className="browse-info-bar">
                <span>
                  {selectedRows.size > 0
                    ? `${selectedRows.size} of ${filteredRows.length} selected`
                    : `${filteredRows.length} items`
                  }
                </span>
              </div>

              {/* Data table */}
              <div className="browse-table-container">
                <table className="browse-table" aria-label={pageTitle}>
                  <thead>
                    <tr>
                      <th className="checkbox-cell">
                        <CuiCheckbox
                          checked={allSelected}
                          indeterminate={someSelected}
                          onChange={toggleAll}
                          aria-label="Select all"
                        />
                      </th>
                      {columns.map(col => (
                        <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                          {col.label}
                          <span className="sort-icon">↕</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map(row => (
                      <tr key={row.id}>
                        <td className="checkbox-cell">
                          <CuiCheckbox
                            checked={selectedRows.has(row.id)}
                            onChange={() => toggleRow(row.id)}
                            aria-label={`Select ${row.name}`}
                          />
                        </td>
                        {columns.map(col => (
                          <td key={col.key}>
                            {col.key === 'name' ? (
                              <div className="resource-name-cell">
                                <a className="resource-name" href="#">{row.name}</a>
                              </div>
                            ) : col.key === 'status' ? (
                              <span className={getStatusClass(row[col.key] ?? '')}>
                                {row[col.key]}
                              </span>
                            ) : (
                              row[col.key]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
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
