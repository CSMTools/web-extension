const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const browser = process.env.BROWSER;
const BUILD_DIR_NAME = 'dist';
const SRC_DIR_NAME = 'src';

const output = `../${BUILD_DIR_NAME}/${browser}`;

module.exports = {
  entry: {
    popup: path.join(__dirname, `../${SRC_DIR_NAME}/popup.ts`),
    background: path.join(__dirname, `../${SRC_DIR_NAME}/background/${browser}/background.ts`),
    'basic_communicator': path.join(__dirname, `../${SRC_DIR_NAME}/content_scripts/basic_communicator.ts`),
    'inventory-inject': path.join(__dirname, `../${SRC_DIR_NAME}/injections/inventory.ts`),
    'market-listing-inject': path.join(__dirname, `../${SRC_DIR_NAME}/injections/market-listing.ts`),
  },
  output: {
    path: path.join(__dirname, output),
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.d.ts'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './images', to: `../${output}/images`, context: 'public' },
        { from: './css', to: `../${output}/css`, context: 'public' },
        { from: './popup.html', to: `../${output}/popup.html`, context: 'public' },
        { from: `${browser}_manifest.json`, to: `../${output}/manifest.json`, context: 'public' },
      ],
    }),
  ],
};
