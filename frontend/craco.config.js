const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
module.exports = {
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    fs: false,
                },
            },
        },
        plugins: {
            add: [
                new NodePolyfillPlugin({
                    excludeAliases: ['console']
                })
            ],
        },
        target: 'node'
    },
};