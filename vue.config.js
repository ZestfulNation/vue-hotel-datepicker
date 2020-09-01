const path = require('path')

module.exports = {
    css: { extract: true },
    chainWebpack: config => {
        config.resolve.alias.set('@', path.resolve(__dirname, './src'))
        config.resolve.alias.set('~', path.resolve(__dirname, './src'))
    },
}
