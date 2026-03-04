/**
 * Pattern Demo: Resource Page Toolbar
 * Isolated preview of the Azure-style horizontal action bar.
 */
import {
  CuiButton,
  CuiDivider,
  CuiIcon,
  CuiMenu,
  CuiMenuItem,
  CuiToolbar,
} from '@charm-ux/cui/react';

export default function PatternToolbar() {
  return (
    <>
      <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--neutral-stroke2)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 'var(--font-size-base400)', fontWeight: 'var(--font-weight-semi-bold)' }}>
          Full Toolbar (with dropdown)
        </h3>
        <CuiToolbar size="small" label="Resource actions">
          <CuiMenu>
            <CuiButton slot="trigger" appearance="subtle" size="small">
              <CuiIcon slot="start" name="add" />
              Add
              <CuiIcon slot="end" name="chevron-down" />
            </CuiButton>
            <CuiMenuItem>Add role assignment</CuiMenuItem>
            <CuiMenuItem>Add co-administrator</CuiMenuItem>
            <CuiMenuItem>Add classic administrator</CuiMenuItem>
          </CuiMenu>

          <CuiDivider orientation="vertical" style={{ height: '20px' }} />

          <CuiButton appearance="subtle" size="small">
            <CuiIcon slot="start" name="arrow-download" />
            Download
          </CuiButton>
          <CuiButton appearance="subtle" size="small">
            <CuiIcon
              slot="start"
              name="edit"
              label="Edit columns"
            />
            Edit columns
          </CuiButton>
          <CuiButton appearance="subtle" size="small">Refresh</CuiButton>

          <CuiDivider orientation="vertical" style={{ height: '20px' }} />

          <CuiButton appearance="subtle" size="small">
            <CuiIcon slot="start" name="delete" label="Delete" />
            Delete
          </CuiButton>

          <CuiDivider orientation="vertical" style={{ height: '20px' }} />

          <CuiButton appearance="subtle" size="small">Feedback</CuiButton>
        </CuiToolbar>
      </div>

      <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--neutral-stroke2)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 'var(--font-size-base400)', fontWeight: 'var(--font-weight-semi-bold)' }}>
          Simple Toolbar (buttons only)
        </h3>
        <CuiToolbar size="small" label="Actions">
          <CuiButton appearance="subtle" size="small">
            <CuiIcon slot="start" name="add" />
            Add
          </CuiButton>
          <CuiDivider orientation="vertical" style={{ height: '20px' }} />
          <CuiButton appearance="subtle" size="small">Refresh</CuiButton>
          <CuiButton appearance="subtle" size="small">Feedback</CuiButton>
        </CuiToolbar>
      </div>

      <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--neutral-stroke2)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 'var(--font-size-base400)', fontWeight: 'var(--font-weight-semi-bold)' }}>
          Toolbar with Multiple Menus
        </h3>
        <CuiToolbar size="small" label="IAM actions">
          <CuiMenu>
            <CuiButton slot="trigger" appearance="subtle" size="small">
              <CuiIcon slot="start" name="add" />
              Add
              <CuiIcon slot="end" name="chevron-down" />
            </CuiButton>
            <CuiMenuItem>Add role assignment</CuiMenuItem>
            <CuiMenuItem>Add co-administrator</CuiMenuItem>
          </CuiMenu>
          <CuiMenu>
            <CuiButton slot="trigger" appearance="subtle" size="small">
              Remove
              <CuiIcon slot="end" name="chevron-down" />
            </CuiButton>
            <CuiMenuItem>Remove role assignment</CuiMenuItem>
            <CuiMenuItem>Remove co-administrator</CuiMenuItem>
          </CuiMenu>
          <CuiDivider orientation="vertical" style={{ height: '20px' }} />
          <CuiButton appearance="subtle" size="small">Download</CuiButton>
          <CuiButton appearance="subtle" size="small">Refresh</CuiButton>
        </CuiToolbar>
      </div>

      <div style={{ padding: 32, color: 'var(--neutral-foreground2)' }}>
        <h2 style={{ marginTop: 0 }}>Resource Page Toolbar Pattern</h2>
        <p>Components: <code>CuiToolbar</code>, <code>CuiButton</code>, <code>CuiDivider</code>, <code>CuiMenu</code>, <code>CuiMenuItem</code></p>
        <h3>Layout Rules</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>All buttons: <code>appearance="subtle"</code> + <code>size="small"</code></li>
          <li>Vertical dividers: <code>CuiDivider orientation="vertical"</code> with 20px height</li>
          <li>Dropdown triggers: icon in <code>slot="start"</code>, chevron-down in <code>slot="end"</code></li>
          <li>Group: primary actions → data actions → destructive → meta</li>
          <li>No wrapping: toolbar must never wrap to a second line — add <code>flex-wrap: nowrap</code> on <code>cui-toolbar</code> and <code>white-space: nowrap</code> on buttons via <code>::part(button-control)</code> to pierce the shadow DOM</li>
        </ul>
      </div>
      <style>{`
        body { margin: 0; }
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
      `}</style>
    </>
  );
}
