/**
 * @description webpack基础配置
 */

const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {"BarChart/main":"./src/components/BarChart/src/main.js","FoldLineChart/main":"./src/components/FoldLineChart/src/main.js","GaugeChart/main":"./src/components/GaugeChart/src/main.js","PictorialBarChart/main":"./src/components/PictorialBarChart/src/main.js","PieChart/main":"./src/components/PieChart/src/main.js","ScatterChart/main":"./src/components/ScatterChart/src/main.js","WaterWaveBall/main":"./src/components/WaterWaveBall/src/main.js"},
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
  optimization: {
    minimizer: [
      // 优化js
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          output: {
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
          },
          compress: {
            // 在UglifyJs删除没有用到的代码时不输出警告
            warnings: false,

            drop_console: false,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true,
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
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
      ],
    }),
  ],
};
