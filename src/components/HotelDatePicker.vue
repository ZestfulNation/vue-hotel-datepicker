<template>
  <div class="datepicker__wrapper">
    <input
      class="datepicker__input"
      :value="value"
      :id="DatePickerID"
      :placeholder="placeholder"
      type="text"
      v-on:change="updateValues"/>
  </div>
</template>

<script>
import HotelDatepicker from '../vendor/hotel-datepicker.js';

const defaulti18n = {
    selected: 'Your stay:',
    night: 'Night',
    nights: 'Nights',
    button: 'Close',
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
        showBottomBar: {
          default: true,
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
          showBottomBar: this.showBottomBar,
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
$main-color: #17867f;
$medium-gray: #999999;
$dark-gray: #2d3047;

/* =============================================================
 * BASE STYLES
 * ============================================================*/
.datepicker {
  box-sizing: border-box;
  left: 0;
  // overflow: hidden;
  position: absolute;
  width: 260px;
  z-index: 1;

  &--open:before {
    content: '';
    background: $main-color;
    position: absolute;
    top: 0;
    left: 0;
    width: 234px;
    height: 2px;
  }

  &__wrapper {
    position: relative;
    display: inline-block;
  }

  &__input {
  	border: solid 1px #dbdbdb;
  	height: 30px;
    background: #fff url('calendar_icon.svg') no-repeat 5px center / 16px;
    box-sizing: border-box;
    color: gray;
    font-size: 12px;
    outline: none;
    padding: 4px 30px 2px 30px;
    width: 234px;
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
    transition-duration: 0.2s;
    transition-property: color, background-color, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    color: #acb2c1;
    padding: 9px 7px;

    &--invalid-range {
      background: rgba($main-color, 0.3);
      color: #fff;
      cursor: not-allowed;
      position: relative;
    }

    &--tmp {
      // background: red !important;
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
      background-color: rgba($main-color, 0.5);
      color: #fff;
    }

    &--hovering {
      background-color: rgba($main-color, 0.3);
      color: #fff;
    }

    &--today {
      background-color: #484c55;
      color: #fff;
    }

    &--first-day-selected,
    &--last-day-selected {
      background-color: $main-color;
      color: #fff;
    }

    &--last-day-selected:after {
      content: none;
    }
  }

  &__month-button {
    transition-duration: 0.2s;
    transition-property: color, background-color, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    color: #9da6b8;
    display: inline-block;
    padding: 5px 10px;

    &:hover {
      color: darken(#9da6b8, 10%);
    }
  }

  &__topbar {
    height: 20px;
  }

  &__bottombar {
    float: left;
    position: relative;
    width: 100%;
    background: white;
    margin-bottom: 0;
    padding: 10px 0 20px;
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
    color: $main-color;
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
    color: $main-color;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    margin-top: 0;
    outline: 0;
    position: absolute;
    right: 0;
    top: 3px;
    transform: rotate(45deg);
  }

  &__tooltip {
    background-color: $dark-gray;
    color: #fff;
    border-radius: 2px;
    font-size: 11px;
    margin-top: -5px;
    padding: 5px 10px;

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

@media (min-width: 768px) {
  .datepicker {
    width: 460px;
  }
  .datepicker__months {
    // overflow: hidden;
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
  // .datepicker__months:before {
  //   background: #dcdcdc;
  //   bottom: 0;
  //   content: '';
  //   display: block;
  //   left: 50%;
  //   position: absolute;
  //   top: 0;
  //   width: 1px;
  // }
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
