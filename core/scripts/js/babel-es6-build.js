/**
 * @file
 *
 * Compile *.es6.js files to ES5.
 *
 * @internal This file is part of the core javascript build process and is only
 * meant to be used in that context.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const changeOrAdded = require('./changeOrAdded');
const log = require('./log');

const fileMatch = './**/*.es6.js';
const globOptions = {
  ignore: './node_modules/**'
};
const processFiles = (error, filePaths) => {
  if (error) {
    process.exitCode = 1;
  }
  filePaths.forEach(changeOrAdded);
};
glob(fileMatch, globOptions, processFiles);
process.exitCode = 0;
