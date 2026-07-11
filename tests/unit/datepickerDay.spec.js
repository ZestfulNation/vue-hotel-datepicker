import { shallowMount } from '@vue/test-utils'
import { expect } from 'chai'

import Day from '@/DatePicker/components/Day.vue'

describe('Datepicker Day', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Day, {
      props: {
        activeMonthIndex: 0,
        belongsToThisMonth: true,
        checkIn: null,
        checkOut: null,
        date: new Date(),
        dayNumber: '1',
        hoveringDate: null,
        hoveringTooltip: true,
        isOpen: true,
        nextDisabledDate: null,
        options: {
          disabledDates: [],
          disabledDaysOfWeek: [],
          endDate: '2017-12-30T23:00:00.000Z',
          format: 'YYYY-MM-DD',
          hoveringTooltip: true,
          maxNights: null,
          minNights: 3,
          startDate: '2017-10-05T15:16:50.281Z',
          disabledWeekDaysObject: {},
        },
      },
    })
  })

  describe('isDateLessOrEquals', () => {
    it('should return a boolean when comparing two dates', () => {
      expect(wrapper.vm.isDateLessOrEquals(new Date('12-10-2017'), new Date('10-10-2017'))).to.equal(false)
      expect(wrapper.vm.isDateLessOrEquals(new Date('12-10-2017'), new Date('12-15-2017'))).to.equal(true)
    })
  })

  describe('compareDay', () => {
    it('should return return -1 if the first day is before the second day', () => {
      expect(wrapper.vm.compareDay('10-10-2017', '10-12-2017')).to.equal(-1)
    })
    it('should return return 1 if the first day is after the second day', () => {
      expect(wrapper.vm.compareDay('10-12-2017', '10-10-2017')).to.equal(1)
    })
    it('should return return 0 if the days are the same', () => {
      expect(wrapper.vm.compareDay('10-12-2017', '10-12-2017')).to.equal(0)
    })
  })
})

const baseOptions = {
  disabledDates: [],
  disabledDaysOfWeek: [],
  endDate: Infinity,
  format: 'YYYY-MM-DD',
  hoveringTooltip: true,
  maxNights: null,
  minNights: 1,
  startDate: new Date('2020-01-01'),
  priceSymbol: '$',
  priceDecimals: 0,
  disabledWeekDaysObject: {
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  },
  enableCheckout: false,
}
const mountDay = (props) =>
  shallowMount(Day, {
    props: {
      activeMonthIndex: 0,
      belongsToThisMonth: true,
      checkIn: null,
      checkOut: null,
      hoveringDate: null,
      isOpen: true,
      options: baseOptions,
      ...props,
    },
  })

describe('Datepicker Day price', () => {
  it('shows the raw price for a nightly period', () => {
    const wrapper = mountDay({
      date: new Date('2020-09-10'),
      showPrice: true,
      sortedPeriodDates: [{ startAt: '2020-09-01', endAt: '2020-09-30', periodType: 'nightly', price: 100 }],
    })

    expect(wrapper.vm.dayPrice).to.equal('100')
    wrapper.destroy()
  })

  it('divides the price by 7 and applies priceDecimals for a weekly period', () => {
    const wrapper = mountDay({
      date: new Date('2020-09-10'),
      showPrice: true,
      priceDecimals: 2,
      sortedPeriodDates: [{ startAt: '2020-09-01', endAt: '2020-09-30', periodType: 'weekly_by_saturday', price: 700 }],
    })

    expect(wrapper.vm.dayPrice).to.equal('100.00')
    wrapper.destroy()
  })

  it('returns an empty string when the date is outside every period', () => {
    const wrapper = mountDay({ date: new Date('2020-09-10'), showPrice: true, sortedPeriodDates: [] })

    expect(wrapper.vm.dayPrice).to.equal('')
    wrapper.destroy()
  })
})

describe('Datepicker Day disabling', () => {
  it('disables a day that falls on a disabled week day', () => {
    const options = {
      ...baseOptions,
      disabledWeekDaysObject: { ...baseOptions.disabledWeekDaysObject, friday: true },
    }
    // 2020-01-03 is a Friday
    const wrapper = mountDay({ date: new Date('2020-01-03'), options })

    expect(wrapper.vm.isDisabled).to.equal(true)
    expect(wrapper.vm.disabledClass).to.include('vhd__datepicker__month-day--disabled')
    wrapper.destroy()
  })

  it('disables a day before the configured startDate', () => {
    const wrapper = mountDay({ date: new Date('2019-12-25') })

    expect(wrapper.vm.isDisabled).to.equal(true)
    wrapper.destroy()
  })

  it('disables a day after the configured endDate', () => {
    const options = { ...baseOptions, endDate: new Date('2020-01-10') }
    const wrapper = mountDay({ date: new Date('2020-01-15'), options })

    expect(wrapper.vm.isDisabled).to.equal(true)
    wrapper.destroy()
  })
})

describe('Datepicker Day bookings', () => {
  const bookings = [{ checkInDate: '2020-01-05', checkOutDate: '2020-01-10', style: {} }]

  it('marks a day within a booking as not-allowed', () => {
    const wrapper = mountDay({ date: new Date('2020-01-07'), bookings })

    expect(wrapper.vm.bookingClass).to.include('vhd__datepicker__month-day--not-allowed')

    wrapper.destroy()
  })

  it('emits booking-clicked instead of day-clicked when a booked day is clicked', () => {
    const wrapper = mountDay({ date: new Date('2020-01-07'), bookings })

    wrapper.vm.dayClicked({}, new Date('2020-01-07'))

    expect(wrapper.emitted('booking-clicked')).to.not.equal(undefined)
    expect(wrapper.emitted('day-clicked')).to.equal(undefined)
    wrapper.destroy()
  })
})

describe('Datepicker Day half-day class', () => {
  it('flags a half check-in day', () => {
    const wrapper = mountDay({
      date: new Date('2020-01-05'),
      checkIncheckOutHalfDay: { '2020-01-05': { checkIn: true } },
    })

    expect(wrapper.vm.halfDayClass).to.include('vhd__datepicker__month-day--halfCheckIn')
    wrapper.destroy()
  })
})
