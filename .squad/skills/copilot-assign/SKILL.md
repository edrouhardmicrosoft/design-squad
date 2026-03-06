---
name: "copilot-assign"
description: "Assign background coding tasks to GitHub Copilot for implementation"
domain: "implementation"
confidence: "high"
source: "manual"
---

# Skill: copilot-assign

> Delegate background coding tasks to GitHub Copilot.

## Context

Any squad member can assign background coding work to Copilot. Use this when design decisions need to be translated into code — component scaffolding, CSS implementation, design token codegen, test generation, etc.

When the work came from Agentation, treat the JSON contract in `.squad/agentation-tasks/` as the source of truth for scope, expected result, and annotation metadata.

## Patterns

### Component scaffolding
- Generate component boilerplate from Planner's specs
- Create file structure following project conventions
- Set up prop types and interfaces

### Design-to-code
- Implement CSS/styling from Figma specs
- Generate design token files (CSS custom properties, JS constants)
- Create responsive layout code from wireframe specs

### Test generation
- Scaffold test files for design components
- Generate accessibility test cases
- Create visual regression test setup

### Documentation
- Generate component documentation from implementation
- Create usage examples and API references
- Update design system docs

## When to Use

- Builder has specs and needs implementation scaffolding
- Researcher needs data formatted or processed
- Planner needs a prototype spun up quickly
- Any member needs repetitive code work done in the background

### Agentation-driven tasks
When Builder triages Agentation annotations and delegates straightforward fixes:
- Copilot receives a task contract sourced from the annotation (task id, element, comment, route, expected result)
- Implement the fix, open a PR, and include the annotation reference in the PR description
- Builder (or the human) resolves the annotation after PR merge
- Typical tasks: spacing fixes, color corrections, typo fixes, missing alt text, minor layout tweaks

### Working from the task contract
- Read `.squad/agentation-tasks/<task-id>.json` before making assumptions
- Respect `triage.expectedResult` and keep the change scoped to the annotated surface
- Check `.squad/orchestration-log/agentation/` if you need the latest routing or fallback context
- Preserve the `taskId` in your PR description or summary so the annotation can be resolved cleanly

## Anti-Patterns

- Don't assign ambiguous tasks — be specific about inputs, outputs, and constraints
- Don't use for architecture decisions (that's Oracle)
- Don't silently change the route or expected result without updating the task contract
- Don't skip review of Copilot's output — always verify against specs
