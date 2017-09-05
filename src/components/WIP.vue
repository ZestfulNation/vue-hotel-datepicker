<template lang='pug'>
  .datepicker__wrapper
    input(
      class="datepicker__input"
      :value="value"
      :id="DatePickerID"
      :placeholder="placeholder"
      type="text"
      readonly
    )
    button.datepicker__clear-button
    span.datepicker__month-button.datepicker__month-button--prev(
      @click='renderPreviousMonth'
    )

    span.datepicker__month-button.datepicker__month-button--next(
      @click='renderNextMonth'
    )
    div(style='float: left; widht: 50%')
      .square(v-for='dayName in this.i18n["day-names"]' v-text='dayName')
      .square(v-for='day in months[activeMonthIndex].days'
        @mouseover='hoveringDate = day.date')
        Day(
          @dayClicked='handleDayClick($event)'
          :date='day.date'
          :hoveringDate='hoveringDate'
          :dayNumber='getDay(day.date)'
          :belongsToThisMonth='day.belongsToThisMonth'
          :checkIn='checkIn'
          :checkOut='checkOut'
        )
    div(style='float: left; widht: 50%')
      .square(v-for='dayName in this.i18n["day-names"]' v-text='dayName')
      .square(v-for='day in months[activeMonthIndex+1].days'
        @mouseover='hoveringDate = day.date')
        Day(
          @dayClicked='handleDayClick($event)'
          :date='day.date'
          :hoveringDate='hoveringDate'
          :dayNumber='getDay(day.date)'
          :belongsToThisMonth='day.belongsToThisMonth'
          :checkIn='checkIn'
          :checkOut='checkOut'
        )
</template>

<script>
import fecha from 'fecha';
import _ from 'lodash';

import Day from './Day.vue';

const defaulti18n = {
    selected: 'Your stay:',
    night: 'Night',
    nights: 'Nights',
    button: 'Close',
    'day-names': ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
    'check-in': 'Check-in',
    'check-out': 'Check-Out',
    'month-names': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    'error-more': 'Date range should not be more than 1 night',
    'error-more-plural': 'Date range should not be more than %d nights',
    'error-less': 'Date range should not be less than 1 night',
    'error-less-plural': 'Date range should not be less than %d nights',
    'info-more': 'Please select a date range longer than 1 night',
    'info-more-plural': 'Please select a date range longer than %d nights',
    'info-range': 'Please select a date range between %d and %d nights',
    'info-default': 'Please select a date range'
};

export default {
  name: 'WIP',

  components: {
    Day,
  },

  props: {
    value: {
      type: String
    },
    useDummyInputs: {
      default: true,
      type: Boolean
    },
    placeholder: {
      default: 'Check-in ► Check-out',
      type: String
    },
    DatePickerID: {
      default: '1',
      type: String
    },
    format: {
        default: 'YYYY-MM-DD',
        type: String
    },
    infoFormat: {
      default: 'YYYY-MM-DD',
      type: String
    },
    separator: {
      default: ' ► ',
      type: String
    },
    startOfWeek: {
      default: 'monday',
      type: String
    },
    startDate: {
      default: function() {
        return new Date()
      },
      type: [ Date, String ]
    },
    endDate: {
      type: [ Date, String, Boolean ]
    },
    minNights: {
      default: 1,
      type: Number
    },
    maxNights: {
      default: 0,
      type: Number
    },
    selectForward: {
      default: true,
      type: Boolean,
    },
    disabledDates: {
      default: function(){ return [] },
      type: Array
    },
    disabledDaysOfWeek: {
      default: function(){ return [] },
      type: Array
    },
    allowedRanges: {
      default: function(){ return [] },
      type: Array
    },
    enableCheckout: {
      default: false,
      type: Boolean
    },
    container: {
      default: '',
      type: String
    },
    animationSpeed: {
      default: '.2s',
      type: String
    },
    hoveringTooltip: {
      default: true,
      type: [Boolean, Function]
    },
    showCloseButton: {
      default: false,
      type: Boolean
    },
    autoClose: {
      default: true,
      type: Boolean
    },
    i18n: {
      default: () => defaulti18n,
      type: Object
    }

  },

  data: function () {
    return {
      hoveringDate: null,
      checkIn: null,
      checkOut: null,
      currentDate: new Date(),
      months: [],
      activeMonthIndex: 0,
    };
  },

  methods: {
    handleDayClick(date) {
      if (this.checkIn == null) {
        this.checkIn = date;
      } else if ( this.checkIn !== null && this.checkOut == null ) {
        this.checkOut = date;
      }
      else {
        this.checkOut = null;
        this.checkIn = date;
      }
    },

    renderPreviousMonth(){
      if (this.activeMonthIndex >= 1) {
        this.activeMonthIndex--
      }
      else {
        return
      }
    },

    renderNextMonth(){
      const firstDayOfLastMonth = _.filter(this.months[this.months.length-1].days, {
        'belongsToThisMonth': true
      });

      this.createMonth(
        this.getNextMonth(
          firstDayOfLastMonth[0].date
        )
      );

      this.activeMonthIndex++;
    },

    setCheckIn(date) {
      this.checkIn = date;
    },

    setCheckOut(date) {
      this.checkOut = date;
    },

    compareDates(time1, time2) {
        return new Date(time1) < new Date(time2);
    },

    getFirstSunday(date) {
      var firstDay =  this.getFirstDayOfMonth(date);
      return new Date(
        firstDay.setDate(
          firstDay.getDate()
          -firstDay.getDay()
        )
      )
    },

    getFirstDayOfMonth(date) {
      return new Date(
        date.getFullYear(),
        date.getMonth(), 1
      )
    },

    getDay(date) { return fecha.format(date, 'D') },

    getNextMonth(date){
      let nextMonth;

      if (date.getMonth() == 11) {
        nextMonth = new Date(date.getFullYear() + 1, 0, 1);
      } else {
        nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      }

      return nextMonth;
    },

    addDays(date, quantity) {
      let result = new Date(date);
      result.setDate(result.getDate() + quantity);
      return result;
    },

    createMonth(date){
      const firstSunday = this.getFirstSunday(date);
      let month = {
        days: []
      };

      for (let i = 0; i < 42; i++) {
        month.days.push({
          date: this.addDays(firstSunday, i),
          belongsToThisMonth: this.addDays(firstSunday, i).getMonth() === date.getMonth(),
          isInRange: false,
        });
      }

      this.months.push(month);
    }
  },

  beforeMount() {
    this.createMonth(this.currentDate);
    this.createMonth(this.getNextMonth(this.currentDate));
  }
};
</script>
