var path = require('path');
const VueDir = path.resolve(__dirname, 'src');

console.log('VueDir: ' + VueDir);

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('@', VueDir);
    config.resolve.alias.set('~', VueDir);
  }
};
