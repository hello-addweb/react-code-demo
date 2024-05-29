const path = require('path');
const glob = require('glob');
const nodeExternals = require('webpack-node-externals');

const entryArray = glob.sync('./src/**/app.ts');

const entryObject = entryArray.reduce((acc, item) => {
    let name = path.dirname(item.replace('./src/', ''))
    acc[name] = item
    return acc;
}, {});

module.exports = {
    mode: "development",
    devtool: 'source-map',
    target: "node",
    entry: entryObject,
    output: {
        filename: '[name]/app.js', // Using [name] placeholder for dynamic output filenames
        path: path.resolve(__dirname, 'build'),
        libraryTarget: 'commonjs2', // Add this line to set the output library target
    },
    // externals: [
    //     nodeExternals({
    //         allowlist: ['@middy/core', '@middy/http-error-handler', '@middy/http-json-body-parser', '@middy/util', 'mongodb'],
    //     }),
    // ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.node$/,
                loader: 'node-loader'
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['node_modules'],
    },
};
