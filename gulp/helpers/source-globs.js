import GulpGlob from 'gulpglob';
import {gulpDir} from './dirs';

// Gulpfile includes and helpers
export const gulpGlob = new GulpGlob(`${gulpDir}/**/*.js`);
