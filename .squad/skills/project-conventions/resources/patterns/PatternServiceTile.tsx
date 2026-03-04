/**
 * Pattern: Service Tile (Vertical)
 *
 * Azure portal home page service tile — vertical layout with icon on top
 * and label below. Shows a subtle card-like hover background.
 *
 * Usage:
 *   <ServiceTile label="Virtual Machines" iconUrl={azureIcon('virtual-machine')} />
 *   <ServiceTile label="Create a resource" iconSlot={<PlusIcon />} />
 */
import type { CSSProperties, ReactNode } from 'react';

/* ─── Styles (inject once) ─── */
const STYLE_ID = 'pattern-service-tile-styles';

export const serviceTileStyles = `
  .service-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 98px;
    height: 98px;
    padding: 10px 4px 8px;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s, box-shadow 0.15s, border-color 0.15s;
    border: 1px solid transparent;
  }
  .service-tile:hover {
    background: var(--neutral-background1);
    border-color: var(--neutral-stroke2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }
  .service-tile-icon {
    width: 32px;
    height: 32px;
    margin-bottom: 6px;
    flex-shrink: 0;
  }
  .service-tile-label {
    font-size: 11px;
    color: var(--neutral-foreground1);
    text-align: center;
    line-height: 1.25;
    word-break: break-word;
  }
`;

function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = serviceTileStyles;
  document.head.appendChild(style);
}

/* ─── Props ─── */
export interface ServiceTileProps {
  /** Tile label text */
  label: string;
  /** Icon URL (e.g. from azureIcon()) */
  iconUrl?: string;
  /** Custom icon node — overrides iconUrl */
  iconSlot?: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Additional className */
  className?: string;
  /** Additional inline style */
  style?: CSSProperties;
}

/* ─── Component ─── */
export function ServiceTile({
  label,
  iconUrl,
  iconSlot,
  onClick,
  className,
  style,
}: ServiceTileProps) {
  ensureStyles();

  return (
    <a
      className={`service-tile${className ? ` ${className}` : ''}`}
      style={style}
      href="javascript:;"
      onClick={onClick}
      aria-label={label}
    >
      {iconSlot ? (
        <div className="service-tile-icon">{iconSlot}</div>
      ) : iconUrl ? (
        <img className="service-tile-icon" src={iconUrl} alt="" />
      ) : null}
      <span className="service-tile-label">{label}</span>
    </a>
  );
}

/* ─── Demo / Gallery preview ─── */
import { azureIcon } from './azure-icons';

const demoTiles = [
  { label: 'Virtual Machines', iconUrl: azureIcon('virtual-machine') },
  { label: 'SQL databases', iconUrl: azureIcon('sql-database') },
  { label: 'App Services', iconUrl: azureIcon('app-service') },
  { label: 'Storage accounts', iconUrl: azureIcon('storage-account') },
  { label: 'Kubernetes services', iconUrl: azureIcon('kubernetes') },
  { label: 'Container Apps', iconUrl: azureIcon('container-app') },
];

export default function PatternServiceTile() {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 600, color: 'var(--neutral-foreground1)' }}>
        Service Tile Pattern
      </h2>
      <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--neutral-foreground3)' }}>
        Vertical icon + label tile with card-like hover. Used for Azure service shortcuts on home pages.
      </p>
      <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {demoTiles.map((t) => (
          <ServiceTile key={t.label} label={t.label} iconUrl={t.iconUrl} />
        ))}
      </div>

      <div style={{ padding: '32px 0 0', color: 'var(--neutral-foreground2)' }}>
        <h3>Props</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li><code>label</code> — tile label text (required)</li>
          <li><code>iconUrl</code> — icon image URL (e.g. from <code>azureIcon()</code>)</li>
          <li><code>iconSlot</code> — custom React node for icon (overrides iconUrl)</li>
          <li><code>onClick</code> — click handler</li>
        </ul>
        <h3>Key details</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>98px width, 32px icon, 11px label</li>
          <li>Hover shows <code>var(--subtle-background-hover)</code> + subtle border</li>
          <li>Use <code>iconSlot</code> for custom icons like the "Create a resource" plus icon</li>
        </ul>
      </div>
    </div>
  );
}
