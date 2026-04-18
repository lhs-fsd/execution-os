#!/usr/bin/env node
// Automated deploy-test-and-fix loop
// - Checks deployed site health
// - Applies a minimal set of safe patches if failures are detected
// - Commits and pushes, triggering a new deployment

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DEPLOY_URL = process.env.DEPLOY_URL || 'https://execution-os.vercel.app';

async function testDeployment() {
  try {
    const res = await fetch(DEPLOY_URL, { method: 'GET' });
    if (res.ok) {
      console.log('Deployment test OK:', DEPLOY_URL);
      return true;
    } else {
      console.error('Deployment test failed with status', res.status);
      return false;
    }
  } catch (err) {
    console.error('Deployment test error:', err && err.message ? err.message : err);
    return false;
  }
}

function patchFile(filePath, patchFn) {
  const abs = path.resolve(filePath);
  const original = fs.readFileSync(abs, 'utf8');
  const patched = patchFn(original);
  if (patched && patched !== original) {
    fs.writeFileSync(abs, patched, 'utf8');
    console.log('Patched', abs);
    return true;
  }
  return false;
}

function applyPatches() {
  // 1) In app/waitlist/page.tsx, guard execution_score and use a local score var
  patchFile(
    path.join(__dirname, '..', 'app', 'waitlist', 'page.tsx'),
    (src) => {
      let s = src;
      // Insert score var if missing
      if (!/const\s+score\s*=/.test(s)) {
        s = s.replace(/(const\s+{[^}]+}\s*\n?);?/i, (m) => m); // no-op, preserve
        // Insert after error state line
        s = s.replace(/(const\s+\[error,\s*setError\]\s*=\s*useState\('\'\);)/, `$1\n  // Safely compute score for UI rendering\n  const score = typeof userData?.execution_score === 'number' ? userData!.execution_score : 0;`);
      }
      // Replace rendering line with score-based rendering
      s = s.replace(/\{userData\?\.execution_score[^}]*\}\/100/g, `{score}/100`);
      // Also update the conditional to use score
      s = s.replace(/\(userData\?\n?\.execution_score[^)]*\) > 0/g, `(score) > 0`);
      return s;
    }
  );
  // 2) tsconfig already includes downlevelIteration, but guard if missing
  patchFile(
    path.join(__dirname, '..', 'tsconfig.json'),
    (src) => {
      if (!/"downlevelIteration"/.test(src)) {
        return src.replace(/"compilerOptions": \{/ , '"compilerOptions": {\n    "downlevelIteration": true,');
      }
      return src;
    }
  );
}

async function run() {
  const ok = await testDeployment();
  if (ok) {
    console.log('Automated test pass. No changes required.');
    process.exit(0);
  }
  console.log('Attempting auto-fixes...');
  applyPatches();
  // Commit changes if any
  try {
    execSync('git add -A');
    const status = execSync('git diff --staged --name-only').toString().trim();
    const hasChanges = status.length > 0;
    if (hasChanges) {
      execSync('git commit -m "auto: apply test-fix patches"', { stdio: 'inherit' });
      execSync('git push', { stdio: 'inherit' });
      console.log('Pushed fixes to remote.');
    } else {
      console.log('No changes detected to commit.');
    }
  } catch (err) {
    console.error('Git operation failed:', err && err.message ? err.message : err);
  }
  // After pushing, a new deployment will occur. Re-run test in a loop could be external (CI); here we exit with non-zero to indicate failure
  process.exit(1);
}

run();
