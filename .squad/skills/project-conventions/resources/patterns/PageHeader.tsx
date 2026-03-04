/**
 * PageHeader — Consistent title bar + subtitle for all Azure portal page types.
 *
 * Renders a single-row flex header: [icon?] title [star?] [more?] [CopilotSuggestions?]
 * with a subtitle line below. Works for resource pages, browse/list pages, create flows,
 * and service blades — any page that needs a consistent title area.
 *
 * Usage:
 *   <PageHeader title="API Management services" subtitle="Microsoft (microsoft.onmicrosoft.com)" showFavorite copilotSuggestions={[...]} />
 *   <PageHeader title="Create API Management service" subtitle="API Management service" showMoreActions />
 *   <PageHeader icon="https://..." title="myResource | Overview" subtitle="App Service" showFavorite showMoreActions copilotSuggestions={[...]} />
 */
import { CuiButton, CuiIcon } from '@charm-ux/cui/react';
import CopilotSuggestions from './CopilotSuggestions';

export interface PageHeaderProps {
  /** Main title — string or JSX (e.g., for mixed-weight service blade titles) */
  title: React.ReactNode;
  /** Subtitle line below the title (e.g., resource type or org name) */
  subtitle?: string;
  /** Optional Iconify SVG URL for a leading icon */
  icon?: string;
  /** Show star/favorite button (default: false) */
  showFavorite?: boolean;
  /** Show more-horizontal "…" button (default: true) */
  showMoreActions?: boolean;
  /** Copilot suggestion labels — if provided, renders CopilotSuggestions inline */
  copilotSuggestions?: string[];
  /** Max visible suggestion pills before "+N" overflow */
  maxVisibleSuggestions?: number;
  /** CSS class prefix for scoping (default: 'page') — generates .{prefix}-header, .{prefix}-title, .{prefix}-subtitle */
  classPrefix?: string;
  /** Title font-weight: 'semibold' (default) for most pages, 'regular' for service blades with mixed-weight titles */
  titleWeight?: 'semibold' | 'regular';
  /** Horizontal padding value (default: '32px') */
  horizontalPadding?: string;
}

const headerStyles = `
  .page-header-bar {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .page-header-title {
    margin: 0;
    font-size: 20px;
    font-weight: var(--font-weight-semi-bold);
    color: var(--neutral-foreground1);
    white-space: nowrap;
  }
  .page-header-subtitle {
    font-size: var(--font-size-base100);
    color: var(--neutral-foreground3);
    margin: 0;
  }
`;

export default function PageHeader({
  title,
  subtitle,
  icon,
  showFavorite = false,
  showMoreActions = true,
  copilotSuggestions,
  maxVisibleSuggestions,
  titleWeight = 'semibold',
  horizontalPadding = '32px',
}: PageHeaderProps) {
  return (
    <>
      <style>{headerStyles}</style>
      <div className="page-header-bar" style={{ padding: `4px ${horizontalPadding} 2px` }}>
        {icon && (
          <CuiIcon url={icon} style={{ fontSize: '24px' }} />
        )}
        <h1 className="page-header-title" style={titleWeight === 'regular' ? { fontWeight: 'var(--font-weight-regular)' as string } : undefined}>{title}</h1>
        {showFavorite && (
          <CuiButton appearance="subtle" iconOnly size="small" aria-label="Favorite">
            <CuiIcon name="star" />
          </CuiButton>
        )}
        {showMoreActions && (
          <CuiButton appearance="subtle" iconOnly size="small" aria-label="More actions">
            <CuiIcon name="more-horizontal" />
          </CuiButton>
        )}
        {copilotSuggestions && copilotSuggestions.length > 0 && (
          <CopilotSuggestions
            suggestions={copilotSuggestions}
            maxVisible={maxVisibleSuggestions}
          />
        )}
      </div>
      {subtitle && (
        <p className="page-header-subtitle" style={{ padding: `0 ${horizontalPadding} 4px` }}>
          {subtitle}
        </p>
      )}
    </>
  );
}
