import { spawnSync } from 'node:child_process';

const build = spawnSync('node', ['scripts/build.mts'], { stdio: 'inherit', shell: true });
if (build.status !== 0) {
  process.exit(build.status ?? 1);
}
