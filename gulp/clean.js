import gulp from 'gulp';
import del from 'del';

import {buildDir} from './helpers/dirs';

gulp.task('clean', () => del(buildDir));
