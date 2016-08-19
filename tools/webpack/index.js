import path from 'path';
import _ from 'lodash';

import getConfigForCSS from './getConfigForCSS';
import getConfigForAssets from './getConfigForAssets';
import getConfigForHtml from './getConfigForHtml';
import getConfigForJS from './getConfigForJS';

const isProd = process.env.NODE_ENV === 'production';

const mergeWebpackConfig = (object, src) => _.mergeWith(object, src, (objValue, srcValue) => {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
  return undefined;
});

export default _.reduce([
  getConfigForCSS,
  getConfigForHtml,
  getConfigForJS,
  getConfigForAssets,
], (finalWebpackConfig, getConfig) => mergeWebpackConfig(finalWebpackConfig, getConfig(isProd)), {
  context: path.join(process.cwd(), 'examples'),

  entry: {
    app: './index.js',
  },

  resolve: {
    extensions: ['', '.js'],
    modules: [
      'node_modules',
      process.cwd(),
    ],
  },

  output: {
    path: path.join(process.cwd(), 'public', '/assets/'),
    publicPath: isProd ? 'assets/' : '/assets/',
    chunkFilename: 'chunk.[chunkhash].js',
    filename: '[name]-[hash].js',
  },

  debug: true,
  devtool: isProd ? false : 'eval-source-map',
});
