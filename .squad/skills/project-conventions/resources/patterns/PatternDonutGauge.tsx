/**
 * Pattern: Donut Gauge Readiness Card
 * SVG ring with color-coded arc, centered score, category breakdown, and status badge.
 */
import { CuiBadge, CuiButton, CuiCard, CuiIcon } from '@charm-ux/cui/react';

/* ─── Types ─── */
export interface ReadinessCategory {
  label: string;
  score: number;
  maxScore: number;
}

export interface DonutGaugeProps {
  /** Overall readiness score */
  score?: number;
  /** Maximum possible score */
  max?: number;
  /** Per-category breakdown */
  categories?: ReadinessCategory[];
}

/* ─── Helpers ─── */
function getScoreColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 70) return 'var(--success-foreground-1)';
  if (pct >= 50) return 'var(--warning-foreground-1)';
  return 'var(--danger-foreground-1)';
}

function getBadgeColor(score: number, max: number): 'success' | 'warning' | 'danger' {
  const pct = (score / max) * 100;
  if (pct >= 70) return 'success';
  if (pct >= 50) return 'warning';
  return 'danger';
}

function getStatusLabel(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 70) return 'Good';
  if (pct >= 50) return 'Fair';
  return 'Needs Attention';
}

/* ─── Default data ─── */
const defaultCategories: ReadinessCategory[] = [
  { label: 'Security', score: 8, maxScore: 30 },
  { label: 'Reliability', score: 10, maxScore: 25 },
  { label: 'Observability', score: 6, maxScore: 25 },
  { label: 'Performance', score: 8, maxScore: 20 },
];

/* ─── Styles ─── */
const styles = `
  .donut-gauge-demo {
    padding: 32px;
    max-width: 480px;
  }
  .donut-gauge-body {
    display: flex;
    gap: 24px;
    align-items: center;
  }
  .donut-gauge-wrap {
    position: relative;
    width: 100px;
    height: 100px;
    flex-shrink: 0;
  }
  .donut-gauge-wrap svg {
    transform: rotate(-90deg);
  }
  .donut-gauge-center {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  .donut-gauge-value {
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
  }
  .donut-gauge-max {
    font-size: 11px;
    color: var(--neutral-foreground3);
  }
  .donut-gauge-cats {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .donut-gauge-cat-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--font-size-base200);
  }
  .donut-gauge-cat-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .donut-gauge-cat-label {
    flex: 1;
    color: var(--neutral-foreground1);
  }
  .donut-gauge-cat-score {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .pattern-info {
    margin-top: 32px;
    padding: 20px;
    background: var(--neutral-background1);
    border: 1px solid var(--neutral-stroke2);
    border-radius: var(--border-radius-md);
  }
  .pattern-info h3 {
    margin: 0 0 8px;
    font-size: var(--font-size-base400);
    color: var(--neutral-foreground1);
  }
  .pattern-info p {
    margin: 0 0 8px;
    color: var(--neutral-foreground2);
    font-size: var(--font-size-base300);
    line-height: 1.6;
  }
  .pattern-info ul {
    margin: 0;
    padding-left: 20px;
    color: var(--neutral-foreground2);
    font-size: var(--font-size-base200);
    line-height: 1.8;
  }
  .pattern-info code {
    background: var(--neutral-background3);
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 12px;
  }
`;

/* ─── Component ─── */
export function DonutGaugeCard({
  score = 32,
  max = 100,
  categories = defaultCategories,
}: DonutGaugeProps) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - ((score / max) * circ);
  const overallColor = getScoreColor(score, max);
  const overallBadge = getBadgeColor(score, max);
  const overallStatus = getStatusLabel(score, max);

  return (
    <CuiCard appearance="outline" heading="AI Readiness Score">
      <div className="donut-gauge-body">
        <div className="donut-gauge-wrap">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="var(--neutral-background5)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={r}
              fill="none"
              stroke={overallColor}
              strokeWidth="8"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="donut-gauge-center">
            <span className="donut-gauge-value" style={{ color: overallColor }}>{score}</span>
            <span className="donut-gauge-max">/ {max}</span>
          </div>
        </div>
        <div className="donut-gauge-cats">
          {categories.map((cat) => {
            const c = getScoreColor(cat.score, cat.maxScore);
            return (
              <div key={cat.label} className="donut-gauge-cat-row">
                <span className="donut-gauge-cat-dot" style={{ background: c }} />
                <span className="donut-gauge-cat-label">{cat.label}</span>
                <span className="donut-gauge-cat-score" style={{ color: c }}>
                  {cat.score}/{cat.maxScore}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div slot="footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CuiBadge appearance="tint" color={overallBadge} size="small">{overallStatus}</CuiBadge>
        <CuiButton appearance="subtle" size="small">
          <CuiIcon slot="start" name="open" />
          View Recommendations
        </CuiButton>
      </div>
    </CuiCard>
  );
}

/* ─── Pattern Demo Page ─── */
export default function PatternDonutGauge() {
  return (
    <>
      <style>{styles}</style>
      <div className="donut-gauge-demo">
        <DonutGaugeCard />

        <div className="pattern-info">
          <h3>Donut Gauge Readiness Card</h3>
          <p>
            An SVG ring gauge with a color-coded arc showing overall readiness score,
            plus a per-category breakdown with colored dots.
          </p>
          <p>Components used:</p>
          <ul>
            <li><code>CuiCard</code> — container with outline appearance</li>
            <li><code>CuiBadge</code> — tinted status badge (Good / Fair / Needs Attention)</li>
            <li><code>CuiButton</code> — subtle footer action</li>
            <li><code>CuiIcon</code> — open icon on the action</li>
          </ul>
          <p style={{ marginTop: 12 }}>
            Props: <code>score</code>, <code>max</code>, <code>categories</code> —
            colors auto-adjust based on score thresholds (≥70% green, ≥50% yellow, &lt;50% red).
          </p>
        </div>
      </div>
    </>
  );
}
