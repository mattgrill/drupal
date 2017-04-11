const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const babili = require('rollup-plugin-babili');

const log = require('./log');

module.exports = (filePath) => {
  const moduleName = filePath.slice(0, -7);
  log(`'${filePath}' is being processed.`);
  rollup.rollup({
    entry: filePath,
    format: 'iife',
    plugins: [
      resolve({ jsnext: true, main: true }),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      }),
      babili({
        comments: false
      })
    ]
  })
  .then(bundle => bundle.write({
    format: 'iife',
    dest: `${moduleName}.js`,
    sourceMap: true
  }))
  .then(() => {
    log(`'${filePath}' is finished.`);
  });
}
