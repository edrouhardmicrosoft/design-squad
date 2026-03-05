# Ceremonies

> Team meetings that happen before or after work. Each squad configures their own.

## Design Review

| Field | Value |
|-------|-------|
| **Trigger** | auto |
| **When** | before |
| **Condition** | multi-agent task involving 2+ agents modifying shared systems |
| **Facilitator** | lead |
| **Participants** | all-relevant |
| **Time budget** | focused |
| **Enabled** | ✅ yes |

**Agenda:**
1. Review the task and requirements
2. Agree on interfaces and contracts between components
3. Identify risks and edge cases
4. Assign action items

---

## Retrospective

| Field | Value |
|-------|-------|
| **Trigger** | auto |
| **When** | after |
| **Condition** | build failure, test failure, or reviewer rejection |
| **Facilitator** | lead |
| **Participants** | all-involved |
| **Time budget** | focused |
| **Enabled** | ✅ yes |

**Agenda:**
1. What happened? (facts only)
2. Root cause analysis
3. What should change?
4. Action items for next iteration

---

## Annotation Triage

| Field | Value |
|-------|-------|
| **Trigger** | manual |
| **When** | on-demand |
| **Condition** | User says "check annotations", "triage annotations", or invokes Builder with Agentation |
| **Facilitator** | Builder |
| **Participants** | Builder, Copilot (background) |
| **Time budget** | focused |
| **Enabled** | ✅ yes |

**Agenda:**
1. Pull all pending annotations via `agentation_get_all_pending`
2. Group by page/component and assess complexity
3. Complex items (layout, new components, interactions) → Builder handles directly
4. Straightforward items (typos, spacing, colors, alt text) → delegate to Copilot via `copilot-assign`
5. Unclear items → flag for human clarification
6. Report summary: what was handled, what was delegated, what needs input
