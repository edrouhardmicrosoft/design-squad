---
name: "agentation-mcp"
description: "Visual UI annotations synced from the browser via MCP - triage, resolve, and delegate fixes"
domain: "design-tooling"
confidence: "high"
source: "manual"
tools:
  - name: "agentation-mcp"
    description: "Agentation MCP server for reading, resolving, and managing browser-sourced UI annotations"
    when: "Need to read pending UI annotations, triage design feedback, resolve completed fixes, or delegate quick fixes to Copilot"
---

# Skill: agentation-mcp

> Visual annotation feedback loop - humans annotate in the browser, agents triage and fix.

## Context

Any squad member can read annotations from Agentation, but **Builder is the primary consumer**. The typical flow is: a human annotates UI issues in the browser -> Builder reads pending annotations -> handles complex work directly -> delegates straightforward fixes to Copilot via `copilot-assign` -> Copilot opens a PR -> annotation resolved.

## Patterns

### Read pending annotations

- Use `agentation_get_all_pending` to pull all unresolved annotations for the current session
- Each annotation includes target context and human comment
- Group annotations by page/component before acting on them

### Triage and prioritize

- **Complex** (layout rework, new components, interaction changes) -> Builder handles directly
- **Straightforward** (typos, spacing, color tweaks, missing alt text) -> delegate to Copilot via `copilot-assign`
- **Unclear** -> ask for clarification, do not resolve

### Copilot handoff

When delegating to Copilot:

1. Read annotation details (element, comment, context)
2. Build a clear task spec (file, change, expected result)
3. Assign via `copilot-assign`
4. After merge/approval, resolve annotation with `agentation_resolve`

### Resolve and dismiss

- `agentation_resolve` marks annotation fixed
- Dismiss stale annotations that no longer apply
- Always add a brief resolution note

## Setup

### MCP server

Add Agentation MCP server to your config:

```bash
npx add-mcp "npx -y agentation-mcp server"
```

Verify setup:

```bash
npx agentation-mcp doctor
```

### React component

Wire `<Agentation />` into app root in dev mode only:

```tsx
import { Agentation } from "agentation";

{
  import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />;
}
```
