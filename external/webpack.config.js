const path = require('path');

module.exports = {
  entry: './build/external/surveys.external.service.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'surveys.js'
  },
  mode: 'production'
};
