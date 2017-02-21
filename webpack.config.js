module.exports = {
  entry: './index.js',
  output: {
    filename: 'dist.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: ['latest', 'stage-0'],
        plugins: [
          "transform-decorators-legacy"
        ]
      }
    }]
  }
};