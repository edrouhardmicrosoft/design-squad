/**
 * Pattern: Azure Portal Filter Panel
 *
 * Functional filtering pattern matching the Azure portal browse pages.
 * Features:
 *   - Search box for free-text filtering
 *   - Filter pills with label == value dropdowns
 *   - "Add filter" to add new filter dimensions
 *   - Active filter tags with dismiss (×)
 *   - Filtered data table that responds to all filters
 *   - Column sorting
 *
 * Coherence components used:
 *   CuiSearchBox, CuiIcon, CuiCheckbox, CuiDivider, CuiTag, CuiButton, CuiDataGrid
 */
import { useState, useRef, useCallback } from 'react';
import {
  CuiButton,
  CuiCheckbox,
  CuiDataGrid,
  CuiDivider,
  CuiIcon,
  CuiMenu,
  CuiMenuItem,
  CuiPopOver,
  CuiSearchBox,
  CuiTag,
} from '@charm-ux/cui/react';

// ─── Types ───

interface FilterDef {
  key: string;
  label: string;
  options: string[];
}

interface GridColumn {
  field: string;
  content: string;
  sortable?: boolean;
}

interface DataRow {
  id: string;
  name: string;
  type: string;
  resourceGroup: string;
  location: string;
  subscription: string;
  status: string;
}

// ─── Sample Data ───

const filterDefs: FilterDef[] = [
  { key: 'subscription', label: 'Subscription', options: ['Azure subscription 1', 'Visual Studio Enterprise', 'Pay-As-You-Go'] },
  { key: 'resourceGroup', label: 'Resource group', options: ['rg-production', 'rg-staging', 'rg-dev', 'rg-shared'] },
  { key: 'type', label: 'Type', options: ['Virtual machine', 'Storage account', 'SQL database', 'App Service', 'Key Vault'] },
  { key: 'location', label: 'Location', options: ['East US', 'West US 2', 'West Europe', 'Southeast Asia'] },
  { key: 'status', label: 'Status', options: ['Running', 'Stopped', 'Deallocated', 'Failed'] },
];

const gridColumns: GridColumn[] = [
  { field: 'name', content: 'Name', sortable: true },
  { field: 'type', content: 'Type', sortable: true },
  { field: 'resourceGroup', content: 'Resource group', sortable: true },
  { field: 'location', content: 'Location', sortable: true },
  { field: 'subscription', content: 'Subscription', sortable: true },
  { field: 'status', content: 'Status', sortable: true },
];

const sampleData: DataRow[] = [
  { id: '1', name: 'vm-prod-web-01', type: 'Virtual machine', resourceGroup: 'rg-production', location: 'East US', subscription: 'Azure subscription 1', status: 'Running' },
  { id: '2', name: 'vm-prod-web-02', type: 'Virtual machine', resourceGroup: 'rg-production', location: 'East US', subscription: 'Azure subscription 1', status: 'Running' },
  { id: '3', name: 'stproddata001', type: 'Storage account', resourceGroup: 'rg-production', location: 'East US', subscription: 'Azure subscription 1', status: 'Running' },
  { id: '4', name: 'sql-prod-analytics', type: 'SQL database', resourceGroup: 'rg-production', location: 'West US 2', subscription: 'Azure subscription 1', status: 'Running' },
  { id: '5', name: 'vm-staging-api-01', type: 'Virtual machine', resourceGroup: 'rg-staging', location: 'West US 2', subscription: 'Visual Studio Enterprise', status: 'Stopped' },
  { id: '6', name: 'app-staging-web', type: 'App Service', resourceGroup: 'rg-staging', location: 'West Europe', subscription: 'Visual Studio Enterprise', status: 'Running' },
  { id: '7', name: 'kv-staging-secrets', type: 'Key Vault', resourceGroup: 'rg-staging', location: 'West Europe', subscription: 'Visual Studio Enterprise', status: 'Running' },
  { id: '8', name: 'vm-dev-test-01', type: 'Virtual machine', resourceGroup: 'rg-dev', location: 'West US 2', subscription: 'Pay-As-You-Go', status: 'Deallocated' },
  { id: '9', name: 'stdevblob001', type: 'Storage account', resourceGroup: 'rg-dev', location: 'Southeast Asia', subscription: 'Pay-As-You-Go', status: 'Running' },
  { id: '10', name: 'sql-dev-testing', type: 'SQL database', resourceGroup: 'rg-dev', location: 'Southeast Asia', subscription: 'Pay-As-You-Go', status: 'Failed' },
  { id: '11', name: 'app-shared-portal', type: 'App Service', resourceGroup: 'rg-shared', location: 'East US', subscription: 'Azure subscription 1', status: 'Running' },
  { id: '12', name: 'kv-shared-certs', type: 'Key Vault', resourceGroup: 'rg-shared', location: 'East US', subscription: 'Azure subscription 1', status: 'Running' },
];

// ─── Filter Pill Dropdown ───

function FilterPillDropdown({
  filterDef,
  selectedValues,
  onSelectionChange,
  onRemoveFilter,
}: {
  filterDef: FilterDef;
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  onRemoveFilter: () => void;
}) {
  const popoverRef = useRef<any>(null);

  const isAll = selectedValues.length === 0;
  const displayValue = isAll
    ? 'all'
    : selectedValues.length === 1
      ? selectedValues[0]
      : `${selectedValues.length} selected`;

  const toggleOption = (opt: string) => {
    if (selectedValues.includes(opt)) {
      onSelectionChange(selectedValues.filter(v => v !== opt));
    } else {
      onSelectionChange([...selectedValues, opt]);
    }
  };

  const closePopover = () => {
    if (popoverRef.current) {
      popoverRef.current.open = false;
    }
  };

  return (
    <CuiPopOver
      ref={popoverRef}
      hideArrow
      fixedPlacement
      placement="bottom-start"
      distance={4}
      contentRole="listbox"
      label={`Filter by ${filterDef.label}`}
      style={{
        '--pop-over-padding': '0',
        '--pop-over-width': '320px',
        '--pop-over-border-radius': '2px',
        '--pop-over-box-shadow': 'var(--shadow16)',
      } as React.CSSProperties}
    >
      <button slot="anchor" className="fp-pill" aria-haspopup="listbox">
        <span className="fp-pill-label">{filterDef.label}</span>
        <span className="fp-pill-op">==</span>
        <span className="fp-pill-value">{displayValue}</span>
        <CuiIcon name="chevron-down" style={{ fontSize: 10 }} />
      </button>
      <div className="fp-dropdown-panel">
        <div className="fp-dropdown-header">
          <span className="fp-dropdown-title">{filterDef.label}</span>
          <button
            className="fp-dropdown-clear"
            onClick={() => onSelectionChange([])}
          >
            Clear
          </button>
        </div>
        <div className="fp-dropdown-options">
          {filterDef.options.map(opt => (
            <div key={opt} className="fp-dropdown-option">
              <CuiCheckbox
                checked={selectedValues.includes(opt)}
                onChange={() => toggleOption(opt)}
              >
                {opt}
              </CuiCheckbox>
            </div>
          ))}
        </div>
        <div className="fp-dropdown-footer">
          <CuiButton
            appearance="primary"
            size="small"
            onClick={closePopover}
          >
            Apply
          </CuiButton>
          <CuiButton
            appearance="outline"
            size="small"
            onClick={() => { closePopover(); onRemoveFilter(); }}
          >
            Remove filter
          </CuiButton>
        </div>
      </div>
    </CuiPopOver>
  );
}

// ─── Add Filter Menu ───

function AddFilterMenu({
  availableFilters,
  onAddFilter,
}: {
  availableFilters: FilterDef[];
  onAddFilter: (key: string) => void;
}) {
  if (availableFilters.length === 0) return null;

  return (
    <CuiMenu fixedPlacement placement="bottom-start">
      <button slot="trigger" className="fp-pill fp-pill-add" aria-label="Add filter">
        <CuiIcon name="add" className="fp-add-icon" style={{ fontSize: 12 }} />
        <span>Add filter</span>
      </button>
      {availableFilters.map(f => (
        <CuiMenuItem key={f.key} onClick={() => onAddFilter(f.key)}>
          {f.label}
        </CuiMenuItem>
      ))}
    </CuiMenu>
  );
}

// ─── Main Component ───

export default function PatternFilterPanel() {
  // Active filter keys (which filters are shown as pills)
  const [activeFilterKeys, setActiveFilterKeys] = useState<string[]>(['subscription', 'status']);
  // Filter selections: key → selected values (empty = "all")
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>({});
  // Free-text search
  const [searchText, setSearchText] = useState('');
  // Sort (driven by CuiDataGrid)
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDesc, setSortDesc] = useState(false);
  // Row selection count (tracked from CuiDataGrid events)
  const [selectedCount, setSelectedCount] = useState(0);

  const handleSort = useCallback((e: any) => {
    const field = e.detail?.field ?? e.detail?.column?.field;
    if (field) {
      setSortBy(prev => {
        if (prev === field) {
          setSortDesc(d => !d);
        } else {
          setSortDesc(false);
        }
        return field;
      });
    }
  }, []);

  const handleRowSelect = useCallback((e: any) => {
    setSelectedCount(e.detail?.selectedRows?.length ?? 0);
  }, []);

  const addFilter = (key: string) => {
    if (!activeFilterKeys.includes(key)) {
      setActiveFilterKeys([...activeFilterKeys, key]);
    }
  };

  const removeFilter = (key: string) => {
    setActiveFilterKeys(activeFilterKeys.filter(k => k !== key));
    setFilterSelections(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const updateFilterSelection = (key: string, values: string[]) => {
    setFilterSelections(prev => ({ ...prev, [key]: values }));
  };

  const clearAllFilters = () => {
    setFilterSelections({});
    setSearchText('');
  };

  // Filter data
  const filteredData = sampleData.filter(row => {
    // Text search
    if (searchText) {
      const term = searchText.toLowerCase();
      const matches = Object.values(row).some(v =>
        typeof v === 'string' && v.toLowerCase().includes(term)
      );
      if (!matches) return false;
    }
    // Column filters
    for (const key of activeFilterKeys) {
      const selected = filterSelections[key];
      if (selected && selected.length > 0) {
        if (!selected.includes((row as any)[key])) return false;
      }
    }
    return true;
  });

  const hasActiveFilters = Object.values(filterSelections).some(v => v.length > 0) || searchText.length > 0;

  const availableFilters = filterDefs.filter(f => !activeFilterKeys.includes(f.key));

  const activeFilters = activeFilterKeys
    .map(key => filterDefs.find(f => f.key === key))
    .filter(Boolean) as FilterDef[];

  // Active filter tags (for the summary bar)
  const appliedTags: { label: string; value: string; key: string; singleValue: string }[] = [];
  for (const key of activeFilterKeys) {
    const selected = filterSelections[key] ?? [];
    const def = filterDefs.find(f => f.key === key);
    if (!def || selected.length === 0) continue;
    for (const val of selected) {
      appliedTags.push({ label: def.label, value: val, key, singleValue: val });
    }
  }

  // Build rows for CuiDataGrid
  const gridRows = filteredData.map(row => ({
    id: row.id,
    cells: {
      name: row.name,
      type: row.type,
      resourceGroup: row.resourceGroup,
      location: row.location,
      subscription: row.subscription,
      status: row.status,
    },
  }));

  // Custom cell renderer for Name (link) and Status (colored dot)
  const renderCell = useCallback((row: any, field: string) => {
    const value = row.cells[field];
    if (field === 'name') {
      return <a className="fp-resource-link" href="#">{value}</a>;
    }
    if (field === 'status') {
      const cls = {
        Running: 'fp-status-running',
        Stopped: 'fp-status-stopped',
        Deallocated: 'fp-status-deallocated',
        Failed: 'fp-status-failed',
      }[value] ?? '';
      return (
        <span className={cls}>
          <span className="fp-status-dot" />
          {value}
        </span>
      );
    }
    return value;
  }, []);

  return (
    <>
      <div style={{ padding: '32px' }}>
        {/* ─── Section 1: Full Filter Bar ─── */}
        <div style={{ marginBottom: 48 }}>
          <h2 className="fp-section-title">Filter Bar</h2>
          <p className="fp-section-desc">
            Search box + filter pills + "Add filter" link. Clicking a pill opens a multi-select dropdown.
            Applied filters appear as dismissible tags below.
          </p>

          <div className="fp-filter-bar">
            {/* Search */}
            <div className="fp-search">
              <CuiSearchBox
                hideLabel
                placeholder="Filter for any field..."
                size="small"
                value={searchText}
                onInput={(e: any) => setSearchText(e.target.value ?? '')}
              />
            </div>

            {/* Filter pills */}
            {activeFilters.map(f => (
              <FilterPillDropdown
                key={f.key}
                filterDef={f}
                selectedValues={filterSelections[f.key] ?? []}
                onSelectionChange={values => updateFilterSelection(f.key, values)}
                onRemoveFilter={() => removeFilter(f.key)}
              />
            ))}

            {/* Add filter */}
            <AddFilterMenu
              availableFilters={availableFilters}
              onAddFilter={addFilter}
            />
          </div>

          {/* Applied filter tags */}
          {(appliedTags.length > 0 || searchText) && (
            <div className="fp-tags-bar">
              {searchText && (
                <CuiTag
                  size="small"
                  shape="rounded"
                  dismissible
                  onDismiss={() => setSearchText('')}
                >
                  <CuiIcon slot="start" name="search" style={{ fontSize: 12 }} />
                  &ldquo;{searchText}&rdquo;
                </CuiTag>
              )}
              {appliedTags.map(tag => (
                <CuiTag
                  key={`${tag.key}-${tag.singleValue}`}
                  size="small"
                  shape="rounded"
                  dismissible
                  onDismiss={() => {
                    const current = filterSelections[tag.key] ?? [];
                    updateFilterSelection(tag.key, current.filter(v => v !== tag.singleValue));
                  }}
                >
                  {tag.label}: {tag.value}
                </CuiTag>
              ))}
              <button className="fp-clear-all" onClick={clearAllFilters}>
                Clear all
              </button>
            </div>
          )}

          {/* Info bar */}
          <div className="fp-info-bar">
            <span>
              {selectedCount > 0
                ? `${selectedCount} of ${filteredData.length} selected`
                : `Showing ${filteredData.length} of ${sampleData.length} resources`
              }
            </span>
            {hasActiveFilters && (
              <span className="fp-info-filtered">
                <CuiIcon name="filter" style={{ fontSize: 12 }} /> Filtered
              </span>
            )}
          </div>

          {/* Data Grid */}
          <div className="fp-grid-container">
            <CuiDataGrid
              label="Resources"
              columns={gridColumns}
              rows={gridRows}
              select="multiple"
              sortBy={sortBy}
              sortDescending={sortDesc}
              fixedHeading
              onSort={handleSort}
              onRowSelectChange={handleRowSelect}
              onSelectAllChange={handleRowSelect}
              renderCell={renderCell}
              noResultsLabel="No resources match the current filters."
            />
          </div>
        </div>

        <CuiDivider style={{ margin: '0 0 32px' }} />

        {/* ─── Section 2: Anatomy & Guidance ─── */}
        <div className="fp-docs">
          <h2 className="fp-section-title">Filter Panel Anatomy</h2>

          <h3 style={{ marginTop: 24 }}>Components Used</h3>
          <ul>
            <li><code>CuiDataGrid</code> — sortable, selectable data table with fixed heading</li>
            <li><code>CuiSearchBox</code> — free-text filter input</li>
            <li><code>CuiPopOver</code> — positioned dropdown panel for filter pill multi-select</li>
            <li><code>CuiMenu</code> / <code>CuiMenuItem</code> — "Add filter" menu with proper keyboard nav</li>
            <li><code>CuiCheckbox</code> — multi-select within filter dropdowns</li>
            <li><code>CuiTag</code> (dismissible, rounded, small) — active filter tags</li>
            <li><code>CuiIcon</code> — chevron indicators, search icon, filter icon</li>
            <li><code>CuiButton</code> — apply/remove actions in dropdown footer</li>
            <li><code>CuiDivider</code> — section separators</li>
          </ul>

          <h3>Layout Structure</h3>
          <pre className="fp-code">{`
.filter-bar          ← flex row, wrapping, gap: 8px
├── CuiSearchBox     ← min-width: 200px, flex: 0 1 280px
├── FilterPill ×N    ← inline-flex buttons w/ dropdown
│   ├── label        ← neutral-foreground3
│   ├── operator     ← "==" in neutral-foreground3
│   ├── value        ← semi-bold neutral-foreground1
│   └── chevron-down
└── "Add filter"     ← brand-foreground-link styled link

.tags-bar            ← flex row showing CuiTag per applied value
└── "Clear all"      ← brand-foreground-link link button

.info-bar            ← flex row: count + "Filtered" indicator
          `.trim()}</pre>

          <h3>Design Tokens</h3>
          <table className="fp-docs-table">
            <thead>
              <tr><th>Element</th><th>Token</th></tr>
            </thead>
            <tbody>
              <tr><td>Pill background</td><td><code>--neutral-background1</code></td></tr>
              <tr><td>Pill border</td><td><code>--neutral-stroke1</code></td></tr>
              <tr><td>Pill border (hover)</td><td><code>--neutral-stroke1-hover</code></td></tr>
              <tr><td>Pill label text</td><td><code>--neutral-foreground3</code></td></tr>
              <tr><td>Pill value text</td><td><code>--neutral-foreground1</code></td></tr>
              <tr><td>Add filter link</td><td><code>--brand-foreground-link</code></td></tr>
              <tr><td>Dropdown bg</td><td><code>--neutral-background1</code></td></tr>
              <tr><td>Dropdown shadow</td><td><code>--shadow16</code></td></tr>
              <tr><td>Table header bg</td><td><code>--neutral-background2</code></td></tr>
              <tr><td>Row hover bg</td><td><code>--subtle-background-hover</code></td></tr>
              <tr><td>Selected row bg</td><td><code>--brand-background2</code></td></tr>
              <tr><td>Status: Running</td><td><code>--status-success-foreground1</code></td></tr>
              <tr><td>Status: Stopped</td><td><code>--neutral-foreground3</code></td></tr>
              <tr><td>Status: Failed</td><td><code>--status-danger-foreground1</code></td></tr>
              <tr><td>Status: Deallocated</td><td><code>--status-warning-foreground1</code></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <style>{styles}</style>
    </>
  );
}

// ─── Styles ───

const styles = `
  body { margin: 0; }

  .fp-section-title {
    margin: 0 0 4px;
    font-size: var(--font-size-base500);
    font-weight: var(--font-weight-semi-bold);
    color: var(--neutral-foreground1);
  }
  .fp-section-desc {
    margin: 0 0 16px;
    font-size: var(--font-size-base300);
    color: var(--neutral-foreground3);
    line-height: 1.5;
  }

  /* ─── Filter Bar ─── */
  .fp-filter-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 10px 0;
    position: relative;
    z-index: 10;
  }
  .fp-search {
    min-width: 200px;
    flex: 0 1 280px;
  }

  /* ─── Filter Pill (Azure fxc-pill style) ─── */
  .fp-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 26px;
    padding: 0 10px;
    border: none;
    border-radius: 16px;
    background: var(--brand-background2);
    font-size: var(--font-size-base200);
    color: var(--neutral-foreground1);
    cursor: pointer;
    white-space: nowrap;
    font-family: inherit;
    transition: background 0.1s;
    line-height: 1;
  }
  .fp-pill:hover {
    filter: brightness(0.95);
  }
  .fp-pill:active {
    filter: brightness(0.90);
  }
  .fp-pill-label {
    color: var(--neutral-foreground1);
  }
  .fp-pill-op {
    color: var(--neutral-foreground3);
    font-size: 11px;
  }
  .fp-pill-value {
    font-weight: var(--font-weight-semi-bold);
    color: var(--neutral-foreground1);
  }
  /* "Add filter" pill variant */
  .fp-pill-add {
    gap: 4px;
    color: var(--neutral-foreground1);
  }
  .fp-pill-add .fp-add-icon {
    color: var(--brand-foreground-link);
  }

  /* ─── Dropdown Panel (card container for popover content) ─── */
  .fp-dropdown-panel {
    background: var(--neutral-background1);
    border: 1px solid var(--neutral-stroke2);
    border-radius: 2px;
    box-shadow: var(--shadow-16);
    width: 320px;
    overflow: hidden;
  }

  .fp-dropdown-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px 8px;
    border-bottom: 1px solid var(--neutral-stroke2);
  }
  .fp-dropdown-title {
    font-size: var(--font-size-base300);
    font-weight: var(--font-weight-semi-bold);
    color: var(--neutral-foreground1);
  }
  .fp-dropdown-clear {
    font-size: var(--font-size-base200);
    color: var(--brand-foreground-link);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
  }
  .fp-dropdown-clear:hover {
    text-decoration: underline;
  }
  .fp-dropdown-options {
    padding: 8px 0;
    max-height: 240px;
    overflow-y: auto;
  }
  .fp-dropdown-option {
    padding: 4px 16px;
    cursor: pointer;
    font-size: var(--font-size-base300);
    color: var(--neutral-foreground1);
  }
  .fp-dropdown-option:hover {
    background: var(--subtle-background-hover);
  }
  .fp-dropdown-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--neutral-stroke2);
  }
  .fp-dropdown-footer cui-button {
    flex: 1;
  }



  /* ─── Tags Bar ─── */
  .fp-tags-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    padding: 6px 0 2px;
  }
  .fp-clear-all {
    font-size: 12px;
    color: var(--brand-foreground-link);
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px 6px;
    font-family: inherit;
    margin-left: 4px;
  }
  .fp-clear-all:hover {
    text-decoration: underline;
  }

  /* ─── Info Bar ─── */
  .fp-info-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 12px;
    color: var(--neutral-foreground3);
  }
  .fp-info-filtered {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--brand-foreground-link);
  }

  /* ─── Data Grid ─── */
  .fp-grid-container {
    border: 1px solid var(--neutral-stroke2);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
  }
  .fp-resource-link {
    color: var(--brand-foreground-link);
    text-decoration: none;
    cursor: pointer;
  }
  .fp-resource-link:hover {
    text-decoration: underline;
  }

  /* ─── Status indicators ─── */
  .fp-status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
    vertical-align: middle;
  }
  .fp-status-running {
    color: var(--status-success-foreground1);
  }
  .fp-status-running .fp-status-dot {
    background: var(--status-success-foreground1);
  }
  .fp-status-stopped {
    color: var(--neutral-foreground3);
  }
  .fp-status-stopped .fp-status-dot {
    background: var(--neutral-foreground3);
  }
  .fp-status-deallocated {
    color: var(--status-warning-foreground1);
  }
  .fp-status-deallocated .fp-status-dot {
    background: var(--status-warning-foreground1);
  }
  .fp-status-failed {
    color: var(--status-danger-foreground1);
  }
  .fp-status-failed .fp-status-dot {
    background: var(--status-danger-foreground1);
  }

  /* ─── Docs section ─── */
  .fp-docs {
    color: var(--neutral-foreground2);
    font-size: 14px;
    line-height: 1.6;
  }
  .fp-docs h3 {
    margin: 16px 0 8px;
    font-size: var(--font-size-base400);
    font-weight: var(--font-weight-semi-bold);
    color: var(--neutral-foreground1);
  }
  .fp-docs ul {
    margin: 0;
    padding-left: 20px;
  }
  .fp-docs li {
    margin-bottom: 4px;
  }
  .fp-docs code {
    font-size: 12px;
    padding: 1px 5px;
    background: var(--neutral-background3);
    border-radius: 3px;
    color: var(--neutral-foreground1);
  }
  .fp-code {
    background: var(--neutral-background3);
    padding: 16px;
    border-radius: var(--border-radius-lg);
    font-size: 12px;
    line-height: 1.6;
    overflow-x: auto;
    color: var(--neutral-foreground1);
  }
  .fp-docs-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 16px;
    font-size: 13px;
  }
  .fp-docs-table th,
  .fp-docs-table td {
    text-align: left;
    padding: 6px 12px;
    border-bottom: 1px solid var(--neutral-stroke2);
  }
  .fp-docs-table th {
    font-weight: var(--font-weight-semi-bold);
    color: var(--neutral-foreground1);
    background: var(--neutral-background3);
  }
`;
