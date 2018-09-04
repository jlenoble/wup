import gulp from 'gulp';
import newer from 'gulp-newer';
import moment from 'moment';
import path from 'path';
import {utilDir, logDir} from './helpers/dirs';

const utilGlob = path.join(utilDir, '*.js');

const thisMonth = moment().format('YYYY/MM');
const thisMonthDir = path.join(logDir, thisMonth);

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
