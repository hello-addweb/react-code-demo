/* eslint-disable */
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
var path = require('path');

module.exports = {
    entry: slsw.lib.entries,
    target: "node",
    externals: [nodeExternals()],
    mode: slsw.lib.webpack.isLocal ? "development" : "production",
    optimization: {
        minimize: true
    },
    performance: {
        // Turn off size warnings for entry points
        hints: false
    },
    resolve: {
        alias: {
            Shared: path.resolve(__dirname, '../shared/js/'),
            Mocks: path.resolve(__dirname, '../shared/js/mocks/'),
            Middlewares: path.resolve(__dirname, '../shared/js/middlewares/'),
            Services: path.resolve(__dirname, '../shared/js/services/'),
            Utilities:  path.resolve(__dirname, '../shared/js/utils/'),
            Constants:  path.resolve(__dirname, '../shared/js/constants/'),
            Helpers: path.resolve(__dirname, '../shared/js/helpers/'),
            Requests:  path.resolve(__dirname, '../shared/js/requests/'),
            Core:  path.resolve(__dirname, '../shared/js/core/'),
            Tracing:  path.resolve(__dirname, '../shared/js/tracing/')
        }
    },
    // Run babel on all .js files and skip those in node_modules
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: __dirname,
                exclude: /node_modules/
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i, 
                loader: 'file-loader',
                options: {
                    name: './[name].[ext]'
                }
            }
        ]
    }
};

