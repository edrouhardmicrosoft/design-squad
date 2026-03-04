/**
 * Pattern Demo: Azure Portal Header
 * Isolated preview of the standard Azure portal header bar.
 */
import {
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

export default function PatternHeader() {
  return (
    <>
      <CuiHeader navigationIconLabel="toggle navigation">
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

      <div style={{ padding: 32, color: 'var(--neutral-foreground2)' }}>
        <h2 style={{ marginTop: 0 }}>Azure Portal Header Pattern</h2>
        <p>Components used: <code>CuiHeader</code>, <code>CuiSearchBox</code>, <code>CuiAvatar</code>, <code>CuiPopOver</code>, <code>CuiPersona</code></p>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>Title slot</strong> — transparent button with "Microsoft Azure" text</li>
          <li><strong>Search slot</strong> — search box with keyboard shortcut hint + Copilot button</li>
          <li><strong>Overflow actions</strong> — Cloud Shell, Notifications, Settings, Help + support, Feedback</li>
          <li><strong>Actions end</strong> — Avatar popover with persona card and profile links</li>
        </ul>
      </div>
      <style>{`body { margin: 0; }`}</style>
    </>
  );
}
