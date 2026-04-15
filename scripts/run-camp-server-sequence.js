const path = require('path');
const { spawnSync } = require('child_process');
const orderedModules = require('./camp-server-modules');

const rootDir = path.resolve(__dirname, '..');
const extraArgs = process.argv.slice(2);

function runModule(modulePath) {
  const result = spawnSync(
    'npx',
    ['playwright', 'test', modulePath, '--workers=1', ...extraArgs],
    {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true,
    }
  );

  if (typeof result.status === 'number') {
    return result.status;
  }

  return 1;
}

function main() {
  for (const modulePath of orderedModules) {
    console.log(`\n[Camp Server Sequence] Running ${modulePath}`);
    const exitCode = runModule(modulePath);
    if (exitCode !== 0) {
      process.exit(exitCode);
    }
  }
}

main();