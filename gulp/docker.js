import gulp from 'gulp';
import {exec} from 'child_process';
import cleanUp from 'node-cleanup';

const echo = cb => (err, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  cb(err);
}

let p;

function dockerStart (cb) {
  p = exec('docker-compose start', echo(cb));
}

function dockerStop (cb) {
  if (p) {
    console.log('\nStopping services...');
    exec('docker-compose stop', echo(cb));
  } else {
    exec('docker-compose stop', err => {
      console.log('');
      cb(err);
    });
  }
}

cleanUp(function (exitCode, signal) {
  if (signal) {
    dockerStop(function done() {
      // calling process.exit() won't inform parent process of signal
      process.kill(process.pid, signal);
    });

    cleanUp.uninstall(); // don't call cleanup handler again

    return false;
  }
});

gulp.task('docker', gulp.series(dockerStart));
