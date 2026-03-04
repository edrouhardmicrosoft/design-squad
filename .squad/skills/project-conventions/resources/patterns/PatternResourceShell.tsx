/**
 * Pattern Demo: Azure Resource Page Shell
 * Full page scaffold combining header, side nav, breadcrumb, title, and toolbar.
 */
import {
  CuiAppFrame,
  CuiAvatar,
  CuiBreadcrumb,
  CuiBreadcrumbItem,
  CuiButton,
  CuiCard,
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
import AzurePortalNav from './PatternAzurePortalNav';

export default function PatternResourceShell() {
  const styles = `
    body { margin: 0; }
    [slot='main'] {
      min-width: 320px;
      padding: 0;
      background: var(--neutral-background2);
    }
    .section-nav {
      width: 220px;
      min-width: 220px;
      border-right: 1px solid var(--neutral-stroke2);
      background: var(--neutral-background1);
      overflow-y: auto;
    }
    .page-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 32px 0;
    }
    .resource-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: var(--font-size-base500);
      font-weight: var(--font-weight-semi-bold);
      color: var(--neutral-foreground1);
    }
    .resource-subtitle {
      font-size: var(--font-size-base200);
      color: var(--neutral-foreground3);
      margin: 0 0 0 32px;
      padding-bottom: 12px;
    }
    .content-area { padding: 24px 32px; }
    .pattern-note {
      background: var(--neutral-background1);
      border: 1px solid var(--neutral-stroke2);
      border-radius: var(--border-radius-md);
      padding: 20px;
      margin-bottom: 16px;
    }
    .pattern-note h3 {
      margin: 0 0 8px;
      font-size: var(--font-size-base400);
      color: var(--neutral-foreground1);
    }
    .pattern-note p {
      margin: 0;
      color: var(--neutral-foreground2);
      font-size: var(--font-size-base300);
      line-height: 1.6;
    }
  `;

  return (
    <>
      <CuiAppFrame skipToMainText="Skip to main content">
        {/* ─── Header Pattern ─── */}
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
            <CuiIcon name="code-regular" />
          </CuiButton>
          <CuiButton slot="overflow-actions" appearance="subtle" shape="rounded" size="large" iconOnly aria-label="Notifications">
            <CuiIcon name="alert" />
          </CuiButton>
          <CuiButton slot="overflow-actions" appearance="subtle" shape="rounded" size="large" iconOnly aria-label="Settings">
            <CuiIcon name="settings" />
          </CuiButton>
          <CuiButton slot="overflow-actions" appearance="subtle" shape="rounded" size="large" iconOnly aria-label="Help + support">
            <CuiIcon name="info" />
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

        {/* ─── Global Navigation (hamburger menu) ─── */}
        <AzurePortalNav />

        {/* ─── Main Content ─── */}
        <div slot="main" style={{ display: 'flex', height: '100%' }}>
          {/* ─── Section Navigation ─── */}
          <nav className="section-nav">
            <CuiSideNav size="small">
              <CuiNavItem label="Overview" href="#" selected>
                <CuiIcon slot="icon" name="navigation" />
              </CuiNavItem>
              <CuiNavItem label="Activity log" href="#">
                <CuiIcon slot="icon" url={azureIcon('activity-log')} />
              </CuiNavItem>
              <CuiNavItem label="Access control (IAM)" href="#">
                <CuiIcon slot="icon" name="person" />
              </CuiNavItem>
              <CuiNavItem label="Tags" href="#">
                <CuiIcon slot="icon" url={azureIcon('tags')} />
              </CuiNavItem>
              <CuiNavHeading>Settings</CuiNavHeading>
              <CuiNavItem label="Configuration" href="#">
                <CuiIcon slot="icon" name="settings" />
              </CuiNavItem>
              <CuiNavItem label="Properties" href="#">
                <CuiIcon slot="icon" name="info" />
              </CuiNavItem>
            </CuiSideNav>
          </nav>

          {/* ─── Page Content ─── */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Breadcrumb */}
          <div style={{ padding: '8px 32px 0' }}>
            <CuiBreadcrumb label="Navigation" size="small">
              <CuiBreadcrumbItem href="#">Home</CuiBreadcrumbItem>
              <CuiBreadcrumbItem href="#">rg-contoso-prod</CuiBreadcrumbItem>
              <CuiBreadcrumbItem active current="page">app-contoso-prod</CuiBreadcrumbItem>
            </CuiBreadcrumb>
          </div>

          {/* Title row */}
          <div className="page-header">
            <CuiIcon
              url={azureIcon('app-service')}
              style={{ fontSize: '24px' }}
            />
            <h1 className="resource-title">app-contoso-prod | Overview</h1>
            <CuiButton appearance="subtle" iconOnly size="small">
              <CuiIcon name="star" />
            </CuiButton>
          </div>
          <p className="resource-subtitle">App Service</p>

          {/* Toolbar Pattern */}
          <div style={{ padding: '0 32px' }}>
            <CuiToolbar size="small" label="Resource actions">
              <CuiMenu>
                <CuiButton slot="trigger" appearance="subtle" size="small">
                  <CuiIcon slot="start" name="add" />
                  Add
                  <CuiIcon slot="end" name="chevron-down" />
                </CuiButton>
                <CuiMenuItem>Add deployment slot</CuiMenuItem>
                <CuiMenuItem>Add custom domain</CuiMenuItem>
              </CuiMenu>
              <CuiDivider orientation="vertical" style={{ height: '20px' }} />
              <CuiButton appearance="subtle" size="small">Restart</CuiButton>
              <CuiButton appearance="subtle" size="small">Stop</CuiButton>
              <CuiButton appearance="subtle" size="small">Refresh</CuiButton>
              <CuiDivider orientation="vertical" style={{ height: '20px' }} />
              <CuiButton appearance="subtle" size="small">
                <CuiIcon
                  slot="start"
                  name="delete"
                />
                Delete
              </CuiButton>
            </CuiToolbar>
          </div>

          <CuiDivider style={{ margin: '0' }} />

          {/* Content */}
          <div className="content-area">
            <div className="pattern-note">
              <h3>Resource Page Shell Pattern</h3>
              <p>
                This page demonstrates all 4 composition patterns working together:
                <strong> Azure Portal Header</strong> (top bar),
                <strong> Side Nav with Azure Icons</strong> (left drawer),
                <strong> Resource Page Toolbar</strong> (action bar),
                and the overall <strong>page shell</strong> (AppFrame + breadcrumb + title).
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <CuiCard appearance="outline">
                <div slot="heading">Pattern: Header</div>
                <p style={{ margin: 0, color: 'var(--neutral-foreground2)', fontSize: 13 }}>
                  CuiHeader with search, Copilot button, and avatar popover
                </p>
              </CuiCard>
              <CuiCard appearance="outline">
                <div slot="heading">Pattern: Side Nav</div>
                <p style={{ margin: 0, color: 'var(--neutral-foreground2)', fontSize: 13 }}>
                  CuiDrawer + CuiSideNav with CuiIcon name + Azure Icons
                </p>
              </CuiCard>
              <CuiCard appearance="outline">
                <div slot="heading">Pattern: Toolbar</div>
                <p style={{ margin: 0, color: 'var(--neutral-foreground2)', fontSize: 13 }}>
                  CuiToolbar with subtle buttons, dividers, and menus
                </p>
              </CuiCard>
              <CuiCard appearance="outline">
                <div slot="heading">Pattern: Page Shell</div>
                <p style={{ margin: 0, color: 'var(--neutral-foreground2)', fontSize: 13 }}>
                  CuiAppFrame + breadcrumb + resource title + subtitle
                </p>
              </CuiCard>
            </div>
          </div>
          </div>
        </div>
      </CuiAppFrame>
      <style>{styles}</style>
    </>
  );
}
