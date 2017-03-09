module.exports = {
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: ['latest', 'stage-0'],
        plugins: [
          'transform-decorators-legacy',
          ['transform-runtime', {
            helpers: true,
            polyfill: false,
            regenerator: true,
            moduleName: 'babel-runtime'
          }]
        ]
      }
    }]
  }
};
