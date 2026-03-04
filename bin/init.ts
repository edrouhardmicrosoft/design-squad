#!/usr/bin/env node

import { existsSync, cpSync, mkdirSync, readdirSync, statSync } from "fs";
import { join, resolve, relative } from "path";
import { execSync } from "child_process";

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";

const ITEMS_TO_COPY = [".squad", ".squad-templates", "squad.config.ts"];

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

  // Check for Squad CLI
  if (!checkSquadCli()) {
    log("");
    info("Squad CLI not found. Install it with:");
    log(`  ${DIM}npm install -g @bradygaster/squad-cli${RESET}`);
    log(`  ${DIM}# or add as a dev dependency:${RESET}`);
    log(`  ${DIM}npm install --save-dev @bradygaster/squad-cli${RESET}`);
  }

  log("");
  info("Ready! Run your squad with:");
  log(`  ${DIM}npx squad${RESET}`);
  log("");
}

run();
