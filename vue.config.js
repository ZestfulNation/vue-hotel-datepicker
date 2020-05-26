var path = require('path');
const VueDir = path.resolve(__dirname, 'src');

module.exports = {
  css: { extract: false },
  filenameHashing: false,
  chainWebpack: config => {
    config.entry = path.resolve(__dirname, '../src/components/DatePicker.vue');
    config.devtool = '#source-map';

    config.resolve.alias.set('@', VueDir);
    config.resolve.alias.set('~', VueDir);
  }
};
