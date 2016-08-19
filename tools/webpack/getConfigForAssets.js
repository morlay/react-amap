const getConfigForAssets = () => ({
  module: {
    loaders: [
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=8192',
      },
    ],
  },
});

export default getConfigForAssets;
