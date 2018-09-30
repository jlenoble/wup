import cleanUp from 'node-cleanup';

const handlers = new Set();

export default function (handler) {
  if (handlers.has(handler)) {
    return;
  }

  handlers.add(handler);

  cleanUp(function (exitCode, signal) {
    if (!signal) { // Nothing to do
      return;
    }

    if (!handlers.has(handler)) { // Cleanup already called for handler
      return;
    }

    handlers.delete(handler); // Don't call handler twice

    handler(exitOnlyIfLastChild(signal));

    return false; // Don't exit yet
  });
}

function exitOnlyIfLastChild (signal) {
  return function (err) {
    if (err) {
      console.error(err);
    }

    if (!handlers.size) {
      cleanUp.uninstall(); // don't call cleanup handlers again

      // calling process.exit() won't inform parent process of signal
      process.kill(process.pid, signal);
    }
  }
}
