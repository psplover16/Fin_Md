import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultPagesWorktreeDir = '.gh-pages-worktree';

export function resolvePublishTarget(value) {
  if (value === 'staging') {
    return {
      name: 'staging',
      destinationSubdir: 'staging',
      commitMessage: 'Deploy staging site'
    };
  }

  if (value === 'production') {
    return {
      name: 'production',
      destinationSubdir: '.',
      commitMessage: 'Deploy production site'
    };
  }

  throw new Error(`Unsupported PUBLISH_TARGET: ${value || '(empty)'}`);
}

export function shouldCommitFromPorcelain(output) {
  return output.trim().length > 0;
}

function runGit(args, options = {}) {
  execFileSync('git', args, {
    cwd: options.cwd,
    stdio: options.stdio ?? 'inherit',
    encoding: options.encoding
  });
}

function gitSucceeds(args, cwd) {
  try {
    execFileSync('git', args, {
      cwd,
      stdio: 'ignore'
    });
    return true;
  } catch {
    return false;
  }
}

function copyDirectoryContents(sourceDir, destinationDir) {
  mkdirSync(destinationDir, { recursive: true });

  for (const entry of readdirSync(sourceDir)) {
    cpSync(join(sourceDir, entry), join(destinationDir, entry), { recursive: true });
  }
}

function emptyDirectoryExcept(directory, preservedEntries) {
  mkdirSync(directory, { recursive: true });

  for (const entry of readdirSync(directory)) {
    if (preservedEntries.has(entry)) {
      continue;
    }

    rmSync(join(directory, entry), { recursive: true, force: true });
  }
}

function emptyProductionRoot(pagesDir) {
  emptyDirectoryExcept(pagesDir, new Set(['.git', 'staging']));
}

function writeRootRedirectIfMissing({ pagesDir, destinationSubdir }) {
  if (destinationSubdir === '.' || existsSync(join(pagesDir, 'index.html'))) {
    return;
  }

  const target = destinationSubdir.endsWith('/') ? destinationSubdir : `${destinationSubdir}/`;
  writeFileSync(
    join(pagesDir, 'index.html'),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <title>Redirecting...</title>
    <script>window.location.replace('${target}' + window.location.search + window.location.hash);</script>
  </head>
  <body><a href="${target}">Continue to staging</a></body>
</html>
`
  );
}

export function syncBuildOutput({ distDir, pagesDir, destinationSubdir }) {
  if (!existsSync(distDir)) {
    throw new Error(`Build output not found: ${distDir}`);
  }

  if (destinationSubdir === '.') {
    emptyProductionRoot(pagesDir);
    copyDirectoryContents(distDir, pagesDir);
  } else {
    const destinationDir = join(pagesDir, destinationSubdir);
    rmSync(destinationDir, { recursive: true, force: true });
    copyDirectoryContents(distDir, destinationDir);
  }

  const spaFallback = join(distDir, '404.html');
  if (existsSync(spaFallback)) {
    cpSync(spaFallback, join(pagesDir, '404.html'));
  }

  writeRootRedirectIfMissing({ pagesDir, destinationSubdir });
  writeFileSync(join(pagesDir, '.nojekyll'), '');
}

function preparePagesWorktree({ cwd, pagesDir }) {
  if (gitSucceeds(['ls-remote', '--exit-code', '--heads', 'origin', 'gh-pages'], cwd)) {
    runGit(['fetch', 'origin', 'gh-pages'], { cwd });
  }

  rmSync(pagesDir, { recursive: true, force: true });

  if (gitSucceeds(['rev-parse', '--verify', 'origin/gh-pages'], cwd)) {
    runGit(['worktree', 'add', '--force', '-B', 'gh-pages', pagesDir, 'origin/gh-pages'], { cwd });
    return;
  }

  runGit(['worktree', 'add', '--force', '--detach', pagesDir, 'HEAD'], { cwd });
  runGit(['checkout', '--orphan', 'gh-pages'], { cwd: pagesDir });
  emptyDirectoryExcept(pagesDir, new Set(['.git']));
}

export function publishPages(env = process.env, cwd = process.cwd()) {
  const target = resolvePublishTarget(env.PUBLISH_TARGET);
  const distDir = resolve(cwd, env.DIST_DIR ?? 'dist');
  const pagesDir = resolve(cwd, env.PAGES_WORKTREE_DIR ?? defaultPagesWorktreeDir);

  preparePagesWorktree({ cwd, pagesDir });
  syncBuildOutput({ distDir, pagesDir, destinationSubdir: target.destinationSubdir });

  runGit(['config', 'user.name', env.GIT_AUTHOR_NAME ?? 'github-actions[bot]'], { cwd: pagesDir });
  runGit(['config', 'user.email', env.GIT_AUTHOR_EMAIL ?? '41898282+github-actions[bot]@users.noreply.github.com'], {
    cwd: pagesDir
  });
  runGit(['add', '-A'], { cwd: pagesDir });

  const porcelain = execFileSync('git', ['status', '--porcelain'], {
    cwd: pagesDir,
    encoding: 'utf8'
  });

  if (!shouldCommitFromPorcelain(porcelain)) {
    console.log('No publish diff; skipping gh-pages commit.');
    return { committed: false, target };
  }

  runGit(['commit', '-m', target.commitMessage], { cwd: pagesDir });
  runGit(['push', 'origin', 'HEAD:gh-pages'], { cwd: pagesDir });
  return { committed: true, target };
}

function isCliEntry() {
  return process.argv[1] ? resolve(process.argv[1]) === fileURLToPath(import.meta.url) : false;
}

if (isCliEntry()) {
  publishPages();
}
