#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";

function parseArgs(argv) {
  const out = {
    title: "",
    comment: "",
    component: "",
    page: "",
    session: "",
    selector: "",
    screenshot: "",
    repo: "",
    fallbackFile: "",
  };

  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    const val = argv[i + 1];
    if (key === "--title") {
      out.title = val || "";
      i++;
    } else if (key === "--comment") {
      out.comment = val || "";
      i++;
    } else if (key === "--component") {
      out.component = val || "";
      i++;
    } else if (key === "--page") {
      out.page = val || "";
      i++;
    } else if (key === "--session") {
      out.session = val || "";
      i++;
    } else if (key === "--selector") {
      out.selector = val || "";
      i++;
    } else if (key === "--screenshot") {
      out.screenshot = val || "";
      i++;
    } else if (key === "--repo") {
      out.repo = val || "";
      i++;
    } else if (key === "--fallback-file") {
      out.fallbackFile = val || "";
      i++;
    }
  }

  return out;
}

function usage() {
  console.log(`\nUsage:\n  node .squad/scripts/agentation-issue.mjs --title "Fix nav overlap" --comment "Header overlaps logo"\n\nOptional:\n  --component Header --page /home --session session-id\n  --selector ".site-nav" --screenshot "https://..."\n  --repo owner/repo\n  --fallback-file .squad/agentation-fallback/task.md\n`);
}

function gh(args) {
  const res = spawnSync("gh", args, { encoding: "utf8" });
  return { ok: res.status === 0, out: res.stdout || "", err: res.stderr || "" };
}

function currentRepo() {
  const res = gh(["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"]);
  return res.ok ? res.out.trim() : "";
}

function body(a) {
  return [
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
  ].join("\n");
}

function writeFallback(a, reason) {
  const file = a.fallbackFile || `.squad/agentation-fallback/${Date.now()}-${(a.title || "task").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}.md`;
  const abs = resolve(process.cwd(), file);
  mkdirSync(dirname(abs), { recursive: true });

  const content = [
    `# Agentation Feedback (GitHub fallback)`,
    "",
    `- Reason: ${reason}`,
    `- Created: ${new Date().toISOString()}`,
    "",
    `## Title`,
    a.title,
    "",
    `## Comment`,
    a.comment,
    "",
    `## Context`,
    `- Component: ${a.component || "(not provided)"}`,
    `- Page: ${a.page || "(not provided)"}`,
    `- Session: ${a.session || "(not provided)"}`,
    `- Selector: ${a.selector || "(not provided)"}`,
    `- Screenshot: ${a.screenshot || "(not provided)"}`,
    "",
    "## Next Step",
    "Create a GitHub issue with label `squad:copilot` for full workflow automation.",
  ].join("\n");

  writeFileSync(abs, content, "utf8");
  console.log(`GitHub unavailable. Wrote fallback task: ${file}`);
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) {
    usage();
    process.exit(0);
  }

  const a = parseArgs(argv);
  if (!a.title || !a.comment) {
    usage();
    console.error("Error: --title and --comment are required.");
    process.exit(1);
  }

  const auth = gh(["auth", "status"]);
  if (!auth.ok) {
    writeFallback(a, "`gh auth status` failed");
    process.exit(0);
  }

  const repo = a.repo || currentRepo();
  if (!repo) {
    writeFallback(a, "Could not determine GitHub repository");
    process.exit(0);
  }

  const created = gh([
    "issue",
    "create",
    "--repo",
    repo,
    "--title",
    a.title,
    "--body",
    body(a),
    "--label",
    "squad:copilot",
  ]);

  if (!created.ok) {
    writeFallback(a, created.err.trim() || "Issue creation failed");
    process.exit(0);
  }

  console.log("Issue created and routed with `squad:copilot`.");
  console.log(created.out.trim());
}

main();
