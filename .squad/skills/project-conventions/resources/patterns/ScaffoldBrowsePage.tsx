/**
 * Scaffold: Azure Portal Browse Page
 *
 * Full-width resource browse/list page — the pattern used for Subscriptions,
 * All Resources, Resource Groups, Virtual Machines, etc. No section side nav.
 *
 * Layout:
 *   AppFrame → Header → slot="main" (full width)
 *     Breadcrumb
 *     PageHeader (title + star + copilot suggestions)
 *     Toolbar (+ Create, Manage view, Edit columns, Refresh, Export to CSV, Open query, Feedback)
 *     Divider
 *     Filter row (search + filter pills)
 *     Data table (checkbox, Name, column2, column3, column4, ...)
 *
 * Customization points (TODOs):
 *   - pageTitle, pageSubtitle — page identity
 *   - pageIconKey — azure-icons key for the leading icon
 *   - toolbarActions — add/remove toolbar buttons
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
  CuiPersona,
  CuiPopOver,
  CuiSearchBox,
  CuiToolbar,
} from '@charm-ux/cui/react';
import CopilotButton from '../experiments/copilot-button';
import { azureIcon } from './azure-icons';
import PageHeader from './PageHeader';
import AzurePortalNav from './PatternAzurePortalNav';

// ─── Types ───

interface FilterDef {
  label: string;
  options: string[];
}

interface ColumnDef {
  key: string;
  label: string;
  /** Width hint (CSS value). Omit for auto. */
  width?: string;
}

interface ResourceRow {
  id: string;
  name: string;
  [key: string]: string;
}

// ─── Data (TODO: customize these) ───

const pageTitle = 'Subscriptions';
const pageSubtitle = 'Microsoft';
const pageIconKey = 'subscription';

const filters: FilterDef[] = [
  { label: 'Subscription', options: ['all'] },
  { label: 'Status', options: ['all', 'Active', 'Disabled', 'Warned'] },
];

const columns: ColumnDef[] = [
  { key: 'name', label: 'Name' },
  { key: 'subscriptionId', label: 'Subscription ID' },
  { key: 'status', label: 'Status' },
  { key: 'offerId', label: 'Offer ID' },
];

const rows: ResourceRow[] = [
  { id: '1', name: 'Azure subscription 1', subscriptionId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', status: 'Active', offerId: 'MS-AZR-0003P' },
  { id: '2', name: 'Visual Studio Enterprise', subscriptionId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', status: 'Active', offerId: 'MS-AZR-0063P' },
  { id: '3', name: 'Pay-As-You-Go', subscriptionId: 'c3d4e5f6-a7b8-9012-cdef-123456789012', status: 'Active', offerId: 'MS-AZR-0003P' },
  { id: '4', name: 'Free Trial', subscriptionId: 'd4e5f6a7-b8c9-0123-def0-234567890123', status: 'Disabled', offerId: 'MS-AZR-0044P' },
  { id: '5', name: 'Dev/Test subscription', subscriptionId: 'e5f6a7b8-c9d0-1234-ef01-345678901234', status: 'Active', offerId: 'MS-AZR-0148P' },
];

const copilotSuggestions = [
  'Which subscriptions have the highest cost?',
  'Show me subscriptions nearing their spending limit.',
];

// ─── Styles ───

const styles = `
  body { margin: 0; }

  [slot='main'] {
    min-width: 320px;
    padding: 0;
    background: var(--neutral-background2);
  }

  .browse-content {
    overflow-y: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* ─── Filter row ─── */
  .browse-filter-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 32px;
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
    padding: 0 32px 24px;
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

  /* ─── Info bar ─── */
  .browse-info-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 32px;
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

export default function ScaffoldBrowsePage() {
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

        {/* ─── Main Content (full-width — no section side nav) ─── */}
        <div slot="main" style={{ height: '100%', width: '100%', minWidth: 0, overflow: 'hidden' }}>
          <div className="browse-content">

            {/* Breadcrumb */}
            <div style={{ padding: '8px 32px 0' }}>
              <CuiBreadcrumb label="Navigation" size="small">
                <CuiBreadcrumbItem href="#">Home</CuiBreadcrumbItem>
                <CuiBreadcrumbItem active current="page">{pageTitle}</CuiBreadcrumbItem>
              </CuiBreadcrumb>
            </div>

            {/* Page title row */}
            <PageHeader
              icon={azureIcon(pageIconKey)}
              title={pageTitle}
              subtitle={pageSubtitle}
              showFavorite
              copilotSuggestions={copilotSuggestions}
            />

            {/* Toolbar */}
            <div style={{ padding: '0 32px' }}>
              <CuiToolbar size="small" label="Actions">
                {/* TODO: Customize toolbar actions */}
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
                <CuiButton appearance="subtle" size="small">Open query</CuiButton>

                <CuiDivider orientation="vertical" style={{ height: '20px' }} />

                {selectedRows.size > 0 && (
                  <>
                    <CuiButton appearance="subtle" size="small">
                      <CuiIcon slot="start" name="delete" />
                      Cancel
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
                  : `${filteredRows.length} ${pageTitle.toLowerCase()}`
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
                              <img src={azureIcon(pageIconKey)} alt="" />
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
      </CuiAppFrame>
      <style>{styles}</style>
    </>
  );
}
