<template>
  <div>
    <div
      class="datepicker__tooltip"
      v-html="tooltipMessageDisplay"
      v-if="showTooltip && this.options.hoveringTooltip"
    />
    <div
      class="datepicker__month-day"
      @click.prevent.stop="dayClicked(date)"
      @keyup.enter.prevent.stop="dayClicked(date)"
      :class="[dayClass, checkinCheckoutClass]"
      :style="isToday ? currentDateStyle : ''"
      :tabindex="tabIndex"
      ref="day"
    >
      <div class="datepicker__month-day-wrapper">
        <span>{{ dayNumber }}</span>
        <strong v-if="showPrice && dayPrice" style="font-size: 10px">
          {{ dayPrice }}
        </strong>
      </div>
    </div>
  </div>
</template>

<script>
import fecha from "fecha";
import Helpers from "./helpers";

export default {
  name: "Day",
  props: {
    disableCheckoutOnCheckin: {
      type: Boolean,
      default: false
    },
    sortedPeriodDates: {
      type: Array,
      default: () => []
    },
    showPrice: {
      type: Boolean,
      default: false
    },
    isOpen: {
      type: Boolean,
      required: true
    },
    checkIncheckOutHalfDay: {
      type: Object,
      default: () => {}
    },
    sortedDisabledDates: {
      type: Array,
      default: () => []
    },
    nextPeriodDisableDates: {
      type: Array,
      default: () => []
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
    currentPeriod: {
      type: Object,
      default: () => {}
    },
    hoveringDate: {
      type: Date
    },
    mounseOverFunction: {
      type: Function
    },
    minNightCount: {
      type: Number,
      default: 0
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
    nextDisabledDate: {
      type: [Date, Number, String]
    },
    hoveringTooltip: {
      default: true,
      type: Boolean
    },
    showCustomTooltip: {
      default: false,
      type: Boolean
    },
    screenSize: {
      type: String,
      default: ""
    },
    tooltipMessage: {
      default: null,
      type: String
    },
    currentDateStyle: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      allowedCheckoutDays: [],
      currentDate: new Date(),
      isDisabled: false,
      isHighlighted: false
    };
  },
  computed: {
    dayNumber() {
      return fecha.format(this.date, "D");
    },
    dayPrice() {
      let currentDate = null;

      this.sortedPeriodDates.forEach(d => {
        if (
          this.validateDateBetweenTwoDates(d.startAt, d.endAt, this.formatDate)
        ) {
          currentDate = d;
        }
      });

      if (currentDate) {
        if (currentDate.periodType === "nightly") {
          return currentDate.price;
        }

        return Math.round(currentDate.price / 7);
      }

      return "";
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
        if (
          currentPeriod.periodType === "nightly" &&
          this.belongsToThisMonth &&
          !this.isDisabled
        ) {
          if (
            this.checkIn &&
            !this.checkOut &&
            this.notAllowedDayDueToNextPeriod(currentPeriod)
          ) {
            return "datepicker__month-day--not-allowed nightly datepicker__month-day--cliquable";
          }

          if (
            !this.checkIn &&
            !this.checkOut &&
            this.notAllowedDayDueToNextPeriod(currentPeriod)
          ) {
            return "datepicker__month-day--disabled datepicker__month-day--not-allowed nightly";
          }

          return "nightly";
        }

        // date.getDay() === 6 => saturday
        if (
          currentPeriod.periodType === "weekly_by_saturday" &&
          currentPeriod.startAt !== this.formatDate &&
          currentPeriod.endAt !== this.formatDate &&
          this.date.getDay() !== 6
        ) {
          return "datepicker__month-day--disabled datepicker__month-day--not-allowed weekly_by_saturday";
        }

        // date.getDay() === 0 => sunday
        if (
          currentPeriod.periodType === "weekly_by_sunday" &&
          currentPeriod.startAt !== this.formatDate &&
          currentPeriod.endAt !== this.formatDate &&
          this.date.getDay() !== 0
        ) {
          return "datepicker__month-day--disabled datepicker__month-day--not-allowed weekly_by_sunday";
        }

        return "nothing";
      }

      return "nothing";
    },
    formatDate() {
      return this.dateFormater(this.date);
    },
    tabIndex() {
      if (
        !this.isOpen ||
        !this.belongsToThisMonth ||
        this.isDisabled ||
        !this.isClickable()
      ) {
        return -1;
      }

      return 0;
    },
    nightsCount() {
      return this.countDays(this.checkIn, this.hoveringDate);
    },
    tooltipMessageDisplay() {
      return this.tooltipMessage
        ? this.tooltipMessage
        : `${this.nightsCount} ${
            this.nightsCount !== 1
              ? this.options.i18n.nights
              : this.options.i18n.night
          }`;
    },
    showTooltip() {
      if (this.screenSize === "desktop") {
        const showTooltipOnHalfDay =
          this.showCustomTooltip && this.date === this.hoveringDate;
        const showTooltip =
          !this.isDisabled &&
          this.belongsToThisMonth &&
          this.date === this.hoveringDate &&
          this.checkIn !== null &&
          this.checkOut === null;

        return showTooltipOnHalfDay || showTooltip;
      }

      return false;
    },
    isToday() {
      return this.compareDay(this.currentDate, this.date) === 0;
    },
    halfDayClass() {
      if (Object.keys(this.checkIncheckOutHalfDay).length > 0) {
        const keyDate = this.dateFormater(this.date);

        if (
          this.checkIncheckOutHalfDay[keyDate] &&
          this.checkIncheckOutHalfDay[keyDate].checkIn
        ) {
          return "datepicker__month-day--halfCheckIn datepicker__month-day--valid";
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
    dayClass() {
      if (this.belongsToThisMonth) {
        // Only hightlight dates that are on periods
        if (
          !this.checkOut &&
          !this.isDisabled &&
          this.checkIn &&
          this.currentPeriod &&
          this.isDateLessOrEquals(this.date, this.hoveringDate)
        ) {
          const countOfDays = this.countDays(this.checkIn, this.hoveringDate);
          const minNightInPeriod = this.currentPeriod.minNight;
          const modulo = countOfDays % minNightInPeriod;
          const isAWeekPeriod =
            this.currentPeriod.type && this.currentPeriod.type !== "nightly";
          const isInACurrentPeriod =
            this.getDayDiff(this.hoveringDate, this.currentPeriod.endAt) > 0;
          const isDateAfterNextDate =
            this.getDayDiff(this.hoveringDate, this.currentPeriod.nextDate) < 0;
          const isDateBeforeNextDate =
            this.getDayDiff(this.hoveringDate, this.currentPeriod.nextDate) > 0;
          let periodClass = "";

          if (isAWeekPeriod) {
            if (isInACurrentPeriod) {
              if (modulo === 0 && this.checkIn !== this.hoveringDate) {
                periodClass = "datepicker__month-day--selected";
              } else if (isDateAfterNextDate) {
                if (this.currentPeriod.type === "weekly_by_saturday") {
                  if (this.hoveringDate.getDay() !== 6) {
                    periodClass =
                      "datepicker__month-day--valid datepicker__month-day--disabled datepicker__month-day--not-allowed";
                  } else {
                    periodClass = "datepicker__month-day--selected";
                  }
                } else if (this.currentPeriod.type === "weekly_by_sunday") {
                  if (this.hoveringDate.getDay() !== 0) {
                    periodClass =
                      "datepicker__month-day--valid datepicker__month-day--disabled datepicker__month-day--not-allowed";
                  } else {
                    periodClass = "datepicker__month-day--selected";
                  }
                }
              } else if (minNightInPeriod > 1) {
                periodClass =
                  "datepicker__month-day--valid datepicker__month-day--disabled datepicker__month-day--not-allowed";
              }
            } else {
              periodClass = "datepicker__month-day--selected";
            }
          } else if (isDateBeforeNextDate) {
            if (minNightInPeriod > 1) {
              periodClass =
                "datepicker__month-day--valid datepicker__month-day--disabled datepicker__month-day--not-allowed";
            } else {
              periodClass =
                "datepicker__month-day--valid datepicker__month-day--disabled datepicker__month-day--not-allowed";
            }
          } else {
            periodClass = "datepicker__month-day--selected";
          }

          return periodClass;
        }

        // If the calendar has a minimum number of nights && !checkOut
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
          return "datepicker__month-day--valid datepicker__month-day--disabled datepicker__month-day--not-allowed";
        }

        if (
          !this.isDisabled &&
          this.date === this.hoveringDate &&
          this.checkIn !== null &&
          this.checkOut == null
        ) {
          return "datepicker__month-day--selected datepicker__month-day--hovering";
        }

        // If the calendar has allowed ranges
        if (this.options.allowedRanges.length !== 0) {
          if (
            !this.isDisabled &&
            this.checkIn !== null &&
            this.checkOut == null
          ) {
            // If the day is one of the allowed check out days and is not highlighted
            if (
              this.allowedCheckoutDays.some(
                i => this.compareDay(i, this.date) === 0 && !this.isHighlighted
              )
            ) {
              return "datepicker__month-day--allowed-checkout";
            }

            // If the day is one of the allowed check out days and is highlighted
            if (
              this.allowedCheckoutDays.some(
                i => this.compareDay(i, this.date) === 0 && this.isHighlighted
              )
            ) {
              return "datepicker__month-day--selected datepicker__month-day--allowed-checkout";
            }

            // If the day is not one of the allowed Checkout Days and is highlighted
            if (
              !this.allowedCheckoutDays.some(
                i => this.compareDay(i, this.date) === 0
              ) &&
              this.isHighlighted
            ) {
              return "datepicker__month-day--out-of-range datepicker__month-day--selected";
            }

            return "datepicker__month-day--out-of-range";
          }
        }

        // Highlight the selected dates and prevent the user from selecting
        // the same date for checkout and checkin
        if (
          this.checkIn !== null &&
          this.dateFormater(this.checkIn) === this.dateFormater(this.date)
        ) {
          if (this.minNightCount === 0) {
            return "datepicker__month-day--first-day-selected";
          }

          return "datepicker__month-day--disabled datepicker__month-day--first-day-selected";
        }

        if (this.checkOut !== null) {
          if (
            this.dateFormater(this.checkOut) === this.dateFormater(this.date)
          ) {
            if (this.halfDayClass) {
              return `datepicker__month-day--disabled datepicker__month-day--last-day-selected ${this.halfDayClass}`;
            }

            return "datepicker__month-day--disabled datepicker__month-day--last-day-selected";
          }
        }

        // Only highlight dates that are not disabled
        if (this.isHighlighted && !this.isDisabled) {
          if (
            this.options.disabledDaysOfWeek.some(
              i => i === fecha.format(this.date, "dddd")
            )
          ) {
            return "datepicker__month-day--selected datepicker__month-day--disabled";
          }

          if (
            this.isDateLessOrEquals(this.date, this.hoveringDate) ||
            (this.checkIn && this.checkOut)
          ) {
            return " datepicker__month-day--selected";
          }
        }

        if (
          this.isDisabled ||
          this.options.disabledDaysOfWeek.some(
            i => i === fecha.format(this.date, "dddd")
          )
        ) {
          return "datepicker__month-day--disabled";
        }
      } else if (!this.belongsToThisMonth) {
        return "datepicker__month-day--hidden";
      }

      if (this.halfDayClass) {
        return `${this.halfDayClass}`;
      }

      return "datepicker__month-day--valid";
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
          this.isDateLessOrEquals(this.checkIn, this.date) &&
          this.isDateLessOrEquals(this.date, this.hoveringDate)
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
          this.isDateLessOrEquals(this.checkIn, this.date) &&
          this.isDateLessOrEquals(this.date, this.checkOut)
        ) {
          this.isHighlighted = true;
        } else {
          this.isHighlighted = false;
        }
      } else if (this.checkIn !== null && this.checkOut == null) {
        this.disableNextDays();
      }
    },
    nextDisabledDate() {
      this.disableNextDays();
    },
    checkIn(date) {
      this.createAllowedCheckoutDays(date);
    }
  },
  beforeMount() {
    this.checkIfDisabled();
    this.checkIfHighlighted();
  },
  methods: {
    ...Helpers,
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
    isDateLessOrEquals(time1, time2) {
      return new Date(time1) <= new Date(time2);
    },
    isClickable() {
      if (this.$refs && this.$refs.day) {
        return getComputedStyle(this.$refs.day).pointerEvents !== "none";
      }

      return true;
    },
    compareDay(day1, day2) {
      const date1 = fecha.format(new Date(day1), "YYYYMMDD");
      const date2 = fecha.format(new Date(day2), "YYYYMMDD");

      if (date1 > date2) {
        return 1;
      }

      if (date1 === date2) {
        return 0;
      }

      if (date1 < date2) {
        return -1;
      }

      return null;
    },
    dayClicked(date) {
      let resetCheckin = false;
      let disableCheckoutOnCheckin = !this.disableCheckoutOnCheckin;

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

          if (this.options.allowedRanges.length !== 0) {
            this.createAllowedCheckoutDays(date);
          }

          this.$emit(
            "dayClicked",
            date,
            formatDate,
            this.allowedCheckoutDays,
            resetCheckin,
            this.belongsToThisMonth
          );
        } else {
          this.$emit("clearSelection");
          this.dayClicked(date);
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
          this.isDateLessOrEquals(this.checkIn, this.date) &&
          this.isDateLessOrEquals(this.date, this.checkOut)
        ) {
          this.isHighlighted = true;
        } else {
          this.isHighlighted = false;
        }
      }
    },
    createAllowedCheckoutDays(date) {
      this.allowedCheckoutDays = [];
      this.options.allowedRanges.forEach(i =>
        this.allowedCheckoutDays.push(this.addDays(date, i))
      );
      this.allowedCheckoutDays.sort((a, b) => a - b);
    },
    disableNextDays() {
      if (
        !this.isDateLessOrEquals(this.date, this.nextDisabledDate) &&
        this.nextDisabledDate !== Infinity
      ) {
        this.isDisabled = true;
      } else if (this.isDateLessOrEquals(this.date, this.checkIn)) {
        this.isDisabled = true;
      }

      if (
        this.compareDay(this.date, this.checkIn) === 0 &&
        this.minNightCount === 0
      ) {
        this.isDisabled = false;
      }

      if (
        this.isDateLessOrEquals(this.checkIn, this.date) &&
        this.options.enableCheckout
      ) {
        this.isDisabled = false;
      }
    }
  }
};
</script>
