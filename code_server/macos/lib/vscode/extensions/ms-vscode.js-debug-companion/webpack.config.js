const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/extension.ts',
  target: 'node',
  output: {
    path: path.join(__dirname, 'out'),
    libraryTarget: 'commonjs2',
    filename: 'extension.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [{ test: /\.ts?$/, loader: 'ts-loader' }],
  },
  externals: {
    vscode: 'commonjs vscode',
    bufferutil: 'commonjs bufferutil',
    'utf-8-validate': 'commonjs utf-8-validate',
  },
};
