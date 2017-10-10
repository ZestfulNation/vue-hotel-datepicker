<template lang='pug'>
  div
    span
    .datepicker__tooltip(v-if='showTooltip && this.hoveringTooltip' v-text='tooltipMessage')
    .datepicker__month-day(
      @click='dayClicked(date)'
      v-text='`${dayNumber}`'
      :class='dayClass'
    )
</template>

<script>
import fecha from 'fecha';

import Helpers from './helpers.js'

export default {
  name: 'Day',

  props: {
    sortedDisabledDates: {
      type: Array
    },
    options: {
      type: Object
    },
    checkIn: {
      type: Date
    },
    checkOut: {
      type: Date
    },
    hoveringDate: {
      type: Date
    },
    mounseOverFunction: {
      type: Function
    },
    belongsToThisMonth: {
      type: Boolean
    },
    activeMonthIndex: {
      type: Number
    },
    date: {
      type: Date
    },
    dayNumber: {
      type: String
    },
    nextDisabledDate: {
      type: [Date, Number, String]
    },
    hoveringTooltip: {
      default: true,
      type: Boolean
    },
  },

  data() {
    return {
      isHighlighted: false,
      isDisabled: false,
      allowedCheckoutDays: [],
    };
  },

  computed: {
    nightsCount: function() {
      return this.countDays(this.checkIn, this.hoveringDate);
    },
    tooltipMessage: function() {
      return `${this.nightsCount} ${this.nightsCount !== 1 ?
              this.options.i18n['nights'] :
                this.options.i18n['night']}`
    },
    showTooltip: function() {
      return  !this.isDisabled &&
              this.date == this.hoveringDate &&
              this.checkIn !== null &&
              this.checkOut == null;
    },

    dayClass: function(){
      if (this.belongsToThisMonth) {

        // If the calendar has a minimum number of nights
        if ( !this.isDisabled &&
             this.compareDay(this.date, this.checkIn) == 1 &&
             this.options.minNights !== 0 &&
             this.compareDay(
                this.date,
                this.addDays(this.checkIn, this.options.minNights)
              ) == -1) {
            return 'datepicker__month-day--selected datepicker__month-day--out-of-range'
        }

        // If the calendar has allowed ranges
        if (this.options.allowedRanges.length !== 0) {
          if ( !this.isDisabled && this.checkIn !== null && this.checkOut == null ) {
            // If the day is one of the allowed check out days and is not highlighted
            if ( _.some(  this.allowedCheckoutDays, (i) => this.compareDay(i, this.date) == 0 && !this.isHighlighted) ) {
              return 'datepicker__month-day--allowed-checkout'
            }
            // If the day is one of the allowed check out days and is highlighted
            if ( _.some(  this.allowedCheckoutDays, (i) => this.compareDay(i, this.date) == 0 && this.isHighlighted) ) {
              return 'datepicker__month-day--selected datepicker__month-day--allowed-checkout'
            }
            // If the day is not one of the allowed Checkout Days and is highlighted
            if ( !(_.some(  this.allowedCheckoutDays, (i) => this.compareDay(i, this.date) == 0 )) && this.isHighlighted) {
              return 'datepicker__month-day--out-of-range datepicker__month-day--selected'
            }
            else {
              return 'datepicker__month-day datepicker__month-day--out-of-range'
            }
          }
        }
        // Highlight the selected dates and prevent the user from selecting
        // the same date for checkout and checkin
        if ( this.checkIn !== null ) {
          if ( fecha.format(this.checkIn, 'YYYYMMDD') == fecha.format(this.date, 'YYYYMMDD') ) {
            return "datepicker__month-day--disabled datepicker__month-day--first-day-selected"
          }
        }
        if ( this.checkOut !== null ) {
          if ( fecha.format(this.checkOut, 'YYYYMMDD') == fecha.format(this.date, 'YYYYMMDD') ) {
            return "datepicker__month-day--disabled datepicker__month-day--last-day-selected"
          }
        }
        // Only highlight dates that are not disabled
        if ( this.isHighlighted && !this.isDisabled) { return " datepicker__month-day--selected"}
        if ( this.isDisabled ) { return "datepicker__month-day--disabled" }
      }

      else if ( !this.belongsToThisMonth ) { return "datepicker__month-day--hidden" }
      else {  return "datepicker__month-day--valid" }
    },
  },

  watch: {
    hoveringDate: function(date) {
      if ( this.checkIn !== null  && this.checkOut == null && this.isDisabled == false) {
        this.isDateLessOrEquals(this.checkIn, this.date) &&
        this.isDateLessOrEquals(this.date, this.hoveringDate) ?
        this.isHighlighted = true : this.isHighlighted = false
      }
      if( this.checkIn !== null  && this.checkOut == null && this.allowedCheckoutDays.length !== 0){

      }
    },
    activeMonthIndex: function(index) {
      this.checkIfDisabled()
      this.checkIfHighlighted()
      if ( this.checkIn !== null  && this.checkOut !== null ) {
          this.isDateLessOrEquals(this.checkIn, this.date) &&
          this.isDateLessOrEquals(this.date, this.checkOut) ?
          this.isHighlighted = true : this.isHighlighted = false
      } else if ( this.checkIn !== null  && this.checkOut == null ) {
        this.disableNextDays()
      } else {
        return
      }

    },
    nextDisabledDate: function() {
      this.disableNextDays();
    },
    checkIn: function(date) {
      this.createAllowedCheckoutDays(date);
    }
  },

  methods: {
    ...Helpers,

    compareDay(day1, day2) {
      const date1 = fecha.format(new Date(day1), 'YYYYMMDD');
      const date2 = fecha.format(new Date(day2), 'YYYYMMDD');

      if (date1 > date2) { return 1; }

      else if (date1 == date2) { return 0; }

      else if (date1 < date2) { return -1; }
    },

    dayClicked(date) {
      if (this.isDisabled) {
        return
      }
      else {
        if (this.options.allowedRanges.length !== 0) {
          this.createAllowedCheckoutDays(date);
        }

        let nextDisabledDate =
          (this.options.maxNights ? this.addDays(this.date, this.options.maxNights) : null) ||
          this.allowedCheckoutDays[this.allowedCheckoutDays.length-1] ||
          this.getNextDate(this.sortedDisabledDates, this.date) ||
          this.nextDateByDayOfWeekArray(this.options.disabledDaysOfWeek, this.date) ||
          null;

        if (this.options.enableCheckout) { nextDisabledDate = Infinity; }

        this.$emit('dayClicked', { date, nextDisabledDate });
      }
    },

    compareEndDay() {
      if (this.options.endDate !== Infinity) {
        return ( this.compareDay(this.date, this.options.endDate) == 1 )
      }
    },

    checkIfDisabled() {
      this.isDisabled =
        // If this day is equal any of the disabled dates
        _.some(
          this.sortedDisabledDates, (i) =>
          this.compareDay(i, this.date) == 0
        )
        // Or is before the start date
        || this.compareDay(this.date, this.options.startDate) == -1
        // Or is after the end date
        || this.compareEndDay()
        // Or is in one of the disabled days of the week
        || _.some(
          this.options.disabledDaysOfWeek, (i) =>
          i == fecha.format(this.date, 'dddd')
        );
        // Handle checkout enabled
        if ( this.options.enableCheckout ) {
          if ( this.compareDay(this.date, this.checkIn) == 1 &&
               this.compareDay(this.date, this.checkOut) == -1 ) {
                this.isDisabled = false;
          }
        }
    },

    checkIfHighlighted(){
      if ( this.checkIn !== null  && this.checkOut !== null && this.isDisabled == false) {
        this.isDateLessOrEquals(this.checkIn, this.date) &&
        this.isDateLessOrEquals(this.date, this.checkOut) ?
        this.isHighlighted = true : this.isHighlighted = false
      }
    },

    createAllowedCheckoutDays(date){
      this.allowedCheckoutDays = [];
      _.forEach(
        this.options.allowedRanges, (i) =>
        this.allowedCheckoutDays.push(this.addDays(date, i))
      )
      this.allowedCheckoutDays.sort((a, b) =>  a - b );
    },

    disableNextDays(){
      if ( !this.isDateLessOrEquals(this.date, this.nextDisabledDate)
            && this.nextDisabledDate !== Infinity) {
              this.isDisabled = true;
      }
      else if ( this.isDateLessOrEquals(this.date, this.checkIn) ) {
        this.isDisabled = true;
      }
      if (this.isDateLessOrEquals(this.checkIn, this.date) && this.options.enableCheckout ){
        this.isDisabled = false
      }
      else {
        return
      }
    },
  },

  beforeMount(){
    this.checkIfDisabled()
    this.checkIfHighlighted()
  },
}
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
