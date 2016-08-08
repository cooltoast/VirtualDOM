var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var LiveReloadPlugin = require("webpack-livereload-plugin");
var WebpackNotifierPlugin = require('webpack-notifier');


module.exports = {
    entry: __dirname + "/static/js/index.js",
    devtool: "cheap-source-map",
    output: {
        path: __dirname + "/static/assets",
        pathinfo: true,
        filename: "index.js",
        publicPath: "/static/assets/"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader?optional=runtime&loose"
            }
        ]
    },

    resolve: {
        modulesDirectories: [
            __dirname + "/static/js",
            "node_modules",
        ]
    },

    plugins: [
        new LiveReloadPlugin(),
        new WebpackNotifierPlugin({
            title: "Webpack Build Complete", alwaysNotify: true
        })
    ]
};
