/**
 * Copilot Suggestions — dismissible bar of pill-shaped suggestion prompts.
 * Appears in the title bar row (lower header), not the top navigation header.
 * Features: multicolor Copilot icon, suggestion pills, +N overflow, dismiss (X) button.
 */
import { useState } from 'react';
import { CuiButton, CuiIcon, CuiTag } from '@charm-ux/cui/react';

export interface CopilotSuggestionsProps {
  /** Suggestion labels to render as pills */
  suggestions: string[];
  /** Maximum number of visible pills before showing "+N" overflow (default: all) */
  maxVisible?: number;
  /** Called when a suggestion pill is clicked */
  onSuggestionClick?: (suggestion: string) => void;
  /** Whether the bar is dismissible (shows X button). Default: true */
  dismissible?: boolean;
  /** Called when the dismiss button is clicked */
  onDismiss?: () => void;
}

const styles = `
  .copilot-suggestions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: nowrap;
  }
  .copilot-suggestions__icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .copilot-suggestions__pills {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }
  .copilot-suggestions__pill {
    --tag-border-color: var(--brand-stroke2);
    cursor: pointer;
  }
  .copilot-suggestions__overflow {
    --tag-border-color: var(--brand-stroke2);
    --tag-fg-color: var(--neutral-foreground3);
    cursor: pointer;
  }
  .copilot-suggestions__dismiss {
    flex-shrink: 0;
    margin-left: auto;
  }
`;

export default function CopilotSuggestions({
  suggestions,
  maxVisible,
  onSuggestionClick,
  dismissible = true,
  onDismiss,
}: CopilotSuggestionsProps) {
  const [visible, setVisible] = useState(true);
  const shownPills = maxVisible != null ? suggestions.slice(0, maxVisible) : suggestions;
  const overflowCount = maxVisible != null ? Math.max(0, suggestions.length - maxVisible) : 0;

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="copilot-suggestions">
        <span className="copilot-suggestions__icon">
          <CuiIcon name="copilot" label="Copilot suggestions" style={{ fontSize: 20 }} />
        </span>
        <div className="copilot-suggestions__pills">
          {shownPills.map((text) => (
            <CuiTag
              key={text}
              className="copilot-suggestions__pill"
              appearance="outline"
              shape="circular"
              size="small"
              onClick={() => onSuggestionClick?.(text)}
            >
              {text}
            </CuiTag>
          ))}
          {overflowCount > 0 && (
            <CuiTag
              className="copilot-suggestions__overflow"
              appearance="outline"
              shape="circular"
              size="small"
              aria-label={`${overflowCount} more suggestions`}
            >
              +{overflowCount}
            </CuiTag>
          )}
        </div>
        {dismissible && (
          <CuiButton
            className="copilot-suggestions__dismiss"
            appearance="subtle"
            iconOnly
            size="small"
            aria-label="Dismiss suggestions"
            onClick={handleDismiss}
          >
            <CuiIcon name="dismiss" />
          </CuiButton>
        )}
      </div>
    </>
  );
}
