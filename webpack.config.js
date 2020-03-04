const path = require('path');
const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');

const srcPrefix = './src/sites/';
const entries = {
    background: './src/background.ts'
};
fs.readdirSync(srcPrefix).forEach(entry => {
    entries[entry.replace(/.(ts|js)x?$/, '')] = srcPrefix + entry;
});

module.exports = {
    mode: "production",
    entry: entries,
    plugins: [
        new CopyPlugin([
            { from: './src/manifest.json', to: '[name].[ext]'}
        ])
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist')
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: [
                    { loader: 'eslint-loader' }
                ]
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'babel-loader' },
                    { loader: 'ts-loader' }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'babel-loader' }
                ]
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
                        }
                    }
                ]
            }
        ]
    }
}
