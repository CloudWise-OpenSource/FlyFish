/**
 * @description webpack基础配置
 */
'use strict';

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {},
  // 系统资源库,通过AMD加载,无需打包
  externals: {
    react: 'React',
    moment: 'moment',
    'react-dom': 'ReactDom',
    'prop-types': 'PropTypes',
    jquery: 'jQuery',
    'jquery-ui': 'jQuery',
    'data-vi': 'dv',
    'data-vi/Component': 'dv.adapter.Component',
    'data-vi/ReactComponent': 'dv.adapter.ReactComponent',
    'data-vi/Event': 'dv.adapter.Event',
    'data-vi/Model': 'dv.adapter.Model',
    'data-vi/Screen': 'dv.adapter.Screen',
    'data-vi/config': 'dv.adapter.config',
    'data-vi/helpers': 'dv.adapter._',
    'data-vi/storage': 'dv.adapter',
    'data-vi/locale': 'dv.adapter',
    'data-vi/modal': 'dv.adapter',
    'data-vi/components': 'dv.adapter',
    'data-vi/models': 'dv.adapter',
    'data-vi/resources': 'dv.adapter',
    'data-vi/requirejs': 'dv.adapter',
    'datavi-editor/adapter': 'dvEditorAdapter',
    'datavi-editor/templates': 'dvEditorAdapter.templates',
    'data-vi/api': 'dv.adapter',
  },
  // 指定模块目录名称
  resolve: {
    extensions: [ '.js', '.jsx' ],
    modules: [ 'node_modules' ],
  },
  output: {
    // 公网发布的目录
    publicPath: '/screen/components/',

    // 编译的目录
    path: `${__dirname}/screen/components/`,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|gif|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: 'base64-inline-loader?limit=10000000&name=[name].[ext]',
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'less-loader',
            options: {
              noIeCompat: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        test: /\.jsx?$/,
        query: {
          presets: [
            'babel-polyfill',
            [ 'env', {
              // 根据browserslist来分析支持情况， 具体的配置参照： https://github.com/ai/browserslist
              browsers: [
                'last 2 versions',
                'ie >= 8',
              ],
              modules: false,
              useBuiltIns: true,
              debug: true,
            }],
            'react',
            'stage-0',
          ],
        },
      },
    ],
  },
  devServer: {
    open: true,
    openPage: 'test/index.html',
    port: 9002,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => [
          autoprefixer({
            browsers: [
              'last 5 versions',
              'last 3 Chrome versions',
              'last 2 Explorer versions',
              'last 3 Safari versions',
              'Firefox >= 20',
            ],
          }),
        ],
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
