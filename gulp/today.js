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
  const dest = thisMonthDir();
  const notebook = todayNotebook();

  return gulp.src(notebookTemplateGlob, {lastRun: createTodayNotebook,
    base: templateDir})
    .pipe(newer(notebook))
    .pipe(rename(path.basename(notebook)))
    .pipe(gulp.dest(dest));
}

function repeatEveryDay (cb) {

}

gulp.task('today', gulp.series(createTodayNotebook));
