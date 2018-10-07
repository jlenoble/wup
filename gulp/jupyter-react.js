import gulp from 'gulp';
import path from 'path';
import camelize from 'camelize';
import babel from 'gulp-babel';
import newer from 'gulp-newer';
import {nodeDir, srcDir, jupyterReactComponentDir}
  from './helpers/dirs';

const glyphSrcDirs = [
  'wupjs-glyph-input-text',
  'wupjs-glyph-button',
  'wupjs-glyph-checkbox',
];

const makeGlob = (dir, base, ext, exclude) => {
  let p1 = path.join(nodeDir, dir, srcDir, base + ext);
  let p2 = exclude ? path.join(nodeDir, dir, srcDir, exclude + ext) : '';
  return {
    glob: exclude ? [p1, '!' + p2] : [p1],
    base: path.join(nodeDir, dir, srcDir),
    dir,
  };
};

const dict = (dirs, base, ext, exclude) => {
  return dirs
    .map(dir => makeGlob(dir, base, ext, exclude))
    .reduce((obj, glob) => {
      obj[glob.dir] = glob;
      return obj;
    }, {});
};

const indexGlobs = dict(glyphSrcDirs, 'index', '.js');
const componentGlobs = dict(glyphSrcDirs, '*', '.jsx', 'demo');
const sassGlobs = dict(glyphSrcDirs, '*', '.scss', 'demo');

function makeTranspileGlyphCallbacks () {
  return glyphSrcDirs.map(dir => {
    function fn () {
      const glob = indexGlobs[dir].glob.concat(componentGlobs[dir].glob);
      const base = indexGlobs[dir].base;
      const dest = path.join(jupyterReactComponentDir, dir);

      return gulp.src(glob, {base, since: gulp.lastRun(fn)})
        .pipe(newer(dest))
        .pipe(babel({
          plugins: [
            'transform-object-rest-spread',
            'transform-modules-amd',
          ],
        }))
        .pipe(gulp.dest(dest));
    }

    Object.defineProperty(fn, 'name', {value: `transpile${
      camelize(dir).slice(5)}`});

    return {fn, dir};
  }).reduce((obj, {fn, dir}) => {
    obj[dir] = fn;
    return obj;
  }, {});
};

const transpileCallbacks = makeTranspileGlyphCallbacks();

glyphSrcDirs.forEach(dir => {
  gulp.task(`transpile:${dir.slice(6)}`, transpileCallbacks[dir]);
});

gulp.task('transpile:glyph', gulp.parallel(...glyphSrcDirs.map(dir => {
  return `transpile:${dir.slice(6)}`;
})));
