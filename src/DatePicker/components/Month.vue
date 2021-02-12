<template>
  <div ref="datepickerMonth" class="vhd__datepicker__month" @mouseenter="enterMonth($event)">
    <p class="vhd__datepicker__month-name">
      {{ monthName }}
    </p>
    <week-row v-bind="$props" />
    <div
      class="vhd__square"
      v-for="(day, dayIndex) in month.days"
      :key="`${dayKey}-${dayIndex}`"
      @mouseenter="enterDay($event, day)"
    >
      <Day
        v-bind="$props"
        :belongsToThisMonth="day.belongsToThisMonth"
        :date="day.date"
        @clear-selection="clearSelection"
        @booking-clicked="handleBookingClicked"
        @day-clicked="handleDayClick"
      />
    </div>
  </div>
</template>

<script>
import fecha from 'fecha'
import Day from './Day.vue'
import WeekRow from './WeekRow.vue'

export default {
  name: 'Month',
  components: {
    Day,
    WeekRow,
  },
  props: {
    month: {
      type: Object,
      required: true,
    },
    dayKey: {
      type: Number,
      required: true,
    },
    weekKey: {
      type: Number,
      required: true,
    },
    isDesktop: {
      type: Boolean,
      required: true,
    },
    showYear: {
      type: Boolean,
      required: true,
    },
    yearBeforeMonth: {
      type: Boolean,
      required: true,
    },
    firstDayOfWeek: {
      type: Number,
      required: true,
    },
    bookings: {
      type: Array,
      default: () => [],
    },
    activeMonthIndex: {
      type: Number,
    },
    checkIn: {
      type: Date,
    },
    checkIncheckOutHalfDay: {
      type: Object,
      default: () => ({}),
    },
    checkInPeriod: {
      type: Object,
      default: () => ({}),
    },
    checkOut: {
      type: Date,
    },
    disableCheckoutOnCheckin: {
      type: Boolean,
      default: false,
    },
    duplicateBookingDates: {
      type: Array,
      default: () => [],
    },
    hoveringDate: {
      type: Date,
    },
    hoveringPeriod: {
      type: Object,
      default: () => ({}),
    },
    hoveringTooltip: {
      default: true,
      type: Boolean,
    },
    i18n: {
      type: Object,
      default: () => ({}),
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    minNightCount: {
      type: Number,
      default: 0,
    },
    nextDisabledDate: {
      type: [Date, Number, String],
    },
    nextPeriodDisableDates: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
    },
    priceSymbol: {
      type: String,
      default: '',
    },
    screenSize: {
      type: String,
      default: '',
    },
    showCustomTooltip: {
      default: false,
      type: Boolean,
    },
    showPrice: {
      type: Boolean,
      default: false,
    },
    disabledDates: {
      type: Array,
      default: () => [],
    },
    sortedDisabledDates: {
      type: Array,
      default: () => [],
    },
    sortedPeriodDates: {
      type: Array,
      default: () => [],
    },
    tooltipMessage: {
      default: null,
      type: String,
    },
  },
  computed: {
    monthName() {
      return this.getMonth(this.month.days[15].date)
    },
  },
  methods: {
    getMonth(date) {
      const month = 'MMMM'
      const year = 'YYYY'
      let format = month
      // const i18n = { monthNames: this.i18n['month-names'] }

      if (this.showYear) {
        format = this.yearBeforeMonth ? `${year} ${month}` : `${month} ${year}`
      }

      return fecha.format(date, format).trim()
    },
    enterDay(event, day) {
      this.$emit('enter-day', event, day)
    },
    enterMonth(event) {
      this.$emit('enter-month', event, this.month)
    },
    clearSelection() {
      this.$emit('clear-selection')
    },
    handleBookingClicked(event, date, currentBooking) {
      this.$emit('booking-clicked', event, date, currentBooking)
    },
    handleDayClick(event, date, formatDate, resetCheckin) {
      this.$emit('day-clicked', event, date, formatDate, resetCheckin)
    },
  },
}
</script>

<style></style>
