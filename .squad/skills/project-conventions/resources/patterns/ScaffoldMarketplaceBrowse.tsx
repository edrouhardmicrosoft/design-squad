/**
 * Scaffold: Marketplace Browse / "Create a Resource"
 *
 * Full-width page with a categories sidebar (left) and a two-column
 * service + marketplace product grid (right). Matches the Azure portal
 * "Create a resource" landing page pattern.
 *
 * Layout:
 *   AppFrame → Header → slot="main"
 *     PageHeader (breadcrumb + title + Copilot suggestions)
 *     Body: categories sidebar | content (search + two-column grid)
 *     Feedback link (fixed bottom-right)
 *
 * Customization points:
 *   - Categories list (topCategories, categories)
 *   - Left column items (popularServices)
 *   - Right column items (marketplaceProducts)
 *   - Copilot suggestion chips
 *   - Column titles and "see more" links
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
  CuiPersona,
  CuiPopOver,
  CuiSearchBox,
} from '@charm-ux/cui/react';
import CopilotButton from '../experiments/copilot-button';
import { azureIcon } from './azure-icons';
import PageHeader from './PageHeader';
import AzurePortalNav from './PatternAzurePortalNav';

// ─── Types ───

interface CategoryItem {
  label: string;
  id: string;
}

interface ServiceItem {
  name: string;
  icon: string;
}

interface MarketplaceItem {
  name: string;
  icon: string;
}

// ─── Data (customize these) ───

const headerTitle = 'Microsoft Azure';
const pageTitle = 'Create a resource';
const breadcrumbLabel = 'Home';

const copilotSuggestions = [
  'Design a new Azure workload',
  'I want to duplicate an existing VM',
  'Help me choose the right VM size',
];

const topCategories: CategoryItem[] = [
  { label: 'Get Started', id: 'get-started' },
  { label: 'Recently created', id: 'recently-created' },
];

const categories: CategoryItem[] = [
  { label: 'Machine Learning', id: 'machine-learning' },
  { label: 'AI Apps and Agents', id: 'ai-apps-agents' },
  { label: 'Analytics', id: 'analytics' },
  { label: 'Blockchain', id: 'blockchain' },
  { label: 'Infrastructure Services', id: 'infrastructure-services' },
  { label: 'Databases', id: 'databases' },
  { label: 'Developer Tools', id: 'developer-tools' },
  { label: 'DevOps', id: 'devops' },
  { label: 'Identity', id: 'identity' },
  { label: 'Integration', id: 'integration' },
  { label: 'Internet of Things', id: 'internet-of-things' },
  { label: 'IT & Management Tools', id: 'it-management-tools' },
  { label: 'Media', id: 'media' },
  { label: 'Migration', id: 'migration' },
  { label: 'Mixed Reality', id: 'mixed-reality' },
  { label: 'Monitoring & Management', id: 'monitoring-management' },
  { label: 'Security', id: 'security' },
  { label: 'Web', id: 'web' },
];

const popularServices: ServiceItem[] = [
  { name: 'Function App', icon: azureIcon('function-app')! },
  { name: 'Web App', icon: azureIcon('web-app')! },
  { name: 'Virtual network', icon: azureIcon('virtual-network')! },
  { name: 'Key Vault', icon: azureIcon('key-vault')! },
  { name: 'Virtual machine', icon: azureIcon('virtual-machine')! },
  { name: 'Storage account', icon: azureIcon('storage-account')! },
  { name: 'Data Factory', icon: azureIcon('data-factory')! },
  { name: 'Logic App', icon: azureIcon('logic-app')! },
  { name: 'Azure Databricks', icon: azureIcon('databricks')! },
  { name: 'App Service Plan', icon: azureIcon('app-service-plan')! },
];

const marketplaceProducts: MarketplaceItem[] = [
  { name: 'Windows Server 2025 Datacenter: Azure Edition', icon: azureIcon('virtual-machine')! },
  { name: 'Windows 11 Enterprise, version 25H2', icon: azureIcon('virtual-machine')! },
  { name: 'Ubuntu Pro 24.04 LTS', icon: azureIcon('virtual-machine')! },
  { name: 'Free SQL Server License: SQL Server 2022 Developer on Windows Server 2022', icon: azureIcon('sql-server')! },
  { name: 'Red Hat Enterprise Linux10 (latest minor version)', icon: azureIcon('virtual-machine')! },
  { name: 'Debian 13 "Trixie"', icon: azureIcon('virtual-machine')! },
  { name: 'Visual Studio 2022 Pro on Windows 10 Enterprise (x64) + Microsoft 365 Apps', icon: azureIcon('virtual-machine')! },
  { name: 'AlmaLinux OS 9', icon: azureIcon('virtual-machine')! },
  { name: 'SharePoint Server Subscription Edition Trial', icon: azureIcon('virtual-machine')! },
  { name: 'Oracle Linux 8.10 (LVM)', icon: azureIcon('virtual-machine')! },
];

// ─── Styles ───

const styles = `
  body { margin: 0; }

  .mb-page {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .mb-header-area {
    padding: 16px 24px 0;
    background: var(--neutral-background1);
  }

  .mb-body {
    display: flex;
    flex: 1;
    min-height: 0;
    background: var(--neutral-background1);
  }

  /* Categories Sidebar */
  .mb-sidebar {
    width: 200px;
    min-width: 200px;
    padding: 12px 0 24px 24px;
    overflow-y: auto;
  }

  .mb-cat-link {
    display: block;
    padding: 4px 12px;
    font-size: var(--font-size-base300);
    color: var(--neutral-foreground2);
    text-decoration: none;
    cursor: pointer;
    border-radius: 4px;
    line-height: 1.6;
  }

  .mb-cat-link:hover {
    background: var(--subtle-background-hover);
    color: var(--neutral-foreground1);
  }

  .mb-cat-link.active {
    font-weight: 600;
    color: var(--neutral-foreground1);
    background: var(--subtle-background-selected);
  }

  .mb-cat-heading {
    font-size: var(--font-size-base200);
    font-weight: 600;
    color: var(--neutral-foreground3);
    padding: 12px 12px 8px;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--neutral-stroke1);
    margin-right: 12px;
    margin-bottom: 4px;
  }

  /* Content Area */
  .mb-content {
    flex: 1;
    padding: 16px 32px 32px;
    overflow-y: auto;
  }

  .mb-search-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 0 0 24px;
  }

  .mb-search-row cui-search-box {
    max-width: 400px;
    flex: 1;
  }

  .mb-quickstart {
    font-size: var(--font-size-base200);
    color: var(--neutral-foreground3);
  }

  .mb-quickstart a {
    color: var(--brand-foreground-link);
    text-decoration: none;
  }

  .mb-quickstart a:hover {
    text-decoration: underline;
  }

  /* Two-Column Grid */
  .mb-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
  }

  @media (max-width: 960px) {
    .mb-columns {
      grid-template-columns: 1fr;
      gap: 32px;
    }
  }

  .mb-col-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding-bottom: 12px;
    margin: 0 0 4px;
    border-bottom: 1px solid var(--neutral-stroke1);
  }

  .mb-col-title {
    font-size: var(--font-size-base400);
    font-weight: 600;
    color: var(--neutral-foreground1);
    margin: 0;
  }

  .mb-col-more {
    font-size: var(--font-size-base200);
    color: var(--brand-foreground-link);
    text-decoration: none;
    cursor: pointer;
  }

  .mb-col-more:hover {
    text-decoration: underline;
  }

  /* Item Rows */
  .mb-item-list {
    display: flex;
    flex-direction: column;
  }

  .mb-item-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
  }

  .mb-item-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .mb-item-icon img {
    width: 32px;
    height: 32px;
  }

  .mb-item-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
  }

  .mb-item-name {
    font-size: var(--font-size-base300);
    font-weight: 600;
    color: var(--neutral-foreground1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mb-item-name.regular {
    font-weight: normal;
    white-space: normal;
    line-height: 1.3;
  }

  .mb-item-actions {
    display: flex;
    gap: 8px;
  }

  .mb-item-actions a {
    font-size: var(--font-size-base200);
    color: var(--brand-foreground-link);
    text-decoration: none;
    cursor: pointer;
  }

  .mb-item-actions a:hover {
    text-decoration: underline;
  }

  .mb-item-actions .separator {
    color: var(--neutral-foreground4);
    font-size: var(--font-size-base200);
  }

  /* Feedback */
  .mb-feedback {
    position: fixed;
    bottom: 12px;
    right: 16px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: var(--font-size-base200);
    color: var(--neutral-foreground3);
    cursor: pointer;
    text-decoration: none;
    z-index: 10;
  }

  .mb-feedback:hover {
    color: var(--brand-foreground-link);
  }
`;

// ─── Component ───

export default function ScaffoldMarketplaceBrowse() {
  const [activeCategory, setActiveCategory] = useState('get-started');

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
        <div slot="main" className="mb-page">
          {/* Breadcrumb + Title + Copilot Suggestions */}
          <div className="mb-header-area">
            <CuiBreadcrumb label="Navigation" size="small">
              <CuiBreadcrumbItem href="#">{breadcrumbLabel}</CuiBreadcrumbItem>
            </CuiBreadcrumb>
            <PageHeader
              title={pageTitle}
              copilotSuggestions={copilotSuggestions}
              horizontalPadding="0"
            />
          </div>

          {/* Body */}
          <div className="mb-body">
            {/* Categories Sidebar */}
            <nav className="mb-sidebar" aria-label="Resource categories">
              {topCategories.map((cat) => (
                <a
                  key={cat.id}
                  className={`mb-cat-link${activeCategory === cat.id ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  role="button"
                  tabIndex={0}
                >
                  {cat.label}
                </a>
              ))}
              <h3 className="mb-cat-heading">Categories</h3>
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  className={`mb-cat-link${activeCategory === cat.id ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  role="button"
                  tabIndex={0}
                >
                  {cat.label}
                </a>
              ))}
            </nav>

            {/* Content */}
            <div className="mb-content">
              <div className="mb-search-row">
                <CuiSearchBox hideLabel placeholder="Search services and marketplace" />
                <span className="mb-quickstart">
                  Getting started? <a href="javascript:;">Try our Quickstart Center</a>
                </span>
              </div>

              <div className="mb-columns">
                {/* Left Column — Services */}
                <div>
                  <div className="mb-col-header">
                    <h2 className="mb-col-title">Popular Azure services</h2>
                    <a className="mb-col-more" href="javascript:;">See more in All services</a>
                  </div>
                  <div className="mb-item-list">
                    {popularServices.map((svc) => (
                      <div className="mb-item-row" key={svc.name}>
                        <div className="mb-item-icon"><img src={svc.icon} alt="" /></div>
                        <div className="mb-item-info">
                          <span className="mb-item-name">{svc.name}</span>
                          <div className="mb-item-actions">
                            <a href="javascript:;">Create</a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column — Marketplace */}
                <div>
                  <div className="mb-col-header">
                    <h2 className="mb-col-title">Popular Marketplace products</h2>
                    <a className="mb-col-more" href="javascript:;">See more in Marketplace</a>
                  </div>
                  <div className="mb-item-list">
                    {marketplaceProducts.map((product) => (
                      <div className="mb-item-row" key={product.name}>
                        <div className="mb-item-icon"><img src={product.icon} alt="" /></div>
                        <div className="mb-item-info">
                          <span className="mb-item-name regular">{product.name}</span>
                          <div className="mb-item-actions">
                            <a href="javascript:;">Create</a>
                            <span className="separator">|</span>
                            <a href="javascript:;">Learn more</a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <a className="mb-feedback" href="javascript:;" aria-label="Give feedback">
            <CuiIcon name="person-feedback" style={{ width: 14, height: 14 }} />
            Give feedback
          </a>
        </div>
      </CuiAppFrame>
      <style>{styles}</style>
    </>
  );
}
