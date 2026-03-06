#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import {
  appendHistory,
  buildIssueBody,
  createTaskFromArgs,
  formatTaskSummary,
  parseArgs,
  parseIssueNumber,
  persistTaskArtifacts,
  printUsage,
  readTaskFromFile,
  writeFallbackArtifacts,
} from "./agentation-flow.mjs";

function gh(args) {
  const res = spawnSync("gh", args, { encoding: "utf8" });
  return { ok: res.status === 0, out: res.stdout || "", err: res.stderr || "" };
}

function currentRepo() {
  const res = gh(["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"]);
  return res.ok ? res.out.trim() : "";
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) {
    printUsage("node .squad/scripts/agentation-issue.mjs");
    process.exit(0);
  }

  const args = parseArgs(argv);
  let task = args.replayTask
    ? appendHistory(readTaskFromFile(args.replayTask), "replayed", `Retry requested from ${args.replayTask}.`)
    : null;

  if (!task) {
    if (!args.title || !args.comment) {
      printUsage("node .squad/scripts/agentation-issue.mjs");
      console.error("Error: --title and --comment are required unless --replay-task is used.");
      process.exit(1);
    }

    task = createTaskFromArgs(args);
  }

  if (args.repo) {
    task = {
      ...task,
      routing: {
        ...task.routing,
        repo: args.repo,
      },
    };
  }

  task = persistTaskArtifacts(task);

  if (args.dryRun) {
    task = persistTaskArtifacts(
      appendHistory(task, "dry-run", "Dry run requested; skipped GitHub issue creation."),
    );
    console.log("Dry run complete. No GitHub mutation performed.");
    console.log(formatTaskSummary(task));
    console.log(`Task contract: ${task.routing.taskFile}`);
    console.log(`Flow log: ${task.routing.logFile}`);
    process.exit(0);
  }

  const auth = gh(["auth", "status"]);
  if (!auth.ok) {
    task = writeFallbackArtifacts(task, "`gh auth status` failed");
    console.log(`GitHub unavailable. Wrote fallback task: ${task.routing.fallbackFile}`);
    console.log(`Task contract: ${task.routing.taskFile}`);
    console.log(`Flow log: ${task.routing.logFile}`);
    process.exit(0);
  }

  const repo = task.routing.repo || currentRepo();
  if (!repo) {
    task = writeFallbackArtifacts(task, "Could not determine GitHub repository");
    console.log(`GitHub unavailable. Wrote fallback task: ${task.routing.fallbackFile}`);
    console.log(`Task contract: ${task.routing.taskFile}`);
    console.log(`Flow log: ${task.routing.logFile}`);
    process.exit(0);
  }

  task = persistTaskArtifacts({
    ...task,
    routing: {
      ...task.routing,
      repo,
    },
  });

  const created = gh([
    "issue",
    "create",
    "--repo",
    repo,
    "--title",
    task.title,
    "--body",
    buildIssueBody(task),
    "--label",
    task.triage.label,
  ]);

  if (!created.ok) {
    task = writeFallbackArtifacts(task, created.err.trim() || created.out.trim() || "Issue creation failed");
    console.log(`GitHub unavailable. Wrote fallback task: ${task.routing.fallbackFile}`);
    console.log(`Task contract: ${task.routing.taskFile}`);
    console.log(`Flow log: ${task.routing.logFile}`);
    process.exit(0);
  }

  const issueUrl = created.out.trim();
  task = persistTaskArtifacts(
    appendHistory(
      {
        ...task,
        routing: {
          ...task.routing,
          issueUrl,
          issueNumber: parseIssueNumber(issueUrl),
        },
      },
      "github-routed",
      `Created GitHub issue with label ${task.triage.label}.`,
    ),
  );

  console.log(`Issue created and routed with \`${task.triage.label}\`.`);
  console.log(issueUrl);
  console.log(`Task contract: ${task.routing.taskFile}`);
  console.log(`Flow log: ${task.routing.logFile}`);
}

main();
