var path = require('path');
const VueDir = path.resolve(__dirname, 'src');

module.exports = {
  filenameHashing: false,
  chainWebpack: config => {
    // config.output.filename = 'vue-hotel-datepicker.min.js';
    // config.output.libraryTarget = 'umd';
    // config.output.library = 'HotelDatePicker';

    config.entry = path.resolve(__dirname, '../src/components/DatePicker.vue');
    config.devtool = '#source-map';

    config.resolve.alias.set('@', VueDir);
    config.resolve.alias.set('~', VueDir);
  }
};
