<template>
  <div
    class="vhd__datepicker__wrapper"
    :class="{
      'vhd__datepicker__wrapper--grid': gridStyle,
      'vhd__datepicker__wrapper--booking': bookings.length > 0,
      vhd__datepicker__fullview: alwaysVisible,
    }"
    :ref="`DatePicker-${hash}`"
    v-if="value"
  >
    <div class="vhd__datepicker__close-button vhd__hide-on-desktop" v-if="isOpen" @click="closeMobileDatepicker">
      <i>+</i>
    </div>
    <div class="vhd__datepicker__dummy-wrapper" :class="{ 'vhd__datepicker__dummy-wrapper--is-active': isOpen }">
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
    <div class="vhd__datepicker__clear-button" tabindex="0" @click="clearSelection" v-show="showClearSelectionButton">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 68">
        <path d="M6.5 6.5l55 55M61.5 6.5l-55 55"></path>
      </svg>
    </div>
    <div
      class="vhd__datepicker"
      :class="{
        'vhd__datepicker--open': isOpen && !alwaysVisible,
        'vhd__datepicker--closed': !isOpen && !alwaysVisible,
        'vhd__datepicker--right': positionRight,
      }"
    >
      <div class="vhd__hide-on-desktop">
        <div
          v-if="isOpen"
          class="vhd__datepicker__dummy-wrapper vhd__datepicker__dummy-wrapper--no-border"
          :class="{ 'vhd__datepicker__dummy-wrapper--is-active': isOpen }"
          @click="toggleDatepicker"
        >
          <div
            class="vhd__datepicker__input"
            tabindex="0"
            :class="{
              'vhd__datepicker__dummy-input--is-active': isOpen && checkIn == null,
            }"
            type="button"
          >
            {{ `${checkIn ? dateFormater(checkIn) : i18n['check-in']}` }}
          </div>
          <div
            class="vhd__datepicker__input"
            tabindex="0"
            :class="{
              'vhd__datepicker__dummy-input--is-active': isOpen && checkOut == null && checkIn !== null,
            }"
            type="button"
          >
            {{ `${checkOut ? dateFormater(checkOut) : i18n['check-out']}` }}
          </div>
        </div>
      </div>
      <div v-if="isOpen || alwaysVisible" class="vhd__datepicker__inner">
        <div
          :class="{
            vhd__datepicker__header: screenSize === 'desktop',
            'vhd__datepicker__header-mobile': screenSize !== 'desktop',
          }"
        >
          <button
            type="button"
            class="vhd__datepicker__month-button vhd__datepicker__month-button--prev"
            @click="renderPreviousMonth"
            @keyup.enter.stop.prevent="renderPreviousMonth"
            :tabindex="isOpen ? 0 : -1"
            :disabled="activeMonthIndex === 0"
          />
          <button
            type="button"
            class="vhd__datepicker__month-button vhd__datepicker__month-button--next"
            @click="renderNextMonth"
            @keyup.enter.stop.prevent="renderNextMonth"
            :disabled="isPreventedMaxMonth"
            :tabindex="isOpen ? 0 : -1"
          />
        </div>
        <div
          class="vhd__datepicker__months"
          :class="{ 'vhd__datepicker__months--full': showSingleMonth }"
          v-if="screenSize === 'desktop' || alwaysVisible"
        >
          <div
            ref="datepickerMonth"
            class="vhd__datepicker__month"
            v-for="(month, monthIndex) in paginateMonths"
            :key="`${datepickerMonthKey}-${month}`"
          >
            <p class="vhd__datepicker__month-name">
              {{ getMonth(months[activeMonthIndex + month].days[15].date) }}
            </p>
            <div class="vhd__datepicker__week-row vhd__hide-up-to-tablet">
              <div
                class="vhd__datepicker__week-name"
                v-for="(dayName, datePickerWeekIndexDesktop) in i18n['day-names']"
                :key="`${datepickerWeekKey}-${datePickerWeekIndexDesktop}`"
              >
                {{ dayName }}
              </div>
            </div>
            <div
              class="vhd__square"
              v-for="(day, dayIndexDesktop) in months[activeMonthIndex + month].days"
              @mouseenter="mouseEnterDay(day)"
              :key="`${datepickerDayKey}-${monthIndex}-${dayIndexDesktop}`"
            >
              <Day
                :activeMonthIndex="activeMonthIndex"
                :belongsToThisMonth="day.belongsToThisMonth"
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
                :isOpen="isOpen"
                :minNightCount="minNightCount"
                :nextDisabledDate="nextDisabledDate"
                :nextPeriodDisableDates="nextPeriodDisableDates"
                :options="dayOptions"
                :screenSize="screenSize"
                :showCustomTooltip="showCustomTooltip"
                :showPrice="showPrice"
                :sortedDisabledDates="sortedDisabledDates"
                :sortedPeriodDates="sortedPeriodDates"
                :tooltipMessage="customTooltipMessage"
                @clear-selection="clearSelection"
                @booking-clicked="handleBookingClicked"
                @day-clicked="handleDayClick"
              />
            </div>
          </div>
        </div>
        <div
          v-if="screenSize !== 'desktop' && isOpen && !alwaysVisible"
          :class="['vhd__datepicker__months-wrapper', { 'vhd__show-tooltip': showCustomTooltip && hoveringTooltip }]"
        >
          <div class="vhd__datepicker__tooltip--mobile" v-if="hoveringTooltip">
            <template v-if="customTooltipMessage">
              {{ cleanString(customTooltipMessage) }}
            </template>
          </div>
          <div class="vhd__datepicker__months" ref="swiperWrapper">
            <div
              ref="datepickerMonth"
              class="vhd__datepicker__month"
              v-for="(a, n) in paginateMonths"
              :key="`${datepickerMonthKey}-${n}`"
            >
              <p class="vhd__datepicker__month-name">
                {{ getMonth(months[activeMonthIndex + n].days[15].date) }}
              </p>
              <div class="vhd__datepicker__week-row">
                <div
                  class="vhd__datepicker__week-name"
                  v-for="(dayName, datePickerIndex) in i18n['day-names']"
                  :key="`datepicker__month-name-datepicker__week-name-${datePickerIndex}`"
                >
                  {{ dayName }}
                </div>
              </div>
              <div
                class="vhd__square"
                v-for="(day, dayIndexMobile) in months[activeMonthIndex + n].days"
                :key="`${datepickerDayKey}-${n}-${dayIndexMobile}`"
                @mouseenter="mouseEnterDay(day)"
              >
                <Day
                  :activeMonthIndex="activeMonthIndex"
                  :belongsToThisMonth="day.belongsToThisMonth"
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
                  :isOpen="isOpen"
                  :minNightCount="minNightCount"
                  :nextDisabledDate="nextDisabledDate"
                  :nextPeriodDisableDates="nextPeriodDisableDates"
                  :options="dayOptions"
                  :screenSize="screenSize"
                  :showPrice="showPrice"
                  :sortedDisabledDates="sortedDisabledDates"
                  :sortedPeriodDates="sortedPeriodDates"
                  :tooltipMessage="customTooltipMessage"
                  @clear-selection="clearSelection"
                  @booking-clicked="handleBookingClicked"
                  @day-clicked="handleDayClick"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import throttle from 'lodash.throttle'
import fecha from 'fecha'

import Day from './components/Day.vue'
import DateInput from './components/DateInput.vue'
import Helpers from '../helpers'
import i18nDefaults from '../i18n/en'

export default {
  name: 'HotelDatePicker',
  components: {
    Day,
    DateInput,
  },
  props: {
    alwaysVisible: {
      type: Boolean,
      default: false,
    },
    bookings: {
      type: Array,
      default() {
        return []
      },
    },
    closeDatepickerOnClickOutside: {
      type: Boolean,
      default: true,
    },
    disableCheckoutOnCheckin: {
      type: Boolean,
      default: false,
    },
    disabledDates: {
      type: Array,
      default() {
        return []
      },
    },
    disabledDaysOfWeek: {
      type: Array,
      default() {
        return []
      },
    },
    disabledWeekDays: {
      type: Object,
      default() {
        return {}
      },
    },
    displayClearButton: {
      type: Boolean,
      default: true,
    },
    enableCheckout: {
      type: Boolean,
      default: false,
    },
    endDate: {
      type: [Date, String, Number],
      default: Infinity,
    },
    endingDateValue: {
      type: [Date, null],
      default: null,
    },
    firstDayOfWeek: {
      type: Number,
      default: 0,
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    gridStyle: {
      type: Boolean,
      default: true,
    },
    halfDay: {
      type: Boolean,
      default: true,
    },
    hoveringTooltip: {
      default: true,
      type: [Boolean, Function],
    },
    i18n: {
      type: Object,
      default: () => i18nDefaults,
    },
    lastDateAvailable: {
      type: [Number, Date],
      default: Infinity,
    },
    maxNights: {
      type: [Number, null],
      default: null,
    },
    minNights: {
      type: Number,
      default: 1,
    },
    periodDates: {
      type: Array,
      default() {
        return []
      },
    },
    positionRight: {
      type: Boolean,
      default: false,
    },
    showPrice: {
      type: Boolean,
      default: false,
    },
    showSingleMonth: {
      type: Boolean,
      default: false,
    },
    showYear: {
      type: Boolean,
      default: true,
    },
    singleDaySelection: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: [Date, String],
      default() {
        return new Date()
      },
    },
    startingDateValue: {
      type: [Date, null],
      default: null,
    },
    tooltipMessage: {
      type: [String, null],
      default: null,
    },
    value: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      activeMonthIndex: 0,
      checkIn: this.startingDateValue,
      checkIncheckOutHalfDay: {},
      checkInPeriod: {},
      checkOut: this.endingDateValue,
      hoveringPeriod: {},
      customTooltip: '',
      customTooltipHalfday: '',
      datepickerDayKey: 0,
      datepickerMonthKey: 0,
      datepickerWeekKey: 0,
      dynamicNightCounts: null,
      hash: Date.now(),
      hoveringDate: null,
      isTouchMove: false,
      months: [],
      nextDisabledDate: null,
      nextPeriodDisableDates: [],
      open: false,
      screenSize: null,
      showCustomTooltip: false,
      sortedDisabledDates: null,
      xDown: null,
      xUp: null,
      yDown: null,
      yUp: null,
    }
  },
  computed: {
    isOpen: {
      get() {
        return this.open
      },
      set(open) {
        this.open = open

        if (this.screenSize !== 'desktop' && !this.alwaysVisible) {
          const body = document.querySelector('body')

          if (open) {
            body.style.overflow = 'hidden'

            this.$nextTick(() => {
              if (this.$refs) {
                const { swiperWrapper } = this.$refs
                const monthHeihgt = this.$refs.datepickerMonth[0].offsetHeight
                const currentSelectionIndex = this.checkOut ? this.getMonthDiff(new Date(), this.checkOut) : 0

                swiperWrapper.scrollTop = currentSelectionIndex * monthHeihgt
              }
            })
          } else {
            body.style.overflow = ''
          }
        }

        this.$emit('input', this.open)
      },
    },
    sortBookings() {
      if (this.bookings.length > 0) {
        const bookings = [...this.bookings]

        return bookings.sort((a, b) => {
          const aa = a.checkInDate.split('/').reverse().join()
          const bb = b.checkOutDate.split('/').reverse().join()

          // eslint-disable-next-line no-nested-ternary
          return aa < bb ? -1 : aa > bb ? 1 : 0
        })
      }

      return []
    },
    duplicateBookingDates() {
      return this.baseHalfDayDates.filter(((newArr) => (date) => newArr.has(date) || !newArr.add(date))(new Set()))
    },
    baseHalfDayDates() {
      if (this.sortBookings.length > 0) {
        const bookings = this.sortBookings.map((x) => [x.checkInDate, x.checkOutDate])

        return bookings.reduce((a, b) => {
          return a.concat(b)
        })
      }

      return this.disabledDates
    },
    paginateMonths() {
      if (this.showSingleMonth || (this.alwaysVisible && this.screenSize !== 'desktop')) {
        return [0]
      }

      return [0, 1]
    },
    customTooltipMessage() {
      let tooltip = ''

      if (this.hoveringDate && (this.customTooltip || this.customTooltipHalfday)) {
        if (this.customTooltip && this.customTooltipHalfday) {
          tooltip = `${this.customTooltipHalfday}. <br/> ${this.customTooltip}`
        } else if (this.customTooltipHalfday && !this.customTooltip) {
          tooltip = this.customTooltipHalfday
        } else {
          tooltip = this.customTooltip
        }

        return tooltip
      }

      return this.tooltipMessage
    },
    sortedPeriodDates() {
      if (this.periodDates) {
        const periodDates = [...this.periodDates]

        return periodDates.sort((a, b) => {
          const aa = a.startAt.split('/').reverse().join()
          const bb = b.startAt.split('/').reverse().join()

          // eslint-disable-next-line no-nested-ternary
          return aa < bb ? -1 : aa > bb ? 1 : 0
        })
      }

      return this.periodDates
    },
    sliceMonthMobile() {
      const nbMonthRenderDom = 4

      if (this.activeMonthIndex >= nbMonthRenderDom) {
        return this.months.slice(this.activeMonthIndex - 3, this.activeMonthIndex + 1)
      }

      return this.months.slice(0, nbMonthRenderDom)
    },
    isPreventedMaxMonth() {
      const lastIndexMonthAvailable = this.getMonthDiff(this.startDate, this.lastDateAvailable)

      return this.activeMonthIndex >= lastIndexMonthAvailable - 1
    },
    minNightCount() {
      return this.dynamicNightCounts || this.minNights
    },
    showClearSelectionButton() {
      return Boolean((this.checkIn || this.checkOut) && this.displayClearButton)
    },
    disabledWeekDaysObject() {
      const disabledDays = this.disabledDaysOfWeek.map((d) => d.toLowerCase())
      // const names = this.i18n['day-names']
      const names = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const SUNDAY = names[0]
      const MONDAY = names[1]
      const TUESDAY = names[2]
      const WEDNESDAY = names[3]
      const THURSDAY = names[4]
      const FRIDAY = names[5]
      const SATURDAY = names[6]
      // The order of _default is important!
      const disabledWeekDaysObject = {
        sunday: disabledDays.includes(SUNDAY),
        monday: disabledDays.includes(MONDAY),
        tuesday: disabledDays.includes(TUESDAY),
        wednesday: disabledDays.includes(WEDNESDAY),
        thursday: disabledDays.includes(THURSDAY),
        friday: disabledDays.includes(FRIDAY),
        saturday: disabledDays.includes(SATURDAY),
      }

      return Object.assign(disabledWeekDaysObject, this.disabledWeekDays)
    },
    disabledWeekDaysArray() {
      const days = this.disabledWeekDaysObject
      // const names = this.i18n['day-names']
      const names = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

      const fn = function fnDisabledWeekDaysArray(day, ix) {
        return day[1] ? names[ix] : false
      }

      return Object.entries(days)
        .map(fn)
        .filter((v) => v)
    },
    dayOptions() {
      return { ...this.$props, disabledWeekDaysObject: this.disabledWeekDaysObject }
    },
  },
  watch: {
    bookings() {
      this.createHalfDayDates(this.baseHalfDayDates)
    },
    checkIn(newDate) {
      this.$emit('check-in-changed', newDate)
    },
    checkOut(newDate) {
      if (this.checkOut !== null) {
        this.hoveringDate = null
        this.nextDisabledDate = null
        this.createHalfDayDates(this.baseHalfDayDates)
        this.reRender()
        this.showCustomTooltip = false
        this.isOpen = false
      }

      this.$emit('check-out-changed', newDate)
    },
  },
  created() {
    fecha.i18n = {
      dayNames: this.i18n['day-names'],
      dayNamesShort: this.shortenString(this.i18n['day-names'], 3),
      monthNames: this.i18n['month-names'],
      monthNamesShort: this.shortenString(this.i18n['month-names'], 3),
      amPm: ['am', 'pm'],
      // D is the day of the month, function returns something like...  3rd or 11th
      DoFn(D) {
        return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : ((D - (D % 10) !== 10) * D) % 10]
      },
    }

    if (
      this.checkIn &&
      (this.getMonthDiff(this.getNextMonth(new Date(this.startDate)), this.checkIn) > 0 ||
        this.getMonthDiff(this.startDate, this.checkIn) > 0)
    ) {
      this.createMonth(new Date(this.startDate))
      const count = this.getMonthDiff(this.startDate, this.checkIn)
      let nextMonth = new Date(this.startDate)

      for (let i = 0; i <= count; i++) {
        const tempNextMonth = this.getNextMonth(nextMonth)

        this.createMonth(tempNextMonth)
        nextMonth = tempNextMonth
      }

      if (this.checkOut && this.getMonthDiff(this.checkIn, this.checkOut) > 0) {
        this.createMonth(this.getNextMonth(nextMonth))
        this.activeMonthIndex = 1
      }

      this.activeMonthIndex += count
    } else {
      this.createMonth(new Date(this.startDate))
      this.createMonth(this.getNextMonth(new Date(this.startDate)))
    }
  },
  mounted() {
    this.handleWindowResize()

    window.addEventListener('resize', this.handleWindowResize)

    if (this.screenSize !== 'desktop') {
      document.addEventListener('touchstart', this.handleTouchStart, false)
      document.addEventListener('touchmove', this.handleTouchMove, false)
      document.addEventListener('touchend', this.handleTouchEnd, false)
    } else {
      document.addEventListener('click', this.handleClickOutside, false)
      document.addEventListener('keyup', this.escFunction, false)
    }

    this.onElementHeightChange(document.body, () => {
      this.emitHeighChangeEvent()
    })

    this.createHalfDayDates(this.baseHalfDayDates)
  },
  destroyed() {
    window.removeEventListener('resize', this.handleWindowResize)

    if (this.screenSize !== 'desktop') {
      document.removeEventListener('touchstart', this.handleTouchStart)
      document.removeEventListener('touchmove', this.handleTouchMove)
      document.removeEventListener('touchend', this.handleTouchEnd)
    } else {
      document.removeEventListener('keyup', this.escFunction, false)
      document.removeEventListener('click', this.handleClickOutside)
    }
  },
  methods: {
    ...Helpers,
    transformDisabledWeekDays() {},
    handleBookingClicked(event, date, currentBooking) {
      this.$emit('booking-clicked', event, date, currentBooking)
      /**
       * @deprecated since v4.0.0 beta 11
       */
      this.$emit('bookingClicked', event, date, currentBooking)
    },
    escFunction(e) {
      const escTouch = 27

      if (e.keyCode === escTouch && this.isOpen && this.checkIn) {
        this.clearSelection()
      }
    },
    formatDate(date) {
      return this.dateFormater(date, this.format)
    },
    cleanString(string) {
      // eslint-disable-next-line no-useless-escape
      return string.replace(/\<br\/>/g, '')
    },
    dateIsInCheckInCheckOut(date) {
      const compareDate = this.dateFormater(date)
      let currentPeriod = null

      this.sortedPeriodDates.forEach((d) => {
        if (
          d.endAt !== compareDate &&
          (d.startAt === compareDate || this.validateDateBetweenTwoDates(d.startAt, d.endAt, compareDate))
        ) {
          currentPeriod = d
        }
      })

      return currentPeriod
    },
    dayIsDisabled(date) {
      if (
        this.checkIn &&
        !this.checkOut &&
        !this.isDateLessOrEquals(date, this.nextDisabledDate) &&
        this.nextDisabledDate !== Infinity
      ) {
        return true
      }

      if (this.checkIn && !this.checkOut && this.isDateLessOrEquals(date, this.checkIn)) {
        return true
      }

      return false
    },
    mouseEnterDay(day) {
      const formatDate = this.dateFormater(day.date)
      const halfDays = Object.keys(this.checkIncheckOutHalfDay)
      const disableDays = this.disabledDates
        .filter((disableDate) => !halfDays.includes(disableDate))
        .includes(formatDate)

      if (!this.dayIsDisabled(day.date) && day.belongsToThisMonth && !disableDays) {
        this.setCustomTooltipOnHover(day)
      }
    },
    setCurrentPeriod(date, eventType) {
      let currentPeriod = {}

      if (this.sortedPeriodDates.length > 0) {
        this.sortedPeriodDates.forEach((d) => {
          if (
            eventType === 'click' &&
            (d.startAt === this.dateFormater(date) ||
              (d.endAt !== this.dateFormater(date) && this.validateDateBetweenTwoDates(d.startAt, d.endAt, date)))
          ) {
            currentPeriod = d
          } else if (
            eventType === 'hover' &&
            (d.startAt === this.dateFormater(date) || this.validateDateBetweenTwoDates(d.startAt, d.endAt, date))
          ) {
            currentPeriod = d
          }
        })

        if (Object.keys(currentPeriod).length > 0) {
          this.hoveringPeriod = currentPeriod
        } else if (this.minNightCount > 0 && this.checkIn) {
          this.hoveringPeriod = {
            periodType: 'nightly',
            minimumDuration: this.minNightCount,
            startAt: this.checkIn,
            endAt: this.addDays(this.checkIn, this.minNightCount),
          }
        } else {
          this.hoveringPeriod = {
            periodType: 'nightly',
            minimumDuration: this.minNightCount,
            startAt: this.checkIn,
            endAt: this.addDays(this.checkIn, this.minNightCount),
          }
        }
      } else if (this.minNightCount > 0) {
        this.hoveringPeriod = {
          periodType: 'nightly',
          minimumDuration: this.minNightCount,
          startAt: this.checkIn,
          endAt: this.addDays(this.checkIn, this.minNightCount),
        }
      }
    },
    setCustomTooltipOnHover(day) {
      const { date } = day

      this.hoveringDate = date
      if (this.showCustomTooltip) this.showCustomTooltip = false

      this.setCurrentPeriod(date, 'hover')

      if (Object.keys(this.hoveringPeriod).length > 0) {
        // Create tooltip
        if (this.hoveringPeriod.periodType === 'weekly_by_saturday') {
          const dayCode = 6
          const text = this.i18n.tooltip.saturdayToSaturday

          this.showTooltipWeeklyOnHover(date, dayCode, text)
        } else if (this.hoveringPeriod.periodType === 'weekly_by_sunday') {
          const dayCode = 0
          const text = this.i18n.tooltip.sundayToSunday

          this.showTooltipWeeklyOnHover(date, dayCode, text)
        } else if (this.hoveringPeriod.periodType === 'nightly') {
          this.showTooltipNightlyOnHover(date)
        } else {
          // Clean tooltip
          this.showCustomTooltip = false
          this.customTooltip = ''
        }
      } else {
        this.hoveringPeriod = {}
      }

      if (this.halfDay) {
        this.createHalfDayTooltip(day.date)
      }
    },
    handleDayClick(event, date, formatDate, resetCheckin) {
      this.nextPeriodDisableDates = []

      if (resetCheckin) {
        this.clearSelection()
        this.$nextTick(() => {
          this.handleDayClick(event, date, formatDate, false)
        })

        return
      }

      let nextDisabledDate =
        (this.maxNights ? this.addDays(date, this.maxNights) : null) ||
        this.getNextDate(this.sortedDisabledDates, date) ||
        this.nextDateByDayOfWeekArray(this.disabledWeekDaysArray, date) ||
        this.nextBookingDate(date) ||
        Infinity

      this.dynamicNightCounts = null

      if (this.enableCheckout) {
        nextDisabledDate = Infinity
      }

      if (this.checkIn == null && this.singleDaySelection === false) {
        this.checkIn = date
        this.setMinimumDuration(date)
      } else if (this.singleDaySelection === true) {
        this.checkIn = date
        this.checkOut = date
      } else if (this.checkIn !== null && this.checkOut == null && this.isDateLessOrEquals(date, this.checkIn)) {
        this.checkIn = date
      } else if (this.checkIn !== null && this.checkOut == null) {
        this.checkOut = date
        this.$emit('period-selected', event, this.checkIn, this.checkOut)
        /**
         * @deprecated since v4.0.0 beta 11
         */
        this.$emit('periodSelected', event, this.checkIn, this.checkOut)
      } else {
        this.checkOut = null
        this.checkIn = date
        this.setMinimumDuration(date)
      }

      if (this.checkIn && !this.checkOut) {
        this.setCurrentPeriod(date, 'click')
        this.checkInPeriod = this.hoveringPeriod
        this.setCustomTooltipOnClick()
      }

      this.nextDisabledDate = nextDisabledDate
      this.hoveringDate = null
      this.hoveringDate = date
      this.$emit('day-clicked', date, formatDate, nextDisabledDate)
      /**
       * @deprecated since v4.0.0 beta 11
       */
      this.$emit('dayClicked', date, formatDate, nextDisabledDate)
    },
    nextBookingDate(date) {
      let closest = Infinity

      if (this.sortBookings.length > 0) {
        const nextDateFormated = this.dateFormater(this.addDays(date, 1))
        const nextBooking = this.sortBookings.find(
          (booking) =>
            this.validateDateBetweenDate(booking.checkInDate, nextDateFormated) ||
            this.validateDateBetweenTwoDates(booking.checkInDate, booking.checkOutDate, nextDateFormated),
        )

        closest = nextBooking ? nextBooking.checkInDate : Infinity
      }

      return closest
    },
    setCustomTooltipOnClick() {
      if (Object.keys(this.checkInPeriod).length > 0 && this.checkInPeriod.periodType.includes('weekly')) {
        const nextValidDate = this.addDays(this.checkIn, this.minNightCount)

        this.checkInPeriod.nextValidDate = nextValidDate
        this.showTooltipWeeklyOnClick()
      } else if (this.checkInPeriod.periodType === 'nightly') {
        this.showTooltipNightlyOnClick()
      }
    },
    showTooltipWeeklyOnHover(date, periodDayType, text) {
      const countDaysBetweenCheckInCurrentDay = this.countDays(this.checkIn, date)
      const notOnPeriodDayType = date.getDay() !== periodDayType
      const isCheckInCheckOut = this.checkIn && this.checkOut
      const notCheckInNotPeriodDayType = !this.checkIn && notOnPeriodDayType
      const isCheckInNotCheckOut = this.checkIn && !this.checkOut
      const isNotBetweenCheckInAndCheckOut = !this.validateDateBetweenTwoDates(this.checkIn, this.checkOut, date)
      const notAllowDaysBetweenCheckInAndNextValidDate =
        this.hoveringPeriod.nextValidDate &&
        this.validateDateBetweenTwoDates(this.checkIn, this.hoveringPeriod.nextValidDate, this.hoveringDate) &&
        this.dateFormater(this.checkIn) !== this.dateFormater(this.hoveringDate) &&
        this.dateFormater(this.hoveringPeriod.nextValidDate) !== this.dateFormater(this.hoveringDate)
      const hasHalfDayOnWeeklyPeriod =
        Object.keys(this.checkIncheckOutHalfDay).length > 0 &&
        this.checkIncheckOutHalfDay[this.dateFormater(date)] &&
        this.checkIncheckOutHalfDay[this.dateFormater(date)].checkIn

      // Show tooltip on not-allowed day
      if (notCheckInNotPeriodDayType) {
        this.showCustomTooltip = true
        this.customTooltip = text
      } else {
        this.showCustomTooltip = false
        this.customTooltip = ''
      }

      // Show tooltip when CheckIn
      if (isCheckInNotCheckOut) {
        const nextDayValid = this.addDays(this.checkIn, this.minNightCount)
        const isDateAfterMinimumDuration = this.getDayDiff(date, nextDayValid) <= 0

        if (isDateAfterMinimumDuration && notOnPeriodDayType) {
          this.showCustomTooltip = true
          this.customTooltip = text
        } else if (notOnPeriodDayType || notAllowDaysBetweenCheckInAndNextValidDate) {
          if (this.checkInPeriod && this.checkInPeriod.periodType === 'nightly') {
            this.showCustomTooltip = false
            this.customTooltip = ''
          } else {
            // Show default message on currentDay
            const night = this.pluralize(this.minNightCount, 'week')

            this.showCustomTooltip = true
            this.customTooltip = this.completeTrad(this.i18n.tooltip.minimumRequiredPeriod, {
              minNightInPeriod: this.minNightCount / 7,
              night,
            })
          }
        } else if (hasHalfDayOnWeeklyPeriod) {
          // Show the correct wording in comparison to periodType of this.checkInPeriod equal to "nightly" / "weekly"
          if (this.checkInPeriod.periodType !== 'nightly') {
            this.customTooltip = `${countDaysBetweenCheckInCurrentDay / 7} ${this.pluralize(
              this.minNightCount,
              'week',
            )}`
          } else if (this.checkInPeriod.periodType === 'nightly') {
            this.customTooltip = `${countDaysBetweenCheckInCurrentDay} ${
              countDaysBetweenCheckInCurrentDay !== 1 ? this.i18n.nights : this.i18n.night
            }`
          }
        } else {
          // Clean tooltip
          this.showCustomTooltip = false
          this.customTooltip = ''
        }
        // Show tooltip when CheckIn & CheckOut on all the days that are not between checkIn and CheckOut
      } else if (isCheckInCheckOut && notOnPeriodDayType && isNotBetweenCheckInAndCheckOut) {
        this.showCustomTooltip = true
        this.customTooltip = text
      }
    },
    showTooltipWeeklyOnClick() {
      const night = this.pluralize(this.minNightCount, 'week')

      this.showCustomTooltip = true
      this.customTooltip = this.completeTrad(this.i18n.tooltip.minimumRequiredPeriod, {
        minNightInPeriod: this.minNightCount / 7,
        night,
      })
    },
    showTooltipNightlyOnHover(date) {
      if (this.checkIn && !this.checkOut) {
        const nextDayValid = this.addDays(this.checkIn, this.minNightCount)
        const isDateAfterMinimumDuration = this.getDayDiff(date, nextDayValid) <= 0
        const countOfDays = this.countDays(this.checkIn, date)
        const night = this.pluralize(Math.max(this.minNightCount, countOfDays))

        if (!isDateAfterMinimumDuration) {
          const minNightInPeriod = this.hoveringPeriod.minimumDuration

          this.showCustomTooltip = true
          this.customTooltip = this.completeTrad(this.i18n.tooltip.minimumRequiredPeriod, {
            minNightInPeriod,
            night,
          })
        } else {
          this.customTooltip = `${countOfDays} ${night}`
        }
      } else {
        this.customTooltip = ''
      }
    },
    showTooltipNightlyOnClick() {
      const minNightInPeriod = this.hoveringPeriod.minimumDuration
      const night = this.pluralize(this.minNightCount)

      this.showCustomTooltip = true
      this.customTooltip = this.completeTrad(this.i18n.tooltip.minimumRequiredPeriod, { minNightInPeriod, night })
    },
    createHalfDayTooltip(date) {
      this.customTooltipHalfday = ''
      const formatedHoveringDate = this.dateFormater(date)

      if (this.checkIncheckOutHalfDay[formatedHoveringDate]) {
        this.showCustomTooltip = true

        if (this.checkIncheckOutHalfDay[formatedHoveringDate].checkIn) {
          this.customTooltipHalfday = this.i18n.tooltip.halfDayCheckOut
        } else if (this.checkIncheckOutHalfDay[formatedHoveringDate].checkOut) {
          this.customTooltipHalfday = this.i18n.tooltip.halfDayCheckIn
        }
      }
    },
    completeTrad(translation, keys) {
      let newT = translation
      const keysTranslations = Object.keys(keys)

      keysTranslations.forEach((key) => {
        newT = newT.replace(`%{${key}}`, keys[key])
      })

      return newT
    },
    handleClickOutside(event) {
      const ignoreClickOnMeElement = this.$refs[`DatePicker-${this.hash}`]

      if (ignoreClickOnMeElement) {
        const isClickInsideElement = ignoreClickOnMeElement.contains(event.target)

        if (!isClickInsideElement) {
          this.hideDatepicker()
        }
      }
    },
    handleWindowResize() {
      if (window.innerWidth < 480) {
        this.screenSize = 'smartphone'
      } else if (window.innerWidth >= 480 && window.innerWidth < 768) {
        this.screenSize = 'tablet'
      } else if (window.innerWidth >= 768) {
        this.screenSize = 'desktop'
      }

      return this.screenSize
    },
    onElementHeightChange(el, callback) {
      let lastHeight = el.clientHeight
      let newHeight = lastHeight
      const newEl = el

      ;(function run() {
        newHeight = el.clientHeight

        if (lastHeight !== newHeight) {
          callback()
        }

        lastHeight = newHeight

        if (newEl.onElementHeightChangeTimer) {
          clearTimeout(el.onElementHeightChangeTimer)
        }

        newEl.onElementHeightChangeTimer = setTimeout(run, 1000)
      })()
    },
    emitHeighChangeEvent() {
      this.$emit('height-changed')
    },
    reRender() {
      this.datepickerDayKey += 1
      this.datepickerMonthKey += 1
      this.datepickerWeekKey += 1
    },
    clearSelection() {
      this.hoveringDate = null
      this.checkIn = null
      this.checkOut = null
      this.nextDisabledDate = null
      this.nextPeriodDisableDates = []
      this.showCustomTooltip = false
      this.hoveringPeriod = {}
      this.checkInPeriod = {}
      this.createHalfDayDates(this.baseHalfDayDates)
      this.reRender()
      this.$emit('clear-selection')
    },
    closeMobileDatepicker() {
      this.hideDatepicker()
    },
    hideDatepicker() {
      this.clearCheckIn()

      this.isOpen = false
    },
    showDatepicker() {
      this.isOpen = true
    },
    toggleDatepicker() {
      this.clearCheckIn()

      this.isOpen = !this.isOpen
    },
    clearCheckIn() {
      if (this.checkIn && !this.checkOut) {
        this.clearSelection()
      }
    },
    clickOutside() {
      if (this.closeDatepickerOnClickOutside) {
        this.hideDatepicker()
      }
    },
    setMinimumDuration(date) {
      if (this.sortedPeriodDates) {
        let nextPeriod = null
        let currentPeriod = null
        const compareDate = this.dateFormater(date)

        this.sortedPeriodDates.forEach((d) => {
          if (
            d.endAt !== compareDate &&
            (d.startAt === compareDate || this.validateDateBetweenTwoDates(d.startAt, d.endAt, date))
          ) {
            currentPeriod = d
          }
        })

        if (currentPeriod) {
          this.sortedPeriodDates.forEach((period) => {
            if (period.startAt === currentPeriod.endAt) {
              nextPeriod = period
            }
          })

          if (this.checkIn && !this.checkOut && nextPeriod) {
            const endNextPeriod = this.addDays(nextPeriod.startAt, nextPeriod.minimumDuration - 1)
            const startNextPeriodPlusOne = this.addDays(nextPeriod.startAt, 1)
            const newDisablesDates = this.getDaysArray(startNextPeriodPlusOne, endNextPeriod)

            this.nextPeriodDisableDates = newDisablesDates
          }

          if (currentPeriod.periodType === 'nightly' && currentPeriod.endAt !== date) {
            this.dynamicNightCounts = currentPeriod.minimumDuration
          }

          if (currentPeriod.periodType === 'weekly_by_saturday' || currentPeriod.periodType === 'weekly_by_sunday') {
            const minimumDuration = currentPeriod.minimumDuration * 7

            this.dynamicNightCounts = minimumDuration
          }
        } else {
          this.dynamicNightCounts = 0
        }
      }
    },
    renderPreviousMonth() {
      if (this.activeMonthIndex >= 1) {
        this.activeMonthIndex--
      }
    },
    renderNextMonth: throttle(function throttleRenderNextMonth() {
      if (this.activeMonthIndex < this.months.length - 2) {
        this.activeMonthIndex++

        return
      }

      let firstDayOfLastMonth

      if (this.screenSize !== 'desktop') {
        firstDayOfLastMonth = this.months[this.months.length - 1].days.filter((day) => day.belongsToThisMonth === true)
      } else {
        firstDayOfLastMonth = this.months[this.activeMonthIndex + 1].days.filter(
          (day) => day.belongsToThisMonth === true,
        )
      }

      if (this.endDate !== Infinity) {
        if (fecha.format(firstDayOfLastMonth[0].date, 'YYYYMM') === fecha.format(new Date(this.endDate), 'YYYYMM')) {
          return
        }
      }

      const nextMonth = this.getNextMonth(firstDayOfLastMonth[0].date)

      this.createMonth(nextMonth)
      this.activeMonthIndex++
      this.$emit('next-month-rendered', nextMonth)
    }, 350),
    setCheckIn(date) {
      this.checkIn = date
    },
    setCheckOut(date) {
      this.checkOut = date
    },
    getMonth(date) {
      return this.i18n['month-names'][fecha.format(date, 'M') - 1] + (this.showYear ? fecha.format(date, ' YYYY') : '')
    },
    createMonth(date) {
      const firstDay = this.getFirstDay(date, this.firstDayOfWeek)
      const month = {
        days: [],
      }

      for (let i = 0; i < 42; i++) {
        month.days.push({
          date: this.addDays(firstDay, i),
          belongsToThisMonth: this.addDays(firstDay, i).getMonth() === date.getMonth(),
        })
      }

      this.months.push(month)
    },
    createHalfDayDates(_baseHalfDayDates) {
      let sortedDates = []
      const checkIncheckOutHalfDay = {}
      const baseHalfDayDates = [..._baseHalfDayDates]

      // Sorted disabledDates
      baseHalfDayDates.sort((a, b) => {
        const aa = a.split('/').reverse().join()
        const bb = b.split('/').reverse().join()

        // eslint-disable-next-line no-nested-ternary
        return aa < bb ? -1 : aa > bb ? 1 : 0
      })

      if (this.sortBookings.length === 0) {
        for (let i = 0; i < baseHalfDayDates.length; i++) {
          const newDate = baseHalfDayDates[i]

          if (this.halfDay) {
            const newDateIncrementOne = baseHalfDayDates[i + 1]

            if (i === 0) {
              checkIncheckOutHalfDay[newDate] = {
                checkIn: true,
              }
            }

            if (
              !checkIncheckOutHalfDay[newDate] &&
              baseHalfDayDates[i + 1] &&
              this.getDayDiff(newDate, newDateIncrementOne) > 1
            ) {
              checkIncheckOutHalfDay[newDate] = {
                checkOut: true,
              }
              checkIncheckOutHalfDay[newDateIncrementOne] = {
                checkIn: true,
              }
            }

            if (i === baseHalfDayDates.length - 1) {
              checkIncheckOutHalfDay[baseHalfDayDates[baseHalfDayDates.length - 1]] = {
                checkOut: true,
              }
            }
          }

          sortedDates[i] = baseHalfDayDates[i]
        }
      } else {
        this.sortBookings.forEach((booking) => {
          checkIncheckOutHalfDay[booking.checkInDate] = {
            checkIn: true,
          }
          checkIncheckOutHalfDay[booking.checkOutDate] = {
            checkOut: true,
          }
        })
      }

      if (this.halfDay) {
        const halfDays = Object.keys(checkIncheckOutHalfDay)

        sortedDates = sortedDates.filter((date) => !halfDays.includes(date))
      }

      sortedDates = sortedDates.map((date) => new Date(date))
      this.sortedDisabledDates = sortedDates.sort((a, b) => a - b)
      this.checkIncheckOutHalfDay = checkIncheckOutHalfDay
      this.$emit('handle-checkin-checkout-half-day', this.checkIncheckOutHalfDay)
      /**
       * @deprecated since v4.0.0 beta 11
       */
      this.$emit('handleCheckinCheckoutHalfDay', this.checkIncheckOutHalfDay)
    },
  },
}
</script>
