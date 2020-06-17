<template>
  <div class="datepicker__wrapper" :ref="`DatePicker-${hash}`" v-if="show">
    <div
      class="datepicker__close-button -hide-on-desktop"
      v-if="isOpen"
      @click="closeMobileDatepicker"
    >
      <i>+</i>
    </div>
    <div
      class="datepicker__dummy-wrapper"
      :class="{ 'datepicker__dummy-wrapper--is-active': isOpen }"
    >
      <date-input
        :i18n="i18n"
        :input-date="formatDate(checkIn)"
        input-date-type="check-in"
        :is-open="isOpen"
        :toggle-datepicker="toggleDatepicker"
        :single-day-selection="singleDaySelection"
      />

      <date-input
        v-if="!singleDaySelection"
        :i18n="i18n"
        :input-date="formatDate(checkOut)"
        input-date-type="check-out"
        :is-open="isOpen"
        :toggle-datepicker="toggleDatepicker"
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
      class="datepicker"
      :class="{ 'datepicker--open': isOpen, 'datepicker--closed': !isOpen }"
    >
      <div class="-hide-on-desktop">
        <div
          v-if="isOpen"
          class="datepicker__dummy-wrapper datepicker__dummy-wrapper--no-border"
          :class="{ 'datepicker__dummy-wrapper--is-active': isOpen }"
          @click="toggleDatepicker"
        >
          <div
            class="datepicker__input"
            tabindex="0"
            :class="{
              'datepicker__dummy-input--is-active': isOpen && checkIn == null
            }"
            type="button"
          >
            {{ `${checkIn ? formatDate(checkIn) : i18n["check-in"]}` }}
          </div>
          <div
            class="datepicker__input"
            tabindex="0"
            :class="{
              'datepicker__dummy-input--is-active':
                isOpen && checkOut == null && checkIn !== null
            }"
            type="button"
          >
            {{ `${checkOut ? formatDate(checkOut) : i18n["check-out"]}` }}
          </div>
        </div>
      </div>
      <div class="datepicker__inner">
        <div class="datepicker__header">
          <button
            type="button"
            class="datepicker__month-button datepicker__month-button--prev -hide-up-to-tablet"
            @click="renderPreviousMonth"
            @keyup.enter.stop.prevent="renderPreviousMonth"
            :tabindex="isOpen ? 0 : -1"
            :disabled="activeMonthIndex === 0"
          />
          <button
            type="button"
            class="datepicker__month-button datepicker__month-button--next -hide-up-to-tablet"
            @click="renderNextMonth"
            @keyup.enter.stop.prevent="renderNextMonth"
            :disabled="isPreventedMaxMonth"
            :tabindex="isOpen ? 0 : -1"
          />
        </div>
        <div class="datepicker__months" v-if="screenSize == 'desktop'">
          <div
            ref="datepickerMonth"
            class="datepicker__month"
            v-for="n in [0, 1]"
            :key="datepickerMonthKey + n"
          >
            <p class="datepicker__month-name">
              {{ getMonth(months[activeMonthIndex + n].days[15].date) }}
            </p>
            <div class="datepicker__week-row -hide-up-to-tablet">
              <div
                class="datepicker__week-name"
                v-for="(dayName, datePickerWeekIndexDesktop) in i18n[
                  'day-names'
                ]"
                :key="datepickerWeekKey + datePickerWeekIndexDesktop"
              >
                {{ dayName }}
              </div>
            </div>
            <div
              class="square"
              v-for="(day, dayIndexDesktop) in months[activeMonthIndex + n]
                .days"
              :key="`${datepickerDayKey}-${dayIndexDesktop}`"
              @mouseover="handleHoveringDate(day)"
            >
              <Day
                :activeMonthIndex="activeMonthIndex"
                :belongsToThisMonth="day.belongsToThisMonth"
                :checkIn="checkIn"
                :checkIncheckOutHalfDay="checkIncheckOutHalfDay"
                :checkOut="checkOut"
                :currentDateStyle="currentDateStyle"
                :currentPeriod="currentPeriod"
                :date="day.date"
                :disableCheckoutOnCheckin="disableCheckoutOnCheckin"
                :hoveringDate="hoveringDate"
                :isOpen="isOpen"
                :minNightCount="minNightCount"
                :nextDisabledDate="nextDisabledDate"
                :nextPeriodDisableDates="nextPeriodDisableDates"
                :options="$props"
                :screenSize="screenSize"
                :showCustomTooltip="showCustomTooltip"
                :showPrice="showPrice"
                :sortedDisabledDates="sortedDisabledDates"
                :sortedPeriodDates="sortedPeriodDates"
                :tooltipMessage="customTooltipMessage"
                @setMinNightCount="setMinNightCount"
                @clearSelection="clearSelection"
                @dayClicked="handleDayClick"
              />
            </div>
          </div>
        </div>
        <div
          v-if="screenSize !== 'desktop' && isOpen"
          :class="{ 'show-tooltip': showCustomTooltip }"
        >
          <div class="datepicker__tooltip--mobile">
            <template v-if="customTooltipMessage">
              {{ cleanString(customTooltipMessage) }}
            </template>
          </div>
          <div class="datepicker__week-row">
            <div
              class="datepicker__week-name"
              v-for="(dayName, datePickerWeekIndexMobile) in this.i18n[
                'day-names'
              ]"
              :key="datepickerWeekKey + datePickerWeekIndexMobile"
            >
              {{ dayName }}
            </div>
          </div>
          <div
            class="datepicker__months"
            id="swiperWrapper"
            ref="swiperWrapper"
          >
            <div
              ref="datepickerMonth"
              class="datepicker__month"
              v-for="(a, n) in months"
              :key="datepickerMonthKey + n"
            >
              <p class="datepicker__month-name">
                {{ getMonth(months[n].days[15].date) }}
              </p>
              <div class="datepicker__week-row -hide-up-to-tablet">
                <div
                  class="datepicker__week-name"
                  v-for="(dayName, datePickerIndex) in i18n['day-names']"
                  :key="
                    `datepicker__month-name-datepicker__week-name-${datePickerIndex}`
                  "
                >
                  {{ dayName }}
                </div>
              </div>
              <div
                class="square"
                v-for="(day, dayIndexMobile) in months[n].days"
                :key="`${datepickerDayKey}-${dayIndexMobile}`"
                @mouseover="handleHoveringDate(day)"
                @click="test(day, $event)"
              >
                <Day
                  :activeMonthIndex="activeMonthIndex"
                  :belongsToThisMonth="day.belongsToThisMonth"
                  :checkIn="checkIn"
                  :checkIncheckOutHalfDay="checkIncheckOutHalfDay"
                  :checkOut="checkOut"
                  :currentDateStyle="currentDateStyle"
                  :currentPeriod="currentPeriod"
                  :date="day.date"
                  :disableCheckoutOnCheckin="disableCheckoutOnCheckin"
                  :hoveringDate="hoveringDate"
                  :isOpen="isOpen"
                  :minNightCount="minNightCount"
                  :nextDisabledDate="nextDisabledDate"
                  :nextPeriodDisableDates="nextPeriodDisableDates"
                  :options="$props"
                  :screenSize="screenSize"
                  :showCustomTooltip="showCustomTooltip"
                  :showPrice="showPrice"
                  :sortedDisabledDates="sortedDisabledDates"
                  :sortedPeriodDates="sortedPeriodDates"
                  :tooltipMessage="customTooltipMessage"
                  @setMinNightCount="setMinNightCount"
                  @clearSelection="clearSelection"
                  @dayClicked="handleDayClick"
                />
              </div>
            </div>
          </div>
        </div>

        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
import throttle from "lodash.throttle";
import fecha from "fecha";

import Day from "../Day.vue";
import DateInput from "../DateInput.vue";
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
    minimumRequiredPeriod:
      "A minimum of <br/> %{minNightInPeriod} %{night} is required."
  }
};

export default {
  name: "HotelDatePicker",
  components: {
    Day,
    DateInput
  },
  props: {
    disableCheckoutOnCheckin: {
      type: Boolean,
      default: false
    },
    lastDateAvailable: {
      type: [Number, Date],
      default: Infinity
    },
    showPrice: {
      type: Boolean,
      default: false
    },
    periodDates: {
      default() {
        return [];
      },
      type: Array
    },
    currentDateStyle: {
      default: () => ({ border: "2px solid #234c56" })
    },
    value: {
      type: String
    },
    startingDateValue: {
      default: null,
      type: Date
    },
    endingDateValue: {
      default: null,
      type: Date
    },
    format: {
      default: "YYYY-MM-DD",
      type: String
    },
    startDate: {
      default() {
        return new Date();
      },
      type: [Date, String]
    },
    endDate: {
      default: Infinity,
      type: [Date, String, Number]
    },
    firstDayOfWeek: {
      default: 0,
      type: Number
    },
    minNights: {
      type: Number,
      default: 1
    },
    maxNights: {
      default: null,
      type: Number
    },
    halfDay: {
      type: Boolean,
      default: false
    },
    disabledDates: {
      default() {
        return [];
      },
      type: Array
    },
    disabledDaysOfWeek: {
      default() {
        return [];
      },
      type: Array
    },
    allowedRanges: {
      default() {
        return [];
      },
      type: Array
    },
    hoveringTooltip: {
      default: true,
      type: [Boolean, Function]
    },
    tooltipMessage: {
      default: null,
      type: String
    },
    i18n: {
      default: () => defaulti18n,
      type: Object
    },
    enableCheckout: {
      default: false,
      type: Boolean
    },
    singleDaySelection: {
      default: false,
      type: Boolean
    },
    showYear: {
      default: false,
      type: Boolean
    },
    closeDatepickerOnClickOutside: {
      default: true,
      type: Boolean
    },
    displayClearButton: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      hash: Date.now(),
      datepickerDayKey: 0,
      datepickerMonthKey: 0,
      nextPeriodDisableDates: [],
      datepickerWeekKey: 0,
      activeMonthIndex: 0,
      checkIn: this.startingDateValue,
      checkIncheckOutHalfDay: {},
      checkOut: this.endingDateValue,
      currentPeriod: null,
      customTooltip: "",
      dynamicNightCounts: null,
      hoveringDate: null,
      isOpen: false,
      isTouchMove: false,
      months: [],
      nextDisabledDate: null,
      screenSize: null,
      show: true,
      showCustomTooltip: false,
      sortedDisabledDates: null,
      xDown: null,
      xUp: null,
      yDown: null,
      yUp: null
    };
  },
  computed: {
    customTooltipMessage() {
      if (
        this.screenSize === "desktop" &&
        this.hoveringDate &&
        this.customTooltip
      ) {
        return this.customTooltip;
      }

      if (this.screenSize !== "desktop" && this.customTooltip) {
        return this.customTooltip;
      }

      return this.tooltipMessage;
    },
    sortedPeriodDates() {
      if (this.periodDates) {
        const periodDates = [...this.periodDates];

        return periodDates.sort((a, b) => {
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
        });
      }

      return this.periodDates;
    },
    sliceMonthMobile() {
      const nbMonthRenderDom = 4;

      if (this.activeMonthIndex >= nbMonthRenderDom) {
        return this.months.slice(
          this.activeMonthIndex - 3,
          this.activeMonthIndex + 1
        );
      }

      return this.months.slice(0, nbMonthRenderDom);
    },
    isPreventedMaxMonth() {
      const lastIndexMonthAvailable = this.getMonthDiff(
        this.startDate,
        this.lastDateAvailable
      );

      return this.activeMonthIndex >= lastIndexMonthAvailable - 1;
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
    isOpen(value) {
      if (this.screenSize !== "desktop") {
        const body = document.querySelector("body");

        if (value) {
          body.style.overflow = "hidden";

          this.$nextTick(() => {
            if (this.$refs) {
              const { swiperWrapper } = this.$refs;
              const monthHeihgt = this.$refs.datepickerMonth[0].offsetHeight;
              const currentSelectionIndex = this.checkOut
                ? this.getMonthDiff(new Date(), this.checkOut)
                : 0;

              swiperWrapper.scrollTop = currentSelectionIndex * monthHeihgt;
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
      if (this.checkOut !== null && this.checkOut !== null) {
        this.hoveringDate = null;
        this.nextDisabledDate = null;
        this.parseDisabledDates();
        this.reRender();
        this.showCustomTooltip = false;
        this.isOpen = false;
      }

      this.$emit("check-out-changed", newDate);
    }
  },
  beforeMount() {
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

    if (
      this.checkIn &&
      (this.getMonthDiff(
        this.getNextMonth(new Date(this.startDate)),
        this.checkIn
      ) > 0 ||
        this.getMonthDiff(this.startDate, this.checkIn) > 0)
    ) {
      this.createMonth(new Date(this.startDate));
      const count = this.getMonthDiff(this.startDate, this.checkIn);
      let nextMonth = new Date(this.startDate);

      for (let i = 0; i <= count; i++) {
        const tempNextMonth = this.getNextMonth(nextMonth);

        this.createMonth(tempNextMonth);
        nextMonth = tempNextMonth;
      }

      if (this.checkOut && this.getMonthDiff(this.checkIn, this.checkOut) > 0) {
        this.createMonth(this.getNextMonth(nextMonth));
        this.activeMonthIndex = 1;
      }

      this.activeMonthIndex += count;
    } else {
      this.createMonth(new Date(this.startDate));
      this.createMonth(this.getNextMonth(new Date(this.startDate)));
    }

    this.parseDisabledDates();
  },
  mounted() {
    this.handleWindowResize();

    if (this.screenSize !== "desktop") {
      document.addEventListener("touchstart", this.handleTouchStart, false);
      document.addEventListener("touchmove", this.handleTouchMove, false);
      document.addEventListener("touchend", this.handleTouchEnd, false);
    } else {
      document.addEventListener("click", this.handleClickOutside, false);
      window.addEventListener("resize", this.handleWindowResize);
    }

    this.onElementHeightChange(document.body, () => {
      this.emitHeighChangeEvent();
    });
  },
  destroyed() {
    if (this.screenSize !== "desktop") {
      document.removeEventListener("touchstart", this.handleTouchStart);
      document.removeEventListener("touchmove", this.handleTouchMove);
      document.removeEventListener("touchend", this.handleTouchEnd);
    } else {
      window.removeEventListener("resize", this.handleWindowResize);
      document.removeEventListener("click", this.handleClickOutside);
    }
  },
  methods: {
    ...Helpers,
    cleanString(string) {
      // eslint-disable-next-line no-useless-escape
      return string.replace(/\<br\/>/g, "");
    },
    dateIsInCheckInCheckOut(date) {
      const compareDate = this.formatDate(date);
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
    pluralizeNight(countDays) {
      return countDays !== 1 ? this.i18n.nights : this.i18n.night;
    },
    handleHoveringDate(day) {
      if (this.screenSize === "desktop") {
        this.setCustomTooltip(day);
      }
    },
    test(day) {
      if (this.screenSize !== "desktop") {
        this.setCustomTooltip(day);
      }
    },
    setCustomTooltip(day) {
      if (day.belongsToThisMonth) {
        if (this.screenSize === "desktop") {
          this.hoveringDate = day.date;
          if (this.showCustomTooltip) this.showCustomTooltip = false;
        }

        if (!this.checkout && this.checkIn && this.currentPeriod) {
          this.setPeriodCustomTooltip(day.date);
        } else if (this.halfDay) {
          this.setHalfDayCustomTooltip(day.date);
        }
      }
    },
    setPeriodCustomTooltip(date) {
      let countDays;
      const countOfDays = this.countDays(this.checkIn, date);
      const minNightInPeriod = this.currentPeriod.minNight;
      const modulo = countOfDays % minNightInPeriod;
      const isAWeekPeriod =
        this.currentPeriod.type && this.currentPeriod.type !== "nightly";
      const isInACurrentPeriod =
        this.getDayDiff(date, this.currentPeriod.endAt) > 0;
      const isDateAfterNextDate =
        this.getDayDiff(date, this.currentPeriod.nextDate) < 0;
      const isDateBeforeNextDate =
        this.getDayDiff(date, this.currentPeriod.nextDate) > 0;

      if (isAWeekPeriod) {
        if (isInACurrentPeriod) {
          if (modulo === 0 && this.checkIn !== date) {
            this.customTooltip = `${countOfDays} ${this.pluralizeNight(
              countDays
            )}`;
          } else if (isDateAfterNextDate) {
            if (this.currentPeriod.type === "weekly_by_saturday") {
              this.customTooltip = this.i18n.tooltip.saturdayToSaturday;
            } else if (this.currentPeriod.type === "weekly_by_sunday") {
              this.customTooltip = this.i18n.tooltip.sundayToSunday;
            }
          } else {
            const night = this.pluralizeNight(countDays);

            this.customTooltip = this.completeTrad(
              this.i18n.tooltip.minimumRequiredPeriod,
              { minNightInPeriod, night }
            );
          }
        } else {
          this.customTooltip = `${countOfDays} ${this.pluralizeNight(
            countOfDays
          )}`;
        }
      } else if (isDateBeforeNextDate) {
        const night = this.pluralizeNight(countDays);

        this.customTooltip = this.completeTrad(
          this.i18n.tooltip.minimumRequiredPeriod,
          { minNightInPeriod, night }
        );
      } else {
        this.customTooltip = `${countOfDays} ${this.pluralizeNight(
          countOfDays
        )}`;
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
    setHalfDayCustomTooltip(date) {
      const formatedHoveringDate = this.formatDate(date);

      if (this.checkIncheckOutHalfDay[formatedHoveringDate]) {
        this.showCustomTooltip = true;

        if (this.checkIncheckOutHalfDay[formatedHoveringDate].checkIn) {
          this.customTooltip = this.i18n.tooltip.halfDayCheckIn;
        } else if (this.checkIncheckOutHalfDay[formatedHoveringDate].checkOut) {
          this.customTooltip = this.i18n.tooltip.halfDayCheckOut;
        }
      }
    },
    handleClickOutside(event) {
      const ignoreClickOnMeElement = this.$refs[`DatePicker-${this.hash}`];

      if (ignoreClickOnMeElement) {
        const isClickInsideElement = ignoreClickOnMeElement.contains(
          event.target
        );

        if (!isClickInsideElement) {
          this.hideDatepicker();
        }
      }
    },
    setMinNightCount(minNights) {
      this.dynamicNightCounts = minNights;
    },
    formatDate(date) {
      if (date) {
        return fecha.format(date, this.format);
      }

      return "";
    },
    handleWindowResize() {
      if (window.innerWidth < 480) {
        this.screenSize = "smartphone";
      } else if (window.innerWidth >= 480 && window.innerWidth < 768) {
        this.screenSize = "tablet";
      } else if (window.innerWidth >= 768) {
        this.screenSize = "desktop";
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
      this.datepickerWeekKey += 1;
    },
    clearSelection() {
      this.hoveringDate = null;
      this.checkIn = null;
      this.checkOut = null;
      this.nextDisabledDate = null;
      this.nextPeriodDisableDates = [];
      this.showCustomTooltip = false;
      this.parseDisabledDates();
      this.reRender();
      this.$emit("clear-selection");
    },
    closeMobileDatepicker() {
      this.hideDatepicker();

      if (this.checkIn && !this.checkOut) {
        this.clearSelection();
      }
    },
    hideDatepicker() {
      this.isOpen = false;
    },
    showDatepicker() {
      this.isOpen = true;
    },
    toggleDatepicker() {
      this.isOpen = !this.isOpen;
    },
    clickOutside() {
      if (this.show && this.closeDatepickerOnClickOutside) {
        this.hideDatepicker();
      }
    },
    handleDayClick(date, formatDate, allowedCheckoutDays, resetCheckin) {
      this.nextPeriodDisableDates = [];

      if (resetCheckin) {
        this.clearSelection();
        this.$nextTick(() => {
          this.handleDayClick(date, formatDate, allowedCheckoutDays, false);
        });

        return;
      }

      let nextDisabledDate =
        (this.maxNights ? this.addDays(date, this.maxNights) : null) ||
        allowedCheckoutDays[allowedCheckoutDays.length - 1] ||
        this.getNextDate(this.sortedDisabledDates, date) ||
        this.nextDateByDayOfWeekArray(this.disabledDaysOfWeek, date) ||
        Infinity;

      this.setMinNightCount(null);

      if (this.enableCheckout) {
        nextDisabledDate = Infinity;
      }

      if (this.checkIn == null && this.singleDaySelection === false) {
        this.checkIn = date;
        this.setPeriods(date);
      } else if (this.singleDaySelection === true) {
        this.checkIn = date;
        this.checkOut = date;
      } else if (this.checkIn !== null && this.checkOut == null) {
        this.checkOut = date;
      } else {
        this.checkOut = null;
        this.checkIn = date;
        this.setPeriods(date);
      }

      this.nextDisabledDate = nextDisabledDate;

      if (this.minNightCount > 0) {
        this.currentPeriod = {
          date,
          minNight: this.minNightCount,
          nextDate: this.addDays(date, this.minNightCount)
        };
        const currentPeriod = this.dateIsInCheckInCheckOut(date);

        if (currentPeriod) {
          this.currentPeriod.type = currentPeriod.periodType;
          this.currentPeriod.endAt = currentPeriod.endAt;
        }

        this.showCustomTooltip = true;
        this.setPeriodCustomTooltip(date);
      }

      this.$emit("day-clicked", date, formatDate, nextDisabledDate);
    },
    setPeriods(date) {
      if (this.sortedPeriodDates) {
        let nextPeriod = null;
        let currentPeriod = null;
        const compareDate = this.formatDate(date);

        this.sortedPeriodDates.forEach(d => {
          if (
            d.endAt !== compareDate &&
            (d.startAt === compareDate ||
              this.validateDateBetweenTwoDates(d.startAt, d.endAt, date))
          ) {
            currentPeriod = d;
          }
        });

        if (currentPeriod) {
          this.sortedPeriodDates.forEach(period => {
            if (period.startAt === currentPeriod.endAt) {
              nextPeriod = period;
            }
          });

          if (this.checkIn && !this.checkOut && nextPeriod) {
            const endNextPeriod = this.addDays(
              nextPeriod.startAt,
              nextPeriod.minimumDuration - 1
            );
            const startNextPeriodPlusOne = this.addDays(nextPeriod.startAt, 1);
            const newDisablesDates = this.getDaysArray(
              startNextPeriodPlusOne,
              endNextPeriod
            );

            this.nextPeriodDisableDates = newDisablesDates;
          }

          if (
            currentPeriod.periodType === "nightly" &&
            currentPeriod.endAt !== date
          ) {
            this.setMinNightCount(currentPeriod.minimumDuration);
          }

          if (
            currentPeriod.periodType === "weekly_by_saturday" ||
            currentPeriod.periodType === "weekly_by_sunday"
          ) {
            const minimumDuration = currentPeriod.minimumDuration * 7;

            this.setMinNightCount(minimumDuration);
          }
        } else {
          this.setMinNightCount(0);
        }
      }
    },
    renderPreviousMonth() {
      if (this.activeMonthIndex >= 1) {
        this.activeMonthIndex--;
      }
    },
    renderNextMonth: throttle(function throttleRenderNextMonth() {
      if (this.activeMonthIndex < this.months.length - 2) {
        this.activeMonthIndex++;

        return;
      }

      let firstDayOfLastMonth;

      if (this.screenSize !== "desktop") {
        firstDayOfLastMonth = this.months[this.months.length - 1].days.filter(
          day => day.belongsToThisMonth === true
        );
      } else {
        firstDayOfLastMonth = this.months[
          this.activeMonthIndex + 1
        ].days.filter(day => day.belongsToThisMonth === true);
      }

      if (this.endDate !== Infinity) {
        if (
          fecha.format(firstDayOfLastMonth[0].date, "YYYYMM") ===
          fecha.format(new Date(this.endDate), "YYYYMM")
        ) {
          return;
        }
      }

      this.createMonth(this.getNextMonth(firstDayOfLastMonth[0].date));
      this.activeMonthIndex++;
    }, 350),
    setCheckIn(date) {
      this.checkIn = date;
    },
    setCheckOut(date) {
      this.checkOut = date;
    },
    getMonth(date) {
      return (
        this.i18n["month-names"][fecha.format(date, "M") - 1] +
        (this.showYear ? fecha.format(date, " YYYY") : "")
      );
    },
    createMonth(date) {
      const firstDay = this.getFirstDay(date, this.firstDayOfWeek);
      const month = {
        days: []
      };

      for (let i = 0; i < 42; i++) {
        month.days.push({
          date: this.addDays(firstDay, i),
          belongsToThisMonth:
            this.addDays(firstDay, i).getMonth() === date.getMonth()
        });
      }

      this.months.push(month);
    },
    parseDisabledDates() {
      let sortedDates = [];
      const checkIncheckOutHalfDay = {};

      // Sorted disabledDates
      this.disabledDates.sort((a, b) => {
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

      for (let i = 0; i < this.disabledDates.length; i++) {
        const newDate = this.disabledDates[i];

        if (this.halfDay) {
          const newDateIncrementOne = this.disabledDates[i + 1];

          if (i === 0) {
            checkIncheckOutHalfDay[newDate] = {
              checkIn: true
            };
          }

          if (
            this.disabledDates[i + 1] &&
            this.getDayDiff(newDate, newDateIncrementOne) > 1
          ) {
            checkIncheckOutHalfDay[newDate] = {
              checkOut: true
            };
            checkIncheckOutHalfDay[newDateIncrementOne] = {
              checkIn: true
            };
          }

          if (i === this.disabledDates.length - 1) {
            checkIncheckOutHalfDay[
              this.disabledDates[this.disabledDates.length - 1]
            ] = {
              checkOut: true
            };
          }
        }

        sortedDates[i] = this.disabledDates[i];
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
