<template>
  <div>
    <div
      class="datepicker__tooltip"
      v-html="tooltipMessageDisplay"
      v-if="showTooltip && options.hoveringTooltip"
    />
    <div
      :data-testid="`day-${formatDate}`"
      @click.prevent.stop="dayClicked($event, date)"
      :class="[
        'datepicker__month-day',
        dayClass,
        checkinCheckoutClass,
        bookingClass,
        { 'datepicker__month-day--today': isToday }
      ]"
      :tabindex="tabIndex"
      ref="day"
    >
      <div class="datepicker__month-day-wrapper">
        <span>{{ dayNumber }}</span>
      </div>
    </div>

    <BookingBullet
      v-if="currentBooking && !isDisabled"
      :currentBooking="currentBooking"
      :duplicateBookingDates="duplicateBookingDates"
      :formatDate="formatDate"
      :previousBooking="previousBooking"
    />
  </div>
</template>

<script>
import fecha from "fecha";
import Helpers from "./helpers";
import BookingBullet from "./BookingBullet.vue";

export default {
  name: "Day",
  components: {
    BookingBullet
  },
  props: {
    activeMonthIndex: {
      type: Number,
      default: 0
    },
    bookings: {
      type: Array,
      default: () => []
    },
    checkIn: {
      type: Date,
      default: new Date()
    },
    checkIncheckOutHalfDay: {
      type: Object,
      default: () => ({})
    },
    checkInPeriod: {
      type: Object,
      default: () => ({})
    },
    checkOut: {
      type: Date,
      default: new Date()
    },
    date: {
      type: Date,
      default: new Date()
    },
    disableCheckoutOnCheckin: {
      type: Boolean,
      default: false
    },
    duplicateBookingDates: {
      type: Array,
      default: () => []
    },
    hoveringDate: {
      type: Date
    },
    hoveringPeriod: {
      type: Object,
      default: () => ({})
    },
    hoveringTooltip: {
      default: true,
      type: Boolean
    },
    i18n: {
      type: Object,
      default: () => ({})
    },
    isDesktop: {
      type: Boolean,
      required: false
    },
    isOpen: {
      type: Boolean,
      required: true
    },
    minNightCount: {
      type: Number,
      default: 0
    },
    nextDisabledDate: {
      type: [Date, Number, String],
      default: new Date()
    },
    nextPeriodDisableDates: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object
    },
    screenSize: {
      type: String,
      default: ""
    },
    showCustomTooltip: {
      default: false,
      type: Boolean
    },
    sortedDisabledDates: {
      type: Array,
      default: () => []
    },
    sortedPeriodDates: {
      type: Array,
      default: () => []
    },
    tooltipMessage: {
      default: null,
      type: String
    }
  },
  data() {
    return {
      currentDate: new Date(),
      isDisabled: false,
      isHighlighted: false
    };
  },
  computed: {
    previousBooking() {
      let previousBooking = null;

      if (
        this.currentBooking &&
        this.duplicateBookingDates.includes(this.currentBooking.checkInDate)
      ) {
        previousBooking = this.bookings.find(
          booking =>
            booking.checkOutDate === this.formatDate &&
            this.duplicateBookingDates.includes(booking.checkOutDate)
        );
      }

      return previousBooking;
    },
    currentBooking() {
      return this.bookings.find(
        booking =>
          (this.duplicateBookingDates.includes(this.formatDate) &&
            booking.checkInDate === this.formatDate) ||
          (!this.duplicateBookingDates.includes(this.formatDate) &&
            this.validateDateBetweenTwoDates(
              booking.checkInDate,
              booking.checkOutDate,
              this.formatDate
            ))
      );
    },
    dayNumber() {
      return fecha.format(this.date, "D");
    },
    halfDayClass() {
      if (Object.keys(this.checkIncheckOutHalfDay).length > 0) {
        const keyDate = this.dateFormater(this.date);

        if (
          this.checkIncheckOutHalfDay[keyDate] &&
          this.checkIncheckOutHalfDay[keyDate].checkIn
        ) {
          if (this.checkIn && !this.checkOut) {
            return "datepicker__month-day--halfCheckIn datepicker__month-day--valid";
          }

          return "datepicker__month-day--halfCheckIn datepicker__month-day--invalid";
        }

        if (
          this.checkIncheckOutHalfDay[keyDate] &&
          this.checkIncheckOutHalfDay[keyDate].checkOut
        ) {
          return "datepicker__month-day--halfCheckOut datepicker__month-day--valid";
        }
      }

      return false;
    },
    bookingClass() {
      if (this.bookings.length > 0 && this.currentBooking) {
        if (
          !this.isDisabled &&
          this.validateDateBetweenTwoDates(
            this.currentBooking.checkInDate,
            this.currentBooking.checkOutDate,
            this.hoveringDate
          )
        ) {
          if (this.checkIncheckOutHalfDay[this.formatDate]) {
            if (this.checkIn && !this.checkOut) {
              return "datepicker__month-day--not-allowed datepicker__month-day--hovering";
            }

            if (this.checkIncheckOutHalfDay[this.formatDate].checkOut) {
              return "datepicker__month-day--not-allowed datepicker__month-day--hovering";
            }

            return "datepicker__month-day--not-allowed datepicker__month-day--invalid";
          }

          if (this.checkIn && !this.checkOut) {
            return "datepicker__month-day--not-allowed datepicker__month-day--invalid";
          }

          return "datepicker__month-day--not-allowed datepicker__month-day--hovering";
        }

        if (
          this.checkIncheckOutHalfDay[this.formatDate] &&
          this.checkIncheckOutHalfDay[this.formatDate].checkOut &&
          !this.duplicateBookingDates.includes(this.formatDate)
        ) {
          if (!this.checkIn) {
            return "datepicker__month-day--not-allowed datepicker__month-day--hovering";
          }

          if (
            (this.checkIn && this.checkIn === this.date) ||
            (this.checkIn && this.checkOut)
          ) {
            return "datepicker__month-day--not-allowed datepicker__month-day--hovering";
          }
        }

        if (this.checkIn && !this.checkOut && this.hoveringDate === this.date) {
          return "datepicker__month-day--not-allowed datepicker__month-day--hovering";
        }

        return "datepicker__month-day--not-allowed datepicker__month-day--invalid";
      }

      return "";
    },
    dayClass() {
      // If the calendar has a minimum number of nights && !checkOut
      const nextValidDate = this.addDays(this.checkIn, this.minNightCount);
      const isDateAfterMinimumDuration =
        this.getDayDiff(this.hoveringDate, nextValidDate) <= 0;

      if (
        !isDateAfterMinimumDuration &&
        !this.checkOut &&
        !this.isDisabled &&
        this.compareDay(this.date, this.checkIn) === 1 &&
        this.minNightCount > 0 &&
        this.compareDay(
          this.date,
          this.addDays(this.checkIn, this.minNightCount)
        ) === -1
      ) {
        return "datepicker__month-day--valid datepicker__month-day--disabled datepicker__month-day--not-allowed minimumDurationUnvalidDay";
      }

      // Current Day
      if (
        !this.isDisabled &&
        this.date === this.hoveringDate &&
        this.checkIn !== null &&
        this.checkOut == null
      ) {
        return "datepicker__month-day--selected datepicker__month-day--hovering currentDay";
      }

      // Highlight the selected dates and prevent the user from selecting
      // the same date for checkout and checkin
      if (
        this.checkIn !== null &&
        this.dateFormater(this.checkIn) === this.dateFormater(this.date)
      ) {
        if (this.minNightCount === 0) {
          return "datepicker__month-day--first-day-selected checkIn";
        }

        // Good
        return "datepicker__month-day--disabled datepicker__month-day--first-day-selected checkIn";
      }

      // Checkout day
      if (this.checkOut !== null) {
        if (this.dateFormater(this.checkOut) === this.dateFormater(this.date)) {
          if (this.halfDayClass) {
            return `datepicker__month-day--disabled datepicker__month-day--last-day-selected ${this.halfDayClass} checkOut`;
          }

          return "datepicker__month-day--disabled datepicker__month-day--last-day-selected checkOut";
        }
      }

      // Only highlight dates that are not disabled
      if (this.isHighlighted && !this.isDisabled) {
        if (
          this.options.disabledDaysOfWeek.some(
            i => i === fecha.format(this.date, "dddd")
          )
        ) {
          return "datepicker__month-day--selected datepicker__month-day--disabled afterMinimumDurationValidDay";
        }

        if (
          Object.keys(this.checkInPeriod).length > 0 &&
          this.checkInPeriod.periodType.includes("weekly") &&
          this.hoveringDate &&
          this.isDateBefore(this.date, this.hoveringDate)
        ) {
          // If currentPeriod has a minimumDuration 1
          if (this.checkInPeriod.minimumDuration === 1) {
            return "datepicker__month-day--selected afterMinimumDurationValidDay";
          }

          // If currentPeriod has a minimumDuration superior to 1
          if (
            this.getDayDiff(
              this.hoveringDate,
              this.checkInPeriod.nextValidDate
            ) <= 0
          ) {
            return "datepicker__month-day--selected afterMinimumDurationValidDay";
          }
        } else if (
          Object.keys(this.checkInPeriod).length > 0 &&
          this.checkInPeriod.periodType === "nightly" &&
          this.hoveringDate &&
          this.hasWeeklyPeriod()
        ) {
          return "datepicker__month-day--selected afterMinimumDurationValidDay";
        }

        if (
          this.hoveringPeriod.periodType === "nightly" &&
          this.isDateBefore(this.date, this.hoveringDate)
        ) {
          return "datepicker__month-day--selected afterMinimumDurationValidDay";
        }

        if (this.checkIn && this.checkOut) {
          return "datepicker__month-day--selected";
        }
      }

      // Good
      if (
        this.isDisabled ||
        this.options.disabledDaysOfWeek.some(
          i => i === fecha.format(this.date, "dddd")
        )
      ) {
        return "datepicker__month-day--disabled";
      }

      if (this.halfDayClass) {
        return `${this.halfDayClass}`;
      }

      // Set disabled the day before the minimum duration
      if (
        !this.checkOut &&
        !this.isDisabled &&
        this.compareDay(this.date, this.checkIn) === 1 &&
        this.minNightCount > 0 &&
        this.compareDay(
          this.date,
          this.addDays(this.checkIn, this.minNightCount)
        ) === -1
      ) {
        return "datepicker__month-day--valid datepicker__month-day--disabled datepicker__month-day--not-allowed minimumDurationUnvalidDay";
      }

      return "datepicker__month-day--valid";
    },
    checkinCheckoutClass() {
      let currentPeriod = null;

      this.sortedPeriodDates.forEach(d => {
        if (
          d.endAt !== this.formatDate &&
          (d.startAt === this.formatDate ||
            this.validateDateBetweenTwoDates(
              d.startAt,
              d.endAt,
              this.formatDate
            ))
        ) {
          currentPeriod = d;
        }
      });

      if (
        this.nextPeriodDisableDates
          ? this.nextPeriodDisableDates.some(
              i => this.compareDay(i, this.date) === 0
            )
          : null
      ) {
        return "datepicker__month-day--disabled datepicker__month-day--not-allowed nightly";
      }

      if (currentPeriod) {
        if (currentPeriod.periodType === "nightly" && !this.isDisabled) {
          return "nightly";
        }

        return this.weeklyClasses(currentPeriod, currentPeriod.periodType);
      }

      return "";
    },
    formatDate() {
      return this.dateFormater(this.date);
    },
    tabIndex() {
      if (!this.isOpen || this.isDisabled || !this.isClickable()) {
        return -1;
      }

      return 0;
    },
    nightsCount() {
      return this.countDays(this.checkIn, this.hoveringDate);
    },
    tooltipMessageDisplay() {
      const dateIsInPeriod = this.validateDateBetweenTwoDates(
        this.hoveringPeriod.startAt,
        this.hoveringPeriod.endAt,
        this.date
      );
      const checkInIsInPeriod = this.validateDateBetweenTwoDates(
        this.hoveringPeriod.startAt,
        this.hoveringPeriod.endAt,
        this.checkIn
      );

      if (this.tooltipMessage) {
        return this.tooltipMessage;
      }

      if (
        this.hoveringPeriod &&
        this.hoveringPeriod.type !== "nightly" &&
        dateIsInPeriod &&
        checkInIsInPeriod &&
        this.nightsCount >= 7
      ) {
        return `${this.nightsCount / 7} ${this.pluralize(
          this.nightsCount,
          "week"
        )}`;
      }

      if (this.nightsCount >= 1) {
        return `${this.nightsCount} ${
          this.nightsCount !== 1 ? this.i18n.nights : this.i18n.night
        }`;
      }

      return "";
    },
    showTooltip() {
      if (this.screenSize === "desktop" || this.screenSize === "tablet") {
        const showCustomTooltip =
          this.showCustomTooltip && this.date === this.hoveringDate;
        const showDefaultTooltip =
          !this.isDisabled &&
          this.date === this.hoveringDate &&
          this.tooltipMessageDisplay.length > 0 &&
          this.checkIn !== null &&
          this.checkOut === null;

        return showCustomTooltip || showDefaultTooltip;
      }

      return false;
    },
    isToday() {
      return this.compareDay(this.currentDate, this.date) === 0;
    }
  },
  watch: {
    hoveringDate() {
      if (
        this.checkIn !== null &&
        this.checkOut == null &&
        this.isDisabled === false
      ) {
        if (
          this.isDateBefore(this.checkIn, this.date) &&
          this.isDateBefore(this.date, this.hoveringDate)
        ) {
          this.isHighlighted = true;
        } else {
          this.isHighlighted = false;
        }
      }
    },
    activeMonthIndex() {
      this.checkIfDisabled();
      this.checkIfHighlighted();

      if (this.checkIn !== null && this.checkOut !== null) {
        if (
          this.isDateBefore(this.checkIn, this.date) &&
          this.isDateBefore(this.date, this.checkOut)
        ) {
          this.isHighlighted = true;
        } else {
          this.isHighlighted = false;
        }
      } else if (this.checkIn !== null && this.checkOut === null) {
        this.disableNextDays();
      }
    },
    nextDisabledDate() {
      this.disableNextDays();
    }
  },
  beforeMount() {
    this.checkIfDisabled();
    this.checkIfHighlighted();
  },
  methods: {
    ...Helpers,
    hasWeeklyPeriod() {
      const hasWeeklyMonday =
        this.hoveringPeriod.periodType === "weekly_by_monday" &&
        this.hoveringDate.getDay() === 1;
      const hasWeeklySunday =
        this.hoveringPeriod.periodType === "weekly_by_sunday" &&
        this.hoveringDate.getDay() === 0;
      const hasWeeklySaturday =
        this.hoveringPeriod.periodType === "weekly_by_saturday" &&
        this.hoveringDate.getDay() === 6;

      return (
        (this.hoveringPeriod.periodType.includes("weekly") &&
          hasWeeklyMonday) ||
        hasWeeklySunday ||
        (hasWeeklySaturday && this.isDateBefore(this.date, this.hoveringDate))
      );
    },
    weeklyClasses(currentPeriod, periodType) {
      let dayIndex = null;

      if (periodType === "weekly_by_saturday") {
        dayIndex = 6;
      } else if (periodType === "weekly_by_sunday") {
        dayIndex = 0;
      } else if (periodType === "weekly_by_monday") {
        dayIndex = 1;
      }

      if (
        currentPeriod.periodType === periodType &&
        currentPeriod.startAt !== this.formatDate &&
        currentPeriod.endAt !== this.formatDate &&
        this.date.getDay() !== dayIndex
      ) {
        return `datepicker__month-day--disabled datepicker__month-day--not-allowed ${periodType}`;
      }

      // Disable date between checkIn and nextDate, if minimumDuration is superior to 1
      if (this.notAllowDaysBetweenCheckInAndNextValidDate(dayIndex)) {
        return `datepicker__month-day--disabled datepicker__month-day--not-allowed ${periodType}`;
      }

      return "";
    },
    notAllowDaysBetweenCheckInAndNextValidDate(dayCode) {
      return (
        this.checkIn &&
        !this.checkOut &&
        this.date.getDay() === dayCode &&
        Object.keys(this.hoveringPeriod).length > 0 &&
        this.validateDateBetweenTwoDates(
          this.checkIn,
          this.hoveringPeriod.nextValidDate,
          this.date
        ) &&
        this.dateFormater(this.checkIn) !== this.formatDate &&
        this.dateFormater(this.hoveringPeriod.nextValidDate) !== this.formatDate
      );
    },
    notAllowedDayDueToNextPeriod(currentPeriod) {
      // Check if the next period is directly after the current period
      const date = new Date(currentPeriod.endAt);
      let nextPeriod = null;

      this.sortedPeriodDates.forEach(period => {
        const dateA = new Date(period.startAt).setHours(0, 0, 0, 0);
        const dateB = new Date(date).setHours(0, 0, 0, 0);

        if (dateA === dateB) {
          nextPeriod = period;
        }
      });

      if (nextPeriod) {
        // Subtract the startAt nextPeriod to the currentPeriod minimumDuration
        const subtractTimestamp = new Date(nextPeriod.startAt).setHours(
          0,
          0,
          0,
          0
        );
        const subtractDate = new Date(subtractTimestamp);
        const resultDate = new Date(
          subtractDate.setDate(
            subtractDate.getDate() - currentPeriod.minimumDuration
          )
        );

        if (
          !this.validateDateBetweenTwoDates(
            currentPeriod.startAt,
            resultDate,
            this.date
          )
        ) {
          return true;
        }
      }

      return false;
    },
    isClickable() {
      if (this.$refs && this.$refs.day) {
        return getComputedStyle(this.$refs.day).pointerEvents !== "none";
      }

      return true;
    },
    dayClicked(event, date) {
      let resetCheckin = false;
      let disableCheckoutOnCheckin = !this.disableCheckoutOnCheckin;

      if (
        !this.checkIncheckOutHalfDay[this.formatDate] &&
        this.currentBooking
      ) {
        this.$emit("bookingClicked", event, date, this.currentBooking);

        return;
      }

      if (this.disableCheckoutOnCheckin) {
        if (this.checkIn && this.checkIn === date) {
          if (this.checkOut) {
            disableCheckoutOnCheckin = true;
            resetCheckin = true;
          } else {
            disableCheckoutOnCheckin = false;
            this.$emit("clearSelection");
          }
        } else {
          disableCheckoutOnCheckin = true;
        }
      }

      if (disableCheckoutOnCheckin) {
        if (!this.isDisabled || this.isClickable()) {
          const formatDate = this.dateFormater(date);

          this.$emit("dayClicked", event, date, formatDate, resetCheckin);
        } else {
          this.$emit("clearSelection");
          this.dayClicked(event, date);
        }
      }
    },
    compareEndDay() {
      if (this.options.endDate !== Infinity) {
        return this.compareDay(this.date, this.options.endDate) === 1;
      }

      return false;
    },
    checkIfDisabled() {
      this.isDisabled =
        // If this day is equal any of the disabled dates
        (this.sortedDisabledDates
          ? this.sortedDisabledDates.some(
              i => this.compareDay(i, this.date) === 0
            )
          : null) ||
        // Or is before the start date
        this.compareDay(this.date, this.options.startDate) === -1 ||
        // Or is after the end date
        this.compareEndDay() ||
        // Or is in one of the disabled days of the week
        this.options.disabledDaysOfWeek.some(
          i => i === fecha.format(this.date, "dddd")
        );

      // Handle checkout enabled
      if (this.options.enableCheckout) {
        if (
          this.compareDay(this.date, this.checkIn) === 1 &&
          this.compareDay(this.date, this.checkOut) === -1
        ) {
          this.isDisabled = false;
        }
      }
    },
    checkIfHighlighted() {
      if (
        this.checkIn !== null &&
        this.checkOut !== null &&
        this.isDisabled === false
      ) {
        if (
          this.isDateBefore(this.checkIn, this.date) &&
          this.isDateBefore(this.date, this.checkOut)
        ) {
          this.isHighlighted = true;
        } else {
          this.isHighlighted = false;
        }
      }
    },
    disableNextDays() {
      if (
        !this.isDateBefore(this.date, this.nextDisabledDate) &&
        this.nextDisabledDate !== Infinity
      ) {
        this.isDisabled = true;
      } else if (this.isDateBefore(this.date, this.checkIn)) {
        this.isDisabled = true;
      }

      if (
        this.compareDay(this.date, this.checkIn) === 0 &&
        this.minNightCount === 0
      ) {
        this.isDisabled = false;
      }

      if (
        this.isDateBefore(this.checkIn, this.date) &&
        this.options.enableCheckout
      ) {
        this.isDisabled = false;
      }
    }
  }
};
</script>
