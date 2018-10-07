import gulp from 'gulp';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import {nodeDir, jupyterReactVendorDir} from './helpers/dirs';
import exec from './helpers/exec';

const link = true;

const vendorDirs = {
  'react': link,
  'react-dom': link,
  'prop-types': link,
};

function makeLink (dir) {
  return new Promise((resolve, reject) => {
    const lnk = path.resolve(jupyterReactVendorDir, dir);

    fs.stat(lnk, err => {
      if (err) {
        const cmd = `ln -s ${path.resolve(nodeDir, dir)} ${lnk}`;
        exec(`${cmd} && echo ${cmd}`, err => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        return;
      }
      resolve();
    });
  });
};

function makeVendorDir (done) {
  const dir = path.resolve(jupyterReactVendorDir);
  fs.stat(dir, err => {
    if (err) {
      return mkdirp(dir, done);
    }
    done();
  });
}

function makeLinks () {
  return Promise.all(Object.entries(vendorDirs).map(([dir, link]) => {
    if (link) {
      return makeLink(dir);
    } else {
      return Promise.resolve();
    }
  }));
}

gulp.task('vendors', gulp.series(makeVendorDir, makeLinks));
