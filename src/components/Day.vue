<template lang='pug'>
  div
    span
    .datepicker__tooltip(v-if='showTooltip && this.options.hoveringTooltip' v-html='tooltipMessageDisplay')
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
    tooltipMessage: {
      default: null,
      type: String
    }
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
    tooltipMessageDisplay: function() {
      return this.tooltipMessage
      ? this.tooltipMessage
      : `${this.nightsCount} ${this.nightsCount !== 1 ?
              this.options.i18n['nights'] : this.options.i18n['night']}`
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
             this.options.minNights > 0 &&
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
        if ( this.checkIn !== null &&
            ( fecha.format(this.checkIn, 'YYYYMMDD') == fecha.format(this.date, 'YYYYMMDD') )
          ) {
          if (this.options.minNights == 0) {
            return "datepicker__month-day--first-day-selected"
          } else {
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
      this.checkIfDisabled();
      this.disableNextDays();
    },
    checkOut: function(date) {
      this.checkIfHighlighted();
    },
    sortedDisabledDates: function() {
      this.checkIfDisabled();
      this.checkIfHighlighted();
    },
  },

  methods: {
    ...Helpers,

    dayClicked(date) {
      if (this.isDisabled) {
        return
      }
      else {
        if (this.options.allowedRanges.length !== 0) {
          this.createAllowedCheckoutDays(date);
        }

        const nextDisabledDate = this.getNextDisabledDate(
          this.date,
          this.options,
          this.allowedCheckoutDays,
          this.sortedDisabledDates);

        this.$emit('dayClicked', { date, nextDisabledDate });
      }
    },

    checkIfDisabled() {
      this.isDisabled = this.checkIfDayIsDisabled(this.date, this.checkIn, this.checkOut, this.sortedDisabledDates, this.options);
    },

    checkIfHighlighted(){
      if ( this.checkIn !== null  && this.checkOut !== null && this.isDisabled == false) {
        this.isDateLessOrEquals(this.checkIn, this.date) &&
        this.isDateLessOrEquals(this.date, this.checkOut) ?
        this.isHighlighted = true : this.isHighlighted = false
      } else {
        this.isHighlighted = false;
      }
    },

    createAllowedCheckoutDays(date){
      this.allowedCheckoutDays = this.getAllowedCheckoutDays(date, this.options);
    },

    disableNextDays(){
      if ( !this.isDateLessOrEquals(this.date, this.nextDisabledDate)
            && this.nextDisabledDate !== Infinity) {
              this.isDisabled = true;
      }
      else if ( this.isDateLessOrEquals(this.date, this.checkIn) ) {
        this.isDisabled = true;
      }
      if ( this.compareDay(this.date, this.checkIn) == 0 && this.options.minNights == 0) {
        this.isDisabled = false;
      }
      if (this.isDateLessOrEquals(this.checkIn, this.date) && this.options.enableCheckout ){
        this.isDisabled = false;
      }
    },
  },

  beforeMount(){
    this.checkIfDisabled();
    this.checkIfHighlighted();
    if (this.checkIn && !this.checkOut) {
      this.disableNextDays();
    }
  },
}
</script>
