---
name: "project-conventions"
description: "Azure Portal design system — Coherence UI patterns, scaffolds, and conventions"
domain: "project-conventions"
confidence: "high"
source: "curated"
---

## Context

This skill defines the **authoritative design system** for building Azure Portal experiences with **Coherence UI (`@charm-ux/cui/react`)**. Every UI implementation task MUST begin by reading this document and selecting the appropriate scaffold/pattern from `.squad/skills/project-conventions/resources/patterns/`.

Patterns are **reference implementations** — copy them verbatim as starting points, then customize only at marked `TODO` points.

---

## Component Library

All UI components come from **`@charm-ux/cui/react`** (Coherence UI). This is the only approved component library.

Key components used across patterns:

| Component | Purpose |
|-----------|---------|
| `CuiAppFrame` | Page shell — slots: `header`, `main` |
| `CuiHeader` | Top navigation bar with search, actions, profile |
| `CuiSideNav` | Inline section navigation sidebar |
| `CuiNavItem` / `CuiNavHeading` | Nav items within SideNav |
| `CuiDrawer` | Overlay panel (used for global hamburger nav) |
| `CuiBreadcrumb` / `CuiBreadcrumbItem` | Breadcrumb navigation |
| `CuiToolbar` | Horizontal action bar |
| `CuiButton` | All button variants (`appearance`: subtle, transparent, primary) |
| `CuiIcon` | Icons — `name` prop for UI metaphors, `url` prop for Azure icons |
| `CuiSearchBox` | Search input |
| `CuiDataGrid` | Data table with sorting and selection |
| `CuiMenu` / `CuiMenuItem` | Dropdown menus |
| `CuiPopOver` | Popover / flyout panels |
| `CuiTag` | Filter tags, Copilot suggestion pills |
| `CuiCheckbox` | Checkbox inputs |
| `CuiDivider` | Horizontal rule / section divider |
| `CuiCard` | Content cards |
| `CuiAvatar` / `CuiPersona` | User identity display |
| `CuiTabList` / `CuiTab` / `CuiTabPanel` | Tab navigation |

---

## Icon Strategy

**Two icon sources — NEVER use Iconify.**

### 1. CuiIcon `name` prop — Generic UI metaphors
For standard UI icons (settings, person, add, search, navigation, info, etc.):
```tsx
<CuiIcon name="settings" />
<CuiIcon name="add" />
<CuiIcon name="person" />
```

### 2. Azure Icons via `url` prop — Azure service/blade icons
For Azure-specific icons (services, resource types, blades), use the CDN map in `azure-icons.ts`:
```tsx
import { azureIcon } from '../patterns/azure-icons';
<CuiIcon url={azureIcon('api-management')} />
<CuiIcon url={azureIcon('virtual-machines')} />
```

The `azure-icons.ts` file maps icon keys to official Azure Portal SVG URLs from `https://raw.githubusercontent.com/maskati/azure-icons/main/svg`.

### Icon decision rule
- Is it a **generic UI concept** (gear, person, arrow, plus)? → Use `name` prop
- Is it an **Azure service or resource** (VM, App Service, SQL Database)? → Use `url` prop with `azureIcon()`
- **NEVER** use `api.iconify.design` URLs

---

## Layout Hierarchy

Every Azure portal page follows this nesting structure:

```
CuiAppFrame
├── CuiHeader (slot="header")
│   ├── Title ("Microsoft Azure")
│   ├── CuiSearchBox (slot="search")
│   ├── Action buttons (Copilot, Cloud Shell, Notifications, Settings)
│   └── CuiAvatar / CuiPersona (profile menu)
├── AzurePortalNav (global hamburger overlay — CuiDrawer)
└── div (slot="main", display: flex)
    ├── Section SideNav (inline sidebar — CuiSideNav, optional)
    └── Content area (flex: 1, overflowY: auto)
        ├── CuiBreadcrumb
        ├── PageHeader (title + subtitle + star + Copilot suggestions)
        ├── CuiToolbar
        ├── CuiDivider
        └── Page content (cards, grids, forms, etc.)
```

### Two-Tier Navigation

1. **Global Nav** (`PatternAzurePortalNav.tsx`) — Portal-wide hamburger overlay with: + Create a resource, Home, Dashboard, All services, Favorites
2. **Section Nav** (`PatternSideNav.tsx`) — Resource/blade-specific, always-visible inline sidebar with CuiNavItem entries

Pages without a section sidebar (e.g., Home, Browse) render content full-width in `slot="main"`.

---

## Standard Page Anatomy

Every content page follows this vertical sequence:

1. **Breadcrumb** — `CuiBreadcrumb > CuiBreadcrumbItem` trail
2. **PageHeader** — Title + subtitle + favorite star + Copilot suggestion pills
3. **Toolbar** — `CuiToolbar` with action buttons and dropdown menus
4. **Divider** — `CuiDivider` separating toolbar from content
5. **Content** — Page-specific: data grids, cards, forms, metrics, etc.

For filter-heavy pages (Browse, All Resources), insert between toolbar and content:
- **Filter bar** — Search box + filter pill dropdowns + active filter tags
- **Results grid** — Prefer `CuiDataGrid`; some existing scaffolds still use semantic `<table>` as a legacy implementation

---

## Pattern Catalog

All patterns live in `.squad/skills/project-conventions/resources/patterns/`. Each file is a complete, working reference implementation.

### Scaffolds — Full page templates

Start from a scaffold when building a **complete page**.

| File | Purpose | When to use |
|------|---------|-------------|
| `ScaffoldHomePage.tsx` | Azure portal home/landing page | Portal home with service tiles, recent resources table, filter toolbar |
| `ScaffoldBrowsePage.tsx` | Resource browse/list page | "All Resources", "Subscriptions", any resource listing with filters |
| `ScaffoldBrowseBlade.tsx` | Browse blade variant | Browse view rendered as a blade (panel) rather than full page |
| `ScaffoldServiceBlade.tsx` | Service blade (Monitor style) | "Overview" pages with side nav sections (Monitor, Diagnose, etc.) |
| `ScaffoldDesignerBlade.tsx` | Designer blade | Visual editor / designer experiences |
| `ScaffoldCreateFlow.tsx` | Multi-step create wizard | "Create [Resource]" flows with step-by-step tabs and Review+Create |
| `ScaffoldMarketplaceBrowse.tsx` | Marketplace browse page | Marketplace category browsing with service cards and filters |

### Patterns — Reusable components

Use patterns as **building blocks** within scaffolds or standalone features.

| File | Purpose | When to use |
|------|---------|-------------|
| `PageHeader.tsx` | Title bar + subtitle + star + Copilot suggestions | Every page that needs a title area |
| `PatternAzurePortalNav.tsx` | Global hamburger nav (portal-wide) | Required on all portal pages — hamburger overlay |
| `PatternSideNav.tsx` | Section/resource side navigation | Any page with a left-hand blade/section nav |
| `PatternNavLink.tsx` | Navigation link | Individual nav items |
| `PatternToolbar.tsx` | Action toolbar | Any page with action buttons (Add, Delete, Refresh, etc.) |
| `PatternFilterPanel.tsx` | Search + filter pills + data grid | Any data table with filtering (browse, list, search results) |
| `PatternHeader.tsx` | Portal header bar | The standard Azure header with search, actions, profile |
| `PatternPageHeader.tsx` | Page header variant | Alternative page header composition |
| `PatternResourceShell.tsx` | Full resource page shell | Resource detail pages (combines header, nav, breadcrumb, toolbar) |
| `PatternServiceCard.tsx` | Service card | Marketplace or service listing cards |
| `PatternServiceTile.tsx` | Service tile (home page) | Home page icon+label tiles for Azure services |
| `PatternHealthMetricCard.tsx` | Health/metrics donut card | Dashboard metrics with donut gauge visualization |
| `PatternDonutGauge.tsx` | SVG donut gauge | Standalone percentage donut chart |
| `CopilotSuggestions.tsx` | Copilot suggestion pills | Dismissible bar of pill-shaped Copilot prompts |
| `PatternCopilotSuggestions.tsx` | Copilot suggestions demo | Standalone demo of the Copilot suggestions component |
| `azure-icons.ts` | Azure icon CDN map | Import `azureIcon()` for all Azure service icons |

---

## Pattern Selection Guide

Given a user request, select the starting scaffold:

| User wants… | Start from |
|-------------|------------|
| "Build a home page" / "portal landing" | `ScaffoldHomePage.tsx` |
| "List of resources" / "browse page" / "all X" | `ScaffoldBrowsePage.tsx` |
| "Browse in a blade/panel" | `ScaffoldBrowseBlade.tsx` |
| "Resource overview" / "service detail" / "Monitor blade" | `ScaffoldServiceBlade.tsx` |
| "Visual editor" / "designer" / "canvas" | `ScaffoldDesignerBlade.tsx` |
| "Create resource wizard" / "create flow" | `ScaffoldCreateFlow.tsx` |
| "Marketplace" / "browse services" | `ScaffoldMarketplaceBrowse.tsx` |
| "Filter and search a data table" | `PatternFilterPanel.tsx` (compose into any scaffold) |
| "Resource page with side nav" | `PatternResourceShell.tsx` |

**If no scaffold matches**, compose from individual patterns: `PatternHeader` + `PatternAzurePortalNav` + `PageHeader` + content.

---

## How to Use Patterns

1. **Copy** the scaffold/pattern file verbatim into your working directory
2. **Rename** to match the feature (e.g., `ScaffoldBrowsePage.tsx` → `ApiManagementBrowse.tsx`)
3. **Apply mandatory hygiene fixes** if present in older patterns:
   - Replace any `api.iconify.design` URL usage with `CuiIcon name` (generic UI) or `azureIcon()` (Azure services)
4. **Customize** ONLY at marked `TODO` / customization points:
   - Data arrays (services, resources, nav items)
   - Column definitions
   - Labels and strings
   - Event handlers
5. **Preserve** the structural layout, component hierarchy, and slot usage exactly as written
6. **Import** additional patterns as needed (e.g., add `PatternFilterPanel` into a scaffold)

---

## Coding Conventions

### Imports
```tsx
// Always import from @charm-ux/cui/react — destructured
import { CuiButton, CuiIcon, CuiToolbar } from '@charm-ux/cui/react';

// Azure icons from the local map
import { azureIcon } from '../patterns/azure-icons';
```

### Component Style
- Functional components with hooks (`useState`, `useRef`, `useCallback`)
- Inline `<style>` blocks (template literal in component) for component-scoped CSS
- CSS custom properties from Coherence tokens (`var(--font-size-base400)`, `var(--neutral-stroke2)`, etc.)
- `slot` props for Coherence component composition (`slot="header"`, `slot="main"`, `slot="start"`, `slot="trigger"`)

### Naming
- Scaffold files: `Scaffold{PageType}.tsx`
- Pattern files: `Pattern{ComponentName}.tsx`
- Default exports for all components
- PascalCase component names

---

## Anti-Patterns

- **NEVER use Iconify in new code** — No `api.iconify.design` URLs. Use `CuiIcon name` or `azureIcon()` URL only. If a legacy scaffold includes Iconify URLs, replace them immediately.
- **NEVER import from other component libraries** — No Material UI, Fluent UI v9, Radix, shadcn, etc. Only `@charm-ux/cui/react`.
- **NEVER invent custom layout structures** — Use `CuiAppFrame` with proper slots. Don't build page shells from scratch with raw divs.
- **NEVER skip the two-tier nav pattern** — Portal pages need `PatternAzurePortalNav` (global) and optionally `PatternSideNav` (section). Don't invent custom navs.
- **NEVER hardcode Azure icon URLs inline** — Always use `azureIcon()` from `azure-icons.ts`. Add new entries to the map if needed.
- **NEVER modify pattern structural layout** — Copy patterns as-is. Customize at TODO points only. The hierarchy of `CuiAppFrame > CuiHeader > slot="main" > content` is sacred.
- **NEVER build from scratch when a scaffold exists** — Check the Pattern Selection Guide first. If a scaffold covers 80% of the need, start from it.
- **NEVER omit PageHeader** — Every content page needs a proper title bar with `PageHeader`. Don't use raw `<h1>` tags.
- **NEVER introduce new raw HTML tables for browse grids** — Prefer `CuiDataGrid` for new tabular experiences; migrate legacy scaffold tables when touching them.
- **NEVER skip Copilot suggestions** — If the page has a PageHeader, consider whether Copilot suggestion pills are appropriate.

---

## Examples

### Minimal Azure resource browse page
```tsx
import { CuiAppFrame, CuiHeader } from '@charm-ux/cui/react';
import AzurePortalNav from '../patterns/PatternAzurePortalNav';
import PageHeader from '../patterns/PageHeader';
import PatternFilterPanel from '../patterns/PatternFilterPanel';

export default function MyResourceBrowse() {
  return (
    <CuiAppFrame>
      <CuiHeader slot="header" navigationIconLabel="Menu">
        <span slot="title">Microsoft Azure</span>
      </CuiHeader>
      <AzurePortalNav />
      <div slot="main" style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
        <PageHeader
          title="My Resources"
          subtitle="Contoso (contoso.onmicrosoft.com)"
          showFavorite
          copilotSuggestions={['Show unhealthy resources', 'List by region']}
        />
        <PatternFilterPanel />
      </div>
    </CuiAppFrame>
  );
}
```

### Using Azure icons
```tsx
import { CuiIcon } from '@charm-ux/cui/react';
import { azureIcon } from '../patterns/azure-icons';

// Generic UI icon — name prop
<CuiIcon name="settings" />

// Azure service icon — url prop
<CuiIcon url={azureIcon('api-management')} />
<CuiIcon url={azureIcon('virtual-machines')} />
```
