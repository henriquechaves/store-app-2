var cssnext = require('postcss-cssnext');
var postcssFocus = require('postcss-focus');
var postcssReporter = require('postcss-reporter');

var cssModulesIdentName = '[name]__[local]__[hash:base64:5]';
if (process.env.NODE_ENV === 'production') {
  cssModulesIdentName = '[hash:base64]';
}

module.exports = {

  output: {
    publicPath: '/',
    libraryTarget: 'commonjs2',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
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
              localIdentName: cssModulesIdentName,
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
        use: [
          {
            loader: "style-loader",
          }, {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
              importLoaders: 1,
            }
          }, {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            }
          },
        ],
      }, {
        test:  /\.(eot|ttf)$/,
        use: {
          loader: 'file-loader',
        }
      }, {
        test:  /\.(png|jpg|gif|svg|woff|woff2)$/,
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

};
