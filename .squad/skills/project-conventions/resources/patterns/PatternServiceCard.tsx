/**
 * Pattern: Service Card
 *
 * Azure portal service card with icon, title, description,
 * and a bordered action footer containing View + More buttons.
 *
 * Usage:
 *   <ServiceCard title="Application Insights"
 *     description="Monitor your app's availability, performance, errors, and usage."
 *     icon="app-generic" />
 */
import {
  CuiButton,
  CuiCard,
  CuiIcon,
} from '@charm-ux/cui/react';
import type { CSSProperties, ReactNode } from 'react';
import { azureIcon } from './azure-icons';

/* ─── Style sheet (injected once) ─── */
const STYLE_ID = 'pattern-service-card-styles';

export const serviceCardStyles = `
  /* ─── Service Card ─── */
  .service-card {
    --card-padding: 0;
    --card-content-gap: 0;
    display: block;
    height: 100%;
  }
  .service-card::part(card-base) {
    height: 100%;
  }
  .service-card::part(card-content) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .service-card .service-card-body {
    padding: 16px 16px 12px;
    flex: 1;
  }
  .service-card .service-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .service-card .service-card-icon {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .service-card .service-card-icon cui-icon {
    font-size: 24px;
  }
  .service-card .service-card-title {
    font-weight: var(--font-weight-semi-bold);
    font-size: var(--font-size-base300);
    color: var(--neutral-foreground1);
  }
  .service-card .service-card-desc {
    font-size: var(--font-size-base200);
    color: var(--neutral-foreground2);
    margin: 0;
    line-height: 1.5;
  }
  .service-card .service-card-actions {
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0 10px;
    border-top: 1px solid var(--neutral-stroke2);
  }
  .service-card .service-card-actions cui-button::part(button-control) {
    align-items: center;
    padding: 6px 8px;
    border-radius: 4px;
  }
  .service-card .service-card-actions cui-button::part(button-control):hover {
    background: var(--neutral-background1-hover, #f5f5f5);
  }
  .service-card .service-card-actions cui-button {
    display: flex;
    align-items: center;
  }
`;

function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = serviceCardStyles;
  document.head.appendChild(style);
}

/* ─── Public Props ─── */
export interface ServiceCardProps {
  /** Card title */
  title: string;
  /** Card description text */
  description: string;
  /** Azure icon key (e.g. "api-management") or Fluent icon name (e.g. "app-generic") */
  icon?: string;
  /** Direct icon URL (overrides `icon` prop) */
  iconUrl?: string;
  /** Custom icon node (overrides both `icon` and `iconUrl`) */
  iconSlot?: ReactNode;
  /** Called when "View" is clicked */
  onView?: () => void;
  /** Called when "More" is clicked */
  onMore?: () => void;
  /** Additional className on the outer card */
  className?: string;
  /** Additional inline style on the outer card */
  style?: CSSProperties;
}

/* ─── Component ─── */
export function ServiceCard({
  title,
  description,
  icon,
  iconUrl,
  iconSlot,
  onView,
  onMore,
  className,
  style,
}: ServiceCardProps) {
  ensureStyles();

  const resolvedIconUrl =
    iconUrl ?? (icon ? azureIcon(icon) : undefined);

  return (
    <CuiCard
      appearance="outline"
      className={`service-card${className ? ` ${className}` : ''}`}
      style={style}
    >
      <div className="service-card-body">
        <div className="service-card-header">
          <div className="service-card-icon">
            {iconSlot ?? (
              resolvedIconUrl && (
                <CuiIcon url={resolvedIconUrl} style={{ fontSize: 24 }} />
              )
            )}
          </div>
          <span className="service-card-title">{title}</span>
        </div>
        <p className="service-card-desc">{description}</p>
      </div>

      <div className="service-card-actions">
        <CuiButton appearance="link" size="small" onClick={onView}>
          <CuiIcon
            slot="start"
            name="eye"
            style={{ fontSize: 14 }}
          />
          View
        </CuiButton>
        <CuiButton appearance="link" size="small" onClick={onMore}>
          <CuiIcon
            slot="start"
            name="more-horizontal"
            style={{ fontSize: 14 }}
          />
          More
        </CuiButton>
      </div>
    </CuiCard>
  );
}

/* ─── Demo / Gallery preview ─── */
const demoCards = [
  {
    title: 'Application Insights',
    description: "Monitor your app's availability, performance, errors, and usage.",
    icon: 'application-insights',
  },
  {
    title: 'Container Insights',
    description: 'Gain visibility into the performance and health of your controllers, nodes, and containers.',
    icon: 'kubernetes',
  },
  {
    title: 'VM Insights',
    description: 'Monitor the health, performance, and dependencies of your VMs and VM scale sets.',
    icon: 'virtual-machine',
  },
  {
    title: 'Network Insights',
    description: 'View the health and metrics for all deployed network resources.',
    icon: 'virtual-network',
  },
];

export default function PatternServiceCard() {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 600, color: 'var(--neutral-foreground1)' }}>
        Insights
      </h2>
      <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--neutral-foreground3)' }}>
        Use curated monitoring views for specific Azure resources.{' '}
        <a href="#" style={{ color: 'var(--brand-foreground-link)', textDecoration: 'none' }}>View all insights</a>
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 12,
      }}>
        {demoCards.map((card) => (
          <ServiceCard key={card.title} {...card} />
        ))}
      </div>

      <div style={{ padding: '32px 0 0', color: 'var(--neutral-foreground2)' }}>
        <h2 style={{ marginTop: 0 }}>Service Card Pattern</h2>
        <p>Components: <code>CuiCard</code>, <code>CuiButton</code>, <code>CuiIcon</code></p>
        <h3>Props</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li><code>title</code> — card title (required)</li>
          <li><code>description</code> — body text (required)</li>
          <li><code>icon</code> — Fluent icon name, e.g. <code>"app-generic"</code></li>
          <li><code>iconUrl</code> — direct icon URL (overrides <code>icon</code>)</li>
          <li><code>iconSlot</code> — custom React node for the icon</li>
          <li><code>onView</code> / <code>onMore</code> — action callbacks</li>
        </ul>
        <h3>Key details</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Card uses <code>--card-padding: 0</code> and <code>--card-content-gap: 0</code>; body div handles padding</li>
          <li>Action footer has <code>border-top: 1px solid var(--neutral-stroke2)</code>, padding <code>0 10px</code></li>
          <li>Both buttons use <code>appearance="link"</code> with icons in <code>slot="start"</code></li>
          <li>Button controls get <code>6px 8px</code> padding and subtle hover background via <code>::part(button-control)</code></li>
        </ul>
      </div>
    </div>
  );
}
