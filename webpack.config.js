const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CSSMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const getFilename = (ext = '[ext]') =>
    isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: isProd ? 'production' : 'development',
    entry: ['@babel/polyfill', './js/scripts.js'],
    output: {
        filename: getFilename('js'),
        path: path.resolve(__dirname, 'dist/'),
    },
    optimization: {
        minimize: isProd,
        minimizer: [new TerserWebpackPlugin(), new CSSMinimizerWebpackPlugin()],
    },
    devServer: {
        hot: isDev,
        historyApiFallback: true,
        port: 3001,
        // host: '192.168.0.100',
        host: '0.0.0.0',
        clientLogLevel: 'silent',
    },
    devtool: isDev && 'source-map',
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: './pages/index.html',
            collapseWhitespace: isProd,
        }),
        new MiniCssExtractPlugin({
            filename: getFilename('css'),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist'),
                },
            ],
        }),
        new ImageMinimizerPlugin({
            exclude: /\.sprite\./,
            minimizerOptions: {
                plugins: [
                    ['gifsicle', { interlaced: true }],
                    ['jpegtran', { progressive: true }],
                    ['optipng', { optimizationLevel: 5 }],
                    [
                        'svgo',
                        {
                            plugins: [
                                {
                                    cleanupIDs: false,
                                    removeViewBox: false,
                                },
                            ],
                        },
                    ],
                ],
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { hmr: isDev },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },

            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images',
                            name: getFilename(),
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { presets: ['@babel/preset-env'] },
                    },
                ],
            },
            {
                test: /\.(ttf|woff|woff2|eot|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts',
                            name: getFilename(),
                        },
                    },
                ],
            },
        ],
    },
};
