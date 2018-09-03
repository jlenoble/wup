import GulpTask from 'gulptask';

import {gulpGlob} from './helpers/source-globs';
import {buildDir} from './helpers/dirs';
import {transpilePipe} from './helpers/pipes';

new GulpTask({
  name: 'transpile:gulp',
  glob: gulpGlob,
  dest: buildDir,
  pipe: transpilePipe,
});
