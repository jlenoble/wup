import gulp from 'gulp';
import tap from 'gulp-tap';
import concat from 'gulp-concat';
import exec from 'gulp-exec';
import newer from 'gulp-newer';
import path from 'path';
import destglob from 'destglob';
import {Buffer} from 'buffer';
import {spawn} from 'child_process';

import {buildDir} from './helpers/dirs';

const ipynbGlob = ['**/*.ipynb', '!node_modules/**/*', '!.git/**/*',
  '!build/**/*', '!gulp/**/*'];

function convertNotebooks () {
  const options = {
    continueOnError: false, // default = false, true means don't emit error event
    pipeStdout: false, // default = false, true means stdout is written to file.contents
    outputDir: dirname => path.join(process.cwd(), ...destglob(
      dirname, buildDir)),
  };
  const reportOptions = {
    err: true, // default = true, false means don't write err
  	stderr: true, // default = true, false means don't write stderr
  	stdout: true // default = true, false means don't write stdout
  };

  return gulp.src(ipynbGlob, {lastRun: convertNotebooks})
    .pipe(newer({
      dest: buildDir,
      ext: '.js',
    }))
    .pipe(newer({
      dest: buildDir,
      ext: '.py',
    }))
    .pipe(exec('jupyter nbconvert --to script --output-dir ' +
      '"<%= options.outputDir(file.dirname) %>" "<%= file.path %>"', options))
    .pipe(exec.reporter(reportOptions));
}

function watchNotebooks (done) {
  gulp.watch(ipynbGlob, convertNotebooks);
  done();
}

gulp.task('notebooks', gulp.series(convertNotebooks, watchNotebooks));
