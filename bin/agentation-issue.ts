#!/usr/bin/env node

import { spawnSync } from "child_process";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

type Args = {
  title?: string;
  comment?: string;
  repo?: string;
  component?: string;
  page?: string;
  session?: string;
  selector?: string;
  screenshot?: string;
  fallbackFile?: string;
};

function printUsage() {
  console.log(`
Create a GitHub issue from Agentation feedback and route it to @copilot.

Usage:
  bun run agentation:issue --title "Fix nav overlap" --comment "Nav covers logo at 375px"

Options:
  --title       Issue title (required)
  --comment     Annotation/comment text (required)
  --repo        owner/repo (optional; defaults to current gh repo)
  --component   UI component name (optional)
  --page        Page or route (optional)
  --session     Agentation session id/name (optional)
  --selector    CSS selector or element id from annotation (optional)
  --screenshot  Screenshot URL/path for context (optional)
  --fallback-file  File path for non-GitHub fallback output (optional)
  -h, --help    Show help
`);
}

function parseArgs(argv: string[]): Args {
  const out: Args = {};

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
    }
  }

  return out;
}

function runGh(args: string[]): { ok: boolean; out: string; err: string } {
  const proc = spawnSync("gh", args, { encoding: "utf8" });
  return {
    ok: proc.status === 0,
    out: proc.stdout ?? "",
    err: proc.stderr ?? "",
  };
}

function currentRepo(): string | null {
  const res = runGh(["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"]);
  if (!res.ok) return null;
  const repo = res.out.trim();
  return repo || null;
}

function buildBody(a: Required<Pick<Args, "comment">> & Args): string {
  const lines = [
    "### Agentation Feedback",
    "",
    a.comment,
    "",
    "### Context",
    `- Source: Agentation annotation`,
    `- Component: ${a.component || "(not provided)"}`,
    `- Page: ${a.page || "(not provided)"}`,
    `- Session: ${a.session || "(not provided)"}`,
    `- Selector: ${a.selector || "(not provided)"}`,
    `- Screenshot: ${a.screenshot || "(not provided)"}`,
    "",
    "### Routing",
    "- Label: `squad:copilot`",
    "- Expected: Copilot coding agent picks up this issue via squad workflows",
  ];

  return lines.join("\n");
}

function slug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function writeFallback(a: Required<Pick<Args, "title" | "comment">> & Args, reason: string) {
  const fallbackPath =
    a.fallbackFile || `.squad/agentation-fallback/${Date.now()}-${slug(a.title || "task")}.md`;
  const absPath = resolve(process.cwd(), fallbackPath);
  mkdirSync(dirname(absPath), { recursive: true });

  const content = [
    "# Agentation Feedback (GitHub fallback)",
    "",
    `- Reason: ${reason}`,
    `- Created: ${new Date().toISOString()}`,
    "",
    "## Title",
    a.title,
    "",
    "## Comment",
    a.comment,
    "",
    "## Context",
    `- Component: ${a.component || "(not provided)"}`,
    `- Page: ${a.page || "(not provided)"}`,
    `- Session: ${a.session || "(not provided)"}`,
    `- Selector: ${a.selector || "(not provided)"}`,
    `- Screenshot: ${a.screenshot || "(not provided)"}`,
    "",
    "## Next Step",
    "Create a GitHub issue with label `squad:copilot` when GitHub access is available.",
  ].join("\n");

  writeFileSync(absPath, content, "utf8");
  console.log(`GitHub unavailable. Wrote fallback task: ${fallbackPath}`);
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) {
    printUsage();
    process.exit(0);
  }

  const a = parseArgs(argv);

  if (!a.title || !a.comment) {
    printUsage();
    console.error("Error: --title and --comment are required.");
    process.exit(1);
  }

  const auth = runGh(["auth", "status"]);
  if (!auth.ok) {
    writeFallback({ ...a, title: a.title, comment: a.comment }, "`gh auth status` failed");
    process.exit(0);
  }

  const repo = a.repo || currentRepo();
  if (!repo) {
    writeFallback({ ...a, title: a.title, comment: a.comment }, "Could not determine repository");
    process.exit(0);
  }

  const body = buildBody({ ...a, comment: a.comment });
  const create = runGh([
    "issue",
    "create",
    "--repo",
    repo,
    "--title",
    a.title,
    "--body",
    body,
    "--label",
    "squad:copilot",
  ]);

  if (!create.ok) {
    writeFallback(
      { ...a, title: a.title, comment: a.comment },
      create.err.trim() || create.out.trim() || "Issue creation failed"
    );
    process.exit(0);
  }

  console.log("Issue created and routed with `squad:copilot`.");
  console.log(create.out.trim());
}

main();
