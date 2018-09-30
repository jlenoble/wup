import gulp from 'gulp';
import exec from './helpers/exec';
import cleanUp from './helpers/cleanup';

function dockerStart (cb) {
  exec('docker-compose start', cb);
  cleanUp(dockerStop);
}

function dockerStop (cb) {
  console.log('\nStopping services...');
  exec('docker-compose stop', cb);
}

gulp.task('docker', gulp.series(dockerStart));
