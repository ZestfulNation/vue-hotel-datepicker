import HotelDatePicker from './DatePicker/HotelDatePicker.vue'
import './assets/scss/index.scss'

HotelDatePicker.install = (app) => {
  app.component(HotelDatePicker.name, HotelDatePicker)
}

export default HotelDatePicker
