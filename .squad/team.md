# Design Squad

> A portable design team: Oracle, Researcher, Planner, Builder — with Figma and Copilot helpers.

## Coordinator

| Name | Role | Notes |
|------|------|-------|
| Squad | Coordinator | Routes work, enforces handoffs and reviewer gates. Does not generate domain artifacts. |

## Core Members

| Name | Role | Charter | Status |
|------|------|---------|--------|
| Oracle | Strategic Advisor | `.squad/agents/oracle/charter.md` | ✅ Active |
| Researcher | Research & Discovery | `.squad/agents/researcher/charter.md` | ✅ Active |
| Planner | Spec & Flow Planning | `.squad/agents/planner/charter.md` | ✅ Active |
| Builder | Implementation | `.squad/agents/builder/charter.md` | ✅ Active |
| Scribe | Session Logger | `.squad/agents/scribe/charter.md` | 📋 Silent |
| Ralph | Work Monitor | — | 🔄 Monitor |

## Squad Helpers (Available to All Core Members)

| Name | Type | Skill | Notes |
|------|------|-------|-------|
| Figma | Helper | `.squad/skills/figma-mcp/SKILL.md` | Connects to Figma MCP; any core member can consult |
| Copilot | Helper | `.squad/skills/copilot-assign/SKILL.md` | Background coding tasks; any core member can assign |
| Agentation | Helper | `.squad/skills/agentation-mcp/SKILL.md` | Visual UI annotations from the browser; Builder triages, delegates simple fixes to Copilot |

## Project Context

- **Project:** design-squad
- **Stack:** TypeScript, Bun, Squad CLI/SDK
- **Description:** A portable design team with strategic analysis, research, planning, and building capabilities
- **Created:** 2026-03-04
