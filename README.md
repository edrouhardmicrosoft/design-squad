# Design Squad

A portable AI design team powered by [Squad](https://github.com/bradygaster/squad). Drop it into any project and get a consistent, fixed-composition team of design-focused agents.

## Team

| Member | Role | Model |
|--------|------|-------|
| **Oracle** 🧿 | Strategic Advisor | `gpt-5.3-codex` |
| **Researcher** 🔍 | Research & Discovery | configurable |
| **Planner** 📐 | Spec & Flow Planning | configurable |
| **Builder** 🔨 | Implementation | configurable |

### Squad Helpers

Available to every core member via shared skills:

| Helper | What it does |
|--------|-------------|
| **Figma** 🎨 | Connects to Figma MCP for design file context — components, tokens, layouts |
| **Copilot** 🤖 | Assigns background coding tasks — scaffolding, CSS, codegen |

## Quick Start

### Add to any project (one command)

```bash
npx github:your-org/design-squad init
```

This scaffolds `.squad/`, `squad.config.ts`, and `.squad-templates/` into your current directory. Then run:

```bash
npx squad
```

> **Private repo?** Works automatically if you have GitHub access (SSH key or `gh auth`).

### Run from this repo directly

```bash
bun install
npx squad
```

### Manual setup (alternative)

Copy the portable squad configuration into any repo:

```bash
cp -r .squad/ <your-project>/.squad/
cp squad.config.ts <your-project>/squad.config.ts
```

Then install the Squad CLI (`npm install -g @bradygaster/squad-cli` or add it as a dev dependency) and run `squad`.

## Adding Custom Skills

Each core member can receive custom skills. Drop a `SKILL.md` into `.squad/skills/<skill-name>/` and reference it in the agent's charter:

```
.squad/skills/
├── oracle-review/SKILL.md      # Oracle's deep-analysis skill (included)
├── figma-mcp/SKILL.md          # Figma helper (included)
├── copilot-assign/SKILL.md     # Copilot helper (included)
└── <your-skill>/SKILL.md       # Add your own
```

## Model Configuration

Each agent's model is set in their charter file (`## Model → Preferred:`). To swap models when better ones ship, edit one line per agent. Fleet-wide fallback chains live in `squad.config.ts`.

## Structure

```
.squad/
├── team.md                     # Fixed roster
├── routing.md                  # Work type → agent routing
├── agents/
│   ├── oracle/charter.md       # Strategic advisor (gpt-5.3-codex)
│   ├── researcher/charter.md   # Research & discovery
│   ├── planner/charter.md      # Spec & flow planning
│   ├── builder/charter.md      # Implementation
│   └── scribe/charter.md       # Session logger (auto)
├── skills/
│   ├── oracle-review/          # @steipete/oracle deep analysis
│   ├── figma-mcp/              # Figma MCP bridge
│   └── copilot-assign/         # Background coding delegation
└── ...
squad.config.ts                 # Models, routing rules, governance
```

## License

MIT
