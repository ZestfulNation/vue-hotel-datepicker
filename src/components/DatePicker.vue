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
        .datepicker__months(v-if='screenSize == "desktop"')
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
                )
            .next--mobile(
              @click='renderNextMonth' type="button"
            )

</template>

<script>
  import throttle from 'lodash.throttle';
  import {directive as onClickOutside} from 'vue-on-click-outside';
  import fecha from 'fecha';

  import Day from './Day.vue';
  import DateInput from './DateInput.vue';
  import Helpers from './helpers.js';

  const defaulti18n = {
    night: 'Night',
    nights: 'Nights',
    'day-names': ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
    'check-in': 'Check-in',
    'check-out': 'Check-out',
    'month-names': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  };

  export default {
    name: 'HotelDatePicker',

    directives: {
      'on-click-outside': onClickOutside
    },

    components: {
      Day,
      DateInput,
    },

    props: {
      currentDateStyle:{
        default:() => ({border: "1px solid #00c690"}),
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
        default: function () {
          return new Date()
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
        default: function () {
          return []
        },
        type: Array
      },
      disabledDaysOfWeek: {
        default: function () {
          return []
        },
        type: Array
      },
      allowedRanges: {
        default: function () {
          return []
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
        type: Boolean,
      },
      displayClearButton: {
        default: true,
        type: Boolean,
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
        screenSize: this.handleWindowResize(),
      };
    },

    computed: {
      showClearSelectionButton() {
        return Boolean((this.checkIn || this.checkOut) && this.displayClearButton);
      },
    },

    watch: {
      isOpen(value) {
        if (this.screenSize !== 'desktop') {
          const bodyClassList = document.querySelector('body').classList;

          if (value) {
            bodyClassList.add('-overflow-hidden');
            setTimeout(() => {
              let swiperWrapper = document.getElementById('swiperWrapper')
              let monthHeihgt = document.querySelector('.datepicker__month').offsetHeight
              swiperWrapper.scrollTop = this.activeMonthIndex * monthHeihgt
            },100)
          }
          else {
            bodyClassList.remove('-overflow-hidden');
          }
        }
      },
      checkIn(newDate) {
        this.$emit("check-in-changed", newDate)
      },
      checkOut(newDate) {

        if (this.checkOut !== null && this.checkOut !== null) {
          this.hoveringDate = null;
          this.nextDisabledDate = null;
          this.show = true;
          this.parseDisabledDates();
          this.reRender()
          this.isOpen = false;
        }

        this.$emit("check-out-changed", newDate)
      },

    },

    methods: {
      ...Helpers,

      formatDate(date) {
        if (date) {
          return fecha.format(date, this.format);
        }
        return '';
      },

      handleWindowResize() {
        if (window.innerWidth < 480) {
          this.screenSize = 'smartphone';
        }
        else if (window.innerWidth >= 480 && window.innerWidth < 768) {
          this.screenSize = 'tablet';
        }
        else if (window.innerWidth >= 768) {
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
        this.show = false
        this.$nextTick(() => {
          this.show = true;
        })
      },

      clearSelection() {
        this.hoveringDate = null,
        this.checkIn = null;
        this.checkOut = null;
        this.nextDisabledDate = null;
        this.show = true;
        this.parseDisabledDates();
        this.reRender()
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
          this.hideDatepicker()
        }
      },

      handleDayClick(event) {

        if (this.checkIn == null && this.singleDaySelection == false) {
          this.checkIn = event.date;
        } else if (this.singleDaySelection == true) {
          this.checkIn = event.date
          this.checkOut = event.date
        }
        else if (this.checkIn !== null && this.checkOut == null) {
          this.checkOut = event.date;
        }
        else {
          this.checkOut = null;
          this.checkIn = event.date;
        }

        this.nextDisabledDate = event.nextDisabledDate
      },

      renderPreviousMonth() {
        if (this.activeMonthIndex >= 1) {
          this.activeMonthIndex--
        }
        else return
      },

      renderNextMonth: throttle(function throttleRenderNextMonth() {
        if (this.activeMonthIndex < this.months.length - 2) {
          this.activeMonthIndex++;
          return
        }

        let firstDayOfLastMonth;

        if (this.screenSize !== 'desktop') {
          firstDayOfLastMonth = this.months[this.months.length - 1].days
            .filter((day) => day.belongsToThisMonth === true);
        } else {
          firstDayOfLastMonth = this.months[this.activeMonthIndex + 1].days
            .filter((day) => day.belongsToThisMonth === true);
        }

        if (this.endDate !== Infinity) {
          if (fecha.format(firstDayOfLastMonth[0].date, 'YYYYMM') ==
            fecha.format(new Date(this.endDate), 'YYYYMM')) {
            return
          }
        }

        this.createMonth(
          this.getNextMonth(
            firstDayOfLastMonth[0].date
          )
        );

        this.activeMonthIndex++;
      }, 200),

      setCheckIn(date) {
        this.checkIn = date;
      },

      setCheckOut(date) {
        this.checkOut = date;
      },

      getDay(date) {
        return fecha.format(date, 'D')
      },

      getMonth(date) {
        return this.i18n["month-names"][fecha.format(date, 'M') - 1] + (this.showYear ? fecha.format(date, ' YYYY') : '');
      },


    createMonth(date){
      const firstDay = this.getFirstDay(date, this.firstDayOfWeek);
        let month = {
          days: []
        };

      for (let i = 0; i < 42; i++) {
        month.days.push({
          date: this.addDays(firstDay, i),
          belongsToThisMonth: this.addDays(firstDay, i).getMonth() === date.getMonth(),
          isInRange: false,
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
        DoFn: function (D) {
          return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
        }
      };
        if(this.checkIn &&
        (this.getMonthDiff(this.getNextMonth(new Date(this.startDate)), this.checkIn) > 0 ||
        this.getMonthDiff(this.startDate, this.checkIn) > 0)){
          const count = this.getMonthDiff(this.startDate, this.checkIn)
          let nextMonth = new Date(this.startDate)
           this.createMonth(nextMonth)
          for(let i = 0; i < count; i++){
            let tempNextMonth = this.getNextMonth(nextMonth)
            this.createMonth(this.getNextMonth(nextMonth))
            nextMonth = tempNextMonth
          }
          if(this.checkOut && this.getMonthDiff(this.checkIn,this.checkOut) > 0){
            this.createMonth(this.getNextMonth(nextMonth))
            this.activeMonthIndex = 1
          }
          this.activeMonthIndex += count - 1
      }else{
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
  };
</script>

<style lang="scss">
    /* =============================================================
     * VARIABLES
     * ============================================================*/
    $white: #fff;
    $black: #000;
    $gray: #424b53;
    $primary-text-color: #35343d;
    $lightest-gray: #f3f5f8;
    $primary-color: #00ca9d;
    $primary-color: $primary-color;
    $medium-gray: #999999;
    $light-gray: #d7d9e2;
    $dark-gray: #2d3047;

    $font-small: 14px;

    /* =============================================================
     * RESPONSIVE LAYOUT HELPERS
     * ============================================================*/
    $tablet: '(min-width: 480px) and (max-width: 767px)';
    $phone: '(max-width: 479px)';
    $desktop: '(min-width: 768px)';
    $up-to-tablet: '(max-width: 767px)';
    $extra-small-screen: '(max-width: 23em)';

    @mixin focusStyle() {
      &:focus {
        outline: 1px dashed darken($primary-color, 10%);
        outline-offset: -10px;
      }
    }

    @mixin device($device-widths) {
        @media screen and #{$device-widths} {
            @content
        }
    }


    .square {
        width: calc(100% / 7);
        float: left;
        @include device($desktop) {
          cursor: pointer;
        }
    }
    .datepicker__wrapper {
      *,
      *::before,
      *::after {
          box-sizing: border-box;
      }
    }

    /* =============================================================
     * BASE STYLES
     * ============================================================*/

    .datepicker {
        transition: all .2s ease-in-out;
        background-color: $white;
        color: $gray;
        font-size: 16px;
        line-height: 14px;
        overflow: hidden;
        left: 0;
        top: 48px;
        position: absolute;
        z-index: 999;

        button.next--mobile {
            background: none;
            border: 1px solid $light-gray;
            float: none;
            height: 50px;
            width: 100%;
            position: relative;
            background-position: center;
            appearance: none;
            overflow: hidden;
            position: fixed;
            bottom: 0;
            left: 0;
            outline: none;
            box-shadow: 0 5px 30px 10px rgba($black, .08);
            background: white;

            &:after {
                background: transparent url('ic-arrow-right-green.regular.svg') no-repeat center / 8px;
                transform: rotate(90deg);
                content: "";
                position: absolute;
                width: 200%;
                height: 200%;
                top: -50%;
                left: -50%;
            }
        }

        &--closed {
            box-shadow: 0 15px 30px 10px rgba($black, 0);
            max-height: 0;
        }

        &--open {
            box-shadow: 0 15px 30px 10px rgba($black, .08);
            max-height: 900px;

            @include device($up-to-tablet) {
                box-shadow: none;
                height: 100%;
                left: 0;
                right: 0;
                bottom: 0;
                -webkit-overflow-scrolling: touch !important;
                position: fixed;
                top: 0;
                width: 100%;
            }
        }

        &__wrapper {
            position: relative;
            display: inline-block;
            width: 100%;
            height: 48px;
            background: $white url('calendar_icon.regular.svg') no-repeat 17px center / 16px;
        }

        &__input {
            background: transparent;
            height: 48px;
            color: $primary-text-color;
            font-size: 12px;
            outline: none;
            padding: 4px 30px 2px;
            width: 100%;
            word-spacing: 5px;
            border: 0;

            @include focusStyle();

            &::-webkit-input-placeholder,
            &::-moz-placeholder,
            &:-ms-input-placeholder,
            &:-moz-placeholder {
                color: $primary-text-color;
            }
        }

        &__dummy-wrapper {
            border: solid 1px $light-gray;
            cursor: pointer;
            display: block;
            float: left;
            width: 100%;
            height: 100%;

            &--no-border.datepicker__dummy-wrapper {
                margin-top: 15px;
                border: 0;
            }

            &--is-active {
                border: 1px solid $primary-color;
            }
        }

        &__input {
            color: $primary-text-color;
            padding-top: 0;
            font-size: $font-small;
            float: left;
            height: 48px;
            line-height: 3.1;
            text-align: left;
            text-indent: 5px;
            width: calc(50% + 4px);

            @include device($phone) {
                text-indent: 0;
                text-align: center;
            }

            &:first-child {
                background: transparent url('ic-arrow-right-datepicker.regular.svg') no-repeat right center / 8px;
                width: calc(50% - 4px);
                text-indent: 20px;
            }

            &--is-active {
                color: $primary-color;
            }
            &--is-active::placeholder {
                color: $primary-color;
            }
            &--is-active::-moz-placeholder {
                color: $primary-color;
            }
            &--is-active:-ms-input-placeholder {
                color: $primary-color;
            }
            &--is-active:-moz-placeholder {
                color: $primary-color;
            }
            &--single-date:first-child {
                width: 100%;
                background: none;
                text-align: left;
            }
        }

        &__month-day {
            visibility: visible;
            text-align: center;
            margin: 0;
            border: 0;
            height: 40px;
            padding-top: 14px;

            @include focusStyle();

            &--invalid-range {
                background-color: rgba($primary-color, .3);
                color: $lightest-gray;
                cursor: not-allowed;
                position: relative;
            }

            &--invalid {
                color: $lightest-gray;
                cursor: not-allowed;
            }

            &--valid:hover,
            &--allowed-checkout:hover {
                background-color: $white;
                color: $primary-color;
                z-index: 1;
                position: relative;
                box-shadow: 0 0 10px 3px rgba($gray, .4);
            }

            &--disabled {
                opacity: 0.25;
                cursor: not-allowed;
                pointer-events: none;
                position: relative;
            }

            &--selected {
                background-color: rgba($primary-color, .5);
                color: $white;

                &:hover {
                    background-color: $white;
                    color: $primary-color;
                    z-index: 1;
                    position: relative;
                    box-shadow: 0 0 10px 3px rgba($gray, .4);
                }
            }

            &--first-day-selected,
            &--last-day-selected {
                background: $primary-color;
                color: $white;
            }

            &--allowed-checkout {
                color: $medium-gray;
            }

            &--out-of-range {
                color: $lightest-gray;
                cursor: not-allowed;
                position: relative;
                pointer-events: none;
            }

            &--valid {
                cursor: pointer;
                color: $medium-gray;
            }

            &--hidden {
                opacity: 0.25;
                pointer-events: none;
                color: $white;
            }
        }

        &__month-button {
            background: transparent url('ic-arrow-right-green.regular.svg') no-repeat center center / 8px;
            cursor: pointer;
            display: inline-block;
            height: 60px;
            width: 60px;

            @include focusStyle();

            &--prev {
                transform: rotateY(180deg);
            }

            &--next {
                float: right;
            }

            &--locked {
                opacity: .2;
                cursor: not-allowed;
                pointer-events: none;
            }
        }

        &__inner {
            padding: 20px;
            float: left;

            @include device($up-to-tablet) {
                padding: 0;
            }
        }

        &__months {
            @include device($desktop) {
                width: 650px;
            }

            @include device($up-to-tablet) {
                margin-top: 92px;
                height: calc(100% - 92px);
                position: absolute;
                left: 0;
                top: 0;
                overflow: scroll;
                right: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
            }

            &::before {
                background: $light-gray;
                bottom: 0;
                content: '';
                display: block;
                left: 50%;
                position: absolute;
                top: 0;
                width: 1px;

                @include device($up-to-tablet) {
                    display: none;
                }
            }
        }

        &__month {
            font-size: 12px;
            float: left;
            width: 50%;
            padding-right: 10px;

            @include device($up-to-tablet) {
                width: 100%;
                padding-right: 0;
                padding-top: 60px;

                &:last-of-type {
                    margin-bottom: 65px;
                }
            }

            @include device($desktop) {
                &:last-of-type {
                    padding-right: 0;
                    padding-left: 10px;
                }
            }
        }

        &__month-caption {
            height: 2.5em;
            vertical-align: middle;
        }

        &__month-name {
            font-size: 16px;
            font-weight: 500;
            margin-top: -40px;
            padding-bottom: 17px;
            pointer-events: none;
            text-align: center;

            @include device($up-to-tablet) {
                margin-top: -25px;
                margin-bottom: 0;
                position: absolute;
                width: 100%;
            }
        }

        &__week-days {
            height: 2em;
            vertical-align: middle;
        }

        &__week-row {
            border-bottom: 5px solid $white;
            height: 38px;

            @include device($up-to-tablet) {
                box-shadow: 0 13px 18px -8px rgba($black, .07);
                height: 25px;
                left: 0;
                top: 65px;
                position: absolute;
                width: 100%;
            }
        }

        &__week-name {
            width: calc(100% / 7);
            float: left;
            font-size: 12px;
            font-weight: 400;
            color: $medium-gray;
            text-align: center;
        }

        &__close-button {
            appearance: none;
            background: transparent;
            border: 0;
            color: $primary-color;
            cursor: pointer;
            font-size: 21px;
            font-weight: bold;
            margin-top: 0;
            outline: 0;
            z-index: 10000;
            position: fixed;
            left: 7px;
            top: 5px;
            transform: rotate(45deg);
        }

        &__clear-button {
            appearance: none;
            background: transparent;
            border: 0;
            cursor: pointer;
            font-size: 25px;
            font-weight: bold;
            height: 40px;
            margin-bottom: 0;
            margin-left: 0;
            margin-right: -2px;
            margin-top: 4px;
            padding: 0;
            position: absolute;
            right: 0;
            top: 0;
            width: 40px;

            svg {
              fill: none;
              stroke-linecap: round;
              stroke-width: 8px;
              stroke: $medium-gray;
              width: 20px;
              width: 14px;
              top: -3px;
              position: relative;
            }

            @include focusStyle();
        }

        &__tooltip {
            background-color: $dark-gray;
            border-radius: 2px;
            color: $white;
            font-size: 11px;
            margin-left: 5px;
            margin-top: -22px;
            padding: 5px 10px;
            position: absolute;
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

    // Modifiers

    .-overflow-hidden {
        overflow: hidden;
    }

    .-is-hidden {
        display: none;
    }

    .-hide-up-to-tablet {
        @include device($up-to-tablet) {
            display: none;
        }
    }

    .-hide-on-desktop {
        @include device($desktop) {
            display: none;
        }
    }
</style>
