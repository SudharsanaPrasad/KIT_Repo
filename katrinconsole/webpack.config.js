const path = require('path')

const { CleanWebpackPlugin, } = require('clean-webpack-plugin')
const DefineWebpackPlugin = require('webpack').DefinePlugin
const DotEnv = require('dotenv').config()

module.exports = (env, argv) => {
    return {
        optimization: {
            removeAvailableModules: true,
            minimize: true,
        },
        devtool: argv.mode === 'development' ? 'cheap-module-source-map' : undefined,
        entry: path.resolve(__dirname, './katrinconsole-web/index.tsx'),
        output: {
            path: path.resolve(__dirname, './staticfiles/dist'),
            filename: 'index.bundle.js',
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js',],
        },
        module: {
            rules: [{
                test: /\.css$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                },],
            }, {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }, {
                test: /\.(eot|ttf|woff)$/,
                use: 'file-loader',
            },],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new DefineWebpackPlugin({
                OAUTH_CLIENT_ID: JSON.stringify(process.env.OAUTH_CLIENT_ID),
                OAUTH_CLIENT_SECRET: JSON.stringify(process.env.OAUTH_CLIENT_SECRET),
                BASE_URL: JSON.stringify(process.env.BASE_URL),
            }),
        ],
    }
}
