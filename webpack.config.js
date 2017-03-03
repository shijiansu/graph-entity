module.exports = {
  entry: './example/index.js',
  output: {
    filename: './example/dist.js',
  },
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
            helpers: true, // defaults to true
            polyfill: true, // defaults to true
            regenerator: true, // defaults to true
            moduleName: 'babel-runtime' // defaults to 'babel-runtime'
          }]
        ]
      }
    }]
  }
}
