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

## Anti-Patterns

- Don't assign ambiguous tasks — be specific about inputs, outputs, and constraints
- Don't use for architecture decisions (that's Oracle)
- Don't skip review of Copilot's output — always verify against specs
