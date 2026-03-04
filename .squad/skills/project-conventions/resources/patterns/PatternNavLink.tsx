/**
 * Pattern: Nav Link (Horizontal)
 *
 * Azure portal home page navigation link — horizontal layout with icon
 * on the left and label on the right. Shows a card-like hover effect.
 * Used in Navigate and Tools sections of the portal home page.
 *
 * Usage:
 *   <NavLink label="Subscriptions" iconUrl={azureIcon('subscription')} />
 *   <NavLink label="Quickstart Center" /> // text-only, no icon
 */
import type { CSSProperties } from 'react';

/* ─── Styles (inject once) ─── */
const STYLE_ID = 'pattern-nav-link-styles';

export const navLinkStyles = `
  .nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    text-decoration: none;
    transition: background 0.12s;
    border: 1px solid transparent;
  }
  .nav-link:hover {
    background: var(--subtle-background-hover);
    border-color: var(--neutral-stroke2);
  }
  .nav-link-icon {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
  }
  .nav-link-label {
    font-size: 13px;
    color: var(--brand-foreground-link);
    line-height: 1.3;
  }
`;

function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = navLinkStyles;
  document.head.appendChild(style);
}

/* ─── Props ─── */
export interface NavLinkProps {
  /** Link label text */
  label: string;
  /** Icon URL (e.g. from azureIcon()) */
  iconUrl?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional className */
  className?: string;
  /** Additional inline style */
  style?: CSSProperties;
}

/* ─── Component ─── */
export function NavLink({
  label,
  iconUrl,
  onClick,
  className,
  style,
}: NavLinkProps) {
  ensureStyles();

  return (
    <a
      className={`nav-link${className ? ` ${className}` : ''}`}
      style={style}
      href="javascript:;"
      onClick={onClick}
      aria-label={label}
    >
      {iconUrl && (
        <img className="nav-link-icon" src={iconUrl} alt="" />
      )}
      <span className="nav-link-label">{label}</span>
    </a>
  );
}

/* ─── Demo / Gallery preview ─── */
import { azureIcon } from './azure-icons';

const demoNavigate = [
  { label: 'Subscriptions', iconUrl: azureIcon('subscription') },
  { label: 'Resource groups', iconUrl: azureIcon('resource-groups') },
  { label: 'All resources', iconUrl: azureIcon('all-resources') },
  { label: 'Dashboard', iconUrl: azureIcon('dashboard') },
];

const demoTools = [
  { label: 'Microsoft Entra ID', iconUrl: azureIcon('entra-id') },
  { label: 'Microsoft Defender for Cloud', iconUrl: azureIcon('defender') },
  { label: 'Azure Monitor', iconUrl: azureIcon('monitor') },
  { label: 'Azure Advisor', iconUrl: azureIcon('advisor') },
];

const demoLinks = [
  { label: 'Quickstart Center' },
  { label: "What's new" },
  { label: 'Azure Charts' },
  { label: 'Azure mobile app' },
];

export default function PatternNavLink() {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 600, color: 'var(--neutral-foreground1)' }}>
        Nav Link Pattern
      </h2>
      <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--neutral-foreground3)' }}>
        Horizontal icon + label link with card-like hover. Used in Navigate, Tools, and Useful links sections.
      </p>

      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--neutral-foreground1)', margin: '0 0 8px' }}>Navigate (with icons)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 4 }}>
        {demoNavigate.map((n) => (
          <NavLink key={n.label} label={n.label} iconUrl={n.iconUrl} />
        ))}
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--neutral-foreground1)', margin: '24px 0 8px' }}>Tools (with icons)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 4 }}>
        {demoTools.map((t) => (
          <NavLink key={t.label} label={t.label} iconUrl={t.iconUrl} />
        ))}
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--neutral-foreground1)', margin: '24px 0 8px' }}>Useful links (text only)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 4 }}>
        {demoLinks.map((l) => (
          <NavLink key={l.label} label={l.label} />
        ))}
      </div>

      <div style={{ padding: '32px 0 0', color: 'var(--neutral-foreground2)' }}>
        <h3>Props</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li><code>label</code> — link label text (required)</li>
          <li><code>iconUrl</code> — icon image URL (optional, omit for text-only links)</li>
          <li><code>onClick</code> — click handler</li>
        </ul>
        <h3>Key details</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>20px icon, 13px label, 8px gap</li>
          <li>Hover shows <code>var(--subtle-background-hover)</code> + subtle border — card-like effect</li>
          <li>Works with or without an icon for flexible use across sections</li>
        </ul>
      </div>
    </div>
  );
}
