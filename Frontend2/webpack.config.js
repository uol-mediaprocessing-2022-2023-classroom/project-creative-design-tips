// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
    entry: {
        main: './assets/js/main.js',
        app: './assets/css/app.scss'
    },
    output: {
        path: path.resolve(__dirname, 'public/build'),
    },
    devServer: {
        open: true,
        host: '127.0.0.1',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {from:'assets/img', to:'img'}
            ] 
        }),

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ],
        minimize: true,
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    stats: {
      colors: true,
      modules: true,
      reasons: true,
      errorDetails: true
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    }

    return config;
};
