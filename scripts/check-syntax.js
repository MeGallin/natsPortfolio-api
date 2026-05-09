const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const roots = ['server.js', 'config', 'controllers', 'middleware', 'models', 'routes', 'utils', 'tests'];

const files = roots.flatMap((root) => {
  const rootPath = path.join(process.cwd(), root);

  if (!fs.existsSync(rootPath)) {
    return [];
  }

  const stat = fs.statSync(rootPath);
  if (stat.isFile()) {
    return [rootPath];
  }

  return fs
    .readdirSync(rootPath)
    .filter((file) => file.endsWith('.js'))
    .map((file) => path.join(rootPath, file));
});

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}
