<template>
  <div
    :class="[
      'datepicker__wrapper datepicker__wrapper',
      {
        'datepicker__wrapper--booking': bookings.length > 0,
        datepicker__fullview: alwaysVisible
      }
    ]"
    :ref="`DatePicker-${hash}`"
    v-if="show"
  >
    <div
      v-if="isOpen && isMobile"
      @click="closeMobileDatepicker"
      class="datepicker__close-button"
    >
      <i>+</i>
    </div>
    <div
      @click="toggleDatepicker"
      v-if="!alwaysVisible"
      :class="[
        'datepicker__dummy-wrapper',
        { 'datepicker__dummy-wrapper--is-active': isOpen }
      ]"
    >
      <date-input
        class="datepicker__input--first"
        :i18n="i18n"
        :input-date="formatDate(checkIn)"
        input-date-type="check-in"
        :is-open="isOpen"
        :single-day-selection="singleDaySelection"
      />

      <date-input
        v-if="!singleDaySelection"
        :i18n="i18n"
        :input-date="formatDate(checkOut)"
        input-date-type="check-out"
        :is-open="isOpen"
        :single-day-selection="singleDaySelection"
      />
    </div>
    <div
      class="datepicker__clear-button"
      tabindex="0"
      @click="clearSelection"
      v-if="showClearSelectionButton"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 68">
        <path d="M6.5 6.5l55 55M61.5 6.5l-55 55"></path>
      </svg>
    </div>
    <div
      :class="[
        'datepicker',
        {
          'show-tooltip': isMobile && showCustomTooltip && hoveringTooltip,
          'datepicker--open': isOpen && !alwaysVisible,
          'datepicker--closed': !isOpen && !alwaysVisible,
          'datepicker--right': positionRight
        }
      ]"
    >
      <div v-if="isOpen && isMobile">
        <div
          @click="toggleDatepicker"
          :class="[
            'datepicker__dummy-wrapper datepicker__dummy-wrapper--no-border',
            { 'datepicker__dummy-wrapper--is-active': isOpen }
          ]"
        >
          <date-input
            class="datepicker__input--first"
            :i18n="i18n"
            :input-date="formatDate(checkIn)"
            input-date-type="check-in"
            :is-open="isOpen"
            :single-day-selection="singleDaySelection"
          />

          <date-input
            v-if="!singleDaySelection"
            :i18n="i18n"
            :input-date="formatDate(checkOut)"
            input-date-type="check-out"
            :is-open="isOpen"
            :single-day-selection="singleDaySelection"
          />
        </div>

        <div class="datepicker__tooltip--mobile" v-if="hoveringTooltip">
          <template v-if="customTooltipMessage">
            {{ cleanString(customTooltipMessage) }}
          </template>
        </div>

        <DatePickerWeekRow
          v-if="!alwaysVisible"
          :dayNames="i18n['day-names']"
        />
      </div>

      <div v-if="isOpen || alwaysVisible" class="datepicker__inner">
        <div class="datepicker__header" v-if="isDesktop || alwaysVisible">
          <button
            type="button"
            class="datepicker__month-button datepicker__month-button--prev "
            @click="renderPreviousMonth"
            :tabindex="isOpen ? 0 : -1"
            :disabled="activeMonthIndex === 0"
          />
          <button
            type="button"
            class="datepicker__month-button datepicker__month-button--next "
            @click="renderNextMonth"
            :disabled="isPreventedMaxMonth"
            :tabindex="isOpen ? 0 : -1"
          />
        </div>

        <div
          ref="swiperWrapper"
          :class="[
            'datepicker__months',
            { 'datepicker__months--full': showSingleMonth || alwaysVisible }
          ]"
          v-if="
            isDesktop || alwaysVisible || (isMobile && isOpen && !alwaysVisible)
          "
        >
          <template v-if="isMobile">
            <button
              v-if="!alwaysVisible && activeMonthIndex > 0"
              class="datepicker__button-paginate--mobile datepicker__button-paginate--mobile--top"
              @click="renderPreviousMonth"
            >
              <i class="arrow"></i>
            </button>
          </template>

          <!-- Wait for create months -->
          <template v-if="months.length > 0">
            <div
              ref="datepickerMonth"
              class="datepicker__month"
              v-for="(month, monthIndex) in paginate"
              :data-key="activeMonthIndex + month"
              :key="`${datepickerMonthKey}-${month}`"
            >
              <template v-if="months[activeMonthIndex + month]">
                <p class="datepicker__month-name">
                  {{ months[activeMonthIndex + month].monthName }}
                </p>

                <DatePickerWeekRow
                  v-if="isDesktop || alwaysVisible"
                  :class="{
                    'datepicker__week-row--always-visible': alwaysVisible
                  }"
                  :dayNames="i18n['day-names']"
                />

                <div class="container-square">
                  <div
                    :class="[
                      'square',
                      { 'not-in-the-month': !day.belongsToThisMonth }
                    ]"
                    v-for="(day, dayIndex) in months[activeMonthIndex + month]
                      .days"
                    :data-testid="`daywrap-${formatDate(day.date)}`"
                    @mouseenter="mouseEnterDay(day)"
                    :key="`${datepickerDayKey}-${monthIndex}-${dayIndex}`"
                  >
                    <Day
                      v-show="day.belongsToThisMonth"
                      :activeMonthIndex="activeMonthIndex"
                      :bookings="sortBookings"
                      :checkIn="checkIn"
                      :checkIncheckOutHalfDay="checkIncheckOutHalfDay"
                      :checkInPeriod="checkInPeriod"
                      :checkOut="checkOut"
                      :date="day.date"
                      :disableCheckoutOnCheckin="disableCheckoutOnCheckin"
                      :duplicateBookingDates="duplicateBookingDates"
                      :hoveringDate="hoveringDate"
                      :hoveringPeriod="hoveringPeriod"
                      :i18n="i18n"
                      :isDesktop="isDesktop"
                      :isOpen="isOpen"
                      :minNightCount="minNightCount"
                      :nextDisabledDate="nextDisabledDate"
                      :nextPeriodDisableDates="nextPeriodDisableDates"
                      :options="$props"
                      :screenSize="screenSize"
                      :showCustomTooltip="showCustomTooltip"
                      :sortedDisabledDates="sortedDisabledDates"
                      :sortedPeriodDates="sortedPeriodDates"
                      :tooltipMessage="customTooltipMessage"
                      @clearSelection="clearSelection"
                      @bookingClicked="handleBookingClicked"
                      @dayClicked="handleDayClick"
                    />
                  </div>
                </div>
              </template>
            </div>
          </template>

          <button
            v-if="!alwaysVisible && isMobile"
            class="datepicker__button-paginate--mobile"
            :disabled="isPreventedMaxMonth"
            @click="renderNextMonth"
          >
            <i class="arrow"></i>
          </button>
        </div>

        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
import fecha from "fecha";
import Day from "../Day.vue";
import DateInput from "../DateInput.vue";
import DatePickerWeekRow from "../DatePickerWeekRow.vue";
import Helpers from "../helpers";

const defaulti18n = {
  night: "Night",
  nights: "Nights",
  "day-names": ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
  "check-in": "Check-in",
  "check-out": "Check-out",
  "month-names": [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  tooltip: {
    halfDayCheckIn: "Available CheckIn",
    halfDayCheckOut: "Available CheckOut",
    saturdayToSaturday: "Only Saturday to Saturday",
    sundayToSunday: "Only Sunday to Sunday",
    minimumRequiredPeriod: "%{minNightInPeriod} %{night} minimum."
  },
  week: "week",
  weeks: "weeks"
};

export default {
  name: "HotelDatePicker",
  components: {
    DateInput,
    DatePickerWeekRow,
    Day
  },
  props: {
    alwaysVisible: {
      type: Boolean,
      default: false
    },
    bookings: {
      type: Array,
      default() {
        return [];
      }
    },
    clickOutsideElementId: {
      type: String,
      default: ""
    },
    closeDatepickerOnClickOutside: {
      type: Boolean,
      default: true
    },
    countOfDesktopMonth: {
      type: Number,
      default: 2
    },
    countOfMobileMonth: {
      type: Number,
      default: 8
    },
    countOfTotalMonthByDefault: {
      type: Number,
      default: 12
    },
    disabledDates: {
      type: Array,
      default() {
        return [];
      }
    },
    disabledDaysOfWeek: {
      type: Array,
      default() {
        return [];
      }
    },
    displayClearButton: {
      type: Boolean,
      default: true
    },
    disableCheckoutOnCheckin: {
      type: Boolean,
      default: false
    },
    enableCheckout: {
      type: Boolean,
      default: false
    },
    endDate: {
      type: [Date, String, Number],
      default: Infinity
    },
    endingDateValue: {
      type: Date,
      default: null
    },
    firstDayOfWeek: {
      type: Number,
      default: 0
    },
    format: {
      type: String,
      default: "YYYY-MM-DD"
    },
    halfDay: {
      type: Boolean,
      default: true
    },
    hoveringTooltip: {
      default: true,
      type: [Boolean, Function]
    },
    i18n: {
      type: Object,
      default: () => defaulti18n
    },
    lastDateAvailable: {
      type: [Number, Date],
      default: Infinity
    },
    maxNights: {
      type: Number,
      default: null
    },
    minNights: {
      type: Number,
      default: 1
    },
    periodDates: {
      type: Array,
      default() {
        return [];
      }
    },
    positionRight: {
      type: Boolean,
      default: false
    },
    showSingleMonth: {
      type: Boolean,
      default: false
    },
    showYear: {
      type: Boolean,
      default: false
    },
    singleDaySelection: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: [Date, String],
      default() {
        return new Date();
      }
    },
    startingDateValue: {
      type: Date,
      default: null
    },
    tooltipMessage: {
      type: String,
      default: null
    },
    value: {
      type: String
    }
  },
  data() {
    return {
      activeMonthIndex: 0,
      checkIn: this.startingDateValue,
      checkIncheckOutHalfDay: {},
      checkInPeriod: {},
      checkOut: this.endingDateValue,
      customTooltip: "",
      customTooltipHalfday: "",
      datepickerDayKey: 0,
      datepickerMonthKey: 0,
      dynamicNightCounts: null,
      hash: Date.now(),
      hoveringDate: null,
      hoveringPeriod: {},
      isOpen: false,
      lastEnableDaysOfPeriod: null,
      months: [],
      nextDisabledDate: null,
      nextPeriod: null,
      nextPeriodDisableDates: [],
      screenSize: null,
      show: true,
      showCustomTooltip: false,
      sortedDisabledDates: null
    };
  },
  computed: {
    isMobile() {
      return this.screenSize !== "desktop";
    },
    isDesktop() {
      return this.screenSize === "desktop";
    },
    sortBookings() {
      if (this.bookings.length > 0) {
        const bookings = [...this.bookings];

        return bookings.sort((a, b) => {
          const aa = a.checkInDate
            .split("/")
            .reverse()
            .join();
          const bb = b.checkOutDate
            .split("/")
            .reverse()
            .join();

          // eslint-disable-next-line no-nested-ternary
          return aa < bb ? -1 : aa > bb ? 1 : 0;
        });
      }

      return [];
    },
    duplicateBookingDates() {
      return this.baseHalfDayDates.filter(
        (newArr => date => newArr.has(date) || !newArr.add(date))(new Set())
      );
    },
    baseHalfDayDates() {
      if (this.sortBookings.length > 0) {
        const bookings = this.sortBookings.map(x => [
          x.checkInDate,
          x.checkOutDate
        ]);

        return bookings.reduce((a, b) => {
          return a.concat(b);
        });
      }

      return this.disabledDates;
    },
    paginate() {
      if (this.isDesktop) {
        return this.paginateDesktop;
      }

      return this.paginateMobile;
    },
    paginateDesktop() {
      if (this.showSingleMonth) {
        return [0];
      }

      return this.numberToArr(this.countOfDesktopMonth);
    },
    paginateMobile() {
      if (this.showSingleMonth || this.alwaysVisible) {
        return [0];
      }

      return this.numberToArr(this.countOfMobileMonth);
    },
    customTooltipMessage() {
      let tooltip = "";
      const currentDate = this.hoveringDate;

      if (currentDate && (this.customTooltip || this.customTooltipHalfday)) {
        if (this.customTooltip && this.customTooltipHalfday) {
          tooltip = `${this.customTooltipHalfday}. <br/> ${this.customTooltip}`;
        } else if (this.customTooltipHalfday && !this.customTooltip) {
          tooltip = this.customTooltipHalfday;
        } else {
          tooltip = this.customTooltip;
        }

        return tooltip;
      }

      return this.tooltipMessage;
    },
    sortedPeriodDates() {
      if (this.periodDates) {
        const periodDates = [...this.periodDates];

        return periodDates
          .sort((a, b) => {
            const aa = a.startAt
              .split("/")
              .reverse()
              .join();
            const bb = b.startAt
              .split("/")
              .reverse()
              .join();

            // eslint-disable-next-line no-nested-ternary
            return aa < bb ? -1 : aa > bb ? 1 : 0;
          })
          .map(period => {
            const minimumDurationNights = period.periodType.includes("weekly")
              ? period.minimumDuration * 7
              : period.minimumDuration;

            return {
              ...period,
              minimumDurationNights
            };
          });
      }

      return this.periodDates;
    },
    isPreventedMaxMonth() {
      const lastIndexMonthAvailable = this.getMonthDiff(
        this.startDate,
        this.lastDateAvailable
      );

      if (this.isDesktop) {
        return this.activeMonthIndex >= lastIndexMonthAvailable - 1;
      }

      return (
        this.activeMonthIndex + this.countOfMobileMonth >=
        lastIndexMonthAvailable + 1
      );
    },
    minNightCount() {
      return this.dynamicNightCounts || this.minNights;
    },
    showClearSelectionButton() {
      return Boolean(
        (this.checkIn || this.checkOut) && this.displayClearButton
      );
    }
  },
  watch: {
    bookings() {
      this.createHalfDayDates(this.baseHalfDayDates);
    },
    disabledDates(newVal) {
      this.createHalfDayDates(newVal);
    },
    isOpen(value) {
      if (this.isMobile && !this.alwaysVisible) {
        const body = document.querySelector("body");

        if (value) {
          body.style.overflow = "hidden";

          this.$nextTick(() => {
            if (this.checkIn && this.checkOut) {
              const { swiperWrapper } = this.$refs;
              const currentSelectionIndex = this.checkOut
                ? this.getMonthDiff(new Date(), this.checkOut)
                : 0;

              if (currentSelectionIndex > 1) {
                const currentMonth = document.querySelectorAll(
                  `div[data-key="${currentSelectionIndex}"]`
                )[0];

                if (currentMonth)
                  swiperWrapper.scrollTop = currentMonth.offsetTop;
              }
            }
          });
        } else {
          body.style.overflow = "";
        }
      }
    },
    checkIn(newDate) {
      this.$emit("check-in-changed", newDate);
    },
    checkOut(newDate) {
      if (this.checkOut !== null) {
        this.hoveringDate = null;
        this.nextDisabledDate = null;
        this.createHalfDayDates(this.baseHalfDayDates);
        this.reRender();
        this.showCustomTooltip = false;
        this.isOpen = false;
      }

      this.$emit("check-out-changed", newDate);
    }
  },
  created() {
    if (
      this.checkIn &&
      this.startDate &&
      this.isDateBefore(
        this.dateFormater(this.checkIn),
        this.dateFormater(this.startDate)
      )
    ) {
      this.clearSelection();
    }

    fecha.i18n = {
      dayNames: this.i18n["day-names"],
      dayNamesShort: this.shortenString(this.i18n["day-names"], 3),
      monthNames: this.i18n["month-names"],
      monthNamesShort: this.shortenString(this.i18n["month-names"], 3),
      amPm: ["am", "pm"],
      // D is the day of the month, function returns something like...  3rd or 11th
      DoFn(D) {
        return (
          D +
          ["th", "st", "nd", "rd"][
            D % 10 > 3 ? 0 : ((D - (D % 10) !== 10) * D) % 10
          ]
        );
      }
    };
  },
  mounted() {
    this.handleWindowResize();
    this.constructMonth();

    window.addEventListener("resize", this.handleWindowResize);

    if (this.isDesktop) {
      document.addEventListener("click", this.handleClickOutside, false);
      document.addEventListener("keyup", this.escFunction, false);
    }

    this.onElementHeightChange(document.body, () => {
      this.emitHeighChangeEvent();
    });

    this.createHalfDayDates(this.baseHalfDayDates);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleWindowResize);

    if (this.isDesktop) {
      document.removeEventListener("keyup", this.escFunction, false);
      document.removeEventListener("click", this.handleClickOutside);
    }
  },
  methods: {
    ...Helpers,
    currentMonth(month) {
      return this.months[this.activeMonthIndex + month]?.days;
    },
    constructMonth() {
      const startDate = new Date(this.startDate);
      const diffMonthBetweenStarDateAndCheckOut = this.getMonthDiff(
        this.startDate,
        this.checkOut
      );
      const countOfMonth = this.isDesktop
        ? this.countOfDesktopMonth
        : this.countOfMobileMonth;

      // Create StartDate month
      this.createMonth(startDate);

      // If checkIn && checkOut && difference between startDate and checkOut
      if (
        this.checkIn &&
        this.checkOut &&
        diffMonthBetweenStarDateAndCheckOut > countOfMonth
      ) {
        // Create each month to nextMonthStartDate to checkOut date
        this.renderMultipleMonth(
          this.startDate,
          diffMonthBetweenStarDateAndCheckOut
        );
        const activeIndex = this.isDesktop ? 1 : this.countOfMobileMonth - 1;

        // Set the activeMonthIndex depend to device
        this.activeMonthIndex = Math.abs(
          diffMonthBetweenStarDateAndCheckOut - activeIndex
        );
      } else {
        // Create each month depending to countOfTotalMonthByDefault
        this.renderMultipleMonth(
          this.startDate,
          this.countOfTotalMonthByDefault - 1
        );
      }
    },
    numberToArr(number) {
      const arr = [];

      for (let i = 0; i <= number - 1; i++) {
        arr.push(i);
      }

      return arr;
    },
    renderMultipleMonth(date, max) {
      let nextMonth = new Date(date);
      const dates = [];

      for (let countMonth = 0; countMonth < max; countMonth++) {
        const tempNextMonth = this.getNextMonth(nextMonth);

        dates.push(tempNextMonth);
        nextMonth = tempNextMonth;
      }

      this.createMultipleMonth(dates);
    },
    getMonthName(day) {
      const currentMonth = this.i18n["month-names"][fecha.format(day, "M") - 1];
      const currentYear = this.showYear ? fecha.format(day, " YYYY") : "";

      return `${currentMonth} ${currentYear}`;
    },
    createMonth(date) {
      const firstDayOfMonth = this.getFirstDayOfMonth(date);
      const firstDay = this.getFirstDay(date, this.firstDayOfWeek);
      const month = {
        monthName: this.getMonthName(firstDayOfMonth),
        days: []
      };

      for (let i = 0; i < 42; i++) {
        const day = this.addDays(firstDay, i);

        month.days.push({
          date: day,
          belongsToThisMonth: day.getMonth() === date.getMonth()
        });
      }

      this.months.push(month);
    },
    createMultipleMonth(dates) {
      const months = [];

      for (let d = 0; d < dates.length; d++) {
        const currentDate = dates[d];
        const firstDayOfMonth = this.getFirstDayOfMonth(currentDate);
        const firstDay = this.getFirstDay(currentDate, this.firstDayOfWeek);
        const month = {
          monthName: this.getMonthName(firstDayOfMonth),
          days: []
        };

        for (let i = 0; i < 42; i++) {
          const day = this.addDays(firstDay, i);

          month.days.push({
            date: day,
            belongsToThisMonth: day.getMonth() === currentDate.getMonth()
          });
        }

        months.push(month);
      }

      this.months.push(...months);
    },
    handleBookingClicked(event, date, currentBooking) {
      this.$emit("bookingClicked", event, date, currentBooking);
    },
    escFunction(e) {
      const escTouch = 27;

      if (e.keyCode === escTouch && this.isOpen && this.checkIn) {
        this.clearSelection();
      }
    },
    formatDate(date) {
      return this.dateFormater(date, this.format);
    },
    cleanString(string) {
      // eslint-disable-next-line no-useless-escape
      return string.replace(/\<br\/>/g, "");
    },
    dateIsInCheckInCheckOut(date) {
      const compareDate = this.dateFormater(date);
      let currentPeriod = null;

      this.sortedPeriodDates.forEach(d => {
        if (
          d.endAt !== compareDate &&
          (d.startAt === compareDate ||
            this.validateDateBetweenTwoDates(d.startAt, d.endAt, compareDate))
        ) {
          currentPeriod = d;
        }
      });

      return currentPeriod;
    },
    dayIsDisabled(date) {
      if (
        this.checkIn &&
        !this.checkOut &&
        !this.isDateBefore(date, this.nextDisabledDate) &&
        this.nextDisabledDate !== Infinity
      ) {
        return true;
      }

      if (
        this.checkIn &&
        !this.checkOut &&
        this.isDateBefore(date, this.checkIn)
      ) {
        return true;
      }

      return false;
    },
    mouseEnterDay(day) {
      if (day.belongsToThisMonth) {
        const formatDate = this.dateFormater(day.date);
        const halfDays = Object.keys(this.checkIncheckOutHalfDay);
        const disableDays = this.disabledDates
          .filter(disableDate => !halfDays.includes(disableDate))
          .includes(formatDate);

        if (!this.dayIsDisabled(day.date) && !disableDays) {
          this.setCustomTooltipOnHover(day);
        }
      }
    },
    setCurrentPeriod(date, eventType) {
      let currentPeriod = {};

      if (this.sortedPeriodDates.length > 0) {
        this.sortedPeriodDates.forEach(d => {
          if (
            eventType === "click" &&
            (d.startAt === this.dateFormater(date) ||
              (d.endAt !== this.dateFormater(date) &&
                this.validateDateBetweenTwoDates(d.startAt, d.endAt, date)))
          ) {
            currentPeriod = d;
          } else if (
            eventType === "hover" &&
            (d.startAt === this.dateFormater(date) ||
              this.validateDateBetweenTwoDates(d.startAt, d.endAt, date))
          ) {
            currentPeriod = d;
          }
        });

        if (Object.keys(currentPeriod).length > 0) {
          this.hoveringPeriod = currentPeriod;
        } else if (this.minNightCount > 0 && this.checkIn) {
          this.hoveringPeriod = {
            periodType: "nightly",
            minimumDuration: this.minNightCount,
            startAt: this.checkIn,
            endAt: this.addDays(this.checkIn, this.minNightCount)
          };
        } else {
          this.hoveringPeriod = {
            periodType: "nightly",
            minimumDuration: this.minNightCount,
            startAt: this.checkIn,
            endAt: this.addDays(this.checkIn, this.minNightCount)
          };
        }
      } else if (this.minNightCount > 0) {
        this.hoveringPeriod = {
          periodType: "nightly",
          minimumDuration: this.minNightCount,
          startAt: this.checkIn,
          endAt: this.addDays(this.checkIn, this.minNightCount)
        };
      }
    },
    setCustomTooltipOnHover(day) {
      const { date } = day;

      this.hoveringDate = date;
      if (this.showCustomTooltip) this.showCustomTooltip = false;

      this.setCurrentPeriod(date, "hover");

      if (Object.keys(this.hoveringPeriod).length > 0) {
        // Create tooltip
        if (this.hoveringPeriod.periodType === "weekly_by_saturday") {
          const dayCode = 6;
          const text = this.i18n.tooltip.saturdayToSaturday;

          this.showTooltipWeeklyOnHover(date, dayCode, text);
        } else if (this.hoveringPeriod.periodType === "weekly_by_sunday") {
          const dayCode = 0;
          const text = this.i18n.tooltip.sundayToSunday;

          this.showTooltipWeeklyOnHover(date, dayCode, text);
        } else if (this.hoveringPeriod.periodType === "nightly") {
          this.showTooltipNightlyOnHover(date);
        } else {
          // Clean tooltip
          this.showCustomTooltip = false;
          this.customTooltip = "";
        }
      } else {
        this.hoveringPeriod = {};
      }

      if (this.halfDay) {
        this.createHalfDayTooltip(day.date);
      }
    },
    handleDayClick(event, date, formatDate, resetCheckin) {
      this.nextPeriodDisableDates = [];

      if (resetCheckin) {
        this.clearSelection();
        this.$nextTick(() => {
          this.handleDayClick(event, date, formatDate, false);
        });

        return;
      }

      let nextDisabledDate =
        (this.maxNights ? this.addDays(date, this.maxNights) : null) ||
        this.getNextDate(this.sortedDisabledDates, date) ||
        this.nextDateByDayOfWeekArray(this.disabledDaysOfWeek, date) ||
        this.nextBookingDate(date) ||
        Infinity;

      this.dynamicNightCounts = null;

      if (this.enableCheckout) {
        nextDisabledDate = Infinity;
      }

      if (this.checkIn == null && this.singleDaySelection === false) {
        this.checkIn = date;
        this.setMinimumDuration(date);
      } else if (this.singleDaySelection === true) {
        this.checkIn = date;
        this.checkOut = date;
      } else if (this.checkIn !== null && this.checkOut == null) {
        this.checkOut = date;
        this.$emit("periodSelected", event, this.checkIn, this.checkOut);
      } else {
        this.checkOut = null;
        this.checkIn = date;
        this.setMinimumDuration(date);
      }

      if (this.checkIn && !this.checkOut) {
        this.setCustomTooltipOnClick();
      }

      this.nextDisabledDate = nextDisabledDate;
      this.$emit("dayClicked", date, formatDate, nextDisabledDate);
    },
    nextBookingDate(date) {
      let closest = Infinity;

      if (this.sortBookings.length > 0) {
        const nextDateFormated = this.dateFormater(this.addDays(date, 1));
        const nextBooking = this.sortBookings.find(
          booking =>
            this.validateDateBetweenDate(
              booking.checkInDate,
              nextDateFormated
            ) ||
            this.validateDateBetweenTwoDates(
              booking.checkInDate,
              booking.checkOutDate,
              nextDateFormated
            )
        );

        closest = nextBooking ? nextBooking.checkInDate : Infinity;
      }

      return closest;
    },
    setCustomTooltipOnClick() {
      if (
        Object.keys(this.checkInPeriod).length > 0 &&
        this.checkInPeriod.periodType.includes("weekly")
      ) {
        const nextValidDate = this.addDays(
          this.checkIn,
          this.minNightCount - 1
        );

        this.$set(this.checkInPeriod, "nextValidDate", nextValidDate);
        this.showTooltipWeeklyOnClick();
      } else if (
        this.checkInPeriod.periodType === "nightly" &&
        this.isDateBefore(this.checkIn, this.lastEnableDaysOfPeriod)
      ) {
        this.showTooltipNightlyOnClick();
      } else if (
        this.checkInPeriod.periodType === "nightly" &&
        !this.isDateBefore(this.checkIn, this.lastEnableDaysOfPeriod)
      ) {
        const nextValidDate = this.addDays(
          this.checkIn,
          this.minNightCount - 1
        );

        this.$set(this.checkInPeriod, "nextValidDate", nextValidDate);
        this.showTooltipNightlyOnClick();
      } else {
        const nextValidDate = this.addDays(this.checkIn, this.minNightCount);

        this.$set(this.checkInPeriod, "nextValidDate", nextValidDate);
        this.$set(this.checkInPeriod, "periodType", "nightly");
        this.$set(this.checkInPeriod, "minimumDuration", this.minNightCount);
        this.$set(
          this.checkInPeriod,
          "minimumDurationNights",
          this.minNightCount
        );
        this.showTooltipNightlyOnClick();
      }
    },
    showTooltipWeeklyOnHover(date, periodDayType, text) {
      const countDaysBetweenCheckInCurrentDay = this.countDays(
        this.checkIn,
        date
      );
      const notOnPeriodDayType = date.getDay() !== periodDayType;
      const isCheckInCheckOut = this.checkIn && this.checkOut;
      const notCheckInNotPeriodDayType = !this.checkIn && notOnPeriodDayType;
      const isCheckInNotCheckOut = this.checkIn && !this.checkOut;
      const isNotBetweenCheckInAndCheckOut = !this.validateDateBetweenTwoDates(
        this.checkIn,
        this.checkOut,
        date
      );
      const notAllowDaysBetweenCheckInAndNextValidDate =
        this.hoveringPeriod.nextValidDate &&
        this.validateDateBetweenTwoDates(
          this.checkIn,
          this.hoveringPeriod.nextValidDate,
          this.hoveringDate
        ) &&
        this.dateFormater(this.checkIn) !==
          this.dateFormater(this.hoveringDate) &&
        this.dateFormater(this.hoveringPeriod.nextValidDate) !==
          this.dateFormater(this.hoveringDate);
      const hasHalfDayOnWeeklyPeriod =
        Object.keys(this.checkIncheckOutHalfDay).length > 0 &&
        this.checkIncheckOutHalfDay[this.dateFormater(date)] &&
        this.checkIncheckOutHalfDay[this.dateFormater(date)].checkIn;

      // Show tooltip on not-allowed day
      if (notCheckInNotPeriodDayType) {
        this.showCustomTooltip = true;
        this.customTooltip = text;
      } else {
        this.showCustomTooltip = false;
        this.customTooltip = "";
      }

      // Show tooltip when CheckIn
      if (isCheckInNotCheckOut) {
        const nextDayValid = this.addDays(this.checkIn, this.minNightCount);
        const isDateAfterMinimumDuration =
          this.getDayDiff(date, nextDayValid) <= 0;

        if (isDateAfterMinimumDuration && notOnPeriodDayType) {
          this.showCustomTooltip = true;
          this.customTooltip = text;
        } else if (
          notOnPeriodDayType ||
          notAllowDaysBetweenCheckInAndNextValidDate
        ) {
          if (
            this.checkInPeriod &&
            this.checkInPeriod.periodType === "nightly"
          ) {
            this.showCustomTooltip = false;
            this.customTooltip = "";
          } else {
            // Show default message on currentDay
            const night = this.pluralize(this.minNightCount, "week");

            this.showCustomTooltip = true;
            this.customTooltip = this.completeTrad(
              this.i18n.tooltip.minimumRequiredPeriod,
              { minNightInPeriod: this.minNightCount / 7, night }
            );
          }
        } else if (hasHalfDayOnWeeklyPeriod) {
          // Show the correct wording in comparison to periodType of this.checkInPeriod equal to "nightly" / "weekly"
          if (this.checkInPeriod.periodType !== "nightly") {
            this.customTooltip = `${countDaysBetweenCheckInCurrentDay /
              7} ${this.pluralize(this.minNightCount, "week")}`;
          } else if (this.checkInPeriod.periodType === "nightly") {
            this.customTooltip = `${countDaysBetweenCheckInCurrentDay} ${
              countDaysBetweenCheckInCurrentDay !== 1
                ? this.i18n.nights
                : this.i18n.night
            }`;
          }
        } else {
          // Clean tooltip
          this.showCustomTooltip = false;
          this.customTooltip = "";
        }
        // Show tooltip when CheckIn & CheckOut on all the days that are not between checkIn and CheckOut
      } else if (
        isCheckInCheckOut &&
        notOnPeriodDayType &&
        isNotBetweenCheckInAndCheckOut
      ) {
        this.showCustomTooltip = true;
        this.customTooltip = text;
      }
    },
    showTooltipWeeklyOnClick() {
      const night = this.pluralize(this.minNightCount, "week");

      this.showCustomTooltip = true;
      this.customTooltip = this.completeTrad(
        this.i18n.tooltip.minimumRequiredPeriod,
        { minNightInPeriod: this.minNightCount / 7, night }
      );
    },
    showTooltipNightlyOnHover(date) {
      if (this.checkIn && !this.checkOut) {
        const nextDayValid = this.addDays(this.checkIn, this.minNightCount);
        const isDateAfterMinimumDuration =
          this.getDayDiff(date, nextDayValid) <= 0;
        const countOfDays = this.countDays(this.checkIn, date);
        const night = this.pluralize(Math.max(this.minNightCount, countOfDays));

        if (!isDateAfterMinimumDuration) {
          const minNightInPeriod = this.hoveringPeriod.minimumDuration;

          this.showCustomTooltip = true;
          this.customTooltip = this.completeTrad(
            this.i18n.tooltip.minimumRequiredPeriod,
            { minNightInPeriod, night }
          );
        } else {
          this.customTooltip = `${countOfDays} ${night}`;
        }
      } else {
        this.customTooltip = "";
      }
    },
    showTooltipNightlyOnClick() {
      const minNightInPeriod = this.checkInPeriod.minimumDuration;
      const night = this.pluralize(this.minNightCount);

      this.showCustomTooltip = true;
      this.customTooltip = this.completeTrad(
        this.i18n.tooltip.minimumRequiredPeriod,
        { minNightInPeriod, night }
      );
    },
    createHalfDayTooltip(date) {
      this.customTooltipHalfday = "";
      const formatedHoveringDate = this.dateFormater(date);
      let nextBookableDate = null;

      if (this.checkIn) {
        nextBookableDate = this.addDays(
          this.checkIn,
          this.checkInPeriod.minimumDuration
        );
      }

      if (
        this.checkIncheckOutHalfDay[formatedHoveringDate] &&
        !this.isDateBefore(date, nextBookableDate)
      ) {
        this.showCustomTooltip = true;

        if (this.checkIncheckOutHalfDay[formatedHoveringDate].checkIn) {
          this.customTooltipHalfday = this.i18n.tooltip.halfDayCheckOut;
        } else if (this.checkIncheckOutHalfDay[formatedHoveringDate].checkOut) {
          this.customTooltipHalfday = this.i18n.tooltip.halfDayCheckIn;
        }
      }
    },
    completeTrad(translation, keys) {
      let newT = translation;
      const keysTranslations = Object.keys(keys);

      keysTranslations.forEach(key => {
        newT = newT.replace(`%{${key}}`, keys[key]);
      });

      return newT;
    },
    handleClickOutside(event) {
      const ignoredElement = this.$refs[`DatePicker-${this.hash}`];
      const ignoredOutsideElement =
        document.getElementById(this.clickOutsideElementId) || false;

      if (ignoredElement) {
        const isIgnoredElementClicked = ignoredElement.contains(event.target);
        let isIgnoredOutsideElementClicked = false;

        if (ignoredOutsideElement) {
          isIgnoredOutsideElementClicked = ignoredOutsideElement.contains(
            event.target
          );
        }

        if (!isIgnoredElementClicked && !isIgnoredOutsideElementClicked) {
          this.hideDatepicker();
        }
      }
    },
    handleWindowResize() {
      if (window.innerWidth >= 768) {
        this.screenSize = "desktop";
      } else {
        this.screenSize = "not-desktop";
      }

      return this.screenSize;
    },
    onElementHeightChange(el, callback) {
      let lastHeight = el.clientHeight;
      let newHeight = lastHeight;
      const newEl = el;

      (function run() {
        newHeight = el.clientHeight;

        if (lastHeight !== newHeight) {
          callback();
        }

        lastHeight = newHeight;

        if (newEl.onElementHeightChangeTimer) {
          clearTimeout(el.onElementHeightChangeTimer);
        }

        newEl.onElementHeightChangeTimer = setTimeout(run, 1000);
      })();
    },
    emitHeighChangeEvent() {
      this.$emit("height-changed");
    },
    reRender() {
      this.datepickerDayKey += 1;
      this.datepickerMonthKey += 1;
    },
    clearSelection() {
      this.hoveringDate = null;
      this.checkIn = null;
      this.checkOut = null;
      this.nextDisabledDate = null;
      this.nextPeriodDisableDates = [];
      this.showCustomTooltip = false;
      this.hoveringPeriod = {};
      this.checkInPeriod = {};
      this.createHalfDayDates(this.baseHalfDayDates);
      this.reRender();
      this.$emit("clear-selection");
    },
    closeMobileDatepicker() {
      this.hideDatepicker();
    },
    hideDatepicker() {
      this.clearCheckIn();

      this.isOpen = false;
    },
    showDatepicker() {
      this.isOpen = true;
    },
    toggleDatepicker() {
      this.clearCheckIn();

      this.isOpen = !this.isOpen;
    },
    clearCheckIn() {
      if (this.checkIn && !this.checkOut) {
        this.clearSelection();
      }
    },
    clickOutside() {
      if (this.show && this.closeDatepickerOnClickOutside) {
        this.hideDatepicker();
      }
    },
    setMinimumDuration(date) {
      this.nextPeriod = null;
      this.lastEnableDaysOfPeriod = null;

      if (this.checkIn && this.sortedPeriodDates) {
        const nextPeriodIsPriority = (
          currentPeriod = {},
          minimumDurationNights
        ) => {
          if (this.nextPeriod?.minimumDurationNights) {
            // If NextPeriod is a weekly period
            if (
              currentPeriod?.periodType === "nightly" &&
              this.nextPeriod.periodType.includes("weekly")
            ) {
              return true;
            }

            // If NextPeriod is a nightly period
            return (
              this.nextPeriod.minimumDurationNights > minimumDurationNights
            );
          }

          // If NextPeriod doesn't exist
          return false;
        };

        const getEnableNextDate = () => {
          let enableNextDate = this.addDays(
            this.checkIn,
            this.dynamicNightCounts - 1
          );

          if (this.nextPeriod.periodType.includes("weekly")) {
            const constraintPeriod =
              this.nextPeriod.periodType === "weekly_by_sunday" ? 0 : 6;

            enableNextDate = this.substractDays(
              this.getNextDay(enableNextDate, constraintPeriod),
              1
            );
          }

          return enableNextDate;
        };

        const setDisabledDays = () => {
          const enableNextDate = getEnableNextDate();
          const startDateCheckin = this.addDays(this.checkIn, 1);
          const newDisablesDates = this.getDaysArray(
            startDateCheckin,
            enableNextDate
          );

          this.nextPeriodDisableDates = newDisablesDates;
        };

        const getPeriod = currentDate => {
          const compareDate = this.dateFormater(currentDate);
          let day = null;

          this.sortedPeriodDates.forEach(d => {
            if (
              d.endAt !== compareDate &&
              (d.startAt === compareDate ||
                this.validateDateBetweenTwoDates(
                  d.startAt,
                  d.endAt,
                  currentDate
                ))
            ) {
              day = d;
            }
          });

          return day;
        };

        const currentPeriod = getPeriod(date);

        // If currentPeriod
        if (currentPeriod) {
          this.lastEnableDaysOfPeriod = this.substractDays(
            currentPeriod.endAt,
            currentPeriod.minimumDurationNights
          );

          const currentPeriodIndex = this.sortedPeriodDates.findIndex(
            p => p.startAt === currentPeriod.startAt
          );

          if (this.sortedPeriodDates.length > currentPeriodIndex) {
            this.nextPeriod = this.sortedPeriodDates[currentPeriodIndex + 1];
          }

          // Calculate dynamic minimum nights with nextPeriod
          if (
            !this.isDateBefore(this.checkIn, this.lastEnableDaysOfPeriod) &&
            nextPeriodIsPriority(
              currentPeriod,
              currentPeriod.minimumDurationNights
            )
          ) {
            this.dynamicNightCounts = this.nextPeriod.minimumDurationNights;
            this.checkInPeriod = { ...this.nextPeriod };
            setDisabledDays();
          } else {
            this.checkInPeriod = { ...currentPeriod };
            this.dynamicNightCounts = currentPeriod.minimumDurationNights;
            setDisabledDays();
          }

          // Else !currentPeriod
        } else {
          const checkInWithMinimumDuration = this.addDays(
            this.checkIn,
            this.minNightCount - 1
          );

          this.nextPeriod = getPeriod(checkInWithMinimumDuration);

          if (nextPeriodIsPriority({}, this.minNightCount)) {
            this.dynamicNightCounts = this.nextPeriod.minimumDurationNights;
            this.checkInPeriod = { ...this.nextPeriod };

            setDisabledDays();
          } else {
            this.dynamicNightCounts = 0;
          }
        }
      }
    },
    renderPreviousMonth() {
      if (this.activeMonthIndex >= 1) {
        this.activeMonthIndex--;
      }
    },
    renderNextMonth() {
      const countOfDesktopMonth = this.isDesktop
        ? this.countOfDesktopMonth
        : this.countOfMobileMonth;

      if (this.activeMonthIndex < this.months.length - countOfDesktopMonth) {
        this.activeMonthIndex++;

        return;
      }

      let firstDayOfLastMonth;

      if (this.isMobile) {
        firstDayOfLastMonth = this.months[this.months.length - 1].days.find(
          day => day.belongsToThisMonth === true
        );
      } else {
        firstDayOfLastMonth = this.months[this.activeMonthIndex + 1].days.find(
          day => day.belongsToThisMonth === true
        );
      }

      if (this.endDate !== Infinity) {
        if (
          fecha.format(firstDayOfLastMonth[0].date, "YYYYMM") ===
          fecha.format(new Date(this.endDate), "YYYYMM")
        ) {
          return;
        }
      }

      this.createMonth(this.getNextMonth(firstDayOfLastMonth.date));
      this.activeMonthIndex++;

      this.$emit("renderNextMonth");
    },
    setCheckIn(date) {
      this.checkIn = date;
    },
    setCheckOut(date) {
      this.checkOut = date;
    },
    createHalfDayDates(baseHalfDayDates) {
      // Copy of baseHalfDayDates
      let sortedDates = [];
      const newBaseHalfDayDates = JSON.parse(JSON.stringify(baseHalfDayDates));
      const checkIncheckOutHalfDay = {};

      // Sorted disabledDates
      newBaseHalfDayDates.sort((a, b) => {
        const aa = a
          .split("/")
          .reverse()
          .join();
        const bb = b
          .split("/")
          .reverse()
          .join();

        // eslint-disable-next-line no-nested-ternary
        return aa < bb ? -1 : aa > bb ? 1 : 0;
      });

      if (this.sortBookings.length === 0) {
        for (let i = 0; i < newBaseHalfDayDates.length; i++) {
          const newDate = newBaseHalfDayDates[i];

          if (this.halfDay) {
            const newDateIncrementOne = newBaseHalfDayDates[i + 1];

            if (i === 0) {
              checkIncheckOutHalfDay[newDate] = {
                checkIn: true
              };
            }

            if (
              !checkIncheckOutHalfDay[newDate] &&
              newBaseHalfDayDates[i + 1] &&
              this.getDayDiff(newDate, newDateIncrementOne) > 1
            ) {
              checkIncheckOutHalfDay[newDate] = {
                checkOut: true
              };
              checkIncheckOutHalfDay[newDateIncrementOne] = {
                checkIn: true
              };
            }

            if (i === newBaseHalfDayDates.length - 1) {
              checkIncheckOutHalfDay[
                newBaseHalfDayDates[newBaseHalfDayDates.length - 1]
              ] = {
                checkOut: true
              };
            }
          }

          sortedDates[i] = newBaseHalfDayDates[i];
        }
      } else {
        this.sortBookings.forEach(booking => {
          checkIncheckOutHalfDay[booking.checkInDate] = {
            checkIn: true
          };
          checkIncheckOutHalfDay[booking.checkOutDate] = {
            checkOut: true
          };
        });
      }

      if (this.halfDay) {
        const halfDays = Object.keys(checkIncheckOutHalfDay);

        sortedDates = sortedDates.filter(date => !halfDays.includes(date));
      }

      sortedDates = sortedDates.map(date => new Date(date));
      this.sortedDisabledDates = sortedDates.sort((a, b) => a - b);
      this.checkIncheckOutHalfDay = checkIncheckOutHalfDay;
      this.$emit("handleCheckIncheckOutHalfDay", this.checkIncheckOutHalfDay);
    }
  }
};
</script>

<style lang="scss" src="./index.scss"></style>
