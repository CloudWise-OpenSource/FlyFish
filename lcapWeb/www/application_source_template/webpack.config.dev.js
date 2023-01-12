/**
 * @description webpack基础配置
 */

const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {},
  output: {
    path: `${__dirname}/build/components`,
    filename: "[name].js",
  },
  externals: {
    react: "React",
    moment: "moment",
    "react-dom": "ReactDom",
    "prop-types": "PropTypes",
    jquery: "jQuery",
    "jquery-ui": "jQuery",
    "data-vi": "dv",
    "data-vi/Component": "dv.adapter.Component",
    "data-vi/ReactComponent": "dv.adapter.ReactComponent",
    "data-vi/Event": "dv.adapter.Event",
    "data-vi/Model": "dv.adapter.Model",
    "data-vi/Screen": "dv.adapter.Screen",
    "data-vi/config": "dv.adapter.config",
    "data-vi/helpers": "dv.adapter._",
    "data-vi/storage": "dv.adapter",
    "data-vi/locale": "dv.adapter",
    "data-vi/modal": "dv.adapter",
    "data-vi/components": "dv.adapter",
    "data-vi/models": "dv.adapter",
    "data-vi/resources": "dv.adapter",
    "data-vi/requirejs": "dv.adapter",
    "datavi-editor/adapter": "dvEditorAdapter",
    "datavi-editor/templates": "dvEditorAdapter.templates",
    "data-vi/api": "dv.adapter",
    'datavi-editor/antd': 'dvEditorAdapter.antd',
    'datavi-editor/@ant-design/icons': 'dvEditorAdapter.antdIcons',
    'datavi-editor/chartPanel': 'dvEditorAdapter.chartPanel',
    'data-vi/echarts': 'dv.adapter.echarts',
    "data-vi/variable": "dv.adapter.variable",
  },
  // 指定模块目录名称
  resolve: {
    extensions: [".js", ".jsx"],
    modules: ["node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|gif|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: "base64-inline-loader?limit=10000000&name=[name].[ext]",
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "less-loader",
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
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        loader: "babel-loader",
        exclude: /(node_modules|bower_components)/,
        test: /\.jsx?$/,
        options: {
          presets: [
            "babel-polyfill",
            [
              "env",
              {
                // 根据browserslist来分析支持情况， 具体的配置参照： https://github.com/ai/browserslist
                browsers: ["last 2 versions", "ie >= 8"],
                modules: false,
                useBuiltIns: true,
                debug: true,
              },
            ],
            "react",
            "stage-0",
          ],
        },
      },
    ],
  },
  devServer: {
    port: 8899,
    compress: true,
    // open: 'Google Chrome',
    overlay: true,
    hot: true,
    writeToDisk: true,
    liveReload: true,
    inline: true,
    watchContentBase: true,
    contentBase: path.resolve(process.cwd(), "build"),
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => [
          autoprefixer({
            browsers: [
              "last 5 versions",
              "last 3 Chrome versions",
              "last 2 Explorer versions",
              "last 3 Safari versions",
              "Firefox >= 20",
            ],
          }),
        ],
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(process.cwd(), "public"),
          to: path.resolve(process.cwd(), "build"),
        },
        {
          from: path.resolve(process.cwd(), "applications"),
          to: path.resolve(process.cwd(), "build/applications"),
        },
        {
          noErrorOnMissing: true,
          from: path.resolve(process.cwd(), "componentGroup"),
          to: path.resolve(process.cwd(), "build/componentGroup"),
        },
      ],
    }),
  ],
};
