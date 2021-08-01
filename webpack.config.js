const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";

const plugins = [
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: devMode ? "[name].css" : "[name].[contenthash].css",
        chunkFilename: devMode ? "[id].css" : "[id].[contenthash].css",
    }),
];
if (devMode) {
    // only enable hot in development
    plugins.push(new webpack.HotModuleReplacementPlugin());
}


module.exports = {
    mode: 'development',
    entry: path.join(__dirname, "src", "index.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        // proxy: { // proxy URLs to backend development server
        //     '/api': 'http://localhost:3000'
        // },
        contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
        compress: true, // enable gzip compression
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        https: false, // true for self-signed, object for cert authority
        noInfo: false, // only errors & warns on hot reload
        // ...
    },
    module: {
        rules: [
            {
                test: /\.?js$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    },
                }]
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html"),
        }),
    ],
}