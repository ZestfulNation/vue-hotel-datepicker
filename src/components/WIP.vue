<template lang='pug'>
  .datepicker__wrapper(v-if='show' v-on-click-outside="hideDatepicker")
    .datepicker__close-button.-hide-on-desktop(v-if='isOpen' @click='hideDatepicker') ＋
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
        .datepicker__dummy-wrapper.datepicker__dummy-wrapper--no-border(
          @click='isOpen = !isOpen' :class="`${isOpen ? 'datepicker__dummy-wrapper--is-active' : ''}`"
          v-if='isOpen'
        )
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
        .datepicker__months(v-if='screenSize == "desktop"')
          div.datepicker__month(v-for='n in [0,1]')
            h1.datepicker__month-name(v-text='getMonth(months[activeMonthIndex+n].days[15].date)')
            .datepicker__week-row.-hide-up-to-tablet
              .datepicker__week-name(v-for='dayName in i18n["day-names"]' v-text='dayName')
            .square(v-for='day in months[activeMonthIndex+n].days'
              @mouseover='hoveringDate = day.date')
              Day(
                :options="$props"
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

        .datepicker__week-row(v-if='screenSize !== "desktop"')
          .datepicker__week-name(v-for='dayName in this.i18n["day-names"]' v-text='dayName')
        .datepicker__months#swiperWrapper(v-if='screenSize !== "desktop"')
          div.datepicker__month(v-for='(a, n) in months')
            h1.datepicker__month-name(v-text='getMonth(months[n].days[15].date)')
            .datepicker__week-row.-hide-up-to-tablet
              .datepicker__week-name(v-for='dayName in i18n["day-names"]' v-text='dayName')
            .square(v-for='day in months[n].days'
              @mouseover='hoveringDate = day.date')
              Day(
                :options="$props"
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
import Helpers from './helpers.js';

const defaulti18n = {
  nights: 'Nights',
  'day-names': ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
  'check-in': 'Check-in',
  'check-out': 'Check-Out',
  'month-names': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

export default {
  name: 'WIP',

  components: { Day, },

  props: {
    value: {
      type: String
    },
    format: {
      default: 'YYYY-MM-DD',
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
      default: 5,
      type: Number
    },
    maxNights: {
      default: 0,
      type: Number
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
      xDown: null,
      yDown: null,
      xUp: null,
      yUp: null,
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
    ...Helpers,

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

    hideDatepicker() { this.isOpen = false; },

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

    renderPreviousMonth() {
      if (this.activeMonthIndex >= 1) {
        this.activeMonthIndex--
      }
      else return
    },

    renderNextMonth() {
      const firstDayOfLastMonth = _.filter(this.months[this.months.length-1].days, {
        'belongsToThisMonth': true
      });

      if (!!this.endDate){
        if (fecha.format(firstDayOfLastMonth[0].date, 'YYYYMM') ==
            fecha.format(new Date(this.endDate), 'YYYYMM')) {
          return
        }
      }

      this.createMonth(
        this.getNextMonth(
          firstDayOfLastMonth[0].date
        )
      );

      this.activeMonthIndex++;
    },

    setCheckIn(date) { this.checkIn = date; },

    setCheckOut(date) { this.checkOut = date; },

    getDay(date) { return fecha.format(date, 'D') },

    getMonth(date) { return fecha.format(date, 'MMMM') },

    formatDate(date) { return fecha.format(date, this.format) },

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
  },

  mounted() {
    console.log(this.$props)
    document.addEventListener('touchstart', this.handleTouchStart, false);
    document.addEventListener('touchmove', this.handleTouchMove, false);
  },

  destroyed() {
    window.removeEventListener('touchstart', this.handleTouchMove);
    window.removeEventListener('touchmove', this.handleTouchMove);
  }

};
</script>
