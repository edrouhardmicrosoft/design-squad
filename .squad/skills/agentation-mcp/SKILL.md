---
name: "agentation-mcp"
description: "Visual UI annotations synced from the browser via MCP — triage, resolve, and delegate fixes"
domain: "design-tooling"
confidence: "high"
source: "manual"
tools:
  - name: "agentation-mcp"
    description: "Agentation MCP server for reading, resolving, and managing browser-sourced UI annotations"
    when: "Need to read pending UI annotations, triage design feedback, resolve completed fixes, or delegate quick fixes to Copilot"
---

# Skill: agentation-mcp

> Visual annotation feedback loop — humans annotate in the browser, agents triage and fix.

## Context

Any squad member can read annotations from Agentation, but **Builder is the primary consumer**. The typical flow is: a human annotates UI issues in the browser → Builder reads pending annotations → handles complex work directly → delegates straightforward fixes to Copilot via `copilot-assign` → Copilot opens a PR → annotation resolved.

This skill already knows the Copilot pipeline. When a squad member invokes Agentation, they don't need to separately invoke Copilot — the handoff is built in.

## Patterns

### Read pending annotations
- Use `agentation_get_all_pending` to pull all unresolved annotations for the current session
- Each annotation includes the target element, coordinates, and the human's comment
- Group annotations by page/component before acting on them

### Triage and prioritize
- **Complex** (layout rework, new components, interaction changes) → Builder handles directly
- **Straightforward** (typos, spacing, color tweaks, missing alt text) → delegate to Copilot via `copilot-assign`
- **Questions/unclear** → flag for human clarification, do not resolve

### Copilot handoff (built-in)
When delegating to Copilot:
1. Read the annotation details (element, comment, context)
2. Formulate a clear task spec: what file, what change, what the expected result is
3. Assign via `copilot-assign` — Copilot works in the background and opens a PR
4. Once the PR is merged/approved, resolve the annotation with `agentation_resolve`

This is the default path for simple fixes. No separate Copilot invocation needed.

### Resolve and dismiss
- `agentation_resolve` — mark an annotation as fixed (after PR merge or direct fix)
- Dismiss annotations that are no longer relevant (e.g., stale feedback on changed UI)
- Always resolve with a brief note on what was done

### List sessions
- `agentation_list_sessions` — see all annotation sessions
- Useful for reviewing feedback across multiple pages or time periods
- Sessions persist across page refreshes (local-first, syncs when server is available)

## Setup

### MCP server

Add the Agentation MCP server to your agent configuration:

```
npx add-mcp "npx -y agentation-mcp server"
```

Or configure manually — the server runs on port 4747 by default. Use `--port 8080` to change it.

Verify setup:
```
npx agentation-mcp doctor
```

### React component

Wire the `<Agentation />` component into your app's root layout, guarded by `NODE_ENV`:

```tsx
import { Agentation } from "agentation";

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === "development" && (
        <Agentation endpoint="http://localhost:4747" />
      )}
    </>
  );
}
```

Install the package:
```
npm install agentation -D
```

## Anti-Patterns

- Don't resolve annotations without actually fixing the issue — resolve means "done"
- Don't batch-resolve without reviewing each annotation individually
- Don't delegate complex design decisions to Copilot — those need Builder's judgment
- Don't ignore unclear annotations — flag them for human clarification
- Don't leave the MCP server running in production — it's a dev-only tool
