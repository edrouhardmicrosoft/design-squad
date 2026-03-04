/**
 * Azure Create Flow Scaffold
 *
 * Multi-step wizard using tabs inside a drawer or full page.
 * Common pattern for "Create a resource" flows in Azure.
 *
 * Usage: cp this file to coherence-preview/src/MyCreateFlow.tsx and edit.
 */
import { useState, FormEvent } from 'react';
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
  CuiPersona,
  CuiPopOver,
  CuiSearchBox,
  CuiSelect,
  CuiTab,
  CuiTabPanel,
  CuiTabs,
} from '@charm-ux/cui/react';
import CopilotButton from '../experiments/copilot-button';
import { azureIcon } from './azure-icons';
import PageHeader from './PageHeader';
import AzurePortalNav from './PatternAzurePortalNav';

export default function AzureCreateFlow() {
  const [activeTab, setActiveTab] = useState('basics');

  // TODO: Replace with your resource type
  const resourceTypeLabel = 'Storage account';

  const styles = `
    body { margin: 0; }
    [slot='main'] {
      min-width: 320px;
      padding: 0;
      background: var(--neutral-background2);
    }
    /* Page header styles provided by shared PageHeader component */
    .form-section {
      padding: 24px 32px;
      max-width: 640px;
    }
    .form-section h3 {
      font-size: var(--font-size-base400);
      font-weight: var(--font-weight-semi-bold);
      color: var(--neutral-foreground1);
      margin: 0 0 16px;
    }
    .field-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    .field-row > * { flex: 1; }
    .field-single { margin-bottom: 16px; }
    .form-actions {
      display: flex;
      gap: 12px;
      padding: 16px 32px;
      border-top: 1px solid var(--neutral-stroke2);
      background: var(--neutral-background1);
    }
  `;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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

        {/* ─── Main Content ─── */}
        <div slot="main">
          {/* Breadcrumb */}
          <div style={{ padding: '8px 32px 0' }}>
            <CuiBreadcrumb label="Navigation" size="small">
              <CuiBreadcrumbItem href="#">Home</CuiBreadcrumbItem>
              <CuiBreadcrumbItem active current="page">Create {resourceTypeLabel}</CuiBreadcrumbItem>
            </CuiBreadcrumb>
          </div>

          {/* Page title */}
          <PageHeader title={`Create ${resourceTypeLabel}`} subtitle={resourceTypeLabel} />

          <CuiDivider style={{ margin: '12px 0 0' }} />

          {/* Wizard Tabs */}
          <form onSubmit={handleSubmit}>
            <div style={{ padding: '0 32px' }}>
              <CuiTabs
                activeId={activeTab}
                onTabsChange={(e: any) => setActiveTab(e.detail?.id || 'basics')}
              >
                {/* TODO: Add/remove tabs for your resource */}
                <CuiTab id="basics">Basics</CuiTab>
                <CuiTab id="networking">Networking</CuiTab>
                <CuiTab id="advanced">Advanced</CuiTab>
                <CuiTab id="tags">Tags</CuiTab>
                <CuiTab id="review">Review + create</CuiTab>

                {/* ─── Basics Tab ─── */}
                <CuiTabPanel id="basics">
                  <div className="form-section">
                    <h3>Project details</h3>
                    <div className="field-single">
                      <CuiSelect label="Subscription" name="subscription" required>
                        <option value="">Select a subscription</option>
                        <option value="sub-1">Azure subscription 1</option>
                        <option value="sub-2">Visual Studio Enterprise</option>
                      </CuiSelect>
                    </div>
                    <div className="field-single">
                      <CuiSelect label="Resource group" name="resourceGroup" required>
                        <option value="">Select a resource group</option>
                        <option value="rg-1">rg-production</option>
                        <option value="rg-2">rg-development</option>
                      </CuiSelect>
                    </div>

                    <CuiDivider style={{ margin: '8px 0 24px' }} />

                    <h3>Instance details</h3>
                    <div className="field-single">
                      <CuiInput
                        label="Name"
                        name="name"
                        required
                        placeholder="Enter a unique name"
                      />
                    </div>
                    <div className="field-row">
                      <CuiSelect label="Region" name="region" required>
                        <option value="">(US) East US</option>
                        <option value="westus">(US) West US</option>
                        <option value="westeurope">(Europe) West Europe</option>
                        <option value="southeastasia">(Asia Pacific) Southeast Asia</option>
                      </CuiSelect>
                    </div>
                  </div>
                </CuiTabPanel>

                {/* ─── Networking Tab ─── */}
                <CuiTabPanel id="networking">
                  <div className="form-section">
                    <h3>Network configuration</h3>
                    <p style={{ color: 'var(--neutral-foreground2)' }}>
                      Configure networking options for this resource.
                    </p>
                  </div>
                </CuiTabPanel>

                {/* ─── Advanced Tab ─── */}
                <CuiTabPanel id="advanced">
                  <div className="form-section">
                    <h3>Advanced settings</h3>
                    <p style={{ color: 'var(--neutral-foreground2)' }}>
                      Configure advanced settings.
                    </p>
                  </div>
                </CuiTabPanel>

                {/* ─── Tags Tab ─── */}
                <CuiTabPanel id="tags">
                  <div className="form-section">
                    <h3>Tags</h3>
                    <p style={{ color: 'var(--neutral-foreground2)', marginBottom: 16 }}>
                      Tags are name/value pairs that enable you to categorize resources.
                    </p>
                    <div className="field-row">
                      <CuiInput label="Name" name="tagName" placeholder="e.g. Environment" />
                      <CuiInput label="Value" name="tagValue" placeholder="e.g. Production" />
                    </div>
                  </div>
                </CuiTabPanel>

                {/* ─── Review Tab ─── */}
                <CuiTabPanel id="review">
                  <div className="form-section">
                    <h3>Review + create</h3>
                    <p style={{ color: 'var(--neutral-foreground2)' }}>
                      Review your selections before creating the resource.
                    </p>
                  </div>
                </CuiTabPanel>
              </CuiTabs>
            </div>

            {/* Bottom actions bar */}
            <div className="form-actions">
              <CuiButton appearance="primary" type="submit">
                Review + create
              </CuiButton>
              <CuiButton appearance="outline">Previous</CuiButton>
              <CuiButton appearance="outline">Next</CuiButton>
              <CuiButton appearance="subtle">Download a template for automation</CuiButton>
            </div>
          </form>
        </div>
      </CuiAppFrame>
      <style>{styles}</style>
    </>
  );
}
