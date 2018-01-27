<template lang='pug'>
  .datepicker__wrapper(v-if='show' v-on-click-outside="hideDatepicker")
    .datepicker__close-button.-hide-on-desktop(v-if='isOpen' @click='hideDatepicker') ＋
    .datepicker__dummy-wrapper( @click='isOpen = !isOpen' :class="`${isOpen ? 'datepicker__dummy-wrapper--is-active' : ''}` ")
      input.datepicker__dummy-input.datepicker__input(
        data-qa='datepickerInput'
        :class="`${isOpen && checkIn == null ? 'datepicker__dummy-input--is-active' : ''} ${singleDaySelection ? 'datepicker__dummy-input--single-date' : ''}`"
        :value="`${checkIn ? formatDate(checkIn) : ''}`"
        :placeholder="i18n['check-in']"
        type="text"
        readonly
      )
      input.datepicker__dummy-input.datepicker__input(
        v-if='!singleDaySelection'
        :class="`${isOpen && checkOut == null && checkIn !== null ? 'datepicker__dummy-input--is-active' : ''}`"
        :value="`${checkOut ? formatDate(checkOut) : ''}`"
        :placeholder="i18n['check-out']"
        type="text"
        readonly
      )
    button.datepicker__clear-button(type='button' @click='clearSelection') ＋
    .datepicker( :class='`${ !isOpen ? "datepicker--closed" : "datepicker--open" }`')
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
          div.datepicker__month(v-for='n in [0,1]'  v-bind:key='n')
            h1.datepicker__month-name(v-text='getMonth(months[activeMonthIndex+n].days[15].date)')
            .datepicker__week-row.-hide-up-to-tablet
              .datepicker__week-name(v-for='dayName in i18n["day-names"]' v-text='dayName')
            .square(v-for='day in months[activeMonthIndex+n].days'
              @mouseover='hoveringDate = day.date')
              Day(
                :options="$props"
                @dayClicked='handleDayClick($event)'
                :date='day.date'
                :sortedDisabledDates='sortedDisabledDates'
                :nextDisabledDate='nextDisabledDate'
                :activeMonthIndex='activeMonthIndex'
                :hoveringDate='hoveringDate'
                :tooltipMessage='tooltipMessage'
                :dayNumber='getDay(day.date)'
                :belongsToThisMonth='day.belongsToThisMonth'
                :checkIn='checkIn'
                :checkOut='checkOut'
              )
        div(v-if='screenSize !== "desktop" && isOpen')
          .datepicker__week-row
            .datepicker__week-name(v-for='dayName in this.i18n["day-names"]' v-text='dayName')
          .datepicker__months#swiperWrapper
            div.datepicker__month(v-for='(a, n) in months' v-bind:key='n')
              h1.datepicker__month-name(v-text='getMonth(months[n].days[15].date)')
              .datepicker__week-row.-hide-up-to-tablet
                .datepicker__week-name(v-for='dayName in i18n["day-names"]' v-text='dayName')
              .square(v-for='(day, index) in months[n].days'
                @mouseover='hoveringDate = day.date'
                v-bind:key='index'
                )
                Day(
                  :options="$props"
                  @dayClicked='handleDayClick($event)'
                  :date='day.date'
                  :sortedDisabledDates='sortedDisabledDates'
                  :nextDisabledDate='nextDisabledDate'
                  :activeMonthIndex='activeMonthIndex'
                  :hoveringDate='hoveringDate'
                  :tooltipMessage='tooltipMessage'
                  :dayNumber='getDay(day.date)'
                  :belongsToThisMonth='day.belongsToThisMonth'
                  :checkIn='checkIn'
                  :checkOut='checkOut'
                )
</template>

<script>
import { directive as onClickOutside } from 'vue-on-click-outside';

import fecha from 'fecha';
import _ from 'lodash';

import Day from './Day.vue';
import Helpers from './helpers.js';

const defaulti18n = {
  night: 'Night',
  nights: 'Nights',
  'day-names': ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
  'check-in': 'Check-in',
  'check-out': 'Check-out',
  'month-names': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

export default {
  name: 'HotelDatePicker',

  directives: {
    'on-click-outside': onClickOutside
  },

  components: { Day, },

  props: {
    value: {
      type: String
    },
    startingDateValue: {
      default: null,
      type: Date
    },
    endingDateValue: {
      default: null,
      type: Date 
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
      default: Infinity,
      type: [ Date, String, Number ]
    },
    minNights: {
      default: 1,
      type: Number
    },
    maxNights: {
      default: null,
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
    tooltipMessage: {
      default: null,
      type: String
    },
    i18n: {
      default: () => defaulti18n,
      type: Object
    },
    enableCheckout: {
      default: false,
      type: Boolean
    },
    singleDaySelection: {
      default: false,
      type: Boolean
    }
  },

  data() {
    return {
      hoveringDate: null,
      checkIn: this.startingDateValue,
      checkOut: this.endingDateValue,
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
      sortedDisabledDates: null,
      screenSize: this.handleWindowResize(),
    };
  },

  watch: {
    isOpen (value) {
      if (this.screenSize !== 'desktop') {
        const bodyClassList = document.querySelector('body').classList;

        if (value) {
          bodyClassList.add('-overflow-hidden');
        }
        else {
          bodyClassList.remove('-overflow-hidden');
        }
      }
    },
    checkIn(newDate) {
      this.$emit("checkInChanged", newDate )
    },
    checkOut(newDate) {

      if ( this.checkOut !== null && this.checkOut !== null ) {
        this.hoveringDate = null;
        this.nextDisabledDate = null;
        this.show = true;
        this.parseDisabledDates();
        this.reRender()
        this.isOpen = false;
      }

      this.$emit("checkOutChanged", newDate )
    },

  },

  methods: {
    ...Helpers,

    handleWindowResize() {
      let screenSizeInEm = window.innerWidth / parseFloat(getComputedStyle(document.querySelector('body'))['font-size']);

      if (screenSizeInEm < 31) {
        this.screenSize = 'smartphone';
      }
      else if (screenSizeInEm > 30 && screenSizeInEm < 49) {
        this.screenSize = 'tablet';
      }
      else if (screenSizeInEm > 48) {
        this.screenSize = 'desktop';
      }

      return this.screenSize;
    },

    onElementHeightChange(el, callback){
      let lastHeight = el.clientHeight;
      let newHeight = lastHeight;

      (function run(){
        newHeight = el.clientHeight;

        if( lastHeight !== newHeight ){
          callback();
        }

        lastHeight = newHeight;

        if( el.onElementHeightChangeTimer ) {
          clearTimeout(el.onElementHeightChangeTimer);
        }

        el.onElementHeightChangeTimer = setTimeout(run, 1000);
      })();
    },

    emitHeighChangeEvent() {
      this.$emit('heightChanged');
    },

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

    showDatepicker() { this.isOpen = true; },

    toggleDatepicker() { this.isOpen = !this.isOpen; },

    handleDayClick(event) {

      if (this.checkIn == null && this.singleDaySelection == false) {
        this.checkIn = event.date;
      } else if (this.singleDaySelection == true){
        this.checkIn = event.date
        this.checkOut = event.date
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
      let firstDayOfLastMonth;

      if (this.screenSize !== 'desktop') {
        firstDayOfLastMonth = _.filter(this.months[this.months.length-1].days, {
          'belongsToThisMonth': true
        });
      } else {
        firstDayOfLastMonth = _.filter(this.months[this.activeMonthIndex+1].days, {
          'belongsToThisMonth': true
        });
      }

      if (this.endDate !== Infinity){
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

    getMonth(date) { return this.i18n["month-names"][fecha.format(date, 'M') - 1] },

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

      this.sortedDisabledDates = sortedDates;
    }
  },

  beforeMount() {
    this.createMonth(new Date(this.startDate));
    this.createMonth(this.getNextMonth(new Date(this.startDate)));
    this.parseDisabledDates();
  },

  mounted() {
    document.addEventListener('touchstart', this.handleTouchStart, false);
    document.addEventListener('touchmove', this.handleTouchMove, false);
    window.addEventListener('resize', this.handleWindowResize);

    this.onElementHeightChange(document.body, () => {
      this.emitHeighChangeEvent();
    });
  },

  destroyed() {
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('resize', this. handleWindowResize);
  }

};
</script>

<style lang="scss">
/* =============================================================
 * RESPONSIVE LAYOUT HELPERS
 * ============================================================*/
$tablet: '(min-width: 30em) and (max-width: 49em)';
$phone: '(max-width: 30em)';
$desktop: '(min-width: 49em)';
$tablet-up: '(min-width: 30em)';
$up-to-tablet: '(max-width: 49em)';
$extra-small-screen: '(max-width: 23em)';

@mixin device($device-widths) {
  @media screen and #{$device-widths} { @content }
}

.square {
  width: calc(100% / 7);
  float: left;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

/* =============================================================
 * VARIABLES
 * ============================================================*/
$white: #fff;
$black:                #000;
$gray:                 #424b53;
$primary-text-color:   #35343d;
$lightest-gray:        #f3f5f8;
$primary-color: #00ca9d;
$primary-color: $primary-color;
$medium-gray: #999999;
$light-gray: #d7d9e2;
$dark-gray: #2d3047;

$font-small: 14px;

/* =============================================================
 * BASE STYLES
 * ============================================================*/

.datepicker {
  transition: all .2s ease-in-out;
  background-color: $white;
  color: $gray;
  font-size: 16px;
  line-height: 14px;
  overflow: hidden;
  left: 0;
  top: 48px;
  position: absolute;
  z-index: 10;

  &--closed {
    box-shadow: 0 15px 30px 10px rgba($black, 0);
    max-height: 0;
  }

  &--open {
    box-shadow: 0 15px 30px 10px rgba($black, .08);
    max-height: 900px;

    @include device($up-to-tablet) {
      box-shadow: none;
      height: 100%;
      left: 0;
      position: fixed;
      top: 0;
      width: 100%;
    }
  }

  &__wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 48px;
    background: $white url('calendar_icon.regular.svg') no-repeat 17px center / 16px;
  }

  &__input {
    background: transparent;
    height: 48px;
    color: $primary-text-color;
    font-size: 12px;
    outline: none;
    padding: 4px 30px 2px;
    width: 100%;
    word-spacing: 5px;
    border: 0;

    &:focus {
      outline: none;
    }

    &::-webkit-input-placeholder,
    &::-moz-placeholder,
    &:-ms-input-placeholder,
    &:-moz-placeholder {
      color: $primary-text-color;
    }
  }

  &__dummy-wrapper {
    border: solid 1px $light-gray;
    cursor: pointer;
    display: block;
    float: left;
    width: 100%;
    height: 100%;

    &--no-border.datepicker__dummy-wrapper {
      margin-top: 15px;
      border: 0;
    }

    &--is-active {
      border: 1px solid $primary-color;
    }
  }

  &__dummy-input {
    color: $primary-text-color;
    padding-top: 0;
    font-size: $font-small;
    float: left;
    height: 48px;
    line-height: 3.1;
    text-align: left;
    text-indent: 5px;
    width: calc(50% + 4px);

    @include device($phone) {
      text-indent: 0;
      text-align: center;
    }

    &:first-child {
      background: transparent url('ic-arrow-right-datepicker.regular.svg') no-repeat right center / 8px;
      width: calc(50% - 4px);
      text-indent: 20px;
    }

    &--is-active { color: $primary-color; }
    &--is-active::placeholder { color: $primary-color; }
    &--is-active::-moz-placeholder { color: $primary-color; }
    &--is-active:-ms-input-placeholder { color: $primary-color; }
    &--is-active:-moz-placeholder { color: $primary-color; }
    &--single-date:first-child {
      width: 100%;
      background: none;
      text-align: left;
    }
  }

  &__month-day {
    visibility: visible;
    will-change: auto;
    text-align: center;
    margin: 0;
    border: 0;
    height: 40px;
    padding-top: 15px;

    &--invalid-range {
      background-color: rgba($primary-color, .3);
      color: $lightest-gray;
      cursor: not-allowed;
      position: relative;
    }

    &--invalid {
      color: $lightest-gray;
      cursor: not-allowed;
    }

    &--valid:hover,
    &--allowed-checkout:hover {
      background-color: $white;
      color: $primary-color;
      z-index: 1;
      position: relative;
      box-shadow: 0 0 10px 3px rgba($gray, .4);
    }

    &--disabled {
      color: $lightest-gray;
      cursor: not-allowed;
      pointer-events: none;
      position: relative;
    }

    &--selected {
      background-color: rgba($primary-color, .5);
      color: $white;

      &:hover {
        background-color: $white;
        color: $primary-color;
        z-index: 1;
        position: relative;
        box-shadow: 0 0 10px 3px rgba($gray, .4);
      }
    }

    &--today {
      background-color: $light-gray;
      color: $medium-gray;
    }

    &--first-day-selected,
    &--last-day-selected {
      background: $primary-color;
      color: $white;
    }

    &--allowed-checkout {
      color: $medium-gray;
    }

    &--out-of-range {
      color: $lightest-gray;
      cursor: not-allowed;
      position: relative;
      pointer-events: none;
    }

    &--valid {
      cursor: pointer;
      color: $medium-gray;
    }

    &--hidden {
      visibility: hidden;
      color: $white;
      pointer-events: none;
    }
  }

  &__month-button {
    background: transparent url('ic-arrow-right-green.regular.svg') no-repeat right center / 8px;
    cursor: pointer;
    display: inline-block;
    height: 60px;
    width: 60px;

    &--prev { transform: rotateY(180deg); }

    &--next { float: right; }

    &--locked {
      opacity: .2;
      cursor: not-allowed;
    }
  }

  &__inner {
    padding: 20px;
    float: left;

    @include device($up-to-tablet) { padding: 0; }
  }

  &__months {
    @include device($desktop) { width: 650px; }

    @include device($up-to-tablet) {
      margin-top: 92px;
      height: calc(100% - 92px);
      position: absolute;
      left: 0;
      top: 0;
      overflow: scroll;
      right: 0;
      bottom: 0;
    }

    &::before {
      background: $light-gray;
      bottom: 0;
      content: '';
      display: block;
      left: 50%;
      position: absolute;
      top: 0;
      width: 1px;

      @include device($up-to-tablet) { display: none; }
    }
  }

  &__month {
    font-size: 12px;
    float: left;
    width: 50%;
    padding-right: 10px;

    @include device($up-to-tablet) {
      width: 100%;
      padding-right: 0;
      padding-top: 45px;

      &:last-of-type {
        padding-top: 0;
        padding-left: 0;
        margin-top: 35px;
      }
    }

    @include device($tablet-up) {
      &:last-of-type {
        padding-right: 0;
        padding-left: 10px;
      }
    }
  }

  &__month-caption {
    height: 2.5em;
    vertical-align: middle;
  }

  &__month-name {
    font-size: 16px;
    font-weight: 500;
    margin-top: -40px;
    padding-bottom: 17px;
    pointer-events: none;
    text-align: center;

    @include device($up-to-tablet) {
      margin-top: -25px;
      margin-bottom: 0;
      position: absolute;
      width: 100%;
    }
  }

  &__week-days {
    height: 2em;
    vertical-align: middle;
  }

  &__week-row {
    border-bottom: 5px solid $white;
    height: 38px;

    @include device($up-to-tablet) {
      box-shadow: 0 13px 18px -8px rgba($black, .07);
      height: 25px;
      left: 0;
      top: 65px;
      position: absolute;
      width: 100%;
    }
  }

  &__week-name {
    width: calc(100% / 7);
    float: left;
    font-size: 12px;
    font-weight: 400;
    color: $medium-gray;
    text-align: center;
  }

  &__close-button {
    appearence: none;
    background: transparent;
    border: 0;
    color: $primary-color;
    cursor: pointer;
    font-size: 21px;
    font-weight: bold;
    margin-top: 0;
    outline: 0;
    z-index: 10000;
    position: fixed;
    left: 7px;
    top: 5px;
    transform: rotate(45deg);
  }

  &__clear-button {
    appearence: none;
    background: transparent;
    border: 0;
    color: $primary-color;
    cursor: pointer;
    font-size: 25px;
    font-weight: bold;
    height: 40px;
    margin-bottom: 0;
    margin-left: 0;
    margin-right: -2px;
    margin-top: 4px;
    outline: 0;
    padding: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: rotate(45deg);
    width: 40px;
  }

  &__tooltip {
    background-color: $dark-gray;
    border-radius: 2px;
    color: $white;
    font-size: 11px;
    margin-left: 5px;
    margin-top: -22px;
    padding: 5px 10px;
    position: absolute;
    z-index: 50;

    &:after {
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid $dark-gray;
      bottom: -4px;
      content: '';
      left: 50%;
      margin-left: -4px;
      position: absolute;
    }
  }
}

// Modifiers

.-overflow-hidden { overflow: hidden; }

.-is-hidden { display: none; }

.-hide-up-to-tablet {
  @include device($up-to-tablet) {
    display: none;
  }
}

.-hide-on-desktop {
  @include device($desktop) {
    display: none;
  }
}

</style>
