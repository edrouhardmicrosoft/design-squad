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

> Visual annotation feedback loop — humans annotate in the browser, Builder turns feedback into a routable task contract.

## Context

Any squad member can read annotations from Agentation, but **Builder is the primary consumer**. The default automation is:

1. read pending annotations from the MCP server;
2. normalize each item into a task contract;
3. auto-route **straightforward** work to `squad:copilot`;
4. keep **complex** or **unclear** work with `squad:builder`;
5. persist the contract under `.squad/agentation-tasks/` and mirror the latest lifecycle state under `.squad/orchestration-log/agentation/`;
6. create a GitHub issue or a local fallback file.

## Patterns

### Read pending annotations
- Use `agentation_get_all_pending` to pull all unresolved annotations for the current session
- Each annotation includes the target element, coordinates, and the human's comment
- Group annotations by page/component before acting on them

### Create the task contract first
- Run the issue bridge in dry-run mode before mutating GitHub:
  - `node .squad/scripts/agentation-issue.mjs --dry-run ...`
- Include annotation id, page, component, selector, and screenshot whenever available
- Review the computed `complexity`, `label`, and `expectedResult`

### Routing rules
- **Straightforward** (typos, spacing, color tweaks, missing alt text) → route to `squad:copilot`
- **Complex** (layout rework, new components, interaction changes) → route to `squad:builder`
- **Unclear** → keep with Builder until a human or Builder overrides the complexity
- Use `--complexity` to override auto-triage when you already know the right route

### Recovery and replay
- If GitHub is unavailable, the bridge writes `.squad/agentation-fallback/<task-id>.md`
- Retry later with `node .squad/scripts/agentation-issue.mjs --replay-task .squad/agentation-tasks/<task-id>.json`
- The JSON contract is the source of truth for what should be routed

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

Preview routing without creating an issue:
```bash
node .squad/scripts/agentation-issue.mjs --dry-run --title "Fix nav overlap" --comment "Header nav overlaps logo"
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
- Don't skip the task contract — the JSON file is what makes retries and observability possible
- Don't delegate complex design decisions to Copilot — those stay with Builder
- Don't ignore unclear annotations — flag them for human clarification
- Don't leave the MCP server running in production — it's a dev-only tool
