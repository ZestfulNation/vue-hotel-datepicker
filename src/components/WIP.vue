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

    )

    span.datepicker__month-button.datepicker__month-button--next(
      @click='renderNextMonth'
    )
    .square(v-for='dayName in this.i18n["day-names"]' v-text='dayName')
    div
      .datepicker__month-day(
        v-for='day in months[activeMonthIndex].days'
        @click='setCheckIn(day.date)'
        :style='` width: calc(100% / 7);\
                 float: left;\
                 color: ${day.belongsToThisMonth ? "" : "white" } `'

        v-text='getDay(day.date)'
      )
      hr
    .datepicker__month-day(
      v-for='day in months[activeMonthIndex+1].days'
      @click='setCheckIn(day.date)'
      :style='` width: calc(100% / 7);\
               float: left;\
               color: ${day.belongsToThisMonth ? "" : "white" } `'

      v-text='getDay(day.date)'
    )
    hr
</template>

<script>
import fecha from 'fecha';
import _ from 'lodash';

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
      currentDate: new Date(),
      months: [],
      activeMonthIndex: 0,
    };
  },

  watch: {
    date: function(val, oldVal){
      this.$emit('dateChanged', val, oldVal );
    }
  },

  methods: {
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
      console.log(date)
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

<style lang="scss">

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


$desktopLayoutWidth: 1020px;
/* =============================================================
 * BASE STYLES
 * ============================================================*/


.datepicker {
  left: 0;
  top: 48px;
  position: absolute;
  width: 260px;
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

     ~ .datepicker__dummy-wrapper { border: 1px solid $primary-color; }
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

    &--is-active {
      color: $primary-color;
    }
  }

  &__month {
    border-collapse: collapse;
    text-align: center;
    margin: 0 auto;

    &--month2 {
      display: none;
    }
  }

  &__month-day {
    &--valid {
      cursor: pointer;
    }

    &--lastMonth,
    &--nextMonth {
      visibility: hidden;
    }
  }

  &__month-button {
    cursor: pointer;
    background: transparent url('ic-arrow-right-green.svg') no-repeat right center / 8px;
    width: 100%;
    height: 60px;


    &--prev {
      transform: rotateY(180deg);
    }

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

  &--is-small {

    .datepicker__wrapper { background-position: 8px 14px; }

    .datepicker__dummy-wrapper { height: 44px; }

    .datepicker__dummy-input {
      height: 44px;
      line-height: 2.5;
    }

    .datepicker__clear-button {
      top: 3px;
      right: -3px;
    }

    &.datepicker__wrapper { background-position: 8px 13px; }

    .datepicker {
      right: 0;
      left: auto;
      top: 44px;
    }
  }

  &__inner { padding: 20px; }

  &__month { font-size: 12px; }

  &__month-caption {
    height: 2.5em;
    vertical-align: middle;
  }

  &__month-name {
    font-weight: 500;
    font-size: 16px;
    text-align: center;
  }

  &__week-days {
    height: 2em;
    vertical-align: middle;
  }

  &__week-row {
    border-bottom: 5px solid white;
    height: 38px;
  }

  &__week-name {
    font-size: 12px;
    font-weight: 400;
    font-weight: lighter;
    color: #9599aa;
    text-align: center;
  }

  &__month-day {
    will-change: auto;
    color: #acb2c1;
    margin: 0;
    border: 0;
    padding: 0;

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

    &--disabled {
      color: #e8ebf4;
      cursor: not-allowed;
      position: relative;
    }

    &--selected {
      background-color: rgba($primary-color, 0.5);
      color: #fff;
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

        &:after {
          box-shadow: 0 0 10px 3px rgba(0, 202, 157, .4);
        }
      }
    }

    &--today {
      background-color: $light-gray;
      color: $medium-gray;
    }

    &--first-day-selected {
      background: $primary-color;
      // background: $white url('range_start.jpg') no-repeat center right / 100% 100%;
    }
    &--last-day-selected {
      background: $primary-color;
      // background: $white url('range_end.png') no-repeat center left / 100% 100%;
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
    position: absolute;
    right: -18px;
    top: -17px;
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


@media (min-width: 320px) {
  .datepicker {
    width: 300px;
  }
}

@media (min-width: $desktopLayoutWidth) {
  .datepicker {
    width: 460px;
  }
  .datepicker__months {
    display: inline-block;
    width: 100%;
  }
  .datepicker__month {
    width: 200px;
  }
  .datepicker__month--month1 {
    float: left;
  }
  .datepicker__month--month2 {
    display: table;
    float: right;
  }
  .datepicker__month-button--disabled {
    visibility: hidden;
  }
  .datepicker__months {
    position: relative;
  }
  // Display a line between the months
  .datepicker__months:before {
    background: #dcdcdc;
    bottom: 0;
    content: '';
    display: block;
    left: 50%;
    position: absolute;
    top: 0;
    width: 1px;
  }
}

@media (min-width: $desktopLayoutWidth) {
  .datepicker {
    width: 560px;
  }
  .datepicker__month {
    width: 240px;
    table-layout: fixed;
  }
}



// Modifiers
.-is-hidden { display: none; }

</style>
