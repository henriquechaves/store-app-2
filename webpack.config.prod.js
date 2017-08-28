var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var postcssReporter = require('postcss-reporter');
var postcssFocus = require('postcss-focus');
var cssnext = require('postcss-cssnext');
var cssnano = require('cssnano');
var webpack = require('webpack');

module.exports = {
  devtool: 'hidden-source-map',

  entry: {
    app: [
      './src/index.js',
    ],
    vendor: [
      'react',
      'react-dom',
    ]
  },

  output: {
    path: __dirname + '/dist/',
    filename: '[name].[chunkhash].js',
    publicPath: '/',
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
        test: /\.jsx*$/,
        exclude: /(node_modules|.+\.config.js)/,
        use: {
          loader: 'babel-loader',
        }
      }, {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
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
                  cssnano({
                    autoprefixer: false
                  }),
                  postcssReporter({
                    clearMessages: true,
                  }),
                ],
              }
            }
          ],
        }),
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
      }
    ],
  },



  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
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
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.js',
    }),
    new ExtractTextPlugin({filename: 'app.[chunkhash].css', allChunks: true }),
    new ManifestPlugin({
      basePath: '/',
    }),
    new ChunkManifestPlugin({
      filename: "chunk-manifest.json",
      manifestVariable: "webpackManifest",
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      }
    }),
  ],

};
