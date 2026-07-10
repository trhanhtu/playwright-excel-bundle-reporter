import { spawnSync } from 'node:child_process';

const result = spawnSync('npx', ['tsc', '-p', 'tsconfig.json'], {
  stdio: 'inherit',
  shell: true,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
