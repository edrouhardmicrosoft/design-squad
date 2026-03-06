#!/usr/bin/env node

import { spawnSync } from "child_process";
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
} from "./agentation-flow.ts";

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

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) {
    printUsage("bun run agentation:issue");
    process.exit(0);
  }

  const args = parseArgs(argv);
  let task = args.replayTask
    ? appendHistory(readTaskFromFile(args.replayTask), "replayed", `Retry requested from ${args.replayTask}.`)
    : null;

  if (!task) {
    if (!args.title || !args.comment) {
      printUsage("bun run agentation:issue");
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
      appendHistory(task, "dry-run", "Dry run requested; skipped GitHub issue creation.")
    );
    console.log("Dry run complete. No GitHub mutation performed.");
    console.log(formatTaskSummary(task));
    console.log(`Task contract: ${task.routing.taskFile}`);
    console.log(`Flow log: ${task.routing.logFile}`);
    process.exit(0);
  }

  const auth = runGh(["auth", "status"]);
  if (!auth.ok) {
    task = writeFallbackArtifacts(task, "`gh auth status` failed");
    console.log(`GitHub unavailable. Wrote fallback task: ${task.routing.fallbackFile}`);
    console.log(`Task contract: ${task.routing.taskFile}`);
    console.log(`Flow log: ${task.routing.logFile}`);
    process.exit(0);
  }

  const repo = task.routing.repo || currentRepo();
  if (!repo) {
    task = writeFallbackArtifacts(task, "Could not determine repository");
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

  const create = runGh([
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

  if (!create.ok) {
    task = writeFallbackArtifacts(task, create.err.trim() || create.out.trim() || "Issue creation failed");
    console.log(`GitHub unavailable. Wrote fallback task: ${task.routing.fallbackFile}`);
    console.log(`Task contract: ${task.routing.taskFile}`);
    console.log(`Flow log: ${task.routing.logFile}`);
    process.exit(0);
  }

  const issueUrl = create.out.trim();
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
      `Created GitHub issue with label ${task.triage.label}.`
    )
  );

  console.log(`Issue created and routed with \`${task.triage.label}\`.`);
  console.log(issueUrl);
  console.log(`Task contract: ${task.routing.taskFile}`);
  console.log(`Flow log: ${task.routing.logFile}`);
}

main();
