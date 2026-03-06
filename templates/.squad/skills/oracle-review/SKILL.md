---
name: "oracle-review"
description: "Deep second-opinion review using @steipete/oracle CLI with gpt-5.4 on high reasoning effort"
domain: "strategic-review"
confidence: "high"
source: "manual"
tools:
  - name: "oracle"
    description: "Oracle CLI for bundled prompt + file analysis via gpt-5.4 on high reasoning effort"
    when: "Need deep analysis, stuck on a design decision, cross-validation, architectural review"
---

# Skill: oracle-review

> Deep second-opinion analysis following @steipete/oracle guidelines.

## Context

Oracle uses the `@steipete/oracle` CLI to bundle context + prompt and send it to `gpt-5.4` with `--reasoning-effort=high` for deep one-shot analysis. Use when the team needs strategic guidance, is stuck on a hard problem, or wants cross-validation of a design direction.

## Patterns

### Quick analysis (preview first, then run)

```bash
# Preview what you'll send (no tokens spent)
npx -y @steipete/oracle --dry-run summary -p "<analysis prompt>" --file "<relevant files>"

# Run the analysis
npx -y @steipete/oracle --model gpt-5.4 --reasoning-effort=high -p "<analysis prompt>" --file "<relevant files>"
```

### Exhaustive prompt template (for complex problems)

Structure your prompt as:
1. **Project briefing** (6-30 sentences): stack, conventions, constraints
2. **Current state**: what exists, what's been tried, what failed
3. **Specific question**: exactly what you want analyzed
4. **Desired output**: "give 3 options with tradeoffs", "return patch plan + tests", etc.

### File selection

- Include only the files needed for context (fewer files + better prompt > whole-repo dump)
- Use globs: `--file "src/**/*.ts" --file "!**/*.test.*"`
- Target < 196k tokens total input

## Model Updates

**Current model:** `gpt-5.4` with `--reasoning-effort=high`

To update when a better model ships:
1. Change the `--model` and `--reasoning-effort` flags in the patterns above
2. Update Oracle's charter: `.squad/agents/oracle/charter.md` → `## Model` → `Preferred:`

## Anti-Patterns

- Don't dump the entire repo — curate the file set
- Don't use Oracle for quick questions the coordinator can answer
- Don't skip the `--dry-run` on large file sets
- Don't re-run if the session times out — reattach instead (`oracle status`)
