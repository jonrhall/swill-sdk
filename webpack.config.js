const pkg = require('./package.json'),
  args = require('yargs').argv,
  env = args.env === 'dev' ? 'development' : 'production',
  packageName = `${pkg.name}.min.js`,
  HtmlWebpackPlugin = require('html-webpack-plugin');

console.log(`BUILD ENVIRONMENT: ${env}`);
console.log(`PACKAGE NAME: ${packageName}`);

module.exports = {
  mode: env,
  entry: [ 'babel-polyfill', `${__dirname}/src/sdk.js` ],
  devtool: 'source-map',
  output: {
    path: `${__dirname}/lib`,
    filename: packageName,
    library: `SwillSDK`,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  devServer: {
    compress: true,
    host: '0.0.0.0',
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['transform-runtime'],
            presets: ['env', 'stage-0']
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ]
  },
  performance: {
    hints: false
  },
  stats: {
    colors: true
  },
  plugins: [
    env === 'development' ? new HtmlWebpackPlugin({
      hash: true,
      title: 'Swill SDK Development App',
      filename: 'index.html'
    }) : () => {},
  ]
};
