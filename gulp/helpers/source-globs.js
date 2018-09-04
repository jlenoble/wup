import GulpGlob from 'gulpglob';
import {gulpDir, srcDir} from './dirs';

// Gulpfile includes and helpers
export const gulpGlob = new GulpGlob(`${gulpDir}/**/*.js`);

// All src files
export const srcGlob = new GulpGlob(`${srcDir}/**/*.js`);
