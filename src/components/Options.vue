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
    .wrapper__350
      HotelDatePicker(format="DD/MM/YYYY")
    .wrapper__main
      Snippet(inlineCode='<HotelDatePicker format="DD/MM/YYYY">\n</HotelDatePicker>')
  .box
    Info(
      valueName="startDate"
      description="The start view date. All the dates before this date will be disabled."
      type="Date or String"
      defaultVal="new Date()"
    )
    .wrapper__350
      HotelDatePicker(:startDate="new Date(new Date().getFullYear(), new Date().getMonth()+1, 1)")
    .wrapper__main
      Snippet(inlineCode='<HotelDatePicker\n :startDate="new Date(new Date().getFullYear(), new Date().getMonth()+1, 1)">\n</HotelDatePicker>')
  .box
    Info(
      valueName="endDate"
      description="The end view date. All the dates after this date will be disabled."
      type="Date, Number or String"
      defaultVal="Infinity"
    )
    .wrapper__350
      HotelDatePicker(:startDate="new Date(new Date().getFullYear(), 11, 31)")
    .wrapper__main
      Snippet(inlineCode='<HotelDatePicker\n :startDate="new Date(new Date().getFullYear(), 11, 31)">\n</HotelDatePicker>')
  .box
    Info(
      valueName="minNights"
      description="Minimum nights required to select a range of dates."
      type="Number"
      defaultVal="1"
    )
    .wrapper__350
      HotelDatePicker(:minNights="5")
    .wrapper__main
      Snippet(inlineCode='<HotelDatePicker\n :minNights="5">\n</HotelDatePicker>')
  .box
    Info(
      valueName="maxNights"
      description="Maximum nights required to select a range of dates."
      type="Number"
      defaultVal="0"
    )
    .wrapper__350
      HotelDatePicker(:maxNights="10")
    .wrapper__main
      Snippet(inlineCode='<HotelDatePicker\n :maxNights="10">\n</HotelDatePicker>')
  .box
    Info(
      valueName="disabledDates"
      description="An array of strings in this format: `YYYY-MM-DD`. All the dates passed to the list will be disabled."
      type="Array"
      defaultVal="[]"
    )
    .wrapper__350
      HotelDatePicker(:disabledDates="['2018-01-01', '2018-01-11', '2018-01-21' ]")
    .wrapper__main
      Snippet(inlineCode='<HotelDatePicker\n :disabledDates=\"[\'2018-01-01\', \'2018-01-11\', \'2018-01-21\' ]\">\n</HotelDatePicker>')
  .box
    Info(
      valueName="disabledDaysOfWeek"
      description="An array of strings in this format: \n['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']. \nAll the days passed to the list will be disabled."
      type="Array"
      defaultVal="[]"
    )
    .wrapper__350
      HotelDatePicker(:disabledDaysOfWeek="['Monday', 'Friday' ]")
    .wrapper__main
      Snippet(inlineCode='<HotelDatePicker\n :disabledDaysOfWeek=\"[\'Monday\', \'Friday\']\">\n</HotelDatePicker>')
  .box
    Info(
      valueName="allowedRanges"
      description="An array of numbers. \nExample: [7,10,14]. \n After selecting the start date the calendar will be updated only allowing the checkout 7, 10 or 14 days after."
      type="Array"
      defaultVal="[]"
    )
    .wrapper__350
      HotelDatePicker(:disabledDaysOfWeek="['Monday', 'Friday' ]")
    .wrapper__main
      Snippet(inlineCode='<HotelDatePicker\n :disabledDaysOfWeek=\"[\'Monday\', \'Friday\']\">\n</HotelDatePicker>')
  .box
    Info(
      valueName="enableCheckout"
      description="If `true`, allows the checkout on a disabled date."
      type="Boolean"
      defaultVal="false"
    )
    .wrapper__350
      HotelDatePicker(:disabledDaysOfWeek="['Monday', 'Friday']" :enableCheckout="true")
    .wrapper__main
      Snippet(inlineCode='<HotelDatePicker\n :disabledDaysOfWeek=\"[\'Monday\', \'Friday\']\" :enableCheckout="true">\n</HotelDatePicker>')
  .box
    Info(
      valueName="hoveringTooltip"
      description="Shows a tooltip with the number of nights when hovering a date."
      type="Boolean"
      defaultVal="false"
    )
    .wrapper__350
      HotelDatePicker(:hoveringTooltip="false")
    .wrapper__main
      Snippet(inlineCode='<HotelDatePicker\n :hoveringTooltip="false">\n</HotelDatePicker>')
  .box
    Info(
      valueName="i18n"
      description="An object with all the texts in the component. Use it to tranlate it."
      type="Boolean"
      defaultVal=""
    )
    .wrapper__350
      HotelDatePicker(:i18n='ptBr')
    .wrapper__main
      Snippet(inlineCode='<HotelDatePicker\n :i18n="ptBr">\n</HotelDatePicker>')
      br
      Snippet(sourcePath='./dist/snippet3.txt' lang='javascript')
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


  data(){
    return {
      ptBr: {
        night: 'Noite',
        nights: 'Noites',
        'day-names': ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        'check-in': 'Chegada',
        'check-out': 'Partida',
        'month-names': ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      }
    }
  }
}
</script>
