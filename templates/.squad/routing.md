# Work Routing — Design Squad

How to decide who handles what.

## Routing Table

| Work Type            | Route To      | Examples                                                                                 |
| -------------------- | ------------- | ---------------------------------------------------------------------------------------- |
| Strategic analysis   | Oracle 🧿     | Cross-validation, second opinions, architecture review, deep reasoning, design direction |
| Research & discovery | Researcher 🔍 | User research, competitive analysis, design audits, trend synthesis, persona development |
| Spec & flow planning | Planner 📐    | User flows, wireframes, specs, IA, feature requirements, interaction patterns            |
| Implementation       | Builder 🔨    | Component building, design system code, prototyping, design-to-code                      |
| Session logging      | Scribe        | Automatic — never needs routing                                                          |

## Squad Helper Consultation (Any Core Member Can Trigger)

| Consultation        | Helper        | When to Use                                                                    |
| ------------------- | ------------- | ------------------------------------------------------------------------------ |
| Design file context | Figma 🎨      | Need component specs, tokens, layout reference, asset info                     |
| Background coding   | Copilot 🤖    | Scaffolding, CSS, codegen, test generation, repetitive code                    |
| Visual annotations  | Agentation 🎯 | Browser-sourced UI feedback; Builder triages, delegates quick fixes to Copilot |

## Issue Routing

| Label              | Action                                                                    | Who           |
| ------------------ | ------------------------------------------------------------------------- | ------------- |
| `squad`            | Triage: analyze issue, evaluate complexity, assign `squad:{member}` label | Oracle (Lead) |
| `squad:oracle`     | Strategic analysis and deep review                                        | Oracle        |
| `squad:researcher` | Research and discovery work                                               | Researcher    |
| `squad:planner`    | Spec and flow planning                                                    | Planner       |
| `squad:builder`    | Implementation work                                                       | Builder       |
| `squad:copilot`    | Background coding task (via copilot-assign skill)                         | @copilot 🤖   |

## Rules

1. **Eager by default** — spawn all agents who could usefully start work, including anticipatory downstream work.
2. **Scribe always runs** after substantial work, always as `mode: "background"`. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn an agent for trivial questions.
4. **When two agents could handle it**, pick the one whose domain is the primary concern.
5. **"Team, ..." → fan-out.** Spawn all relevant agents in parallel as `mode: "background"`.
6. **Anticipate downstream work.** Research findings → spawn Planner. Specs ready → spawn Builder.
7. **Helpers are skills, not routed agents.** Any core member can invoke Figma, Copilot, or Agentation via their shared skills.
8. **Oracle for the hard problems.** When the team is stuck, uncertain, or needs cross-validation — route to Oracle.
9. **Agentation -> Builder -> Copilot.** When Builder triages annotations, straightforward fixes auto-delegate to Copilot. One invocation handles the whole pipeline.
