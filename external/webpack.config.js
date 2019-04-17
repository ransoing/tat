const path = require('path');

module.exports = {
  entry: './surveys.external.service.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'surveys.js'
  }
};
