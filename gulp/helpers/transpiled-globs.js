import GulpGlob from 'gulpglob';
import destglob from 'destglob';

import {gulpGlob} from './source-globs';
import {buildDir} from './dirs';

// Transpiled Gulpfile includes and helpers
export const buildGulpGlob = new GulpGlob(
  destglob(gulpGlob.glob, buildDir));
