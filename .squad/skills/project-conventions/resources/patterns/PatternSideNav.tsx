/**
 * Pattern Demo: Side Nav with Azure Icons
 * Isolated preview of Azure-style side navigation.
 * Uses CuiIcon `name` for generic concepts, Azure Icons CDN for service/blade icons.
 * NO Iconify URLs.
 */
import {
  CuiDivider,
  CuiDrawer,
  CuiIcon,
  CuiNavHeading,
  CuiNavItem,
  CuiSideNav,
} from '@charm-ux/cui/react';
import { useState } from 'react';
import { azureIcon } from './azure-icons';

/**
 * Icon strategy for nav items:
 *   - `name`: use CuiIcon registered name (generic UI metaphors)
 *   - `azureIcon`: key into azure-icons.ts (Azure service/blade icons from iconcloud.design)
 *   Only ONE should be set per item.
 */
const navItems: { label: string; name?: string; azureIcon?: string; section: string | null }[] = [
  { label: 'Overview',                     name: 'navigation',   section: null },
  { label: 'Activity log',                 azureIcon: 'activity-log', section: null },
  { label: 'Access control (IAM)',         name: 'person',       section: null },
  { label: 'Tags',                         azureIcon: 'tags',    section: null },
  { label: 'Diagnose and solve problems',  azureIcon: 'diagnostics', section: null },
  { label: 'APIs',                         azureIcon: 'api-management', section: 'APIs' },
  { label: 'Products',                     azureIcon: 'api-center', section: 'APIs' },
  { label: 'Subscriptions',               azureIcon: 'subscription', section: 'APIs' },
  { label: 'Configuration',               name: 'settings',     section: 'Settings' },
  { label: 'Properties',                  name: 'info',         section: 'Settings' },
  { label: 'Networking',                   azureIcon: 'virtual-network', section: 'Settings' },
];

export default function PatternSideNav() {
  const [selected, setSelected] = useState('Overview');
  let lastSection: string | null = null;

  return (
    <>
      <div style={{ display: 'flex', height: '100vh' }}>
        <CuiDrawer
          id="nav-demo"
          inline
          position="start"
          open
          style={{ borderRight: '1px solid var(--neutral-stroke2)' }}
        >
          <CuiSideNav size="small">
            {navItems.map((item, i) => {
              const sectionHeader =
                item.section && item.section !== lastSection ? (
                  <CuiNavHeading key={`h-${i}`}>{item.section}</CuiNavHeading>
                ) : null;
              if (item.section) lastSection = item.section;
              return (
                <span key={item.label}>
                  {sectionHeader}
                  <CuiNavItem
                    label={item.label}
                    href="#"
                    selected={selected === item.label ? true : undefined}
                    onClick={() => {
                      setSelected(item.label);
                    }}
                  >
                    {item.name ? (
                      <CuiIcon slot="icon" name={item.name} />
                    ) : (
                      <CuiIcon
                        slot="icon"
                        url={azureIcon(item.azureIcon!)}
                      />
                    )}
                  </CuiNavItem>
                </span>
              );
            })}
            <CuiDivider />
            <CuiNavItem label="Developer portal" href="#">
              <CuiIcon slot="icon" name="open" />
            </CuiNavItem>
          </CuiSideNav>
        </CuiDrawer>

        <div style={{ flex: 1, padding: 32, color: 'var(--neutral-foreground2)' }}>
          <h2 style={{ marginTop: 0 }}>Side Nav with Azure Icons Pattern</h2>
          <p>
            Selected: <strong style={{ color: 'var(--neutral-foreground1)' }}>{selected}</strong>
          </p>
          <p>Components: <code>CuiDrawer</code>, <code>CuiSideNav</code>, <code>CuiNavItem</code>, <code>CuiNavHeading</code>, <code>CuiIcon</code></p>
          <h3>Icon Strategy (NO Iconify)</h3>
          <ol style={{ lineHeight: 1.8 }}>
            <li><strong>CuiIcon <code>name</code></strong> — generic UI concepts (settings, person, info, etc.)</li>
            <li><strong>Azure Icons CDN</strong> — Azure service & blade icons from <code>azure-icons.ts</code></li>
          </ol>
          <pre style={{
            background: 'var(--neutral-background3)',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflow: 'auto',
          }}>
{`// Generic concept (registered Fluent icon)
<CuiIcon slot="icon" name="settings" />

// Azure service/blade icon (from iconcloud.design)
import { azureIcon } from './azure-icons';
<CuiIcon slot="icon" url={azureIcon('api-management')} />`}
          </pre>
          <h3>Key Features</h3>
          <ul style={{ lineHeight: 1.8 }}>
            <li>No external Iconify dependency — icons load from CDN or are bundled</li>
            <li><code>CuiNavHeading</code> creates labeled section groups</li>
            <li><code>CuiDivider</code> separates major sections</li>
            <li><code>inline</code> + <code>breakpoint</code> collapses to hamburger on small screens</li>
          </ul>
        </div>
      </div>
      <style>{`body { margin: 0; }`}</style>
    </>
  );
}
