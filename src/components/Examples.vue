<template lang="pug">
.examples
  p You can mix and match the props/options to better suit your needs. Check out some examples:
  .box
    h3
      | 1
      span Ranges of 7, 10 or 14 days and checkin only on saturdays
    .wrapper__350
      HotelDatePicker(
        :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
        :enableCheckout="true"
        :allowedRanges="[7,10,14]"
      )
    .wrapper__main
      Snippet(sourcePath='./dist/snippet4.txt')
  .box
    h3
      | 2
      span Block all dates before the 5th day of next month, minimum 3 nights and maximum 10 nights
    .wrapper__350
      HotelDatePicker(
        :startDate="day5nextMonth()"
        :minNights="3"
        :maxNights="10"
      )
    .wrapper__main
      Snippet(sourcePath='./dist/snippet5.txt')
      br
      Snippet(sourcePath='./dist/snippet7.txt' lang='javascript')
  .box
    h3
      | 3
      span Block all dates after December 31st of the current year, allow check-in only on saturdays and minimum 3 nights
    .wrapper__350
      HotelDatePicker(
        :endDate="new Date(new Date().getFullYear(), 11, 31)"
        :minNights='3'
        :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
        :enableCheckout="true"
      )
    .wrapper__main
      Snippet(sourcePath='./dist/snippet6.txt')
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
  methods: {
    day5nextMonth: function() {
      var now = new Date();
      return new Date(now.getFullYear(), now.getMonth()+1, 5);
    }
  }
}
</script>

<style lang="css" scoped>
.box { margin-left: 0px;}
</style>
