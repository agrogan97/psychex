const path = require('path');

module.exports = {
    entry: './core/psychex.core.js',
    output: {
        filename: 'psychex.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'P',
        libraryTarget: 'umd',
    },
    mode: 'development',
};