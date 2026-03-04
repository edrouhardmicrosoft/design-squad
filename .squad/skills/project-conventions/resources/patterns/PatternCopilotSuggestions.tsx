/**
 * Pattern Demo: Copilot Suggestions
 * Shows the pill-shaped Copilot suggestion bar as it appears in the
 * lower header / title bar area of a resource page.
 */
import CopilotSuggestions from './CopilotSuggestions';

const exampleSuggestions = [
  'Identify non-compliant Azure Cosmos DB accounts using ARG.',
  'Filter Azure Cosmos DB accounts by resource group.',
  'Show RU consumption trends for the past 7 days.',
];

export default function PatternCopilotSuggestions() {
  return (
    <>
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* In-context: title bar row */}
        <div>
          <h2 style={{ marginTop: 0, fontSize: 18 }}>Title bar context (with +N overflow &amp; dismiss)</h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 0',
            borderBottom: '1px solid var(--neutral-stroke2)',
          }}>
            <span style={{ fontWeight: 600, fontSize: 20, whiteSpace: 'nowrap' }}>Azure Cosmos DB</span>
            <span style={{ color: 'var(--neutral-foreground3)' }}>★</span>
            <span style={{ color: 'var(--neutral-foreground3)' }}>⋯</span>
            <CopilotSuggestions
              suggestions={exampleSuggestions}
              maxVisible={2}
              onSuggestionClick={(s) => alert(`Clicked: ${s}`)}
            />
          </div>
          <p style={{ fontSize: 13, color: 'var(--neutral-foreground3)', margin: '4px 0 0' }}>
            Microsoft (microsoft.onmicrosoft.com)
          </p>
        </div>

        {/* Standalone: all pills */}
        <div>
          <h2 style={{ marginTop: 0, fontSize: 18 }}>All suggestions visible (no overflow)</h2>
          <CopilotSuggestions
            suggestions={exampleSuggestions}
            onSuggestionClick={(s) => alert(`Clicked: ${s}`)}
          />
        </div>

        {/* Non-dismissible variant */}
        <div>
          <h2 style={{ marginTop: 0, fontSize: 18 }}>Non-dismissible</h2>
          <CopilotSuggestions
            suggestions={exampleSuggestions.slice(0, 2)}
            dismissible={false}
            onSuggestionClick={(s) => alert(`Clicked: ${s}`)}
          />
        </div>
      </div>
      <style>{`body { margin: 0; }`}</style>
    </>
  );
}
