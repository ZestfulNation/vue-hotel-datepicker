<template lang='pug'>
  .datepicker__wrapper(v-if='show' v-on-click-outside='clickOutside' @blur="clickOutside")
    .datepicker__close-button.-hide-on-desktop(v-if='isOpen' @click='hideDatepicker') ＋
    .datepicker__dummy-wrapper(  :class="`${isOpen ? 'datepicker__dummy-wrapper--is-active' : ''}` ")
      date-input(
        :i18n="i18n"
        :input-date="formatDate(checkIn)"
        input-date-type="check-in"
        :is-open="isOpen"
        :show-datepicker="showDatepicker"
        :hide-datepicker="hideDatepicker"
        :toggle-datepicker="toggleDatepicker"
        :single-day-selection="singleDaySelection"
      )
      date-input(
        v-if="!singleDaySelection"
        :i18n="i18n"
        :input-date="formatDate(checkOut)"
        input-date-type="check-out"
        :is-open="isOpen"
        :showDatepicker="showDatepicker"
        :hide-datepicker="hideDatepicker"
        :toggle-datepicker="toggleDatepicker"
        :single-day-selection="singleDaySelection"
      )
    .datepicker__clear-button(tabindex="0" @click='clearSelection' v-if="showClearSelectionButton")
      svg(xmlns='http://www.w3.org/2000/svg' viewBox="0 0 68 68")
        path(d='M6.5 6.5l55 55M61.5 6.5l-55 55')

    .datepicker( :class='`${ isOpen ? "datepicker--open" : "datepicker--closed" }`')
      .-hide-on-desktop
        .datepicker__dummy-wrapper.datepicker__dummy-wrapper--no-border(
          @click='toggleDatepicker' :class="`${isOpen ? 'datepicker__dummy-wrapper--is-active' : ''}`"
          v-if='isOpen'
        )
          .datepicker__input(
            tabindex="0"
            :class="`${isOpen && checkIn == null ? 'datepicker__dummy-input--is-active' : ''}`"
            v-text="`${checkIn ? formatDate(checkIn) : i18n['check-in']}`"
            type="button"
          )
          .datepicker__input(
            tabindex="0"
            :class="`${isOpen && checkOut == null && checkIn !== null ? 'datepicker__dummy-input--is-active' : ''}`"
            v-text="`${checkOut ? formatDate(checkOut) : i18n['check-out']}`"
            type="button"
          )
      .datepicker__inner
        .datepicker__header
          span.datepicker__month-button.datepicker__month-button--prev.-hide-up-to-tablet(
            @click='renderPreviousMonth'
            @keyup.enter.stop.prevent='renderPreviousMonth'
            :tabindex='isOpen ? 0 : -1'
          )
          span.datepicker__month-button.datepicker__month-button--next.-hide-up-to-tablet(
            @click='renderNextMonth'
            @keyup.enter.stop.prevent='renderNextMonth'
            :tabindex='isOpen ? 0 : -1'
          )
        .datepicker__months(v-if='screenSize === "desktop"')
          div.datepicker__month(v-for='n in [0,1]'  v-bind:key='n')
            p.datepicker__month-name(v-text='getMonth(months[activeMonthIndex+n].days[15].date)')
            .datepicker__week-row.-hide-up-to-tablet
              .datepicker__week-name(v-for='dayName in i18n["day-names"]' v-text='dayName')
            .square(v-for='day in months[activeMonthIndex+n].days'
              @mouseover='hoveringDate = day.date'
              )
              Day(
                :is-open="isOpen"
                :options="$props"
                @day-clicked='handleDayClick($event)'
                :date='day.date'
                :sortedDisabledDates='sortedDisabledDates'
                :nextDisabledDate='nextDisabledDate'
                :activeMonthIndex='activeMonthIndex'
                :hoveringDate='hoveringDate'
                :tooltipMessage='tooltipMessage'
                :dayNumber='getDay(day.date)'
                :belongsToThisMonth='day.belongsToThisMonth'
                :checkIn='checkIn'
                :checkOut='checkOut'
                :currentDateStyle='currentDateStyle'
                :price='getPrice(day)'
              )
        div(v-if='screenSize !== "desktop" && isOpen')
          .datepicker__week-row
            .datepicker__week-name(
              v-for='dayName in this.i18n["day-names"]'
              v-text='dayName'
            )
          .datepicker__months#swiperWrapper
            div.datepicker__month(
              v-for='(a, n) in months'
              v-bind:key='n'
            )
              p.datepicker__month-name(
                v-text='getMonth(months[n].days[15].date)'
              )
              .datepicker__week-row.-hide-up-to-tablet
                .datepicker__week-name(
                  v-for='dayName in i18n["day-names"]'
                  v-text='dayName'
                )
              .square(v-for='(day, index) in months[n].days'
                @mouseover='hoveringDate = day.date'
                @focus='hoveringDate = day.date'
                v-bind:key='index'
              )
                Day(
                  :is-open="isOpen"
                  :options="$props"
                  @day-clicked='handleDayClick($event)'
                  :date='day.date'
                  :sortedDisabledDates='sortedDisabledDates'
                  :nextDisabledDate='nextDisabledDate'
                  :activeMonthIndex='activeMonthIndex'
                  :hoveringDate='hoveringDate'
                  :tooltipMessage='tooltipMessage'
                  :dayNumber='getDay(day.date)'
                  :belongsToThisMonth='day.belongsToThisMonth'
                  :checkIn='checkIn'
                  :checkOut='checkOut'
                  :currentDateStyle='currentDateStyle'
                  :price='getPrice(day)'
                )
            .next--mobile(
              @click='renderNextMonth' type="button"
            )

</template>

<script>
import throttle from 'lodash.throttle';
import { directive as onClickOutside } from 'vue-on-click-outside';
import fecha from 'fecha';
import defaulti18n from './i18n.js';

import Day from './components/Day.vue';
import DateInput from './components/DateInput.vue';
import Helpers from './helpers.js';
import './assets/scss/main.scss';

export default {
  name: 'VueHotelDatePicker',

  directives: {
    'on-click-outside': onClickOutside
  },

  components: {
    Day,
    DateInput
  },

  props: {
    currentDateStyle: {
      type: [Object, null, String],
      default: () => ({ border: '1px solid #00c690' })
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
      default: 'YYYY-MM-DD',
      type: String
    },
    startDate: {
      default: function() {
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
      default: 1,
      type: Number
    },
    maxNights: {
      default: null,
      type: Number
    },
    disabledDates: {
      default: function() {
        return [];
      },
      type: Array
    },
    disabledDaysOfWeek: {
      default: function() {
        return [];
      },
      type: Array
    },
    allowedRanges: {
      default: function() {
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
    },
    priceDefault: {
      default: '',
      type: [Number, String, null]
    },
    priceByDate: {
      default: function() {
        return [];
      },
      type: [Array, null]
    }
  },

  data() {
    return {
      hoveringDate: null,
      checkIn: this.startingDateValue,
      checkOut: this.endingDateValue,
      months: [],
      activeMonthIndex: 0,
      nextDisabledDate: null,
      show: true,
      isOpen: false,
      xDown: null,
      yDown: null,
      xUp: null,
      yUp: null,
      sortedDisabledDates: null,
      screenSize: this.handleWindowResize()
    };
  },

  computed: {
    showClearSelectionButton() {
      return Boolean(
        (this.checkIn || this.checkOut) && this.displayClearButton
      );
    }
  },

  watch: {
    isOpen(value) {
      if (!value) {
        this.$emit('closed', this);
      }

      if (this.screenSize !== 'desktop') {
        const bodyClassList = document.querySelector('body').classList;

        if (value) {
          bodyClassList.add('-overflow-hidden');
          setTimeout(() => {
            const swiperWrapper = document.getElementById('swiperWrapper');
            let monthEl = document.querySelector('.datepicker__month')
            let monthHeight = 1

            if (monthEl) monthHeight = monthEl.offsetHeight;

            swiperWrapper.scrollTop = this.activeMonthIndex * monthHeight;
          }, 100);
        } else {
          bodyClassList.remove('-overflow-hidden');
        }
      }
    },
    checkIn(newDate) {
      this.$emit('check-in-changed', newDate);
    },
    checkOut(newDate) {
      if (this.checkOut !== null && this.checkOut !== null) {
        this.hoveringDate = null;
        this.nextDisabledDate = null;
        this.show = true;
        this.parseDisabledDates();
        this.reRender();
        this.isOpen = false;
      }

      this.$emit('check-out-changed', newDate);
    }
  },

  beforeMount() {
    fecha.i18n = {
      dayNames: this.i18n['day-names'],
      dayNamesShort: this.shortenString(this.i18n['day-names'], 3),
      monthNames: this.i18n['month-names'],
      monthNamesShort: this.shortenString(this.i18n['month-names'], 3),
      amPm: ['am', 'pm'],
      // D is the day of the month, function returns something like...  3rd or 11th
      DoFn: function(D) {
        return (
          D +
          ['th', 'st', 'nd', 'rd'][
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
        let tempNextMonth = this.getNextMonth(nextMonth);
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
    document.addEventListener('touchstart', this.handleTouchStart, false);
    document.addEventListener('touchmove', this.handleTouchMove, false);
    window.addEventListener('resize', this.handleWindowResize);

    this.onElementHeightChange(document.body, () => {
      this.emitHeighChangeEvent();
    });
  },

  destroyed() {
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('resize', this.handleWindowResize);
  },
  methods: {
    ...Helpers,

    formatDate(date) {
      if (date) {
        return fecha.format(date, this.format);
      }
      return '';
    },

    handleWindowResize() {
      if (window.innerWidth < 480) {
        this.screenSize = 'smartphone';
      } else if (window.innerWidth >= 480 && window.innerWidth < 768) {
        this.screenSize = 'tablet';
      } else if (window.innerWidth >= 768) {
        this.screenSize = 'desktop';
      }

      return this.screenSize;
    },

    onElementHeightChange(el, callback) {
      let lastHeight = el.clientHeight;
      let newHeight = lastHeight;

      (function run() {
        newHeight = el.clientHeight;

        if (lastHeight !== newHeight) {
          callback();
        }

        lastHeight = newHeight;

        if (el.onElementHeightChangeTimer) {
          clearTimeout(el.onElementHeightChangeTimer);
        }

        el.onElementHeightChangeTimer = setTimeout(run, 1000);
      })();
    },

    emitHeighChangeEvent() {
      this.$emit('height-changed');
    },

    reRender() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },

    clearSelection() {
      (this.hoveringDate = null), (this.checkIn = null);
      this.checkOut = null;
      this.nextDisabledDate = null;
      this.show = true;
      this.parseDisabledDates();
      this.reRender();
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
      if (this.closeDatepickerOnClickOutside) {
        this.hideDatepicker();
      }
    },

    handleDayClick(event) {
      if (this.checkIn == null && this.singleDaySelection == false) {
        this.checkIn = event.date;
      } else if (this.singleDaySelection == true) {
        this.checkIn = event.date;
        this.checkOut = event.date;
      } else if (
        this.checkIn !== null && this.checkOut == null &&
        this.isDateLessOrEquals(event.date, this.checkIn)
      ) {
        this.checkIn = event.date;
      } else if (this.checkIn !== null && this.checkOut == null) {
        this.checkOut = event.date;
      } else {
        this.checkOut = null;
        this.checkIn = event.date;
      }

      this.nextDisabledDate = event.nextDisabledDate;
      this.hoveringDate = null;
      this.hoveringDate = event.date;
    },

    renderPreviousMonth() {
      if (this.activeMonthIndex >= 1) {
        this.activeMonthIndex--;
      } else return;
    },

    renderNextMonth: throttle(function throttleRenderNextMonth() {
      if (this.activeMonthIndex < this.months.length - 2) {
        this.activeMonthIndex++;
        return;
      }

      let firstDayOfLastMonth;

      if (this.screenSize !== 'desktop') {
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
          fecha.format(firstDayOfLastMonth[0].date, 'YYYYMM') ==
          fecha.format(new Date(this.endDate), 'YYYYMM')
        ) {
          return;
        }
      }

      this.createMonth(this.getNextMonth(firstDayOfLastMonth[0].date));

      this.activeMonthIndex++;
    }, 200),

    setCheckIn(date) {
      this.checkIn = date;
    },

    setCheckOut(date) {
      this.checkOut = date;
    },

    getDay(date) {
      return fecha.format(date, 'D');
    },

    getMonth(date) {
      return (
        this.i18n['month-names'][fecha.format(date, 'M') - 1] +
        (this.showYear ? fecha.format(date, ' YYYY') : '')
      );
    },

    createMonth(date) {
      const firstDay = this.getFirstDay(date, this.firstDayOfWeek);
      let month = {
        days: []
      };

      for (let i = 0; i < 42; i++) {
        month.days.push({
          date: this.addDays(firstDay, i),
          belongsToThisMonth:
            this.addDays(firstDay, i).getMonth() === date.getMonth(),
          isInRange: false
        });
      }
      this.months.push(month);
    },

    parseDisabledDates() {
      const sortedDates = [];

      for (let i = 0; i < this.disabledDates.length; i++) {
        sortedDates[i] = new Date(this.disabledDates[i]);
      }

      sortedDates.sort((a, b) => a - b);

      this.sortedDisabledDates = sortedDates;
    },
    getPrice(day) {
      const ranges = Array.isArray(this.priceByDate) ? this.priceByDate : [];
      const range = ranges.find(range => {
        const hasPrice = range.price ? true : false;
        const hasStartDate = range.start ? true : false;
        const hasEndDate = range.end ? true : false;
        const dateIsGreaterOrEqualThatStart =
          hasStartDate && day.date >= range.start ? true : false;
        const dateIsLessThatEnd =
          hasEndDate && day.date < range.end ? true : false;

        return (
          (hasStartDate || hasEndDate) &&
          (!hasStartDate || dateIsGreaterOrEqualThatStart) &&
          (!hasEndDate || dateIsLessThatEnd)
        );
      });

      return String(
        typeof range === 'object' ? range.price : this.priceDefault || ''
      );
    }
  },

};
</script>
