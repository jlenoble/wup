import {default as originalCleanUp} from 'node-cleanup';
import fs from 'fs';
import path from 'path';
import exec from './exec';
import {execSync} from 'child_process';
import {buildDir} from './dirs';

const handlers = new Set();
const called = new WeakSet();

export default function cleanUp (handler) {
  if (handlers.has(handler)) {
    return;
  }

  handlers.add(handler);

  originalCleanUp(function (exitCode, signal) {
    const exit = false; // Exit explicitly and only if last child, see below

    if (!signal) { // Nothing to do
      return exit;
    }

    if (!handlers.has(handler)) { // Cleanup for handler is complete
      return exit;
    }

    handler(exitOnlyIfLastChild(signal, handler));

    return exit;
  });
}

function exitOnlyIfLastChild (signal, handler) {
  if (called.has(handler)) { // Cleanup already called for handler
    return;
  }

  called.add(handler); // Don't call handler twice

  return function (err) {
    if (err) {
      console.error(err);
    }

    handlers.delete(handler); // Don't call handler again

    if (!handlers.size) {
      originalCleanUp.uninstall(); // don't call cleanup handlers again
      unlock(); // Delete lock files on disc

      // calling process.exit() won't inform parent process of signal
      process.kill(process.pid, signal);
    }
  }
}

function lock (cb) {
  const lockFile = path.join(process.cwd(), buildDir,
    `.lock-gulp-tdd-${process.pid}`);
  exec(`touch ${lockFile}`, cb);
}

function unlock (cb) {
  const lockFiles = path.join(process.cwd(), buildDir,
    `.lock-gulp-tdd-*`);
  exec(`rm ${lockFiles}`, cb);
}

function getLockFiles () {
  return execSync(`ls -al ${path.join(process.cwd(), buildDir)} | grep ${
    '.lock-gulp-tdd'}`)
  .toString()
  .split(/[ \t\r\n]+/)
  .filter(str => {
    return /^\.lock-gulp-tdd-\d+$/.test(str);
  });
}

function isTopProcess () {
  try {
    fs.statSync(path.join(process.cwd(), buildDir,
      `.lock-gulp-tdd-${process.ppid}`));
    return false;
  } catch (e) {
    return true;
  }
}

function keepAlive (cb) {
  if (isTopProcess()) {
    const lockFiles = getLockFiles();
    const childLockFile = lockFiles[lockFiles.length - 1];

    let t0 = Date.now();
    let n = 1;

    while (1) {
      if (Date.now() - t0 > n * 500) {
        try {
          fs.statSync(path.join(process.cwd(), buildDir, childLockFile));
        } catch (e) {
          break; // Child process has returned
        }
        n++;
      }

      if (Date.now() - t0 > 30000) {
        break; // Child process is taking too long to clean up
      }
    }
  }

  cb();
}

export function keepTopProcessAliveTillAutoTaskExits () {
  lock();
  cleanUp(keepAlive);
}
