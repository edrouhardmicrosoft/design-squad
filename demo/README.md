# Design Squad — Agentation Demo

A design system sampler app for testing [Agentation](https://agentation.dev) visual annotations.

## Quick Start

```bash
cd demo
bun install
```

### Run everything (app + MCP server)

```bash
bun run dev:all
```

This starts:
- **Vite dev server** at `http://localhost:5173`
- **Agentation MCP server** at `http://localhost:4747`

### Run separately

```bash
# Terminal 1 — Vite dev server
bun run dev

# Terminal 2 — Agentation MCP server
bun run dev:mcp
```

## Testing Annotations

1. Open `http://localhost:5173` in your browser
2. The Agentation overlay will appear (bottom-right corner)
3. Click elements on the page to annotate them with feedback
4. Annotations sync to the MCP server at `localhost:4747`

### With an AI agent (full pipeline)

1. Add the MCP server to your agent:
   ```bash
   npx add-mcp "npx -y agentation-mcp server"
   ```
2. Or verify existing setup:
   ```bash
   npx agentation-mcp doctor
   ```
3. Annotate UI elements in the browser
4. Ask Builder to triage annotations — straightforward fixes auto-delegate to Copilot

## What's in the Sampler

The demo includes a variety of UI components to annotate:

- **Navigation** — sticky nav bar with links and dark mode toggle
- **Typography** — heading scale, body text, links
- **Buttons** — primary, secondary, outline, danger, ghost, sizes
- **Cards** — image cards with badges
- **Interactive counter** — stateful component
- **Form elements** — text, email, select, textarea, checkbox, validation
- **Alerts** — info, success, warning, error
- **Badges** — colored status indicators
- **Data table** — squad member roster
- **Dark mode** — toggle to test both themes
