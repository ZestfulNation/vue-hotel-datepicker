<template lang="pug">
.options
  hr
  h2 Options/Props
  .box
    Info(
      valueName="format"
      description="The input date format string"
      type="String"
      defaultVal="YYYY-MM-DD"
    )
    .grid__half
      HotelDatePicker(format="DD/MM/YYYY")
    .grid__half
      Snippet(inlineCode='<HotelDatePicker format="DD/MM/YYYY">\n</HotelDatePicker>')
  .box
    Info(
      valueName="startDate"
      description="The start view date. All the dates before this date will be disabled."
      type="Date or String"
      defaultVal="new Date()"
    )
    .grid__half
      HotelDatePicker(:startDate="new Date(new Date().getFullYear(), new Date().getMonth()+1, 1)")
    .grid__half
      Snippet(inlineCode='<HotelDatePicker\n :startDate="new Date(new Date().getFullYear(), new Date().getMonth()+1, 1)">\n</HotelDatePicker>')
  .box
    Info(
      valueName="endDate"
      description="The end view date. All the dates after this date will be disabled."
      type="Date, Number or String"
      defaultVal="Infinity"
    )
    .grid__half
      HotelDatePicker(:startDate="new Date(new Date().getFullYear(), 11, 31)")
    .grid__half
      Snippet(inlineCode='<HotelDatePicker\n :startDate="new Date(new Date().getFullYear(), 11, 31)">\n</HotelDatePicker>')
  .box
    Info(
      valueName="minNights"
      description="Minimum nights required to select a range of dates."
      type="Number"
      defaultVal="1"
    )
    .grid__half
      HotelDatePicker(:minNights="5")
    .grid__half
      Snippet(inlineCode='<HotelDatePicker\n :minNights="5">\n</HotelDatePicker>')
  .box
    Info(
      valueName="maxNights"
      description="Maximum nights required to select a range of dates."
      type="Number"
      defaultVal="0"
    )
    .grid__half
      HotelDatePicker(:maxNights="10")
    .grid__half
      Snippet(inlineCode='<HotelDatePicker\n :maxNights="10">\n</HotelDatePicker>')
  .box
    Info(
      valueName="disabledDates"
      description="An array of strings in this format: `YYYY-MM-DD`. All the dates passed to the list will be disabled."
      type="Array"
      defaultVal="[]"
    )
    .grid__half
      HotelDatePicker(:disabledDates="['2018-01-01', '2018-01-11', '2018-01-21' ]")
    .grid__half
      Snippet(inlineCode='<HotelDatePicker\n :disabledDates=\"[\'2018-01-01\', \'2018-01-11\', \'2018-01-21\' ]\">\n</HotelDatePicker>')
  .box
    Info(
      valueName="disabledDaysOfWeek"
      description="An array of strings in this format: \n`['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']`. \nAll the days passed to the list will be disabled."
      type="Array"
      defaultVal="[]"
    )
    .grid__half
      HotelDatePicker(:disabledDaysOfWeek="['Monday', 'Friday' ]")
    .grid__half
      Snippet(inlineCode='<HotelDatePicker\n :disabledDaysOfWeek=\"[\'Monday\', \'Friday\']\">\n</HotelDatePicker>')
  .box
    Info(
      valueName="allowedRanges"
      description="An array of numbers. \nExample: `[7,10,14]`. \n After selecting the start date the calendar will be updated only allowing the checkout 7, 10 or 14 days after."
      type="Array"
      defaultVal="[]"
    )
    .grid__half
      HotelDatePicker(:disabledDaysOfWeek="['Monday', 'Friday' ]")
    .grid__half
      Snippet(inlineCode='<HotelDatePicker\n :disabledDaysOfWeek=\"[\'Monday\', \'Friday\']\">\n</HotelDatePicker>')
</template>

<script>
import HotelDatePicker from 'vue-hotel-datepicker';
import Snippet from './Snippet';
import Info from './Info';

export default {
  name: 'Options',
  components: {
    HotelDatePicker,
    Snippet,
    Info,
  },
}
</script>

<style scoped>
.box {
  width: 100%;
  float: left;
  margin-left: 40px;
}
</style>
