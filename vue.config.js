var path = require('path');
const VueDir = path.resolve(__dirname, 'src');

module.exports = {
  filenameHashing: false,
  chainWebpack: config => {
    config.output.filename = 'vue-hotel-datepicker.min.js';
    config.resolve.alias.set('@', VueDir);
    config.resolve.alias.set('~', VueDir);
  }
};
