import DatePicker from './components/DatePicker.vue';

const VueHotelDatePicker = {
  install: function (Vue, options) {
    Vue.component(DatePicker.name, DatePicker);
  }
};

export default VueHotelDatePicker;
