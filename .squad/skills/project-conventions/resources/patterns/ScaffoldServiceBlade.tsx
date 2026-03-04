/**
 * Scaffold: Azure Service Blade
 *
 * Alternate AppFrame layout that matches how Azure portal renders service-level
 * pages like "Monitor | Overview". The key difference from the standard Resource
 * Page scaffold:
 *
 *   Standard:   AppFrame navigation slot holds the side nav,
 *               title lives inside slot="main" (to the right of nav).
 *
 *   This blade:  AppFrame navigation slot is unused. Inside slot="main",
 *                a full-width title bar spans the top, with a custom flex
 *                layout below it — collapsible sidebar (left) + content (right).
 *                The info banner and tabs live inside the content area (to the
 *                right of the sidebar), not full-width above the body.
 *
 * This matches the real Azure portal pattern where the page title
 * ("Monitor | Overview") always spans full width above the service sidebar,
 * regardless of whether the sidebar is expanded or collapsed.
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
  CuiMessageBar,
  CuiNavHeading,
  CuiNavItem,
  CuiPersona,
  CuiPopOver,
  CuiSearchBox,
  CuiSideNav,
} from '@charm-ux/cui/react';
import { ServiceCard } from './PatternServiceCard';
import CopilotButton from '../experiments/copilot-button';
import { azureIcon } from './azure-icons';
import PageHeader from './PageHeader';
import AzurePortalNav from './PatternAzurePortalNav';

/* ─── Service nav items (customize per service) ─── */
interface NavItem {
  label: string;
  name?: string;
  azureIconKey?: string;
  selected?: boolean;
}

const navSections: { heading: string | null; items: NavItem[] }[] = [
  {
    heading: null,
    items: [
      { label: 'Overview', name: 'navigation', selected: true },
      { label: 'Activity log', azureIconKey: 'activity-log' },
      { label: 'Alerts', name: 'alert' },
      { label: 'Issues (preview)', name: 'warning' },
      { label: 'Metrics', azureIconKey: 'monitor' },
      { label: 'Logs', azureIconKey: 'audit-logs' },
      { label: 'Change Analysis', name: 'arrow-sync' },
      { label: 'Service health', azureIconKey: 'diagnostics' },
      { label: 'Workbooks', azureIconKey: 'workbooks' },
    ],
  },
  {
    heading: 'Insights',
    items: [
      { label: 'Insights', azureIconKey: 'application-insights' },
    ],
  },
  {
    heading: 'Settings',
    items: [
      { label: 'Settings', name: 'settings' },
      { label: 'Support + Troubleshooting', name: 'chat' },
    ],
  },
];

export default function ScaffoldServiceBlade() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selected, setSelected] = useState('Overview');
  const [bannerVisible, setBannerVisible] = useState(true);

  /* ─── Customize these ─── */
  const serviceName = 'Monitor';
  const pageTitle = 'Overview';

  const styles = `
    body { margin: 0; }
    [slot='main'] {
      min-width: 320px;
      padding: 0;
      background: var(--neutral-background-1);
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    /* ─── Full-width blade header area ─── */
    .blade-breadcrumb {
      padding: 4px 16px 0;
    }

    /* Info message bar — blue Azure style for intent="info" */
    cui-message-bar[intent='info'] {
      --message-bar-bg-color: var(--brand-background2);
      --message-bar-icon-fg-color: var(--brand-foreground-link);
      --message-bar-border: 1px solid var(--brand-stroke1);
    }

    /* Tabs */
    .blade-tabs {
      display: flex;
      gap: 0;
      padding: 0;
      border-bottom: 1px solid var(--neutral-stroke-2);
    }
    .blade-tab {
      padding: 8px 16px;
      font-size: var(--font-size-base-300);
      font-weight: var(--font-weight-regular);
      color: var(--neutral-foreground-2);
      border: none;
      background: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      font-family: inherit;
    }
    .blade-tab.active {
      color: var(--brand-foreground-link);
      border-bottom-color: var(--brand-foreground-link);
      font-weight: var(--font-weight-semibold);
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
      border-right: 1px solid var(--neutral-stroke-2);
      background: var(--neutral-background-1);
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
      background: var(--neutral-background-1);
      border-right: 1px solid var(--neutral-stroke-2);
    }

    /* Content area */
    .blade-content {
      flex: 1;
      overflow: hidden;
      background: var(--neutral-background-1);
      display: flex;
      flex-direction: row;
    }
    .blade-content-inner {
      flex: 1;
      overflow-y: auto;
      padding: 24px 24px;
    }

    /* Card grid for overview content */
    .blade-card-section {
      margin-bottom: 28px;
    }
    .blade-card-section h2 {
      font-size: 18px;
      font-weight: var(--font-weight-semibold);
      color: var(--neutral-foreground-1);
      margin: 0 0 4px;
    }
    .blade-card-section p {
      font-size: var(--font-size-base-200);
      color: var(--neutral-foreground-3);
      margin: 0 0 14px;
    }
    .blade-card-section p a {
      color: var(--brand-foreground-link);
      text-decoration: none;
    }
    .blade-card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 12px;
    }
  `;

  return (
    <>
      <CuiAppFrame skipToMainText="Skip to main content">
        {/* ─── Header (standard Azure portal header) ─── */}
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

        {/* ─── No section navigation slot — sidebar is inside main ─── */}

        {/* ─── Main ─── */}
        <div slot="main" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Breadcrumb — full width */}
          <div className="blade-breadcrumb">
            <CuiBreadcrumb label="Navigation" size="small">
              <CuiBreadcrumbItem href="#">Home</CuiBreadcrumbItem>
            </CuiBreadcrumb>
          </div>

          {/* Title — shared PageHeader, full width above sidebar */}
          <PageHeader
            icon={azureIcon('monitor')}
            title={<><strong>{serviceName}</strong> | {pageTitle}</>}
            subtitle="Microsoft"
            titleWeight="regular"
            horizontalPadding="16px"
            copilotSuggestions={[
              'Summarize these Monitor services in a table',
              'Run an anomaly investigation into my resource',
              'Catch me up on my alerts',
            ]}
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
                        selected={selected === item.label ? true : undefined}
                        onClick={() => setSelected(item.label)}
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

              <div className="blade-content-inner">
                {/* Info banner — inside content area */}
                <CuiMessageBar
                  intent="info"
                  shape="square"
                  dismissible
                  open={bannerVisible}
                  onMessageBarHide={() => setBannerVisible(false)}
                >
                  <CuiIcon slot="icon" name="info-filled" label="info" />
                  The Log Analytics agents, used by VM Insights, won't be supported as of August 31, 2024.
                  Plan to migrate to VM Insights on Azure Monitor agent prior to this date.
                  <CuiButton slot="action" appearance="link" href="#">→</CuiButton>
                </CuiMessageBar>

                {/* Tabs — inside content area */}
                <div className="blade-tabs">
                  <button className="blade-tab active">Overview</button>
                  <button className="blade-tab">Tutorials</button>
                </div>

                {/* ─── Insights section ─── */}
                <div className="blade-card-section">
                  <h2>Insights</h2>
                  <p>Use curated monitoring views for specific Azure resources. <a href="#">View all insights</a></p>
                  <div className="blade-card-grid">
                    {[
                      { title: 'Application Insights', description: "Monitor your app's availability, performance, errors, and usage.", icon: 'app-generic' },
                      { title: 'Container Insights', description: 'Gain visibility into the performance and health of your controllers, nodes, and containers.', icon: 'box' },
                      { title: 'VM Insights', description: 'Monitor the health, performance, and dependencies of your VMs and VM scale sets.', icon: 'desktop' },
                      { title: 'Network Insights', description: 'View the health and metrics for all deployed network resources.', icon: 'globe' },
                    ].map(card => (
                      <ServiceCard key={card.title} {...card} />
                    ))}
                  </div>
                </div>

                {/* ─── Detection section ─── */}
                <div className="blade-card-section">
                  <h2>Detection, triage, and diagnosis</h2>
                  <p>Visualize, analyze, and respond to monitoring data and events. <a href="#">Learn more about monitoring ↗</a></p>
                  <div className="blade-card-grid">
                    {[
                      { title: 'Metrics', description: 'Create charts to monitor and investigate the usage and performance of your Azure resources.', icon: 'data-trending' },
                      { title: 'Alerts', description: 'Get notified and respond using alerts and actions.', icon: 'alert' },
                      { title: 'Logs', description: 'Analyze and diagnose issues with log queries.', icon: 'notebook' },
                      { title: 'Workbooks', description: 'View, create and share interactive reports.', icon: 'book-open' },
                    ].map(card => (
                      <ServiceCard key={card.title} {...card} />
                    ))}
                  </div>
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
