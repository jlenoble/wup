import PolyPipe from 'polypipe';
import gulp from 'gulp';
import babel from 'gulp-babel';

// Transpile pipeline
export const transpilePipe = new PolyPipe(babel);
