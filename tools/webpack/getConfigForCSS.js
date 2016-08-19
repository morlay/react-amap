import autoprefixerStylus from 'autoprefixer-stylus';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const createExtractLoader = (extractCSS, { withCSSModules, isProd }) => {
  const baseLoaders = [
    {
      loader: 'css-loader',
      query: {
        sourceMap: true,
        minimize: isProd,
        ...(withCSSModules ? {
          modules: true,
          importLoaders: 2,
          localIdentName: isProd ? '[hash:base64:5]' : '[name]__[local]---[hash:base64:5]',
        } : {}),
      },
    },
    'stylus-loader',
  ];

  return extractCSS.extract({
    fallbackLoader: 'style-loader',
    loader: baseLoaders,
  });
};

const getConfigForCSS = (isProd) => {
  const extractCSS = new ExtractTextPlugin({
    filename: '[name]-[hash].css',
    disable: process.env.SOURCE_MAP,
    allChunks: isProd,
  });

  console.log(extractCSS);

  return ({
    stylus: {
      use: [
        autoprefixerStylus({
          browsers: [
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 2.3',
            'bb >= 10',
          ],
        }),
      ],
    },
    module: {
      loaders: [
        {
          test: /_\.styl/,
          loader: createExtractLoader(extractCSS, {
            withCSSModules: true,
            isProd,
          }),
        },
        {
          test: /[^_]\.styl/,
          loader: createExtractLoader(extractCSS, {
            isProd,
          }),
        },
      ],
    },
    plugins: [
      extractCSS,
    ],
  });
};

export default getConfigForCSS;
