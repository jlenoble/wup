import gulp from 'gulp';
import {spawn} from 'child_process';
import {interceptMessage} from 'child-process-data';
import cleanUp from './helpers/cleanup';
import exec from './helpers/exec';
import {jupyterStarted, tokenAccepted} from './helpers/regex';

let p;

function jupyterStart (cb) {
  p = spawn('jupyter', ['notebook']);

  interceptMessage(p, jupyterStarted);
  interceptMessage(p, tokenAccepted, {silent: true});

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
