import gulp from 'gulp';
import newer from 'gulp-newer';
import path from 'path';
import {utilDir} from './helpers/dirs';
import {thisMonthDir} from './helpers/autonaming';

const utilGlob = path.join(utilDir, '*.js');

function copyUtil () {
  return gulp.src(utilGlob, {lastRun: copyUtil, base: utilDir})
    .pipe(newer(thisMonthDir))
    .pipe(gulp.dest(thisMonthDir));
}

function watchUtil (done) {
  gulp.watch(utilGlob, copyUtil);
  done();
}

gulp.task('copy:util', gulp.series(copyUtil, watchUtil));
