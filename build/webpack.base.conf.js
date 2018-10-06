const path = require('path')

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../src/main.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: 'build.js',
  },
  resolve: {
    extensions: ['.json', '.js', '.vue'],
    alias: {
      components: path.resolve(__dirname, '../src/components'),
      '@': path.resolve(__dirname, '../src/'),
      'vue$': 'vue/dist/vue.esm.js',
    },
  },
  module: {
    rules: [
        {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            preserveWhitespace: false,
          postcss: [
            require('autoprefixer')({
              browsers: ['last 10 versions', 'ie 11']
            }),
            require('cssnano')({
              discardComments: {
                removeAll: true
              },
              safe: true,
            }),
          ],

          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader?minimize?{discardComments:{removeAll:true}}',
          },
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'images/[name].[hash:7].[ext]',
          },
        },
      },

      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]',
          },
        },
      },

    ],
  },
}
