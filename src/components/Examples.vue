<template lang="pug">
.examples
  .box
    h3 Ranges of 7, 10 or 14 days and checkin only on saturdays
    .grid__half
      HotelDatePicker(
        :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
        :enableCheckout="true"
        :allowedRanges="[7,10,14]"
      )
    .grid__half
      Snippet(sourcePath='./dist/snippet4.txt')
  .box
    h3 Ranges of 7, 10 or 14 days and checkin only on saturdays
    .grid__half
      HotelDatePicker(
        :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
        :enableCheckout="true"
        :allowedRanges="[7,10,14]"
      )
    .grid__half
      Snippet(sourcePath='./dist/snippet4.txt')
</template>

<script>

import HotelDatePicker from 'vue-hotel-datepicker';
import Snippet from './Snippet';
import Info from './Info';

export default {
  name: 'Examples',
  components: {
    HotelDatePicker,
    Snippet,
    Info,
  },
}
</script>
