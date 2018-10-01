import gulp from 'gulp';
import newer from 'gulp-newer';
import rename from 'gulp-rename';
import gutil from 'gulp-util';
import path from 'path';
import exec from './helpers/exec';
import {templateDir} from './helpers/dirs';
import {repeatEveryDay} from './helpers/repeat';
import {thisMonthDir, todayNotebook} from './helpers/autonaming';

const notebookTemplateGlob = path.join(templateDir, 'today.ipynb');

function createTodayNotebook () {
  const dest = thisMonthDir();
  const notebook = todayNotebook();

  return gulp.src(notebookTemplateGlob, {base: templateDir})
    .pipe(newer(notebook))
    .pipe(rename(path.basename(notebook)))
    .pipe(gulp.dest(dest));
}

function openTodayNotebook (cb) {
  const dest = thisMonthDir();
  const notebook = path.basename(todayNotebook());
  exec(`google-chrome http://localhost:8888/tree/${dest}/${notebook}`, cb);
}

function createAndOpenTodayNotebook () {
  createTodayNotebook()
    .on('end', () => {
      gutil.log(`Created today notebook ${todayNotebook()}`);

      openTodayNotebook(function () {
        gutil.log(`Opened today notebook ${todayNotebook()}`);
      });
    });
}

gulp.task('today', gulp.series(createTodayNotebook, openTodayNotebook,
  repeatEveryDay(createAndOpenTodayNotebook, 'Stopping auto notebook...')));
