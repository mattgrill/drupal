const fs = require('fs');
const babel = require('babel-core');

const log = require('./log');

module.exports = (filePath) => {
  const moduleName = filePath.slice(0, -7);
  log(`'${filePath}' is being processed.`);
  babel.transformFile(
    filePath,
    {
      sourceMaps: process.env.BABEL_ENV ? false : 'inline',
      comments: false
    },
    (err, result) => {
      const fileName = filePath.slice(0, -7);
      fs.writeFile(`${fileName}.js`, result.code, () => {
        log(`'${filePath}' is finished.`);
      });
    }
  );
}
