import gulp from 'gulp';
import tap from 'gulp-tap';
import exec from 'gulp-exec';
import filter from 'gulp-filter';
import newer from 'gulp-newer';
import path from 'path';
import destglob from 'destglob';
import {buildDir} from './helpers/dirs';
import {transpilePipe} from './helpers/pipes';

const ipynbGlob = ['**/*.ipynb', '!node_modules/**/*', '!.git/**/*',
  '!build/**/*', '!gulp/**/*'];

const notebooks = new Set();

function convertNotebooks () {
  const options = {
    continueOnError: false, // default = false, true means don't emit error event
    pipeStdout: false, // default = false, true means stdout is written to file.contents
    outputName: name => path.join(process.cwd(), ...destglob(name, buildDir)),
  };
  const reportOptions = {
    err: true, // default = true, false means don't write err
  	stderr: true, // default = true, false means don't write stderr
  	stdout: true // default = true, false means don't write stdout
  };

  return gulp.src(ipynbGlob, {lastRun: convertNotebooks})
    .pipe(tap(function (file) {
      notebooks.add(options.outputName(file.path));
    }))
    .pipe(newer({
      dest: buildDir,
      ext: '.js',
    }))
    .pipe(newer({
      dest: buildDir,
      ext: '.py',
    }))
    .pipe(exec('jupyter nbconvert --to script --output-dir ' +
      '"<%= options.outputName(file.dirname) %>" "<%= file.path %>"', options))
    .pipe(exec.reporter(reportOptions));
}

function transpileNotebooks () {
  const glob = Array.from(notebooks).map(file => file.replace(/\.ipynb$/,
    '.*'));
  const f = filter('**/*.js', {restore: true, passthrough: false});

  const stream = gulp.src(glob, {lastRun: transpileNotebooks, cwd: buildDir,
    base: buildDir})
    .pipe(newer('.'))
    .pipe(f)
    .pipe(transpilePipe.plugin())
    .pipe(gulp.dest('.'));

  f.restore.pipe(gulp.dest('.'));

  return stream;
}

function watchNotebooks (done) {
  gulp.watch(ipynbGlob, convertNotebooks);

  const glob = Array.from(notebooks).map(file => file.replace(/\.ipynb$/,
    '.*'));
  gulp.watch(glob, transpileNotebooks);

  done();
}

gulp.task('notebooks', gulp.series(convertNotebooks, transpileNotebooks,
  watchNotebooks));
