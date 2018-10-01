import cleanUp from './cleanup';
import {thisMidnight, safeNow} from './autonaming';

export default function repeatFactory (start, interval, run, stopMessage) {
  return function (cb) {
    function repeat () {
      const id = setInterval(run, interval);

      cleanUp(function (cb) {
        if (stopMessage) {
          console.log(stopMessage);
        }
        clearInterval(id);
        cb();
      });
    }

    setTimeout(function () {
      run();
      repeat();
    }, start);

    cb();
  };
}

export function repeatEveryDay (run, stopMessage) {
  const start = thisMidnight() - safeNow();
  const interval = 24 * 3600 * 1000;

  const fn = repeatFactory(start, interval, run, stopMessage);

  Object.defineProperty(fn, 'name', {value: 'repeatEveryDay' +
    run.name[0].toUpperCase() + run.name.slice(1)});

  return fn;
}
