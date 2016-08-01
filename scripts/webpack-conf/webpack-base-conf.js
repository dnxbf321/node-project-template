var webpack = require('webpack')
var HappyPack = require('happypack')

var path = require('path')

var getDefinition = require('./webpack-definition')
var entry = require('./webpack-entry')
var htmlPlugins = require('./webpack-html-plugins')
var getPostcssPlugins = require('../util/postcss-plugins')
var babelrc = require('../util/babelrc')

var codePath = process.cwd()
var projectRoot = path.join(codePath, 'client')
var staticRoot = path.join(projectRoot, 'static')
var cliRoot = path.join(__dirname, '../../')

module.exports = function(env) {
  var postcssPlugins = getPostcssPlugins(env)
  var definition = getDefinition(env)
  return {
    context: projectRoot,
    entry: entry,
    output: {
      filename: '[name].js?[hash:7]',
      path: path.join(codePath, 'client/dist'),
      publicPath: path.join(JSON.parse(definition.client.publicPath), '/').replace(/\:\/([^\/])/i, '://$1')
    },
    resolve: {
      extensions: ['', '.js'],
      root: [path.join(codePath, 'node_modules'), path.join(cliRoot, 'node_modules')]
    },
    resolveLoader: {
      root: [path.join(codePath, 'node_modules'), path.join(cliRoot, 'node_modules')]
    },
    module: {
      preLoaders: [{
        test: /\.(js|vue)$/,
        loader: 'eslint',
        include: staticRoot,
        exclude: /node_modules/
      }],
      loaders: [{
        test: /\.js$/,
        loader: 'babel',
        include: staticRoot,
        exclude: /node_modules/,
        query: babelrc,
        happy: {
          id: 'js'
        }
      }, {
        test: /\.vue$/,
        loader: 'vue',
        include: staticRoot,
        exclude: /node_modules/,
        happy: {
          id: 'vue'
        }
      }, {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 1,
          name: '[path][name].[ext]?[hash:7]'
        }
      }, {
        test: /\.hbs$/,
        loader: 'handlebars',
        query: {
          helperDirs: [path.join(staticRoot, 'js/hbs-helper'), path.join(__dirname, '../helper')],
          partialDirs: [path.join(staticRoot, 'html/partial')]
        }
      }, {
        test: /\.css$/,
        loader: 'style!css!postcss',
        happy: {
          id: 'css'
        }
      }]
    },
    eslint: {
      formatter: require('eslint-friendly-formatter')
    },
    babel: babelrc,
    vue: {
      postcss: {
        plugins: postcssPlugins
      }
    },
    postcss: postcssPlugins,
    plugins: [
      new webpack.IgnorePlugin(/vertx/),
      new webpack.DefinePlugin(definition),
      new HappyPack({
        id: 'js',
        tempDir: path.join(codePath, 'tmp')
      }),
      new HappyPack({
        id: 'vue',
        tempDir: path.join(codePath, 'tmp')
      }),
      new HappyPack({
        id: 'css',
        tempDir: path.join(codePath, 'tmp')
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'static/js/common'
      }),
      new webpack.optimize.OccurenceOrderPlugin()
    ].concat(htmlPlugins)
  }
}