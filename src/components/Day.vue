<template lang='pug'>
  .datepicker__month-day(
    @click='dayClicked(date)'
    v-text='dayNumber'
    :class='dayClass'
  )
</template>

<script>
import fecha from 'fecha';
import _ from 'lodash';

export default {
  name: 'Day',

  props: {
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
    disabledDates: {
      type: Array
    },
    nextDisabledDate: {
      type: [Date, Number]
    },
  },

  data() {
    return {
      isHighlighted: false,
      isDisabled: false,
    };
  },

  computed: {
    dayClass: function(){
      if ( this.checkIn !== null && this.belongsToThisMonth ) {
        if ( fecha.format(this.checkIn, 'YYYYMMDD') == fecha.format(this.date, 'YYYYMMDD') ) {
          return "datepicker__month-day--disabled datepicker__month-day--first-day-selected"
        }
      }
      if ( this.checkOut !== null && this.belongsToThisMonth ) {
        if ( fecha.format(this.checkOut, 'YYYYMMDD') == fecha.format(this.date, 'YYYYMMDD') ) {
          return "datepicker__month-day--disabled datepicker__month-day--last-day-selected"
        }
      }
      if ( !this.belongsToThisMonth ) { return "datepicker__month-day--hidden" }
      if ( this.isHighlighted && !this.isDisabled) { return " datepicker__month-day--selected"}
      if ( this.isDisabled ) { return "datepicker__month-day--disabled" }


      else {  return "datepicker__month-day--valid" }
    },
  },

  watch: {
    hoveringDate: function(date) {
      if ( this.checkIn !== null  && this.checkOut == null && this.isDisabled == false) {
        this.compareDates(this.checkIn, this.date) &&
        this.compareDates(this.date, this.hoveringDate) ?
        this.isHighlighted = true : this.isHighlighted = false
      }
    },
    activeMonthIndex: function(index) {
      this.checkIfDisabled()
      this.checkIfHighlighted()
      if ( this.checkIn !== null  && this.checkOut !== null ) {
          this.compareDates(this.checkIn, this.date) &&
          this.compareDates(this.date, this.checkOut) ?
          this.isHighlighted = true : this.isHighlighted = false
      } else if ( this.checkIn !== null  && this.checkOut == null ) {
        this.disableNextDays()
      } else {
        return
      }

    },
    nextDisabledDate: function() {
      this.disableNextDays()
    },
  },

  methods: {
    getNextDate(datesArray, referenceDate){
      var now = new Date(referenceDate);
      var closest = Infinity;

      datesArray.forEach(function(d) {
        var date = new Date(d);
        if (date >= now && date < closest) {
          closest = d;
        }
      });

      return closest
    },

    compareDates(time1, time2) {
      return new Date(time1) <= new Date(time2);
    },

    dayClicked(date) {
      if (this.isDisabled) {
        return
      } else {
        const nextDisabledDate = this.getNextDate(this.disabledDates, this.date) || null;
        this.$emit('dayClicked', { date, nextDisabledDate });
      }
    },

    checkIfDisabled(){
      this.isDisabled = _.some(
        this.disabledDates, (i) =>
        fecha.format(i, 'YYYYMMDD') == fecha.format(this.date, 'YYYYMMDD')
      )
    },

    checkIfHighlighted(){
      if ( this.checkIn !== null  && this.checkOut !== null && this.isDisabled == false) {
        this.compareDates(this.checkIn, this.date) &&
        this.compareDates(this.date, this.checkOut) ?
        this.isHighlighted = true : this.isHighlighted = false
      }
    },

    disableNextDays(){
      if ( !this.compareDates(this.date, this.nextDisabledDate) && this.nextDisabledDate !== Infinity) {
        this.isDisabled = true;
      }
      else if ( this.compareDates(this.date, this.checkIn) ) {
        this.isDisabled = true;
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

  mounted(){

  }
}
</script>

<style lang="scss">
.list-item {
  opacity: 1;
}
.list-enter-active, .list-leave-active {
  transition: all .5s;
  opacity: 1;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
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
$primary-color: #00ca9d;
$primary-color: $primary-color;
$medium-gray: #999999;
$light-gray: #d7d9e2;
$dark-gray: #2d3047;

/* =============================================================
 * BASE STYLES
 * ============================================================*/


.datepicker {
  left: 0;
  top: 48px;
  position: absolute;
  z-index: 10;
  transition:  max-height .5s ease-in-out, box-shadow .2s ease-in-out;

  &--closed {
    box-shadow: 0 15px 30px 10px rgba(0, 0, 0, 0);
    max-height: 0px;
    transition:  max-height .5s ease-in-out, box-shadow .2s ease .4s;
  }

  &--open {
    box-shadow: 0 15px 30px 10px rgba(0, 0, 0, 0.08);
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
    background: #fff url('calendar_icon.svg') no-repeat 10px center / 16px;
  }

  &__input {
  	background: transparent;
    height: 48px;
    color: gray;
    font-size: 12px;
    outline: none;
    padding: 4px 30px 2px 30px;
    width: 100%;
    word-spacing: 5px;
    border: 0;

    &:focus {
      outline: none;
    }

    &::-webkit-input-placeholder,
    &::-moz-placeholder,
    &:-ms-input-placeholder,
    &:-moz-placeholder{
      color: pink;
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
    color: $medium-gray;
    float: left;
    height: 48px;
    line-height: 3.1;
    text-align: left;
    text-indent: 35px;
    width: calc(50% + 4px);

    &:first-child {
      background: transparent url('ic-arrow-right.svg') no-repeat right center / 8px;
      width: calc(50% - 4px)
    }

    &--is-active { color: $primary-color; }
    &--is-active::placeholder { color: $primary-color; }
    &--is-active::-moz-placeholder { color: $primary-color; }
    &--is-active:-ms-input-placeholder { color: $primary-color; }
    &--is-active:-moz-placeholder { color: $primary-color; }
  }

  &__month-day {
    visibility: visible;

    &--valid {
      cursor: pointer;
    }

    &--hidden {
      visibility: hidden;
      color: white;
      pointer-events: none;
    }
  }

  &__month-button {
    cursor: pointer;
    background: transparent url('ic-arrow-right-green.svg') no-repeat right center / 8px;
    width: 60px;
    height: 60px;


    &--prev { transform: rotateY(180deg); }

    &--next { float: right; }

    &--locked {
      opacity: .2;
      cursor: not-allowed;
    }
  }

  &__info {
    &--feedback {
      display: none;
    }

    &--error,
    &--help {
      display: block;
    }
  }

  &__tooltip {
    position: absolute;
  }
}

/* =============================================================
 * THEME
 * ============================================================*/
.datepicker {
  background-color: #fff;
  color: #484c55;
  font-size: 16px;
  line-height: 14px;
  overflow: hidden;

  &__inner {
    padding: 20px;
    float: left;

    @include device($up-to-tablet) {
      padding: 0;
    }
  }

  &__months {

    @include device($up-to-tablet) {
      margin-top: 92px;
      height: calc(100% - 65px);
      position: absolute;
      left: 0;
      top: 0;
      overflow: scroll;
    }

    &::before {
      background: #dcdcdc;
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
    border-bottom: 5px solid white;
    height: 38px;

    @include device($up-to-tablet) {
      box-shadow: 0 13px 18px -8px rgba(29,29,38,.07);
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
    font-weight: lighter;
    color: #9599aa;
    text-align: center;
  }

  &__month-day {
    will-change: auto;
    text-align: center;
    color: #acb2c1;
    margin: 0;
    border: 0;
    height: 40px;
    padding-top: 15px;

    &--invalid-range {
      background-color: rgba($primary-color, 0.3);
      color: #e8ebf4;
      cursor: not-allowed;
      position: relative;
    }

    &--invalid {
      color: #e8ebf4;
      cursor: not-allowed;
    }

    &--valid:hover {
      background-color: #fff;
      color: $primary-color;
      z-index: 1;
      position: relative;
      box-shadow: 0 0 10px 3px rgba(0, 202, 157, .4);
    }

    &--disabled {
      color: #e8ebf4;
      cursor: not-allowed;
      position: relative;
    }

    &--selected {
      background-color: rgba($primary-color, 0.5);
      color: #fff;

      &:hover {
        background-color: #fff;
        color: $primary-color;
        z-index: 1;
        position: relative;
        box-shadow: 0 0 10px 3px rgba(0, 202, 157, .4);
      }
    }

    &--hovering {
      background-color: rgba($primary-color, 0.5);
      color: #fff;

      &.datepicker__month-day--valid:hover {
        background-color: #fff;
        color: $primary-color;
        z-index: 1;
        position: relative;

        &::before,
        &::after {
          background-color: #fff;
          // border-radius: 50%;
          content: ' ';
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
          z-index: -1;
        }

        &:before {
          content: ' ';
          border-radius: 0 50% 50% 0;
          background-color: rgba($primary-color, 0.5);
        }
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
  }

  &__month-button {
    color: #9da6b8;
    display: inline-block;

    &:hover {
      color: darken(#9da6b8, 10%);
    }
  }

  &__topbar {
    height: 20px;
  }

  &__info-text {
    font-size: 13px;

    &--selected-days {
      font-size: 11px;
      font-style: normal;
    }
  }

  &__info {
    &--selected {
      font-size: 11px;
      text-transform: uppercase;
    }

    &--selected-label { color: #acb2c1; }

    &--error {
      color: red;
      font-size: 13px;
      font-style: italic;
    }

    &--help {
      color: #acb2c1;
      font-style: italic;
    }
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
    right: 0px;
    top: 0;
    transform: rotate(45deg);
    width: 40px;
  }

  &__tooltip {
    background-color: $dark-gray;
    color: #fff;
    border-radius: 2px;
    font-size: 11px;
    margin-top: -5px;
    padding: 5px 10px;
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
