import gulp from 'gulp';
import newer from 'gulp-newer';
import rename from 'gulp-rename';
import path from 'path';
import exec from './helpers/exec';
import cleanUp from './helpers/cleanup';
import {templateDir} from './helpers/dirs';
import {thisMonthDir, todayNotebook} from './helpers/autonaming';

const notebookTemplateGlob = path.join(templateDir, 'today.ipynb');

function createTodayNotebook () {
  return gulp.src(notebookTemplateGlob, {lastRun: createTodayNotebook,
    base: templateDir})
    .pipe(newer(todayNotebook))
    .pipe(rename(path.basename(todayNotebook)))
    .pipe(gulp.dest(thisMonthDir));
}

function repeatEveryDay (cb) {

}

gulp.task('today', gulp.series(createTodayNotebook));
