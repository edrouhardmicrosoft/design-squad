import { CuiIcon } from '@charm-ux/cui/react';
import type { CSSProperties } from 'react';

const STYLE_ID = 'pattern-health-metric-card-styles';

const healthMetricCardStyles = `
  .pattern-health-metric-card {
    background: var(--neutral-background1);
    border: 1px solid var(--neutral-stroke2);
    border-radius: 8px;
    padding: 12px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }

  .pattern-health-metric-card-icon {
    width: 34px;
    height: 34px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .pattern-health-metric-card-icon.success {
    background: var(--status-success-background1);
    color: var(--status-success-foreground1);
  }

  .pattern-health-metric-card-icon.danger {
    background: var(--status-danger-background1);
    color: var(--status-danger-foreground1);
  }

  .pattern-health-metric-card-icon.brand {
    background: var(--brand-background2);
    color: var(--brand-foreground-link);
  }

  .pattern-health-metric-card-label {
    font-size: var(--font-size-base100);
    color: var(--neutral-foreground3);
    text-transform: uppercase;
    letter-spacing: 0.2px;
    margin-bottom: 2px;
    font-weight: var(--font-weight-semi-bold);
  }

  .pattern-health-metric-card-value {
    font-size: var(--font-size-hero600);
    line-height: 1.1;
    color: var(--neutral-foreground1);
    font-weight: var(--font-weight-bold);
  }

  .pattern-health-metric-card-subtext {
    font-size: var(--font-size-base100);
    color: var(--neutral-foreground3);
  }
`;

function ensureStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = healthMetricCardStyles;
  document.head.appendChild(style);
}

export type HealthMetricCardAccent = 'success' | 'danger' | 'brand';

export interface HealthMetricCardProps {
  label: string;
  value: number | string;
  subtext: string;
  icon: string;
  accent: HealthMetricCardAccent;
  className?: string;
  style?: CSSProperties;
}

export function HealthMetricCard({
  label,
  value,
  subtext,
  icon,
  accent,
  className,
  style,
}: HealthMetricCardProps) {
  ensureStyles();

  const rootClass = className
    ? `pattern-health-metric-card ${className}`
    : 'pattern-health-metric-card';

  return (
    <div className={rootClass} style={style}>
      <div className={`pattern-health-metric-card-icon ${accent}`}>
        <CuiIcon
          url={`https://api.iconify.design/fluent:${icon}-24-regular.svg`}
          style={{ fontSize: 20 }}
        />
      </div>
      <div>
        <div className="pattern-health-metric-card-label">{label}</div>
        <div className="pattern-health-metric-card-value">{value}</div>
        <div className="pattern-health-metric-card-subtext">{subtext}</div>
      </div>
    </div>
  );
}

export default function PatternHealthMetricCard() {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 340, padding: 24 }}>
      <HealthMetricCard
        label="Passed"
        value={148}
        subtext="Last 24 hours"
        icon="checkmark-circle"
        accent="success"
      />
      <HealthMetricCard
        label="Failed"
        value={23}
        subtext="Last 24 hours"
        icon="dismiss-circle"
        accent="danger"
      />
      <HealthMetricCard
        label="In progress"
        value={11}
        subtext="Currently running"
        icon="clock"
        accent="brand"
      />
    </div>
  );
}