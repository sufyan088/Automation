const path = require('path');
const { spawnSync } = require('child_process');
const orderedModules = require('./camp-server-modules');

const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
const extraArgs = process.argv.slice(2);

function resolveCommand(command) {
  if (!isWindows) {
    return command;
  }

  if (command === 'npx') {
    return 'npx.cmd';
  }

  return command;
}

function quoteForCmd(value) {
  const stringValue = String(value);
  return `"${stringValue.replace(/(\\*)"/g, '$1$1\\"').replace(/(\\+)$/g, '$1$1')}"`;
}

function buildCmdCommandLine(command, args) {
  const formattedArgs = (args || [])
    .map((arg) => (/^[A-Za-z0-9_./:=\\-]+$/.test(String(arg)) ? String(arg) : quoteForCmd(arg)))
    .join(' ');
  return formattedArgs ? `${command} ${formattedArgs}` : command;
}

function runModule(modulePath) {
  const command = resolveCommand('npx');
  const args = ['playwright', 'test', modulePath, '--workers=1', ...extraArgs];
  const spawnCommand = isWindows && command.toLowerCase().endsWith('.cmd')
    ? 'cmd.exe'
    : command;
  const finalArgs = isWindows && command.toLowerCase().endsWith('.cmd')
    ? ['/d', '/s', '/c', buildCmdCommandLine(command, args)]
    : args;
  const result = spawnSync(spawnCommand, finalArgs, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
  });

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