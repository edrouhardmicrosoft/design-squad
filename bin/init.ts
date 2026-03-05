#!/usr/bin/env node

import { existsSync, cpSync, statSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { execSync } from "child_process";

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";

const ITEMS_TO_COPY = [".squad", ".squad-templates", "squad.config.ts"];
const REQUIRED_WORKFLOWS = ["sync-squad-labels.yml", "squad-triage.yml", "squad-issue-assign.yml", "squad-heartbeat.yml"];

function log(msg: string) {
  console.log(msg);
}

function success(msg: string) {
  log(`${GREEN}✓${RESET} ${msg}`);
}

function warn(msg: string) {
  log(`${YELLOW}⚠${RESET} ${msg}`);
}

function info(msg: string) {
  log(`${CYAN}ℹ${RESET} ${msg}`);
}

function getTemplatesDir(): string {
  // Templates are bundled alongside this script in ../templates/
  return resolve(__dirname, "..", "templates");
}

function runCommand(cmd: string): { ok: boolean; out: string } {
  try {
    const out = execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
    return { ok: true, out };
  } catch {
    return { ok: false, out: "" };
  }
}

function upsertPackageScript(targetDir: string, scriptName: string, scriptValue: string): boolean {
  const packageJsonPath = join(targetDir, "package.json");
  if (!existsSync(packageJsonPath)) {
    warn("No package.json found - skipping npm script wiring");
    return false;
  }

  try {
    const raw = readFileSync(packageJsonPath, "utf8");
    const parsed = JSON.parse(raw) as { scripts?: Record<string, string> };
    parsed.scripts = parsed.scripts || {};

    if (parsed.scripts[scriptName] === scriptValue) {
      return false;
    }

    parsed.scripts[scriptName] = scriptValue;
    writeFileSync(packageJsonPath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
    return true;
  } catch {
    warn("Could not update package.json scripts automatically");
    return false;
  }
}

function scaffoldWorkflows(templatesDir: string, targetDir: string, force: boolean): number {
  const srcDir = join(templatesDir, ".squad-templates", "workflows");
  const destDir = join(targetDir, ".github", "workflows");

  if (!existsSync(srcDir)) {
    warn("Workflow templates not found - skipping .github/workflows scaffolding");
    return 0;
  }

  mkdirSync(destDir, { recursive: true });
  let copied = 0;

  for (const file of REQUIRED_WORKFLOWS) {
    const src = join(srcDir, file);
    const dest = join(destDir, file);
    if (!existsSync(src)) continue;

    if (copyItem(src, dest, `.github/workflows/${file}`, force)) {
      copied++;
    }
  }

  return copied;
}

function doctor(targetDir: string): number {
  let issues = 0;
  log("");
  log(`${CYAN}🩺 Design Squad Doctor${RESET}`);
  log(`${DIM}Checking Agentation -> Copilot workflow readiness in ${targetDir}${RESET}`);

  const hasGh = runCommand("gh --version").ok;
  if (!hasGh) {
    warn("gh CLI not found (GitHub issue automation unavailable; fallback files still work)");
    issues++;
  } else {
    success("gh CLI found");
    if (runCommand("gh auth status").ok) {
      success("gh auth is valid");
    } else {
      warn("gh is not authenticated (run `gh auth login`)");
      issues++;
    }
  }

  const skillPath = join(targetDir, ".squad", "skills", "agentation-mcp", "SKILL.md");
  if (existsSync(skillPath)) {
    success("Agentation skill scaffolded");
  } else {
    warn("Missing .squad/skills/agentation-mcp/SKILL.md");
    issues++;
  }

  const packageJsonPath = join(targetDir, "package.json");
  let scriptWired = false;
  const scriptPath = join(targetDir, ".squad", "scripts", "agentation-issue.mjs");
  if (existsSync(scriptPath)) {
    scriptWired = true;
  }

  if (existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { scripts?: Record<string, string> };
      const issueScript = pkg.scripts?.["agentation:issue"] || "";
      if (issueScript) {
        success("package.json contains agentation:issue script");
        if (issueScript.includes(".squad/scripts/agentation-issue.mjs") || issueScript.includes("bin/agentation-issue.ts")) {
          scriptWired = true;
        }
      } else {
        warn("package.json missing agentation:issue script");
        issues++;
      }
    } catch {
      warn("Could not parse package.json for script validation");
      issues++;
    }
  } else {
    warn("No package.json found; run bridge as `node .squad/scripts/agentation-issue.mjs ...`");
  }

  if (scriptWired) {
    success("Agentation issue bridge script wiring detected");
  } else {
    warn("Missing Agentation issue bridge script wiring");
    issues++;
  }

  const workflowsDir = join(targetDir, ".github", "workflows");
  for (const wf of REQUIRED_WORKFLOWS) {
    if (existsSync(join(workflowsDir, wf))) {
      success(`workflow present: ${wf}`);
    } else {
      warn(`missing workflow: .github/workflows/${wf}`);
      issues++;
    }
  }

  const repo = runCommand("gh repo view --json nameWithOwner --jq .nameWithOwner");
  if (repo.ok && repo.out) {
    const secretCheck = runCommand(`gh secret list --repo ${repo.out}`);
    if (secretCheck.ok) {
      if (secretCheck.out.includes("COPILOT_ASSIGN_TOKEN")) {
        success("COPILOT_ASSIGN_TOKEN secret found");
      } else {
        warn("COPILOT_ASSIGN_TOKEN secret not found (Copilot auto-assignment may fail)");
        issues++;
      }
    }
  }

  log("");
  if (issues === 0) {
    success("Doctor checks passed");
  } else {
    warn(`Doctor found ${issues} issue(s)`);
    info("Workflow still works with fallback files when GitHub is unavailable.");
  }
  log("");

  return issues;
}

function copyItem(src: string, dest: string, name: string, force: boolean): boolean {
  if (existsSync(dest) && !force) {
    warn(`${name} already exists — skipping (use --force to overwrite)`);
    return false;
  }

  const srcStat = statSync(src);
  if (srcStat.isDirectory()) {
    cpSync(src, dest, { recursive: true, force });
  } else {
    cpSync(src, dest, { force });
  }
  success(`${name}`);
  return true;
}

function checkSquadCli(): boolean {
  try {
    execSync("npx squad --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function printUsage() {
  log(`
${CYAN}design-squad${RESET} — Drop a design team into any project

${DIM}Usage:${RESET}
  npx github:your-org/design-squad init [--force]
  npx github:your-org/design-squad doctor

${DIM}Options:${RESET}
  --force    Overwrite existing files
  --help     Show this help message
`);
}

function run() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  const command = args.find((a) => !a.startsWith("-")) ?? "init";
  const force = args.includes("--force") || args.includes("-f");

  if (command === "doctor") {
    const issues = doctor(process.cwd());
    process.exit(issues === 0 ? 0 : 1);
  }

  if (command !== "init") {
    log(`Unknown command: ${command}`);
    printUsage();
    process.exit(1);
  }

  const templatesDir = getTemplatesDir();
  const targetDir = process.cwd();

  if (!existsSync(templatesDir)) {
    log(`Error: Templates directory not found at ${templatesDir}`);
    process.exit(1);
  }

  log("");
  log(`${CYAN}🎨 Design Squad Init${RESET}`);
  log(`${DIM}Scaffolding into ${targetDir}${RESET}`);
  log("");

  let copied = 0;
  for (const item of ITEMS_TO_COPY) {
    const src = join(templatesDir, item);
    const dest = join(targetDir, item);
    if (existsSync(src)) {
      if (copyItem(src, dest, item, force)) copied++;
    } else {
      warn(`${item} not found in templates — skipping`);
    }
  }

  log("");

  if (copied === 0) {
    info("Nothing to do — all files already exist. Use --force to overwrite.");
  } else {
    success(`Scaffolded ${copied} item(s)`);
  }

  const workflowCount = scaffoldWorkflows(templatesDir, targetDir, force);
  if (workflowCount > 0) {
    success(`Scaffolded ${workflowCount} workflow file(s)`);
  }

  if (upsertPackageScript(targetDir, "agentation:issue", "node .squad/scripts/agentation-issue.mjs")) {
    success("Wired package.json script: agentation:issue");
  }

  if (upsertPackageScript(targetDir, "agentation:issue:help", "node .squad/scripts/agentation-issue.mjs --help")) {
    success("Wired package.json script: agentation:issue:help");
  }

  // Check for Squad CLI
  if (!checkSquadCli()) {
    log("");
    info("Squad CLI not found. Install it with:");
    log(`  ${DIM}npm install -g @bradygaster/squad-cli${RESET}`);
    log(`  ${DIM}# or add as a dev dependency:${RESET}`);
    log(`  ${DIM}npm install --save-dev @bradygaster/squad-cli${RESET}`);
  }

  log("");
  info("Run readiness checks:");
  log(`  ${DIM}npx github:your-org/design-squad doctor${RESET}`);
  log("");
  info("Create Copilot-routed issue from Agentation feedback:");
  log(`  ${DIM}npm run agentation:issue -- --title "Fix X" --comment "Y"${RESET}`);

  log("");
  info("Ready! Run your squad with:");
  log(`  ${DIM}npx squad${RESET}`);
  log("");
}

run();
