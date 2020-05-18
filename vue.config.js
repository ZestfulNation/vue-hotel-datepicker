var path = require('path');
const VueDir = path.resolve(__dirname, 'src');

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('@', VueDir);
    config.resolve.alias.set('~', VueDir);
  }
};
