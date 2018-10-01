import cleanUp from './cleanup';
import {thisMidnight, safeNow} from './autonaming';

export default function repeatFactory (start, interval, run, stopMessage) {
  return function repeatAtFixedInterval (cb) {
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

  return repeatFactory(start, interval, run, stopMessage);
}
