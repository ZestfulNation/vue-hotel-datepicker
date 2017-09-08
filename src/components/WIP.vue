<template lang='pug'>
  .datepicker__wrapper(v-if='show' v-on-click-outside="hideDatepicker")
    .datepicker__close-button.-hide-on-desktop ＋
    .datepicker__dummy-wrapper(@click='isOpen = !isOpen' :class="`${isOpen ? 'datepicker__dummy-wrapper--is-active' : ''}`")
      input.datepicker__dummy-input.datepicker__input(
        :class="`${isOpen && checkIn == null ? 'datepicker__dummy-input--is-active' : ''}`"
        :value="`${checkIn ? formatDate(checkIn) : ''}`"
        :placeholder="i18n['check-in']"
        type="text"
        readonly
      )
      input.datepicker__dummy-input.datepicker__input(
        :class="`${isOpen && checkOut == null && checkIn !== null ? 'datepicker__dummy-input--is-active' : ''}`"
        :value="`${checkOut ? formatDate(checkOut) : ''}`"
        :placeholder="i18n['check-out']"
        type="text"
        readonly
      )
    button.datepicker__clear-button(@click='clearSelection') ＋
    .datepicker(:class='`${ !isOpen ? "datepicker--closed" : "datepicker--open" }`')
      .-hide-on-desktop
        .datepicker__dummy-wrapper.datepicker__dummy-wrapper--no-border(@click='isOpen = !isOpen' :class="`${isOpen ? 'datepicker__dummy-wrapper--is-active' : ''}`")
          input.datepicker__dummy-input.datepicker__input(
            :class="`${isOpen && checkIn == null ? 'datepicker__dummy-input--is-active' : ''}`"
            :value="`${checkIn ? formatDate(checkIn) : ''}`"
            :placeholder="i18n['check-in']"
            type="text"
            readonly
          )
          input.datepicker__dummy-input.datepicker__input(
            :class="`${isOpen && checkOut == null && checkIn !== null ? 'datepicker__dummy-input--is-active' : ''}`"
            :value="`${checkOut ? formatDate(checkOut) : ''}`"
            :placeholder="i18n['check-out']"
            type="text"
            readonly
          )
      .datepicker__inner
        .datepicker__header
          span.datepicker__month-button.datepicker__month-button--prev.-hide-up-to-tablet(
            @click='renderPreviousMonth'
          )
          span.datepicker__month-button.datepicker__month-button--next.-hide-up-to-tablet(
            @click='renderNextMonth'
          )
        .datepicker__week-row.-hide-on-desktop
          .datepicker__week-name(v-for='dayName in this.i18n["day-names"]' v-text='dayName')
        v-touch.datepicker__months(
          id="swiperWrapper"
          @swipeup='swipeAfterScroll(renderNextMonth, "down")'
          @swipedown='swipeAfterScroll(renderPreviousMonth, "up")'
        )
          div.datepicker__month
            h1.datepicker__month-name(v-text='getMonth(months[activeMonthIndex].days[15].date)')
            .datepicker__week-row.-hide-up-to-tablet
              .datepicker__week-name(v-for='dayName in this.i18n["day-names"]' v-text='dayName')
            .square(v-for='day in months[activeMonthIndex].days' @mouseover='hoveringDate = day.date')
              Day(
                @dayClicked='handleDayClick($event)'
                :date='day.date'
                :disabledDates='sortedDisabledDates'
                :nextDisabledDate='nextDisabledDate'
                :activeMonthIndex='activeMonthIndex'
                :hoveringDate='hoveringDate'
                :dayNumber='getDay(day.date)'
                :belongsToThisMonth='day.belongsToThisMonth'
                :checkIn='checkIn'
                :checkOut='checkOut'
              )
          div.datepicker__month
            h1.datepicker__month-name(v-text='getMonth(months[activeMonthIndex+1].days[15].date)')
            .datepicker__week-row.-hide-up-to-tablet
              .datepicker__week-name(v-for='dayName in this.i18n["day-names"]' v-text='dayName')
            .square(v-for='day in months[activeMonthIndex+1].days'
              @mouseover='hoveringDate = day.date')
              Day(
                @dayClicked='handleDayClick($event)'
                :date='day.date'
                :disabledDates='sortedDisabledDates'
                :nextDisabledDate='nextDisabledDate'
                :activeMonthIndex='activeMonthIndex'
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
      nextDisabledDate: null,
      show: true,
      isOpen: false,
    };
  },

  computed: {
    sortedDisabledDates: function(){
      return this.parseDisabledDates();
    },
  },

  watch: {
    checkOut: function(date) {
      if ( this.checkOut !== null && this.checkOut !== null ) {
      this.hoveringDate = null;
      this.nextDisabledDate = null;
      this.show = true;
      this.parseDisabledDates();
      this.reRender()

      this.isOpen = false;
      }
    },
  },

  methods: {
    reRender() {
      this.show = false
      this.$nextTick(() => {
        this.show = true;
      })
    },
    clearSelection(){
      this.hoveringDate = null,
      this.checkIn = null;
      this.checkOut = null;
      this.nextDisabledDate = null;
      this.show = true;
      this.parseDisabledDates();
      this.reRender()
    },
    hideDatepicker(){
      this.isOpen = false;
    },
    handleDayClick(event) {
      if (this.checkIn == null) {
        this.checkIn = event.date;
      }
      else if ( this.checkIn !== null && this.checkOut == null ) {
        this.checkOut = event.date;
      }
      else {
        this.checkOut = null;
        this.checkIn = event.date;
      }
      this.nextDisabledDate = event.nextDisabledDate
    },

    swipeAfterScroll(action, option){
      const swiperWrapper = document.getElementById("swiperWrapper")
      if( swiperWrapper.scrollTop === (swiperWrapper.scrollHeight - swiperWrapper.offsetHeight)
        && option === 'down') {
        action()
      } else if ( swiperWrapper.scrollTop === 0 && option === 'up'){
        action()
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

    getMonth(date) { return fecha.format(date, 'MMMM') },

    formatDate(date) { return fecha.format(date, this.format) },

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
    },
    ///// Handle options
    parseDisabledDates() {
      const sortedDates = [];

      for (let i = 0; i < this.disabledDates.length; i++) {
        sortedDates[i] = new Date(this.disabledDates[i]);
      }

      sortedDates.sort((a, b) =>  a - b );
      return sortedDates;
    }
  },

  beforeMount() {
    this.createMonth(this.currentDate);
    this.createMonth(this.getNextMonth(this.currentDate));
    this.parseDisabledDates();
  }


};
</script>
