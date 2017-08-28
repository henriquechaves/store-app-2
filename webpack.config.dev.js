var webpack = require('webpack');
var cssnext = require('postcss-cssnext');
var postcssFocus = require('postcss-focus');
var postcssReporter = require('postcss-reporter');

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: {
    app: [
      'eventsource-polyfill',
      'webpack-hot-middleware/client',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      './src/index.js',
    ],
    vendor: [
      'react',
      'react-dom',
    ],
  },

  output: {
    path: __dirname,
    filename: 'app.js',
    publicPath: 'http://0.0.0.0:8000/',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'src',
      'node_modules',
    ],
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: "style-loader"
          }, {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64:5]',
              sourceMap: true,
              importLoaders: 1,
            }
          }, {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              plugins: () => [
                postcssFocus(),
                cssnext({
                  browsers: ['last 2 versions', 'IE > 10'],
                }),
                postcssReporter({
                  clearMessages: true,
                }),
              ],
            }
          },
        ],
      }, {
        test: /\.css$/,
        include: /(node_modules)/,
        use: [
          {
            loader: "style-loader",
          }, {
            loader: "css-loader",
          },
        ],
      }, {
        test: /\.scss$/,
        include: /(node_modules)/,
        use: [
          {
            loader: "style-loader",
          }, {
            loader: "css-loader",
            options: {
              sourceMap: true,
              importLoaders: 1,
            },
          }, {
            loader: "sass-loader",
            options:{
              sourceMap: true,
            },
          },
        ],
      }, {
        test: /\.json$/,
        use: {
          loader: 'json-loader',
        }
      }, {
        test:  /\.(eot|ttf)$/,
        use: {
          loader: 'file-loader',
        }
      }, {
        test:  /\.(png|jpe?g|gif|svg|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        }
      }, {
        test: /bootstrap[\/\\]dist[\/\\]js[\/\\]umd[\/\\]/,
        use: {
          loader: 'imports-loader?jQuery=jquery',
        }
      }, {
        test: /\.jsx*$/,
        exclude: /(node_modules|.+\.config.js)/,
        use: {
          loader: 'babel-loader',
        }
      }
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
      'jquery': 'jquery',
      'Tether': 'tether',
      'window.Tether': 'tether',
      Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
      Button: 'exports-loader?Button!bootstrap/js/dist/button',
      Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
      Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
      Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
      Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
      Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
      Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
      Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
      Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
      Util: 'exports-loader?Util!bootstrap/js/dist/util',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.js',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        CLIENT: JSON.stringify(true),
        'NODE_ENV': JSON.stringify('development'),
      }
    }),
  ],

};
