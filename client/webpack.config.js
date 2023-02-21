const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: 'production', // Swapped from development to production once deployed to Heroku and fully tested. This is a good practice as demostrated from the lighthouse lecture
    entry: {
      main: './src/js/index.js', // Focal point of all js files that meet to be put to use for the application
      install: './src/js/install.js', // Gives logic for the install button and installing process
      database: './src/js/database.js', // Database logic for opening with interactions
      editor: './src/js/editor.js', // Editor UI logic
      header: './src/js/header.js', // The header for the editor application
    },
    output: {
      filename: '[name].bundle.js', // each file from the entry is bundled
      path: path.resolve(__dirname, 'dist'), // path location for the dist folder
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html', // Simplifies the creation of the HTML files served with webpack bundles
        title: 'JATE'
      }),
     
      // Injects our custom service worker
      new InjectManifest({
        swSrc: './src-sw.js', // Customer service worker script that is injected in the dist folder
        swDest: 'src-sw.js', // New service worker file name that is injected
      }),

      // Creates a manifest.json file.
      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: 'Just Anoter Text Editor',
        short_name: 'JATE',
        description: 'Text Editor/Note Reminder',
        background_color: '#225ca3',
        theme_color: '#225ca3',
        start_url: './',
        publicPath: './',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
    ],

    module: {
      // CSS loaders
      rules: [
        {
          test: /\.css$/i, // using regex to search for a css file which gives style and layout
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          // We use babel-loader in order to use ES6.
          use: {
            loader: 'babel-loader', // Converts js language to allow older browsers to understand
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'],
            },
          },
        },
      ],
    },
  };
};
