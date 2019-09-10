const path = require('path');

module.exports = {
  entry: './build/external/src/surveys.external.service.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'surveys.js'
  },
  mode: 'production'
};
