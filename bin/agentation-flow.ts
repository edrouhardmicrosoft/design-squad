import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

export type AgentationComplexity = "straightforward" | "complex" | "unclear";
export type AgentationSeverity = "low" | "medium" | "high";
export type AgentationRoute = "copilot" | "builder";
export type AgentationLabel = "squad:copilot" | "squad:builder";
export type AgentationStage =
  | "annotation-captured"
  | "triaged"
  | "replayed"
  | "dry-run"
  | "github-routed"
  | "fallback-written";

export type AgentationArgs = {
  title?: string;
  comment?: string;
  repo?: string;
  component?: string;
  page?: string;
  session?: string;
  selector?: string;
  screenshot?: string;
  fallbackFile?: string;
  annotationId?: string;
  severity?: string;
  complexity?: string;
  expectedResult?: string;
  replayTask?: string;
  dryRun?: boolean;
};

export type HistoryEntry = {
  stage: AgentationStage;
  at: string;
  detail: string;
};

export type AgentationTask = {
  version: "1.0";
  taskId: string;
  createdAt: string;
  title: string;
  comment: string;
  source: {
    kind: "agentation";
    annotationId: string | null;
    session: string | null;
    component: string | null;
    page: string | null;
    selector: string | null;
    screenshot: string | null;
  };
  triage: {
    complexity: AgentationComplexity;
    severity: AgentationSeverity;
    routeTarget: AgentationRoute;
    label: AgentationLabel;
    rationale: string[];
    expectedResult: string;
  };
  routing: {
    repo: string | null;
    issueUrl: string | null;
    issueNumber: number | null;
    fallbackFile: string | null;
    taskFile: string | null;
    logFile: string | null;
  };
  lifecycle: {
    currentStage: AgentationStage;
    history: HistoryEntry[];
  };
};

const STRAIGHTFORWARD_HINTS = [
  "typo",
  "copy",
  "text",
  "spacing",
  "padding",
  "margin",
  "color",
  "contrast",
  "alt text",
  "aria",
  "label",
  "icon",
  "border",
  "radius",
  "font",
  "alignment",
  "align",
] as const;

const COMPLEX_HINTS = [
  "layout",
  "rework",
  "new component",
  "new page",
  "new flow",
  "interaction",
  "animation",
  "responsive",
  "navigation",
  "modal",
  "drawer",
  "state",
  "refactor",
  "architecture",
  "workflow",
  "information architecture",
  "multi-step",
] as const;

export function parseArgs(argv: string[]): AgentationArgs {
  const out: AgentationArgs = {};

  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    const val = argv[i + 1];

    if (key === "--title") {
      out.title = val;
      i++;
    } else if (key === "--comment") {
      out.comment = val;
      i++;
    } else if (key === "--repo") {
      out.repo = val;
      i++;
    } else if (key === "--component") {
      out.component = val;
      i++;
    } else if (key === "--page") {
      out.page = val;
      i++;
    } else if (key === "--session") {
      out.session = val;
      i++;
    } else if (key === "--selector") {
      out.selector = val;
      i++;
    } else if (key === "--screenshot") {
      out.screenshot = val;
      i++;
    } else if (key === "--fallback-file") {
      out.fallbackFile = val;
      i++;
    } else if (key === "--annotation-id") {
      out.annotationId = val;
      i++;
    } else if (key === "--severity") {
      out.severity = val;
      i++;
    } else if (key === "--complexity") {
      out.complexity = val;
      i++;
    } else if (key === "--expected-result") {
      out.expectedResult = val;
      i++;
    } else if (key === "--replay-task") {
      out.replayTask = val;
      i++;
    } else if (key === "--dry-run") {
      out.dryRun = true;
    }
  }

  return out;
}

export function printUsage(command: string) {
  console.log(`
Create or replay an Agentation task and route it to the right squad label.

Usage:
  ${command} --title "Fix nav overlap" --comment "Nav covers logo at 375px"
  ${command} --replay-task .squad/agentation-tasks/<task-id>.json

Options:
  --title            Issue title (required unless --replay-task is used)
  --comment          Annotation/comment text (required unless --replay-task is used)
  --repo             owner/repo (optional; defaults to current gh repo)
  --component        UI component name
  --page             Page or route
  --session          Agentation session id/name
  --selector         CSS selector or element id from annotation
  --screenshot       Screenshot URL/path for context
  --annotation-id    Agentation annotation id
  --severity         low | medium | high (default: medium)
  --complexity       auto | straightforward | complex | unclear (default: auto)
  --expected-result  Definition of done for the assignee
  --fallback-file    File path for non-GitHub fallback output
  --replay-task      Retry GitHub routing from a saved task contract
  --dry-run          Write task artifacts and print routing without creating an issue
  -h, --help         Show help
`);
}

export function createTaskFromArgs(args: AgentationArgs): AgentationTask {
  const createdAt = new Date().toISOString();
  const classification = classifyTask(args);
  const taskId = `${Date.now()}-${slug(args.annotationId || args.title || "task")}`;
  const task: AgentationTask = {
    version: "1.0",
    taskId,
    createdAt,
    title: args.title ?? "",
    comment: args.comment ?? "",
    source: {
      kind: "agentation",
      annotationId: clean(args.annotationId),
      session: clean(args.session),
      component: clean(args.component),
      page: clean(args.page),
      selector: clean(args.selector),
      screenshot: clean(args.screenshot),
    },
    triage: {
      complexity: classification.complexity,
      severity: normalizeSeverity(args.severity),
      routeTarget: classification.routeTarget,
      label: classification.label,
      rationale: classification.rationale,
      expectedResult: clean(args.expectedResult) || defaultExpectedResult(classification.routeTarget),
    },
    routing: {
      repo: clean(args.repo),
      issueUrl: null,
      issueNumber: null,
      fallbackFile: clean(args.fallbackFile),
      taskFile: null,
      logFile: null,
    },
    lifecycle: {
      currentStage: "triaged",
      history: [
        {
          stage: "annotation-captured",
          at: createdAt,
          detail: "Captured annotation input and normalized task metadata.",
        },
        {
          stage: "triaged",
          at: createdAt,
          detail: `Triaged as ${classification.complexity}; routed to ${classification.label}.`,
        },
      ],
    },
  };

  return task;
}

export function readTaskFromFile(taskPath: string, cwd = process.cwd()): AgentationTask {
  const absolutePath = resolve(cwd, taskPath);
  const raw = readFileSync(absolutePath, "utf8");
  const parsed = JSON.parse(raw) as AgentationTask;

  if (!parsed.taskId || !parsed.title || !parsed.comment || !parsed.triage?.label) {
    throw new Error(`Task file is missing required fields: ${taskPath}`);
  }

  return parsed;
}

export function appendHistory(task: AgentationTask, stage: AgentationStage, detail: string): AgentationTask {
  return {
    ...task,
    lifecycle: {
      currentStage: stage,
      history: [
        ...task.lifecycle.history,
        {
          stage,
          at: new Date().toISOString(),
          detail,
        },
      ],
    },
  };
}

export function persistTaskArtifacts(task: AgentationTask, cwd = process.cwd()): AgentationTask {
  const taskFile = task.routing.taskFile ?? `.squad/agentation-tasks/${task.taskId}.json`;
  const logFile = task.routing.logFile ?? `.squad/orchestration-log/agentation/${task.taskId}.json`;
  const nextTask: AgentationTask = {
    ...task,
    routing: {
      ...task.routing,
      taskFile,
      logFile,
    },
  };

  writeTextFile(resolve(cwd, taskFile), `${JSON.stringify(nextTask, null, 2)}\n`);
  writeTextFile(resolve(cwd, logFile), `${JSON.stringify(nextTask, null, 2)}\n`);
  return nextTask;
}

export function writeFallbackArtifacts(
  task: AgentationTask,
  reason: string,
  cwd = process.cwd()
): AgentationTask {
  const fallbackFile = task.routing.fallbackFile ?? `.squad/agentation-fallback/${task.taskId}.md`;
  const nextTask = appendHistory(
    {
      ...task,
      routing: {
        ...task.routing,
        fallbackFile,
      },
    },
    "fallback-written",
    reason
  );

  const persisted = persistTaskArtifacts(nextTask, cwd);
  writeTextFile(resolve(cwd, fallbackFile), buildFallbackMarkdown(persisted, reason));
  return persisted;
}

export function buildIssueBody(task: AgentationTask): string {
  const contract = JSON.stringify(task, null, 2);
  return [
    "### Agentation Feedback",
    "",
    task.comment,
    "",
    "### Triage",
    `- Task ID: ${task.taskId}`,
    `- Complexity: ${task.triage.complexity}`,
    `- Severity: ${task.triage.severity}`,
    `- Routed label: \`${task.triage.label}\``,
    `- Expected result: ${task.triage.expectedResult}`,
    `- Rationale: ${task.triage.rationale.join("; ")}`,
    "",
    "### Context",
    `- Annotation ID: ${task.source.annotationId ?? "(not provided)"}`,
    `- Component: ${task.source.component ?? "(not provided)"}`,
    `- Page: ${task.source.page ?? "(not provided)"}`,
    `- Session: ${task.source.session ?? "(not provided)"}`,
    `- Selector: ${task.source.selector ?? "(not provided)"}`,
    `- Screenshot: ${task.source.screenshot ?? "(not provided)"}`,
    "",
    "### Machine-readable task contract",
    "```json",
    contract,
    "```",
  ].join("\n");
}

export function formatTaskSummary(task: AgentationTask): string {
  return [
    `Task ID: ${task.taskId}`,
    `Complexity: ${task.triage.complexity}`,
    `Severity: ${task.triage.severity}`,
    `Route: ${task.triage.label}`,
    `Expected result: ${task.triage.expectedResult}`,
  ].join("\n");
}

export function parseIssueNumber(issueUrl: string): number | null {
  const match = issueUrl.match(/\/issues\/(\d+)/);
  return match ? Number(match[1]) : null;
}

function buildFallbackMarkdown(task: AgentationTask, reason: string): string {
  return [
    "# Agentation Feedback (GitHub fallback)",
    "",
    `- Reason: ${reason}`,
    `- Created: ${new Date().toISOString()}`,
    `- Task ID: ${task.taskId}`,
    `- Routed label: ${task.triage.label}`,
    `- Complexity: ${task.triage.complexity}`,
    `- Severity: ${task.triage.severity}`,
    "",
    "## Title",
    task.title,
    "",
    "## Comment",
    task.comment,
    "",
    "## Context",
    `- Annotation ID: ${task.source.annotationId ?? "(not provided)"}`,
    `- Component: ${task.source.component ?? "(not provided)"}`,
    `- Page: ${task.source.page ?? "(not provided)"}`,
    `- Session: ${task.source.session ?? "(not provided)"}`,
    `- Selector: ${task.source.selector ?? "(not provided)"}`,
    `- Screenshot: ${task.source.screenshot ?? "(not provided)"}`,
    "",
    "## Expected Result",
    task.triage.expectedResult,
    "",
    "## Next Step",
    `Retry with --replay-task ${task.routing.taskFile ?? `.squad/agentation-tasks/${task.taskId}.json`} once GitHub access is available.`,
  ].join("\n");
}

function classifyTask(args: AgentationArgs): {
  complexity: AgentationComplexity;
  routeTarget: AgentationRoute;
  label: AgentationLabel;
  rationale: string[];
} {
  const explicitComplexity = normalizeComplexity(args.complexity);
  if (explicitComplexity) {
    return buildClassification(explicitComplexity, [`Complexity explicitly set to ${explicitComplexity}.`]);
  }

  const haystack = [
    args.title,
    args.comment,
    args.component,
    args.page,
    args.expectedResult,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const straightforwardMatches = STRAIGHTFORWARD_HINTS.filter((hint) => haystack.includes(hint));
  const complexMatches = COMPLEX_HINTS.filter((hint) => haystack.includes(hint));

  if (straightforwardMatches.length > 0 && complexMatches.length === 0) {
    return buildClassification("straightforward", [
      `Matched straightforward hints: ${straightforwardMatches.join(", ")}.`,
    ]);
  }

  if (complexMatches.length > 0 && straightforwardMatches.length === 0) {
    return buildClassification("complex", [`Matched complex hints: ${complexMatches.join(", ")}.`]);
  }

  if (complexMatches.length > straightforwardMatches.length) {
    return buildClassification("complex", [
      `Complex hints outweighed straightforward hints (${complexMatches.length} vs ${straightforwardMatches.length}).`,
    ]);
  }

  if (straightforwardMatches.length > complexMatches.length) {
    return buildClassification("straightforward", [
      `Straightforward hints outweighed complex hints (${straightforwardMatches.length} vs ${complexMatches.length}).`,
    ]);
  }

  if (straightforwardMatches.length > 0 || complexMatches.length > 0) {
    return buildClassification("unclear", [
      "Task contains mixed straightforward and complex signals, so it stays with Builder for triage.",
    ]);
  }

  return buildClassification("unclear", [
    "No reliable complexity hints matched; defaulting to Builder for explicit triage.",
  ]);
}

function buildClassification(complexity: AgentationComplexity, rationale: string[]) {
  const routeTarget: AgentationRoute = complexity === "straightforward" ? "copilot" : "builder";
  const label: AgentationLabel = routeTarget === "copilot" ? "squad:copilot" : "squad:builder";
  return { complexity, routeTarget, label, rationale };
}

function normalizeSeverity(value?: string): AgentationSeverity {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }

  return "medium";
}

function normalizeComplexity(value?: string): AgentationComplexity | null {
  if (value === "straightforward" || value === "complex" || value === "unclear") {
    return value;
  }

  return null;
}

function defaultExpectedResult(routeTarget: AgentationRoute): string {
  if (routeTarget === "copilot") {
    return "Apply the requested UI fix, keep the change scoped to the annotated surface, and open a PR that references the Agentation task ID.";
  }

  return "Builder should own the triage, make the design/implementation call, and delegate follow-on simple coding work only after the task contract is clear.";
}

function writeTextFile(path: string, content: string) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function clean(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function slug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
