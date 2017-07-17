<template>
  <div class="datepicker__wrapper">
    <input
      class="datepicker__input"
      :value="value"
      :id="DatePickerID"
      :placeholder="placeholder"
      type="text"
      v-on:change="updateValues"
      readonly/>
  </div>
</template>

<script>
import HotelDatepicker from '../vendor/hotel-datepicker.js';

const defaulti18n = {
    selected: 'Your stay:',
    night: 'Night',
    nights: 'Nights',
    button: 'Close',
    'check-in': 'Check-in',
    'check-out': 'Check-Out',
    'day-names': ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
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
    name: 'DatePicker',

    props: {
        value: {
          type: String
        },
        useDummyInputs: {
          default: false,
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
            date: '',
        };
    },

    watch: {
        date: function(val, oldVal){
          this.$emit('dateChanged', val, oldVal );
        }
    },

		mounted: function() {
			var hdpkr = new HotelDatepicker(document.getElementById(this.DatePickerID), {
          DatePickerID: this.DatePickerID,
          useDummyInputs: this.useDummyInputs,
          format: this.format,
          infoFormat: this.infoFormat,
          separator: this.separator,
          startOfWeek: this.startOfWeek,
          startDate: this.startDate,
          endDate: this.endDate,
          minNights: this.minNights,
          maxNights: this.maxNights,
          selectForward: this.selectForward,
          disabledDates: this.disabledDates,
          disabledDaysOfWeek: this.disabledDaysOfWeek,
          allowedRanges: this.allowedRanges,
          enableCheckout: this.enableCheckout,
          container: this.container,
          animationSpeed: this.animationSpeed,
          hoveringTooltip: this.hoveringTooltip,
          showCloseButton: this.showCloseButton,
          autoClose: this.autoClose,
          i18n: this.i18n,
      });

      this.updateValues()
		},

    methods: {
      updateValues() {
        var currentDate = document.getElementById(this.DatePickerID).value;
        this.date = currentDate;
      }
    }
};
</script>
<style lang="scss">
/* =============================================================
 * VARIABLES
 * ============================================================*/
$primary-color: #00ca9d;
$primary-color: $primary-color;
$medium-gray: #999999;
$dark-gray: #2d3047;

/* =============================================================
 * BASE STYLES
 * ============================================================*/
 *,
 *:after,
 *:before {
   box-sizing: border-box;
 }

.datepicker {
  left: 0;
  top: 50px;
  position: absolute;
  width: 260px;
  z-index: 1;

  &--open ~ .datepicker__dummy-wrapper { border: 1px solid $primary-color; }

  &__wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 48px;
    background: #fff url('calendar_icon.svg') no-repeat 10px center / 16px;
  }

  &__input {
  	background: transparent;
    border: 0;
    height: 48px;
    color: gray;
    font-size: 12px;
    outline: none;
    padding: 4px 30px 2px 30px;
    width: 100%;
    word-spacing: 5px;

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
    border: solid 1px #dbdbdb;
    cursor: pointer;
    display: block;
    float: left;
    width: 100%;
  }

  &__dummy-input {
    color: $medium-gray;
    float: left;
    height: 48px;
    line-height: 3;
    text-align: center;
    width: calc(50% - 2px);

    &:first-child {
      background: transparent url('ic-arrow-right.svg') no-repeat right center / 8px;
    }

    &--is-active {
      color: $primary-color;
    }
  }

  &__inner {
    // overflow: hidden;
  }

  &__month {
    border-collapse: collapse;
    text-align: center;
    width: 100%;

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
    height: 48px;


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
  box-shadow: 0 15px 30px 10px rgba(0, 0, 0, 0.08);
  color: #484c55;
  font-size: 14px;
  line-height: 14px;
  overflow: hidden;

  &__inner { padding: 20px; }

  &__month { font-size: 12px; }

  &__month-caption {
    border-bottom: 1px solid #dcdcdc;
    height: 2.5em;
    vertical-align: middle;
  }

  &__month-name {
    text-transform: uppercase;
  }

  &__week-days {
    height: 2em;
    vertical-align: middle;
  }

  &__week-name {
    font-size: 11px;
    font-weight: 400;
    text-transform: uppercase;
  }

  &__month-day {
    transition-duration: 0.1s;
    transition-property: all;
    transition-timing-function: ease-in-out;
    will-change: auto;
    color: #acb2c1;
    padding: 0;
    border-bottom: 5px solid white;
    height: 36px;
    width: 33px;

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
          transition: all .2s ease;
          transition-delay: 2s;
          position: absolute;
          background-color: #fff;
          border-radius: 50%;
          content: ' ';
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
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
      background-color: #484c55;
      color: #fff;
    }

    &--first-day-selected,
    &--last-day-selected {
      background-color: #fff;
      z-index: 1;
      position: relative;
      &::before,
      &::after {
        position: absolute;
        background-color: $primary-color;
        border-radius: 50%;
        content: ' ';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }
    }

    &--first-day-selected:before {
      content: ' ';
      border-radius: 50% 0 0 50%;
      background-color: rgba($primary-color, 0.5);
    }

    &--last-day-selected:before {
      content: ' ';
      border-radius: 0 50% 50% 0;
      background-color: rgba($primary-color, 0.5);
    }

  }

  &__month-button {
    transition-duration: 0.2s;
    transition-property: color, background-color, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
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
    margin-top: 0;
    outline: 0;
    position: absolute;
    right: 4px;
    top: 7px;
    transform: rotate(45deg);
  }

  &__tooltip {
    background-color: $dark-gray;
    color: #fff;
    border-radius: 2px;
    font-size: 11px;
    margin-top: -5px;
    padding: 5px 10px;
    z-index: 5;

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
    width: 270px;
  }
}

@media (min-width: 769px) {
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

@media (min-width: 768px) {
  .datepicker {
    width: 560px;
  }
  .datepicker__month {
    width: 240px;
  }
}

// Modifiers
.-is-hidden { display: none; }

</style>
