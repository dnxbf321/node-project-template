import webpack from 'webpack'
import merge from 'webpack-merge'
import path from 'path'
import JsDocPlugin from 'jsdoc-webpack-plugin'
import getBaseConfig from './webpack-base-conf'
import getConfig from '../util/config'

var SOURCE_MAP = false

export default (env) => {
  var config = getConfig(env)
  return merge(getBaseConfig(env), {
    stats: {
      children: false
    },
    cache: false,
    devtool: SOURCE_MAP ? '#source-map' : false,
    output: {
      filename: '[name].js?[chunkhash]'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        output: {
          comments: false
        }
      })
    ]
      .concat(config.jsdoc ?
        new JsDocPlugin({
          conf: path.join(process.cwd(), '.jsdoc.json')
        }) : [])
      .concat(config.webpack.banner ?
        new webpack.BannerPlugin(config.webpack.banner + ' | built at ' + new Date(config.version), {
          entryOnly: true
        }) : [])
  })
}