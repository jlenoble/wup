import gulp from 'gulp';
import {spawn} from 'child_process';
import cleanUp from './helpers/cleanup';
import exec from './helpers/exec';

let p;

function jupyterStart (cb) {
  p = spawn('jupyter', ['notebook', '--debug'], {stdio: 'inherit'});
  cleanUp(jupyterStop);
  cb();
}

function jupyterStop (cb) {
  console.log('\nStopping Jupyter...');
  if (p) {
    exec(`yes | kill ${p.pid}`, cb);
  } else {
    cb();
  }
}

gulp.task('jupyter', gulp.series(jupyterStart));
