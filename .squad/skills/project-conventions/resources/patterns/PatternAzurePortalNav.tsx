/**
 * Pattern: Azure Portal Global Navigation
 *
 * The portal-wide navigation panel triggered by the hamburger (☰) menu.
 * Shows: + Create a resource, Home, Dashboard, All services, and Favorites.
 *
 * Azure portal has two navigation tiers:
 *   1. Global nav (this component) — portal-wide, hamburger-toggled overlay
 *   2. Section nav — resource/blade-specific, always visible inline in main
 *
 * Usage:
 *   <CuiAppFrame>
 *     <CuiHeader slot="header" navigationIconLabel="Menu" />
 *     <AzurePortalNav />
 *     <div slot="main" style={{ display: 'flex', height: '100%' }}>
 *       <nav className="section-nav">
 *         <CuiSideNav size="small">...section items...</CuiSideNav>
 *       </nav>
 *       <div style={{ flex: 1, overflowY: 'auto' }}>...content...</div>
 *     </div>
 *   </CuiAppFrame>
 */
import {
  CuiDivider,
  CuiDrawer,
  CuiIcon,
  CuiNavHeading,
  CuiNavItem,
  CuiSideNav,
} from '@charm-ux/cui/react';
import { azureIcon } from './azure-icons';

const favorites: { label: string; name?: string; azureIcon?: string }[] = [
  { label: 'All resources', azureIcon: 'all-resources' },
  { label: 'Resource groups', azureIcon: 'resource-groups' },
  { label: 'App Services', azureIcon: 'app-service' },
  { label: 'Function App', azureIcon: 'function-app' },
  { label: 'Azure SQL Database', azureIcon: 'sql-database' },
  { label: 'Azure Cosmos DB', azureIcon: 'cosmos-db' },
  { label: 'Virtual machines', azureIcon: 'virtual-machine' },
  { label: 'Load balancers', azureIcon: 'load-balancer' },
  { label: 'Storage accounts', azureIcon: 'storage-account' },
  { label: 'Virtual networks', azureIcon: 'virtual-network' },
  { label: 'Microsoft Entra ID', azureIcon: 'entra-id' },
  { label: 'Monitor', azureIcon: 'monitor' },
  { label: 'Advisor', azureIcon: 'advisor' },
  { label: 'Microsoft Defender for Cloud', azureIcon: 'defender' },
  { label: 'Cost Management + Billing', azureIcon: 'cost-management' },
  { label: 'Help + support', name: 'chat' },
  { label: 'Application Templates', name: 'apps' },
];

export default function AzurePortalNav() {
  return (
    <CuiDrawer
      slot="navigation"
      id="portal-nav-drawer"
      position="start"
    >
      <CuiSideNav size="small">
        <CuiNavItem label="Create a resource" href="#">
          <CuiIcon slot="icon" name="add" />
        </CuiNavItem>
        <CuiDivider />
        <CuiNavItem label="Home" href="#">
          <CuiIcon slot="icon" url={azureIcon('home')} />
        </CuiNavItem>
        <CuiNavItem label="Dashboard" href="#">
          <CuiIcon slot="icon" url={azureIcon('dashboard')} />
        </CuiNavItem>
        <CuiNavItem label="All services" href="#">
          <CuiIcon slot="icon" name="grid" />
        </CuiNavItem>

        <CuiNavHeading>FAVORITES</CuiNavHeading>

        {favorites.map((item) => (
          <CuiNavItem key={item.label} label={item.label} href="#">
            {item.name ? (
              <CuiIcon slot="icon" name={item.name} />
            ) : (
              <CuiIcon slot="icon" url={azureIcon(item.azureIcon!)} />
            )}
          </CuiNavItem>
        ))}
      </CuiSideNav>
    </CuiDrawer>
  );
}
