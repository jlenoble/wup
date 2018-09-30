import gulp from 'gulp';
import {exec} from 'child_process';
import cleanUp from './helpers/cleanup';

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

cleanUp(dockerStop);

gulp.task('docker', gulp.series(dockerStart));
