# Squad Decisions

## Active Decisions

### 2026-03-05 - Agentation Mount Is Dev-Only in Demo

- Decision: Mount Agentation in the Vite demo only when `import.meta.env.DEV` is true.
- Rationale: Keeps annotation tooling out of production bundles and uses Vite-native environment semantics.
- Impact: `bun run dev:all` local workflow is unchanged; production UI does not render Agentation overlay.

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
