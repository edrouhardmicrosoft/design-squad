/**
 * Azure Icons — Official Azure Portal icon map.
 *
 * Source: https://iconcloud.design/browse/Azure%20Icons
 * CDN:    https://github.com/maskati/azure-icons (extracted from Azure Portal)
 *
 * Usage:
 *   import { azureIcon } from '../patterns/azure-icons';
 *   <CuiIcon url={azureIcon('api-management')} />
 *
 * Icon strategy (NO Iconify):
 *   1. CuiIcon `name` prop for generic UI metaphors (settings, person, info, etc.)
 *   2. Azure Icons via `url` prop for Azure service & blade-specific icons
 *   3. NEVER use api.iconify.design URLs
 */

const BASE = 'https://raw.githubusercontent.com/maskati/azure-icons/main/svg';

/** Map of Azure icon keys → official portal icon SVG URLs */
export const AZURE_ICONS: Record<string, string> = {
  // ─── Navigation / Blade Icons ───
  'overview':           `${BASE}/Microsoft_AAD_IAM/Overview.svg`,
  'activity-log':       `${BASE}/Microsoft_Azure_ActivityLog/ActivityLogAsset.svg`,
  'tags':               `${BASE}/HubsExtension/Tag.svg`,
  'diagnostics':        `${BASE}/Microsoft_AAD_IAM/DiagnosticsHome.svg`,
  'policy':             `${BASE}/Microsoft_Azure_Policy/PolicyHub.svg`,
  'compliance':         `${BASE}/Microsoft_Azure_AppComplianceAutomation/AppComplianceAutomation.svg`,
  'security':           `${BASE}/Microsoft_AAD_IAM/Security.svg`,
  'identity':           `${BASE}/Microsoft_AAD_IAM/AzureActiveDirectory.svg`,
  'resource-groups':    `${BASE}/HubsExtension/ResourceGroups.svg`,
  'all-resources':      `${BASE}/HubsExtension/BrowseAllResources.svg`,
  'deployments':        `${BASE}/HubsExtension/Deployments.svg`,
  'audit-logs':         `${BASE}/Microsoft_AAD_IAM/AuditLogs.svg`,
  'sign-in-logs':       `${BASE}/Microsoft_AAD_IAM/SignInLogs.svg`,
  'user-management':    `${BASE}/Microsoft_AAD_IAM/UserManagement.svg`,
  'groups':             `${BASE}/Microsoft_AAD_IAM/GroupsManagement.svg`,
  'roles':              `${BASE}/Microsoft_AAD_IAM/AllRolesBlade.svg`,
  'lockbox':            `${BASE}/Microsoft_Azure_Lockbox/AzureLockbox.svg`,
  'properties':         `${BASE}/Microsoft_AAD_IAM/TenantProperties.svg`,
  'portal-settings':    `${BASE}/Microsoft_AAD_IAM/Settings.svg`,
  'cost-alerts':        `${BASE}/Microsoft_Azure_CostManagement/CostAlerts.svg`,
  'security-alerts':    `${BASE}/Microsoft_Azure_Security/SecurityAlerts.svg`,
  'workbooks':          `${BASE}/AppInsightsExtension/Workbooks.svg`,

  // ─── App Services ───
  'function-app':       'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Function-Apps.svg',
  'web-app':            `${BASE}/WebsitesExtension/Webapp.svg`,
  'app-service':        `${BASE}/WebsitesExtension/Website.svg`,
  'app-service-plan':   `${BASE}/WebsitesExtension/WebHostingPlan.svg`,
  'static-web-app':     `${BASE}/WebsitesExtension/StaticSite.svg`,
  'container-app':      `${BASE}/WebsitesExtension/ContainerApp.svg`,
  'container-app-env':  `${BASE}/WebsitesExtension/ContainerAppEnvironment.svg`,

  // ─── API & Integration ───
  'api-management':     `${BASE}/Microsoft_Azure_ApiManagement/Service.svg`,
  'api-center':         `${BASE}/Microsoft_Azure_ApiManagement/Center.svg`,
  'logic-app':          `${BASE}/Microsoft_Azure_EMA/Workflow.svg`,
  'service-bus':        `${BASE}/Microsoft_Azure_ServiceBus/ServiceBus.svg`,
  'event-hub':          `${BASE}/Microsoft_Azure_EventHub/EventHub.svg`,

  // ─── Compute ───
  'virtual-machine':    `${BASE}/Microsoft_Azure_Compute/VirtualMachine.svg`,
  'vm-scale-set':       `${BASE}/Microsoft_Azure_Compute/VirtualMachineScaleSet.svg`,
  'availability-set':   `${BASE}/Microsoft_Azure_Compute/AvailabilitySet.svg`,
  'compute-fleet':      `${BASE}/Microsoft_Azure_AzFleet/AzureFleet.svg`,

  // ─── Containers ───
  'kubernetes':         `${BASE}/Microsoft_Azure_ContainerService/ManagedClusters.svg`,
  'aks':                `${BASE}/Microsoft_Azure_ContainerService/ManagedClusters.svg`,
  'container-registry': `${BASE}/Microsoft_Azure_ContainerRegistries/RegistryResource.svg`,
  'container-instance': `${BASE}/Microsoft_Azure_ContainerService/ContainerGroup.svg`,

  // ─── Data ───
  'cosmos-db':          `${BASE}/Microsoft_Azure_DocumentDB/DocumentDBDatabaseAccount.svg`,
  'sql-database':       `${BASE}/SqlAzureExtension/Database.svg`,
  'sql-server':         `${BASE}/SqlAzureExtension/Server.svg`,
  'sql-managed':        `${BASE}/SqlAzureExtension/ManagedInstance.svg`,
  'data-factory':       `${BASE}/Microsoft_Azure_DataFactory/DataFactoryv2.svg`,
  'databricks':         `${BASE}/Microsoft_Azure_Databricks/Workspace.svg`,
  'data-lake':          `${BASE}/Microsoft_Azure_DataLakeStore/CaboAccount.svg`,

  // ─── Storage ───
  'storage-account':    `${BASE}/Microsoft_Azure_Storage/StorageAccount.svg`,

  // ─── Networking ───
  'virtual-network':    `${BASE}/Microsoft_Azure_Network/VirtualNetwork.svg`,
  'load-balancer':      `${BASE}/Microsoft_Azure_Network/LoadBalancer.svg`,
  'nsg':                `${BASE}/Microsoft_Azure_Network/NetworkSecurityGroup.svg`,
  'public-ip':          `${BASE}/Microsoft_Azure_Network/PublicIpAddress.svg`,
  'private-endpoint':   `${BASE}/Microsoft_Azure_Network/PrivateEndpoint.svg`,
  'nat-gateway':        `${BASE}/Microsoft_Azure_Network/NatGateway.svg`,
  'dns-zone':           `${BASE}/Microsoft_Azure_Network/DnsZone.svg`,
  'front-door':         `${BASE}/Microsoft_Azure_AFDX/FrontdoorProfile.svg`,
  'cdn':                `${BASE}/Microsoft_Azure_Cdn/CdnProfile.svg`,
  'traffic-manager':    `${BASE}/Microsoft_Azure_DNS/TrafficManager.svg`,

  // ─── Security & Identity ───
  'key-vault':          `${BASE}/Microsoft_Azure_KeyVault/KeyVault.svg`,
  'entra-id':           `${BASE}/Microsoft_AAD_IAM/AzureActiveDirectory.svg`,
  'app-registration':   `${BASE}/Microsoft_AAD_RegisteredApps/RegisteredApps.svg`,

  // ─── Monitoring ───
  'monitor':            `${BASE}/Microsoft_Azure_Monitoring/AzureMonitoring.svg`,
  'application-insights': `${BASE}/AppInsightsExtension/ApplicationInsights.svg`,
  'log-analytics':      `${BASE}/Microsoft_OperationsManagementSuite_Workspace/LogAnalytics.svg`,

  // ─── DevOps & Dev Tools ───
  'dev-center':         `${BASE}/Microsoft_Azure_DevCenter/DevCenter.svg`,
  'dev-box':            `${BASE}/Microsoft_Azure_DevCenter/DevCenter.svg`,
  'devops':             `${BASE}/AzureTfsExtension/Organization.svg`,
  'load-testing':       `${BASE}/Microsoft_Azure_CloudNativeTesting/CloudNativeTesting.svg`,

  // ─── AI & ML ───
  'cognitive-services': `${BASE}/Microsoft_Azure_ProjectOxford/CognitiveServices.svg`,
  'bot-service':        `${BASE}/Microsoft_Azure_BotService/BotService.svg`,

  // ─── Advisor & Security ───
  'advisor':            `${BASE}/Microsoft_Azure_Expert/Advisor.svg`,
  'defender':           `${BASE}/Microsoft_Azure_Security/SecurityCenter.svg`,
  'cost-management':    `${BASE}/Microsoft_Azure_CostManagement/CostManagement.svg`,

  // ─── Portal & Management ───
  'resource-group':     `${BASE}/HubsExtension/ResourceGroups.svg`,
  'subscription':       `${BASE}/Microsoft_Azure_Billing/Subscription.svg`,
  'quickstart-center':  `${BASE}/Microsoft_Azure_GettingStarted/GettingStarted.svg`,
  'dashboard':          `${BASE}/Microsoft_Azure_PortalDashboard/Dashboards.svg`,
  'home':               'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-cds/general-17-Home.svg',
  'automation':         `${BASE}/Microsoft_Azure_Automation/Account.svg`,
  'batch':              `${BASE}/Microsoft_Azure_Batch/BatchAccount.svg`,
  'grafana':            `${BASE}/Microsoft_Azure_Dashboard/AzureDashboardGrafanaResource.svg`,

  // ─── Backup & Recovery ───
  'backup-vault':       `${BASE}/Microsoft_Azure_DataProtection/DataProtectionResource.svg`,
  'recovery-vault':     `${BASE}/Microsoft_Azure_RecoveryServices/RecoveryServicesResource.svg`,
};

/**
 * Look up the official Azure icon URL by key.
 * Returns `undefined` when there is no mapping — caller should fall back
 * to a Fluent icon via the CuiIcon `name` attribute.
 */
export function azureIcon(key: string): string | undefined {
  return AZURE_ICONS[key];
}
