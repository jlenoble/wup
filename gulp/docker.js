import gulp from 'gulp';
import {exec} from 'child_process';
import cleanUp from './helpers/cleanup';

const echo = cb => (err, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  cb(err);
}

function dockerStart (cb) {
  exec('docker-compose start', echo(cb));
  cleanUp(dockerStop);
}

function dockerStop (cb) {
  console.log('\nStopping services...');
  exec('docker-compose stop', echo(cb));
}

gulp.task('docker', gulp.series(dockerStart));
