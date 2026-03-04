/**
 * Pattern Demo: Page Header
 * Shows all PageHeader variants: resource page, browse/list, create flow, service blade.
 */
import { azureIcon } from './azure-icons';
import PageHeader from './PageHeader';

export default function PatternPageHeader() {
  return (
    <>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
        <h2 style={{ marginTop: 0 }}>PageHeader Pattern</h2>
        <p style={{ color: 'var(--neutral-foreground3)', fontSize: 14, marginBottom: 32 }}>
          Consistent title bar used across all Azure portal page types. Renders icon, title, star, more actions, and Copilot suggestions in a single flex row.
        </p>

        <h3>Resource Page</h3>
        <div style={{ border: '1px solid var(--neutral-stroke2)', borderRadius: 8, padding: '8px 0', marginBottom: 24 }}>
          <PageHeader
            icon={azureIcon('api-management')}
            title="apim-contoso-prod | Overview"
            subtitle="API Management service"
            showFavorite
            copilotSuggestions={[
              'Show me the health of this resource.',
              'What are the recent changes to this resource?',
            ]}
          />
        </div>

        <h3>Browse / List Page</h3>
        <div style={{ border: '1px solid var(--neutral-stroke2)', borderRadius: 8, padding: '8px 0', marginBottom: 24 }}>
          <PageHeader
            title="API Management services"
            subtitle="Microsoft (microsoft.onmicrosoft.com)"
            showFavorite
            copilotSuggestions={[
              'Identify non-compliant API Management services in my environment.',
              'How many API Management services do I have?',
            ]}
            maxVisibleSuggestions={2}
          />
        </div>

        <h3>Create Flow</h3>
        <div style={{ border: '1px solid var(--neutral-stroke2)', borderRadius: 8, padding: '8px 0', marginBottom: 24 }}>
          <PageHeader
            title="Create API Management service"
            subtitle="API Management service"
          />
        </div>

        <h3>Service Blade (mixed-weight title)</h3>
        <div style={{ border: '1px solid var(--neutral-stroke2)', borderRadius: 8, padding: '8px 0', marginBottom: 24 }}>
          <PageHeader
            icon={azureIcon('monitor')}
            title={<><strong>Monitor</strong> | Overview</>}
            subtitle="Microsoft"
            titleWeight="regular"
            copilotSuggestions={[
              'Summarize these Monitor services in a table',
              'Run an anomaly investigation into my resource',
            ]}
            horizontalPadding="16px"
          />
        </div>

        <h3>Minimal (no subtitle, no suggestions)</h3>
        <div style={{ border: '1px solid var(--neutral-stroke2)', borderRadius: 8, padding: '8px 0', marginBottom: 24 }}>
          <PageHeader
            icon={azureIcon('app-service')}
            title="myStorageAccount"
            showFavorite
            showMoreActions={false}
          />
        </div>
      </div>
      <style>{`body { margin: 0; }`}</style>
    </>
  );
}
