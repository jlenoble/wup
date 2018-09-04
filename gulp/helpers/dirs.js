import path from 'path';

// Main build directory
export const buildDir = 'build';

// Gulp include and helper directory
export const gulpDir = 'gulp';

// Main source file directory
export const srcDir = 'src';

// Transpiled util directory
export const utilDir = path.join(buildDir, srcDir, 'util');

// Notebook directory
export const logDir = 'private/Journal';
