---
name: "figma-mcp"
description: "Connect to Figma via MCP for design file context — components, tokens, layouts, specs"
domain: "design-tooling"
confidence: "high"
source: "manual"
tools:
  - name: "figma"
    description: "Figma MCP server for reading design files, components, and design tokens"
    when: "Need design file context, component specs, token values, layout reference, asset export"
---

# Skill: figma-mcp

> Bridge to Figma design files via Model Context Protocol.

## Context

Any squad member can consult Figma when they need design file context. This skill connects to a Figma MCP server to read components, inspect design tokens, get layout specs, and reference design decisions.

## Patterns

### Read component specs
- Get component properties, variants, and constraints
- Inspect auto-layout settings and spacing
- Read text styles and color references

### Inspect design tokens
- Color palette values (hex, RGB, HSL)
- Typography scale (font family, size, weight, line height)
- Spacing scale and grid settings
- Border radius, shadow, and effect tokens

### Get layout reference
- Page and frame structure
- Component hierarchy and nesting
- Responsive breakpoint layouts

### Sync with implementation
- Export specs for Builder to implement
- Compare design tokens with code tokens
- Identify design drift between Figma and production

## Configuration

Requires a Figma MCP server to be configured in `.copilot/mcp-config.json` or the project's MCP configuration. See Figma's MCP documentation for setup.

## Anti-Patterns

- Don't pull entire Figma files — scope to specific frames/components
- Don't modify Figma files without explicit approval
- Don't assume Figma is the source of truth for coded components (check both)
