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

function OpenTodayNotebook (cb) {
  const dest = thisMonthDir();
  const notebook = path.basename(todayNotebook());
  exec(`google-chrome http://localhost:8888/tree/${dest}/${notebook}`, cb);
}

function run () {
  createTodayNotebook()
    .on('end', () => {
      gutil.log(`Created today notebook ${todayNotebook()}`);

      OpenTodayNotebook(function () {
        gutil.log(`Opened today notebook ${todayNotebook()}`);
      });
    });
}

const stopMessage = 'Stopping auto notebook...';

gulp.task('today', gulp.series(createTodayNotebook, OpenTodayNotebook,
  repeatEveryDay(run, stopMessage)));
