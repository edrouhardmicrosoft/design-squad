/**
 * Scaffold: Azure Portal Home Page
 *
 * The portal landing page with Azure services tiles, recent resources table,
 * and filter toolbar. No section side nav — full-width content area.
 *
 * Layout:
 *   AppFrame → Header → slot="main"
 *     Azure services row (icon tiles + "Navigate >" link)
 *     Resources section (tabs: Recent | Favorite | Shared with me)
 *       Filter toolbar (search + Resource group + Subscription + Manage view)
 *       Resource table (Name, Type, Resource group, Location, Subscription)
 *
 * Customization points (TODOs):
 *   - azureServices[] — top-row icon tiles
 *   - resources[] — table data
 *   - Copilot suggestions
 */
import { useState } from 'react';
import {
  CuiAppFrame,
  CuiAvatar,
  CuiButton,
  CuiDivider,
  CuiHeader,
  CuiIcon,
  CuiPersona,
  CuiPopOver,
  CuiSearchBox,
} from '@charm-ux/cui/react';
import CopilotButton from '../experiments/copilot-button';
import { azureIcon } from './azure-icons';
import AzurePortalNav from './PatternAzurePortalNav';
import { ServiceTile } from './PatternServiceTile';
import { NavLink } from './PatternNavLink';

// ─── Types ───

interface ServiceTile {
  label: string;
  iconUrl: string;
}

interface ResourceRow {
  name: string;
  type: string;
  lastViewed: string;
  iconKey: string;
}

// ─── Data (TODO: customize these) ───

const azureServices: ServiceTile[] = [
  { label: 'Create a resource', iconUrl: '' },  // Special: uses iconSlot in ServiceTile
  { label: 'Subscriptions', iconUrl: azureIcon('subscription')! },
  { label: 'Resource groups', iconUrl: azureIcon('resource-groups')! },
  { label: 'All resources', iconUrl: azureIcon('all-resources')! },
  { label: 'Quickstart Center', iconUrl: azureIcon('quickstart-center')! },
  { label: 'Microsoft Entra ID', iconUrl: azureIcon('entra-id')! },
  { label: 'Cost Management', iconUrl: azureIcon('cost-management')! },
  { label: 'Azure Monitor', iconUrl: azureIcon('monitor')! },
];

const resources: ResourceRow[] = [
  { name: 'charm-pilot', type: 'Static Web App', lastViewed: '2/20/2026, 9:45 PM', iconKey: 'static-web-app' },
  { name: 'charm-pilot-preview', type: 'Static Web App', lastViewed: '2/20/2026, 8:30 PM', iconKey: 'static-web-app' },
  { name: 'VibeAzure', type: 'Static Web App', lastViewed: '2/20/2026, 7:12 PM', iconKey: 'static-web-app' },
];

// ─── Styles ───

const styles = `
  body { margin: 0; }

  [slot='main'] {
    min-width: 320px;
    padding: 0;
    background: var(--neutral-background1);
  }

  /* ─── Page layout ─── */
  .home-content {
    overflow-y: auto;
    height: 100%;
  }
  .home-centered {
    max-width: 1063px;
    margin: 0 auto;
    padding: 16px 24px 48px;
  }

  /* ─── Azure services section ─── */
  .home-section-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin: 0 0 10px;
  }
  .home-section-title {
    font-size: var(--font-size-base400);
    font-weight: var(--font-weight-semi-bold);
    color: var(--neutral-foreground1);
    margin: 0;
  }
  .home-navigate-link {
    font-size: var(--font-size-base200);
    color: var(--brand-foreground-link);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }
  .home-navigate-link:hover {
    text-decoration: underline;
  }

  /* Service tiles row */
  .home-service-tiles {
    display: flex;
    gap: 2px;
    flex-wrap: wrap;
    margin-bottom: 28px;
    align-items: flex-start;
  }
  .home-more-services .service-tile-label {
    color: var(--brand-foreground-link);
  }

  /* ─── Resources section ─── */
  .home-resources-header {
    margin: 0 0 4px;
  }

  /* Tab bar for Recent | Favorite | Shared with me */
  .home-tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--neutral-stroke2);
    margin-bottom: 10px;
  }
  .home-tab {
    padding: 7px 14px;
    font-size: 13px;
    font-weight: var(--font-weight-regular);
    color: var(--neutral-foreground2);
    border: none;
    background: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    margin-bottom: -1px;
  }
  .home-tab:hover {
    color: var(--neutral-foreground1);
  }
  .home-tab.active {
    color: var(--neutral-foreground1);
    border-bottom-color: var(--brand-foreground-link);
    font-weight: var(--font-weight-semi-bold);
  }

  }

  /* Resource table */
  table {
    caption-side: bottom;
    border-collapse: collapse;
    width: 100%;
  }
  table.home-table {
    font-size: 13px;
    table-layout: auto;
  }
  .home-table th {
    text-align: left;
    padding: 6px 12px;
    font-weight: var(--font-weight-semi-bold);
    color: var(--neutral-foreground2);
    border-bottom: 1px solid var(--neutral-stroke1);
    white-space: nowrap;
    font-size: 12px;
    user-select: none;
  }
  .home-table td {
    padding: 6px 12px;
    color: var(--neutral-foreground1);
    border-bottom: 1px solid var(--neutral-stroke2);
    vertical-align: middle;
    font-size: 13px;
  }
  .home-table tr:hover td {
    background: var(--subtle-background-hover);
  }
  .home-table .resource-name {
    color: var(--brand-foreground-link);
    text-decoration: none;
    cursor: pointer;
  }
  .home-table .resource-name:hover {
    text-decoration: underline;
  }
  .home-table .resource-name-cell {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ─── Link sections (Navigate, Tools, Useful links) ─── */
  .home-link-section {
    margin-top: 24px;
  }
  .home-link-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 4px 24px;
    margin-top: 8px;
  }

  .home-table .resource-name-cell img {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

// ─── Component ───

export default function ScaffoldHomePage() {
  const [activeTab, setActiveTab] = useState<'recent' | 'favorite'>('recent');
  const [filterText, setFilterText] = useState('');

  const filteredResources = filterText
    ? resources.filter(r =>
        Object.values(r).some(v => v.toLowerCase().includes(filterText.toLowerCase()))
      )
    : resources;

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

        {/* ─── Main Content (no section side nav) ─── */}
        <div slot="main" style={{ height: '100%', width: '100%', minWidth: 0, overflow: 'hidden' }}>
          <div className="home-content">
            <div className="home-centered">

            {/* ─── Azure services ─── */}
            <div className="home-section-header">
              <h2 className="home-section-title">Azure services</h2>
            </div>

            <div className="home-service-tiles">
              {/* TODO: Customize service tiles */}
              <ServiceTile
                label="Create a resource"
                iconSlot={
                  <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
                    <rect x="3" y="3" width="22" height="22" rx="4" fill="#0078D4" />
                    <path d="M14 8v12M8 14h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                }
              />
              {azureServices.map((svc) => (
                <ServiceTile key={svc.label} label={svc.label} iconUrl={svc.iconUrl} />
              ))}
              <ServiceTile
                label="More services →"
                style={{ width: 80 }}
                className="home-more-services"
              />
            </div>

            {/* ─── Resources ─── */}
            <div className="home-section-header home-resources-header">
              <h2 className="home-section-title">Resources</h2>
            </div>

            {/* Tabs */}
            <div className="home-tabs">
              <button
                className={`home-tab${activeTab === 'recent' ? ' active' : ''}`}
                onClick={() => setActiveTab('recent')}
              >
                Recent
              </button>
              <button
                className={`home-tab${activeTab === 'favorite' ? ' active' : ''}`}
                onClick={() => setActiveTab('favorite')}
              >
                Favorite
              </button>
            </div>

            {/* Resource table */}
            {/* TODO: Replace with your resource data */}
            <table className="home-table" aria-label="Resources" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Last Viewed</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map((r, i) => (
                  <tr key={`${r.name}-${i}`}>
                    <td>
                      <div className="resource-name-cell">
                        <img src={azureIcon(r.iconKey)} alt="" />
                        <a className="resource-name" href="javascript:;">{r.name}</a>
                      </div>
                    </td>
                    <td>{r.type}</td>
                    <td>{r.lastViewed}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ─── Navigate ─── */}
            <div className="home-link-section">
              <h2 className="home-section-title">Navigate</h2>
              <div className="home-link-grid">
                <NavLink label="Subscriptions" iconUrl={azureIcon('subscription')} />
                <NavLink label="Resource groups" iconUrl={azureIcon('resource-groups')} />
                <NavLink label="All resources" iconUrl={azureIcon('all-resources')} />
                <NavLink label="Dashboard" iconUrl={azureIcon('dashboard')} />
              </div>
            </div>

            {/* ─── Tools ─── */}
            <div className="home-link-section">
              <h2 className="home-section-title">Tools</h2>
              <div className="home-link-grid">
                <NavLink label="Microsoft Entra ID" iconUrl={azureIcon('entra-id')} />
                <NavLink label="Microsoft Defender for Cloud" iconUrl={azureIcon('defender')} />
                <NavLink label="Azure Monitor" iconUrl={azureIcon('monitor')} />
                <NavLink label="Azure Advisor" iconUrl={azureIcon('advisor')} />
              </div>
            </div>

            {/* ─── Useful links ─── */}
            <div className="home-link-section">
              <h2 className="home-section-title">Useful links</h2>
              <div className="home-link-grid">
                <NavLink label="Quickstart Center" />
                <NavLink label="What's new" />
                <NavLink label="Azure Charts" />
                <NavLink label="Azure mobile app" />
              </div>
            </div>

          </div>{/* end home-centered */}
          </div>
        </div>
      </CuiAppFrame>
      <style>{styles}</style>
    </>
  );
}
