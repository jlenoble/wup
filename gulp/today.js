import fs from 'fs';
import moment from 'moment';
import gulp from 'gulp';
import newer from 'gulp-newer';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import gutil from 'gulp-util';
import path from 'path';
import {resolveMessage} from 'child-process-data';
import exec from './helpers/exec';
import {templateDir} from './helpers/dirs';
import {repeatEveryDay} from './helpers/repeat';
import {thisMonthDir, todayNotebook, someDaysBeforeNotebook}
  from './helpers/autonaming';
import {jupyterStarted, tokenAccepted} from './helpers/regex';

const notebookTemplateGlob = path.join(templateDir, 'today.ipynb');

function getLastNotebook () {
  let n = 1;

  for (; n < 360; n++) {
    try {
      fs.statSync(someDaysBeforeNotebook(n));
      return someDaysBeforeNotebook(n);
    } catch (e) {}
  }
}

function createTodayNotebook () {
  const dest = thisMonthDir();
  const notebook = todayNotebook();
  const lastNotebook = getLastNotebook();

  if (lastNotebook) {
    return gulp.src(lastNotebook)
      .pipe(newer(notebook))
      .pipe(replace(/("source":\s+\[[^]+"##\s+)\d\d?:\d\d\\n"/, `$1${
        moment().format('h:mm')
      }\\n"`))
      .pipe(rename(path.basename(notebook)))
      .pipe(gulp.dest(dest));
  }

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

gulp.task('today', gulp.series(
  resolveMessage(jupyterStarted),
  resolveMessage(tokenAccepted),
  createTodayNotebook,
  openTodayNotebook,
  repeatEveryDay(createAndOpenTodayNotebook, 'Stopping auto notebook...')
));
