import path from 'path';

// Main build directory
export const buildDir = 'build';

// Gulp include and helper directory
export const gulpDir = 'gulp';

// Main source file directory
export const srcDir = 'src';

// Node modules directory
export const nodeDir = 'node_modules';

// Template directory
export const templateDir = path.join(srcDir, 'templates');

// Jupyter React directory
export const jupyterReactDir = path.join(srcDir, 'jupyter/react');

// Transpiled Jupyter React component directory
export const jupyterReactComponentDir = path.join(buildDir, jupyterReactDir,
  'components');

// Transpiled Jupyter React vendor directory
export const jupyterReactVendorDir = path.join(buildDir, jupyterReactDir,
  'vendors');

// Transpiled util directory
export const utilDir = path.join(buildDir, srcDir, 'util');

// Notebook directory
export const logDir = 'private/Journal';
