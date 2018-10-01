import gulp from 'gulp';
import newer from 'gulp-newer';
import path from 'path';
import {utilDir} from './helpers/dirs';
import {thisMonthDir} from './helpers/autonaming';
import {repeatEveryDay} from './helpers/repeat';

const utilGlob = path.join(utilDir, '*.js');

function copyUtil () {
  const dest = thisMonthDir();

  return gulp.src(utilGlob, {base: utilDir})
    .pipe(newer(dest))
    .pipe(gulp.dest(dest));
}

function watchUtil (done) {
  gulp.watch(utilGlob, copyUtil);
  done();
}

gulp.task('copy:util', gulp.series(copyUtil, watchUtil,
  repeatEveryDay(copyUtil, 'Stopping auto util...')));
