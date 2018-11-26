<template lang='pug'>
  .datepicker__wrapper(v-if='show' v-on-click-outside="handleOutsideClick")
    .datepicker__dummy-wrapper(v-if='(checkIn || checkOut)' @click='isOpen = !isOpen' :class="`${isOpen || checkIn || checkOut ? 'datepicker__dummy-wrapper--is-active' : ''}` ")
      button.datepicker__dummy-input.datepicker__input(
        data-qa='datepickerInput'
        :class="`${isOpen && checkIn == null ? 'datepicker__dummy-input--is-active' : ''} ${singleDaySelection ? 'datepicker__dummy-input--single-date' : ''}`"
        v-text="`${checkIn ? formatDate(checkIn) : i18n['check-in']}`"
        type="button"
      )
      button.datepicker__dummy-input.datepicker__input(
        v-if='!singleDaySelection'
        :class="`${isOpen && checkOut == null && checkIn !== null ? 'datepicker__dummy-input--is-active' : ''}`"
        v-text="`${checkOut ? formatDate(checkOut) : i18n['check-out']}`"
        type="button"
      )
    .datepicker__dummy-wrapper(
      v-if='(!checkIn && !checkOut)' 
      @click='isOpen = !isOpen'
      :class="`${isOpen ? 'datepicker__dummy-wrapper--is-active' : ''}` "
      )
      .datepicker__choose-dates(
        v-text="`${screenSize === 'desktop' ? i18n['choose-dates'] : i18n['dates']}`"
      )
    .datepicker( :class='`${ !isOpen ? "datepicker--closed" : "datepicker--open" }`')
      .-hide-on-desktop
        .datepicker__dummy-wrapper.datepicker__dummy-wrapper--no-border(
          v-if='(checkIn || checkOut)'
          @click='isOpen = !isOpen'
          :class="`${isOpen || checkIn || checkOut ? 'datepicker__dummy-wrapper--is-active' : ''}` "
        )
          button.datepicker__dummy-input.datepicker__input(
            :class="`${isOpen && checkIn == null ? 'datepicker__dummy-input--is-active' : ''}`"
            v-text="`${checkIn ? formatDate(checkIn) : i18n['check-in']}`"
            type="button"
          )
          button.datepicker__dummy-input.datepicker__input(
            :class="`${isOpen && checkOut == null && checkIn !== null ? 'datepicker__dummy-input--is-active' : ''}`"
            v-text="`${checkOut ? formatDate(checkOut) : i18n['check-out']}`"
            type="button"
          )
        .datepicker__dummy-wrapper-mobile(v-if='!checkIn && !checkOut' @click='isOpen = !isOpen' :class="`${isOpen ? 'datepicker__dummy-wrapper__mobile' : ''}` ")
          .datepicker__choose-dates__mobile(
            v-text="`${i18n['choose-dates-extended']}`"
          )
        .datepicker__close-button.-hide-on-desktop(v-if='isOpen' @click='hideDatepicker') ＋
      .datepicker__inner
        .datepicker__header.-table(v-if='screenSize === "desktop" && firstOpen && desktopHeader')
          .datepicker__datepicker-tooltip
            span.icon-lamp
            span.datepicker__datepicker-tooltip__text(
              v-text="`${i18n['datepicker-tooltip']}`"
            )
          span.datepicker__datepicker-enter-dates-later(
            v-text="`${i18n['enter-dates-later']}`"
            @click='hideDatepicker'
          )
        .datepicker__header
          span.datepicker__month-button.datepicker__month-button--prev.-hide-up-to-tablet(
            @click='renderPreviousMonth'
          )
          span.datepicker__month-button.datepicker__month-button--next.-hide-up-to-tablet(
            @click='renderNextMonth'
          )
        .datepicker__months(v-if='screenSize === "desktop"')
          div.datepicker__month(v-for='n in [0,1]'  v-bind:key='n')
            h1.datepicker__month-name(v-text='getMonth(months[activeMonthIndex+n].days[15].date)')
            .datepicker__week-row.-hide-up-to-tablet
              .datepicker__week-name(
                v-for="(dayName, index) in i18n['day-names']"
                v-text='dayName'
                :class="`${(index == 5 || index == 6) ? 'weekend' : ''}`"
                )
            .square(
              v-for='day in months[activeMonthIndex+n].days'
              @mouseover='hoveringDate = day.date'
              :class='checkToday(day.date)'
              )
              Day(
                :options="$props"
                @dayClicked='handleDayClick($event)'
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
              )
        .datepicker__footer
          span.datepicker__clear-button(
            v-if='screenSize === "desktop" && checkIn != null && checkOut != null'
            v-text="`${i18n['clear-dates']}`"
            @click='clearSelection'
          )
        div(v-if='screenSize !== "desktop" && isOpen')
          .datepicker__months#swiperWrapper
            div.datepicker__month(
              v-for='(a, n) in months'
              v-bind:key='n'
            )
              h1.datepicker__month-name(
                v-text='getMonth(months[n].days[15].date)'
              )
              .datepicker__week-row
                .datepicker__week-name(
                  v-for="(dayName, index) in i18n['day-names']"
                  v-text='dayName'
                  :class="`${(index == 5 || index == 6) ? 'weekend' : ''}`"
                )
              .square(v-for='(day, index) in months[n].days'
                @mouseover='hoveringDate = day.date'
                v-bind:key='index'
                :class='checkToday(day.date)'
              )
                Day(
                  :options="$props"
                  @dayClicked='handleDayClick($event)'
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
                )
            .footer__mobile    
              .clear-dates--mobile(
              v-if='checkIn != null && checkOut != null'
              v-text="`${i18n['clear-dates']}`"
              @click='clearSelection'
              )
              div.next--mobile(
                v-if='this.showMoreButton'
                @click='renderMultipleMonth(3)' type="button"
                v-text="`${i18n['show-more']}`"
              )
            
</template>

<script>
  import {directive as onClickOutside} from 'vue-on-click-outside';

  import fecha from 'fecha';
  import Day from './Day.vue';
  import Helpers from './helpers.js';

  const defaulti18n = {
    night: 'Night',
    nights: 'Nights',
    'day-names': ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    'check-in': 'Check-in',
    'check-out': 'Check-out',
    'choose-dates': 'Choose dates',
    'choose-dates-extended': 'Check-in & check-out dates',
    'clear-dates': 'Clear dates',
    'datepicker-tooltip': 'Enter dates of your trip to see prices',
    'dates': 'Dates',
    'enter-dates-later': 'Enter dates later',
    'month-names': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    'show-more': 'More',
  };

  export default {
    name: 'HotelDatePicker',

    directives: {
      'on-click-outside': onClickOutside
    },

    components: {Day,},

    props: {
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
      minNights: {
        default: 1,
        type: Number
      },
      maxNights: {
        default: null,
        type: Number
      },
      desktopHeader: {
        default: false,
        type: Boolean
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
        default: true,
        type: Boolean
      }
    },

    data() {
      return {
        hoveringDate: null,
        checkIn: this.startingDateValue,
        checkOut: this.endingDateValue,
        currentDate: new Date(),
        months: [],
        activeMonthIndex: 0,
        nextDisabledDate: null,
        show: true,
        isOpen: false,
        firstOpen: true,
        sortedDisabledDates: null,
        screenSize: this.handleWindowResize(),
        showMoreButton: true,
        totalNights: '',
        scrolledToSelectedDates: false,
      };
    },

    watch: {
      isOpen(value) {
        if (this.screenSize !== 'desktop') {
          const bodyClassList = document.querySelector('body').classList;

          if (value) {
            bodyClassList.add('-overflow-hidden');
          }
          else {
            bodyClassList.remove('-overflow-hidden');
          }
        }
      },
      checkIn(newDate) {
        this.$emit("checkInChanged", newDate)
      },
      checkOut(newDate) {
        if (this.checkOut !== null && this.checkOut !== null) {
          this.hoveringDate = null;
          this.nextDisabledDate = null;
          this.show = true;
          this.parseDisabledDates();
          this.reRender();
          this.isOpen = false;
          this.$parent.$emit('inputChanged', this.inputValue);
        }

        this.$emit("checkOutChanged", newDate);
      }
    },

    computed: {
      inputValue: function() {
        if( this.checkIn && this.checkOut){
          return fecha.format(this.checkIn, 'YYYY-MM-DD') + ';' + fecha.format(this.checkOut, 'YYYY-MM-DD')
        }
        else return ''
      },
    },

    methods: {
      ...Helpers,

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
        this.$emit('heightChanged');
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
        this.reRender();
        this.$parent.$emit('inputChanged', this.inputValue);
      },
      handleOutsideClick() {
        if (this.isOpen || event.target.classList.contains('btn-show-datepicker') == false) {
          this.hideDatepicker();
        }
        else {
          this.isOpen = true;
        }
      },
      hideDatepicker() {
        this.firstOpen = false;
        this.isOpen = false;
        this.scrolledToSelectedDates = false;
        if (!this.checkOut){
          this.activeMonthIndex = 0;
          this.clearSelection();
        }
        this.$parent.$emit('datePickerClosed', this.inputValue);
        let swiperWrapper = document.getElementById("swiperWrapper");
        if(swiperWrapper){
          swiperWrapper.removeEventListener('scroll', this.handleScroll);
        }
      },

      showDatepicker() {
        this.isOpen = true;
      },

      toggleDatepicker() {
        this.isOpen = !this.isOpen;
      },

      handleDayClick(event) {

        if (this.checkIn == null && this.singleDaySelection == false) {
          this.checkIn = event.date;
        } else if (this.singleDaySelection == true) {
          this.checkIn = event.date
          this.checkOut = event.date
        } else if (this.checkIn !== null && this.checkOut == null) {
            if(fecha.format(new Date(this.checkIn), 'YYYYMMDD') >= fecha.format(new Date(event.date), 'YYYYMMDD')){
              this.checkIn = event.date;
            } else this.checkOut = event.date;
        } else {
          this.checkOut = null;
          this.checkIn = event.date;
        }
        //this.nextDisabledDate = event.nextDisabledDate
      },

      renderPreviousMonth() {
        if (this.activeMonthIndex >= 1) {
          this.activeMonthIndex--
        }
        else return
      },

      renderNextMonth() {
        let firstDayOfLastMonth;

        // if (this.screenSize !== 'desktop') {
        //   firstDayOfLastMonth = this.months[this.months.length - 1].days
        //     .filter((day) => day.belongsToThisMonth === true);
        // } else {
        //   firstDayOfLastMonth = this.months[this.activeMonthIndex + 1].days
        //     .filter((day) => day.belongsToThisMonth === true);
        // }

        firstDayOfLastMonth = this.months[this.months.length - 1].days
            .filter((day) => day.belongsToThisMonth === true);

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
      },

      renderMultipleMonth(count = 3){
        for (let i = 1; i <= count; i++){
          this.renderNextMonth();
        }
      },

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

      formatDate(date) {
        return fecha.format(date, this.format)
      },

      checkToday(date) {
        const date1 = fecha.format(new Date(date), 'YYYYMMDD');
        const date2 = fecha.format(new Date(), 'YYYYMMDD');
        if(date1 == date2){
          return "square--today"
        }
      },

      createMonth(date) {
        const firstMonday = this.getFirstMonday(date);

        let month = {
          days: []
        };

        for (let i = 0; i < 42; i++) {
          month.days.push({
            date: this.addDays(firstMonday, i),
            belongsToThisMonth: this.addDays(firstMonday, i).getMonth() === date.getMonth(),
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
      },

      compareMonths(d1, d2) {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth() + 1;
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
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

      this.createMonth(new Date(this.startDate));
      if (!this.startingDateValue && !this.endingDateValue) {
        //if checkin & checkout dates are not set
        this.createMonth(this.getNextMonth(new Date(this.startDate)));
        if (this.screenSize !== 'desktop'){
          this.renderMultipleMonth(4);
        }
      }
      else {
        //if checkin checkout dates are set, draw months till checkin month and focus it
        var monthDiff = this.compareMonths(new Date(), this.startingDateValue);
        if (this.screenSize !== 'desktop' && monthDiff < 6) {
          monthDiff = 4;
        }
        this.renderMultipleMonth(monthDiff+2);
        this.activeMonthIndex = monthDiff;
      }
      this.parseDisabledDates();
    },

    updated() {
      this.$nextTick(function() {
        if(this.screenSize !== 'desktop' && this.isOpen){
          let swiperWrapper = document.getElementById("swiperWrapper");
          let startDate = document.getElementsByClassName('datepicker__month-day--last-day-selected')[0];
          
          //scroll to selected dates if set
          if(this.checkOut !== null && this.checkOut !== null && !this.scrolledToSelectedDates){
            let startDate = document.querySelector('.square div .datepicker__month-day--last-day-selected');
            startDate = startDate.parentElement.parentElement; //go to square div to measure offsetTop
            if(startDate){
              swiperWrapper.scrollTop = startDate.offsetTop;
              this.scrolledToSelectedDates = true;
            }
          }

          if(swiperWrapper){
            swiperWrapper.addEventListener('scroll', this.handleScroll, false);
          }
        }
      });
    },

    mounted() {
      window.addEventListener('resize', this.handleWindowResize);

      this.onElementHeightChange(document.body, () => {
        this.emitHeighChangeEvent();
      });
    },

    destroyed() {
      window.removeEventListener('resize', this.handleWindowResize);
    },
  };
</script>

<style lang="scss">
    /* =============================================================
     * RESPONSIVE LAYOUT HELPERS
     * ============================================================*/
    $tablet: '(min-width: 480px) and (max-width: 767px)';
    $phone: '(max-width: 479px)';
    $desktop: '(min-width: 768px)';
    $up-to-tablet: '(max-width: 767px)';
    $extra-small-screen: '(max-width: 23em)';

    @mixin device($device-widths) {
        @media screen and #{$device-widths} {
            @content
        }
    }

    .square {
        width: auto;
        float: left;
    }

    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    /* =============================================================
     * VARIABLES
     * ============================================================*/
    $white: #fff;
    $black: #444;
    $gray: #424b53;
    $primary-text-color: #35343d;
    $lightest-gray: #f3f5f8;
    $primary-color: #00ca9d;
    $primary-color: $primary-color;
    $medium-gray: #999999;
    $light-gray: #d7d9e2;
    $dark-gray: #545454;

    $font-small: 19px;
    $width-desktop: 139px;
    $width-mobile: 56px;
    $height-desktop: 42px;
    $height-mobile: 32px;

    /* =============================================================
     * BASE STYLES
     * ============================================================*/

    .datepicker {
        transition: all .2s ease-in-out;
        font-family: PT Sans;
        overflow: hidden;
        left: 0;
        position: absolute;
        z-index: 10;

        @include  device($desktop) {
          top: $height-desktop;
        }

        @include  device($up-to-tablet) {
          top: $height-mobile;
        }

        .square {
          position: relative;

          &--today{
            z-index: 1;
          }
        }

        .footer__mobile{
          position: fixed;
          width: 100%;
          min-height: 56px;
          bottom: 0;
          left: 0;
          position: -webkit-sticky !important;
          padding: 15px 10px;
          background-color: $white;
          border: none;
          z-index: 9999!important; 
          text-align: left;
          -webkit-box-shadow: 0px -2px 3px 0px rgba(0, 0, 0, 0.05);
          box-shadow: 0px -2px 3px 0px rgba(0, 0, 0, 0.05);
          background-color: #fff;
          .clear-dates--mobile {
            display: inline-block;
            width: auto;
            color: #2d6cb4;
            cursor: pointer;
            font-size: 14px;
            line-height: 34px;
            padding-left: 17px;
            text-align: left;
          }
          .next--mobile {
              float: right;
              color: #444;
              background-color: transparent;
              font-size: 14px;
              line-height: 16px;
              border-radius: 3px;
              padding: 8px 15px;
              font-weight: 400;
              vertical-align: middle;
              -ms-touch-action: manipulation;
              touch-action: manipulation;
              cursor: pointer;
              background-image: none;
              border: 1px solid #d1d1d1;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
              text-align: center;
              white-space: nowrap;
              width: fit-content;
              margin-right: 17px;
          }
        }
        &--closed {
            box-shadow: 0 15px 30px 10px rgba($black, 0);
            max-height: 0;
        }

        &--open {
            box-shadow: 0 15px 30px 10px rgba($black, .08);
            max-height: 900px;
            background-color: #fff;
            margin-top: 26px;
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
                margin-top: 0;
                .datepicker__dummy-input:first-child{
                  position: relative;
                  &:after {
                    display: block;
                    content: "—";
                    position: absolute;
                    right: -5px;
                    top: 8px;
                    font-size: 12px;
                  }
                }
            }
        }

        &__wrapper {
            position: relative;
            display: inline-block;
            color: $black;

            @include  device($desktop) {
                width: fit-content;
                height: $height-desktop;
                margin-right: 20px;
            }

            @include  device($up-to-tablet) {
                width: fit-content;
                height: $height-mobile;
            }
        }

        &__input {
            background: $dark-gray;
            height: $height-desktop;
            color: $white;
            font-size: 15px;
            line-height: $height-desktop;
            white-space: nowrap;
            outline: none;
            padding: 4px 0px 2px;
            width: 100%;
            border: 0;
            text-transform: lowercase;

            .mobile{
              background: $white;
              font-family: inherit;
              font-weight: 500;
              margin: 0;
              line-height: 1.4;
              font-size: 19px;
              color: #000;
            }

            &:focus {
                outline: none;
            }

            &::-webkit-input-placeholder,
            &::-moz-placeholder,
            &:-ms-input-placeholder,
            &:-moz-placeholder {
                color: $primary-text-color;
            }
        }

        &__dummy-wrapper {
            border-radius: 3px;
            cursor: pointer;
            display: block;
            float: left;
            width: 100%;
            height: 100%;
            background: $white;
            color: $black;
            font-weight: 200;
            border: 1px solid #d1d1d1;
            border-radius: 3px;
            font-size: 15px;

            @include  device($desktop) {
                line-height: $height-desktop;
            }

            @include  device($up-to-tablet) {
                line-height: $height-mobile;
                font-size: 14px;
            }

            &--no-border.datepicker__dummy-wrapper {
                display: flex;
                justify-content: center;
                margin-top: 10px;
                border: 0;
                background: #fff;
                border-bottom: 1px solid #d1d1d1;
                @include  device($up-to-tablet) {
                    position: relative;
                    z-index: 1;
                }
                .datepicker__dummy-input{
                  font-family: inherit;
                  font-weight: 500;
                  margin: 0;
                  line-height: 1.4;
                  font-size: 17px;
                  color: #000;
                }
            }

            &--is-active {
              background: $dark-gray;
              color: $white;
              border: none;
              .datepicker__dummy-input:first-child {
                margin-left: 20px;
                margin-right: 0px;
                @include  device($up-to-tablet) {
                  margin-left: 12px;
                }
              }
              .datepicker__dummy-input:last-child {
                margin-right: 20px;
                margin-left: 0px;
                @include  device($up-to-tablet) {
                  margin-right: 12px;
                }
              }
            }

            &__mobile {
              text-align: center;
              background-color: $white;
              min-height: 43px;
              font-family: PT Sans;
              line-height: 1.4;
              color: $black;
              font-size: 15px;
              padding: 10px 20px 0px 20px;
              border-bottom: 1px solid #d1d1d1;
              position: relative;
              z-index: 1;
            }
            
        }

        &__choose-dates {
              font-size: 15px;
              cursor: pointer;
              border-radius: 3px;
              margin-top: -1px;
              text-align: center;
              padding: 0 20px;
              @include  device($up-to-tablet) {
                font-size: 14px;
                padding: 0 12px;
              }
              &__mobile {
                font-family: inherit;
                font-weight: 500;
                margin: 0;
                line-height: 1.4;
                font-size: 17px;
                color: #000;
              }
            }

        &__dummy-input {
            color: $white;
            padding-top: 0;
            font-size: $font-small;
            font-weight: 200;
            font: inherit;
            float: left;
            text-align: left;
            text-indent: 0px;
            width: fit-content;
            height: 42px;

            @include  device($up-to-tablet) {
              height: 32px;
            }

            @include device($phone) {
                text-indent: 0;
                text-align: center;
            }

            &:first-child {
                background: transparent url('mdash.svg') no-repeat right center / 9px;
                padding-right: 14px;
                border-top-left-radius: 3px;
                border-bottom-left-radius: 3px;
            }

            &:last-child {
              background: transparent url('mdash.svg') no-repeat left center / 9px;
              padding-left: 4px;
              border-top-right-radius: 3px;
              border-bottom-right-radius: 3px;
              text-indent: 8px;
            }

            &--is-active {
                color: $white;
            }
            &--is-active::placeholder {
                color: $white;
            }
            &--is-active::-moz-placeholder {
                color: $white;
            }
            &--is-active:-ms-input-placeholder {
                color: $white;
            }
            &--is-active:-moz-placeholder {
                color: $white;
            }
            &--single-date:first-child {
                width: 100%;
                background: none;
                text-align: left;
                margin-right: 0px !important;
            }
        }

        &__month-day {
            border: 1px solid #e4e7e7;
            color: #000;
            background: #fff;
            font-family: PT Sans;
            box-sizing: border-box;
            cursor: pointer;
            font-size: 14px;
            line-height: 18px;
            text-align: center;
            visibility: visible;
            will-change: auto;
            text-align: center;
            padding-top: 10px;
            margin-left: -1px;
            margin-bottom: -1px;
            height: 39px;
            width: 39px;
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
                background-color: #D0E7FD;
                color: $black;

                &:hover {
                  background: #6FA759;
                  color: $white;
                  opacity: 1;
                }
            }

            &--today {
              border: 1px double #e10600;
              z-index: 1;
            }

            &--first-day-selected,
            &--last-day-selected {
                background: #6FA759;
                color: $white;
                opacity: 1;
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
                visibility: hidden;
                height: 0;
                padding: 0;
            }
        }

        &__month-button {
            background: transparent url('ic-arrow-right-datepicker.regular.svg') no-repeat right center / 17px;
            cursor: pointer;
            display: inline-block;
            margin-bottom: 19px;
            height: 13px;
            width: 20px;
            fill: #e4e7e7;
            stroke-width: 1;
            &--prev {
                
            }

            &--next {
                float: right;
                transform: rotateY(180deg);
            }

            &--locked {
                opacity: .2;
                cursor: not-allowed;
            }
        }

        &__inner {
            padding: 20px;
            float: left;
            width: 596px;
            @include device($up-to-tablet) {
                padding: 0;
            }
        }

        &__months {
            @include device($desktop) {
                width: 620px;
            }

            @include device($up-to-tablet) {
                width: 287px;
                margin-left: auto;
                margin-right: auto;
                margin-top: 40px;
                height: calc(100% - 42px);
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
        }

        &__month {
            font-size: 12px;
            float: left;
            width: 280px;
            padding-right: 10px;

            @include device($up-to-tablet) {
                width: 100%;
                padding-right: 10px;
                padding-left: 10px;
                padding-bottom: 1px;
                padding-top: 30px;
                margin-top: 10px;
                

                &:last-of-type {
                  margin-bottom: 75px;
                }
                &:last-child {
                  margin-bottom: 75px;
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
            font-weight: 400;
            margin-top: -40px;
            pointer-events: none;
            text-align: center;
            text-transform: Capitalize;
            color: #000;
            font-size: 18px;
            font-family: PT Sans;
            text-align: center;
            caption-side: top;

            @include device($up-to-tablet) {
                margin-top: -25px;
                margin-bottom: 0;
                position: absolute;
                width: 277px;
            }
        }

        &__week-days {
            height: 2em;
            vertical-align: middle;
        }

        &__week-row {
            border-bottom: 5px solid $white;
            height: 20px;

            @include device($up-to-tablet) {
                height: 25px;
                left: 0;
                top: 65px;
                width: 100%;
            }
        }

        &__week-name {
            width: 38px;
            float: left;
            font-size: 14px;
            font-weight: 400;
            font-family: PT Sans;
            color: $black;
            text-align: center;
            line-height: 18px;
            text-transform: lowercase;
        }

        &__close-button {
            background: transparent;
            border: 0;
            color: #464646;
            cursor: pointer;
            font-size: 21px;
            font-weight: bold;
            margin-top: 0;
            outline: 0;
            z-index: 10000;
            right: 13px;
            top: 14px;
            position: absolute;
            transform: rotate(45deg);
            display: block;
            float: right;
        }

        &__clear-button {
            cursor: pointer;
            color: #e10600;
            font-size: 14px;
            line-height: 16px;
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

        &__datepicker-tooltip{
          display: inline;

          &__text{
            color: $medium-gray;
            vertical-align: middle!important;
          }

          .icon-lamp{
            width: 28px;
            height: 28px;
            background-repeat: no-repeat;
            background-image: url(lamp.svg);
            display: inline-block;
            vertical-align: middle;
            bottom: 0;
            pointer-events: all;
            margin-right: 10px;
            }
        }

        &__datepicker-enter-dates-later{
            float: right;
            color: #2d6cb4;
            cursor: pointer;
            font-size: 14px;
            line-height: 16px;
            margin-top: 6px;
        }

        &__datepicker-total-nights{
            float: right;
            color: $medium-gray;
            font-size: 14px;
            line-height: 16px;
        }

        &__footer{
          margin-top: 250px;
        }
      }
    .weekend{
      color: #f51449;
    }

    // Modifiers

    .-overflow-hidden {
        overflow: hidden;
    }

    .-is-hidden {
        display: none;
    }

    .-table {
        content: " ";
        display: table;
        width: 100%;
        margin-bottom: 20px;
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