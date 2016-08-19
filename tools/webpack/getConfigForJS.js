import webpack from 'webpack';

const {
  DefinePlugin,
  optimize: {
    AggressiveMergingPlugin,
    DedupePlugin,
    UglifyJsPlugin,
    CommonsChunkPlugin,
  },
} = webpack;

const GLOBALS = {
  process: {
    env: {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    },
  },
};

const VENDORS = [
  'react',
  'classnames',
];

const getConfigForJS = (isProd) => {
  const exposeVendorJS = new CommonsChunkPlugin({
    name: 'vendor',
  });

  const replaceGlobals = new DefinePlugin(GLOBALS);

  return ({
    entry: {
      vendor: VENDORS,
    },

    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            compact: true,
            presets: [
              ['es2015', { modules: false }],
              '@morlay/babel-preset',
              'react',
            ],
            plugins: isProd ? [
              'transform-runtime',
              'lodash',
            ] : [
              'react-hot-loader/babel',
            ],
          },
        },
      ],
    },

    plugins: [
      replaceGlobals,
      exposeVendorJS,
      ...(isProd ? [
        new UglifyJsPlugin({
          compress: {
            warnings: false,
          },
          output: {
            comments: false,
          },
          sourceMap: false,
        }),

        new DedupePlugin(),
        new AggressiveMergingPlugin(),
      ] : []),
    ],
  });
};

export default getConfigForJS;
