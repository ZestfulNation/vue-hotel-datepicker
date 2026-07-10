import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { vi } from 'vitest'

import Datepicker from '@/DatePicker/HotelDatePicker.vue'
import i18nDefaults from '../../public/i18n/en'

describe('Datepicker Calendar', () => {
  const wrapper = mount(Datepicker, { props: { modelValue: true } })

  it('should correctly re-render the calendar', () => {
    expect(wrapper.vm.modelValue).to.equal(true)
    wrapper.vm.reRender()
    expect(wrapper.vm.isOpen).to.equal(false)
    expect(wrapper.vm.modelValue).to.equal(true)
  })
})

describe('Datepicker Component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      attachTo: document.body,
      props: {
        modelValue: true,
        minNights: 3,
        disabledDates: ['2020-05-28', '2020-05-10', '2020-05-01', '2020-05-22'],
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should toggle the calendar visibility on input click', async () => {
    expect(wrapper.vm.isOpen).to.equal(false)

    const datepickerInput = wrapper.find('[data-qa="vhd__datepickerInput"]')

    await datepickerInput.trigger('click')

    expect(wrapper.vm.isOpen).to.equal(true)
  })

  it('should correctly render the next and previous months', () => {
    const { activeMonthIndex } = wrapper.vm

    wrapper.vm.renderNextMonth()
    expect(wrapper.vm.activeMonthIndex).to.equal(activeMonthIndex + 1)

    wrapper.vm.renderPreviousMonth()
    expect(wrapper.vm.activeMonthIndex).to.equal(activeMonthIndex)
  })
})

describe('Datepicker Props', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('alwaysVisible', () => {
    it('renders the calendar content without needing it to be opened', async () => {
      const wrapper = mount(Datepicker, { props: { modelValue: true, alwaysVisible: true } })

      await nextTick()

      expect(wrapper.find('.vhd__datepicker__wrapper').classes()).to.include('vhd__datepicker__fullview')
      expect(wrapper.find('.vhd__datepicker__months').exists()).to.equal(true)
      wrapper.unmount()
    })
  })

  describe('bookings', () => {
    it('sorts the bookings chronologically by check-in date', () => {
      const wrapper = mount(Datepicker, {
        props: {
          bookings: [
            { checkInDate: '2020-08-26', checkOutDate: '2020-08-29', style: {} },
            { checkInDate: '2020-07-01', checkOutDate: '2020-07-08', style: {} },
          ],
        },
      })

      expect(wrapper.vm.sortBookings[0].checkInDate).to.equal('2020-07-01')
      expect(wrapper.vm.sortBookings[1].checkInDate).to.equal('2020-08-26')
      wrapper.unmount()
    })

    it('emits booking-clicked with the event, date and booking', () => {
      const wrapper = mount(Datepicker)
      const booking = { checkInDate: '2020-01-05', checkOutDate: '2020-01-10' }
      const date = new Date('2020-01-05')

      wrapper.vm.handleBookingClicked('event', date, booking)

      expect(wrapper.emitted('booking-clicked')[0]).to.eql(['event', date, booking])
      wrapper.unmount()
    })
  })

  describe('closeDatepickerOnClickOutside', () => {
    it('hides the datepicker via clickOutside() when true (default)', () => {
      const wrapper = mount(Datepicker, { props: { closeDatepickerOnClickOutside: true } })

      wrapper.vm.isOpen = true
      wrapper.vm.clickOutside()

      expect(wrapper.vm.isOpen).to.equal(false)
      wrapper.unmount()
    })

    it('keeps the datepicker open via clickOutside() when false', () => {
      const wrapper = mount(Datepicker, { props: { closeDatepickerOnClickOutside: false } })

      wrapper.vm.isOpen = true
      wrapper.vm.clickOutside()

      expect(wrapper.vm.isOpen).to.equal(true)
      wrapper.unmount()
    })

    it('closes the datepicker on a real outside click when true (default)', async () => {
      const wrapper = mount(Datepicker, {
        attachTo: document.body,
        props: { modelValue: true, startDate: '2020-01-01', closeDatepickerOnClickOutside: true },
      })

      wrapper.vm.isOpen = true
      await nextTick()

      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await nextTick()

      expect(wrapper.vm.isOpen).to.equal(false)
      wrapper.unmount()
    })

    it('keeps the datepicker open on a real outside click when false', async () => {
      const wrapper = mount(Datepicker, {
        attachTo: document.body,
        props: { modelValue: true, startDate: '2020-01-01', closeDatepickerOnClickOutside: false },
      })

      wrapper.vm.isOpen = true
      await nextTick()

      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await nextTick()

      expect(wrapper.vm.isOpen).to.equal(true)
      wrapper.unmount()
    })

    it('keeps the datepicker open on a real outside click when false and alwaysVisible is true', async () => {
      const wrapper = mount(Datepicker, {
        attachTo: document.body,
        props: {
          modelValue: true,
          startDate: '2020-01-01',
          alwaysVisible: true,
          closeDatepickerOnClickOutside: false,
        },
      })

      wrapper.vm.isOpen = true
      await nextTick()

      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await nextTick()

      expect(wrapper.vm.isOpen).to.equal(true)
      wrapper.unmount()
    })

    it('does not close the datepicker when clicking inside it', async () => {
      const wrapper = mount(Datepicker, {
        attachTo: document.body,
        props: { modelValue: true, startDate: '2020-01-01', closeDatepickerOnClickOutside: true },
      })

      wrapper.vm.isOpen = true
      await nextTick()

      await wrapper.find('.vhd__datepicker__wrapper').trigger('click')

      expect(wrapper.vm.isOpen).to.equal(true)
      wrapper.unmount()
    })
  })

  describe('disabledDates', () => {
    it('sorts the disabled dates chronologically', () => {
      const wrapper = mount(Datepicker, {
        props: { startDate: '2020-01-01', halfDay: false, disabledDates: ['2020-01-20', '2020-01-05'] },
      })

      expect(wrapper.vm.sortedDisabledDates).to.eql([new Date('2020-01-05'), new Date('2020-01-20')])
      wrapper.unmount()
    })
  })

  describe('disabledDaysOfWeek (deprecated)', () => {
    it('disables the given days of the week', () => {
      const wrapper = mount(Datepicker, { props: { disabledDaysOfWeek: ['Monday', 'Tuesday'] } })

      expect(wrapper.vm.disabledWeekDaysObject.monday).to.equal(true)
      expect(wrapper.vm.disabledWeekDaysObject.tuesday).to.equal(true)
      expect(wrapper.vm.disabledWeekDaysObject.sunday).to.equal(false)
      wrapper.unmount()
    })
  })

  describe('disabledWeekDays', () => {
    it('merges on top of the disabledDaysOfWeek object', () => {
      const wrapper = mount(Datepicker, {
        props: { disabledDaysOfWeek: ['Monday'], disabledWeekDays: { sunday: true } },
      })

      expect(wrapper.vm.disabledWeekDaysObject.monday).to.equal(true)
      expect(wrapper.vm.disabledWeekDaysObject.sunday).to.equal(true)
      wrapper.unmount()
    })
  })

  describe('displayClearButton', () => {
    it('shows the clear button once a date is selected when true (default)', async () => {
      const wrapper = mount(Datepicker, { props: { startDate: '2020-01-01' } })

      expect(wrapper.vm.showClearSelectionButton).to.equal(false)
      wrapper.vm.checkIn = new Date('2020-01-05')
      await nextTick()
      expect(wrapper.vm.showClearSelectionButton).to.equal(true)
      wrapper.unmount()
    })

    it('never shows the clear button when false', async () => {
      const wrapper = mount(Datepicker, { props: { startDate: '2020-01-01', displayClearButton: false } })

      wrapper.vm.checkIn = new Date('2020-01-05')
      await nextTick()
      expect(wrapper.vm.showClearSelectionButton).to.equal(false)
      wrapper.unmount()
    })
  })

  describe('enableCheckout', () => {
    it('forces the next disabled date to Infinity so checkout is allowed on disabled dates', () => {
      const wrapper = mount(Datepicker, {
        props: { startDate: '2020-01-01', enableCheckout: true, disabledDates: ['2020-01-10'] },
      })

      wrapper.vm.handleDayClick({}, new Date('2020-01-05'), '2020-01-05', false)

      expect(wrapper.vm.nextDisabledDate).to.equal(Infinity)
      wrapper.unmount()
    })
  })

  describe('endingDateValue / startingDateValue', () => {
    it('initializes checkIn and checkOut from the props', () => {
      const startingDateValue = new Date('2020-01-05')
      const endingDateValue = new Date('2020-01-10')
      const wrapper = mount(Datepicker, { props: { startingDateValue, endingDateValue } })

      expect(wrapper.vm.checkIn).to.equal(startingDateValue)
      expect(wrapper.vm.checkOut).to.equal(endingDateValue)
      wrapper.unmount()
    })

    it('updates checkIn/checkOut when the props change', async () => {
      const wrapper = mount(Datepicker)

      await wrapper.setProps({ startingDateValue: new Date('2020-02-01') })
      expect(wrapper.vm.checkIn).to.eql(new Date('2020-02-01'))

      await wrapper.setProps({ endingDateValue: new Date('2020-02-10') })
      expect(wrapper.vm.checkOut).to.eql(new Date('2020-02-10'))
      wrapper.unmount()
    })
  })

  describe('firstDayOfWeek', () => {
    it('reorders the week day names', () => {
      const wrapper = mount(Datepicker, { props: { modelValue: true, alwaysVisible: true, firstDayOfWeek: 1 } })
      const weekRow = wrapper.findComponent({ name: 'WeekRow' })

      expect(weekRow.vm.dayNames[0]).to.equal('Mon')
      wrapper.unmount()
    })
  })

  describe('format', () => {
    it('formats the check-in input using the given format string', async () => {
      const wrapper = mount(Datepicker, {
        attachTo: document.body,
        props: { modelValue: true, startDate: '2020-01-01', format: 'DD/MM/YYYY' },
      })

      wrapper.vm.checkIn = new Date('2020-01-05')
      await nextTick()

      expect(wrapper.find('[data-qa="vhd__datepickerInput"]').text()).to.equal('05/01/2020')
      wrapper.unmount()
    })
  })

  describe('gridStyle', () => {
    it('toggles the grid style class', () => {
      const wrapperTrue = mount(Datepicker, { props: { modelValue: true, gridStyle: true } })
      const wrapperFalse = mount(Datepicker, { props: { modelValue: true, gridStyle: false } })

      expect(wrapperTrue.find('.vhd__datepicker__wrapper').classes()).to.include('vhd__datepicker__wrapper--grid')
      expect(wrapperFalse.find('.vhd__datepicker__wrapper').classes()).to.not.include('vhd__datepicker__wrapper--grid')
      wrapperTrue.unmount()
      wrapperFalse.unmount()
    })
  })

  describe('halfDay', () => {
    it('marks the first and last disabled dates as half-day check-in/check-out when true (default)', () => {
      const wrapper = mount(Datepicker, {
        props: { startDate: '2020-01-01', disabledDates: ['2020-01-05', '2020-01-10'] },
      })

      expect(wrapper.vm.checkIncheckOutHalfDay['2020-01-05']).to.eql({ checkIn: true })
      expect(wrapper.vm.checkIncheckOutHalfDay['2020-01-10']).to.eql({ checkOut: true })
      wrapper.unmount()
    })

    it('does not create half-day markers when false', () => {
      const wrapper = mount(Datepicker, {
        props: { startDate: '2020-01-01', halfDay: false, disabledDates: ['2020-01-05', '2020-01-10'] },
      })

      expect(wrapper.vm.checkIncheckOutHalfDay).to.eql({})
      wrapper.unmount()
    })
  })

  describe('hoveringTooltip', () => {
    it('passes the value through to the day options', () => {
      const wrapper = mount(Datepicker, { props: { hoveringTooltip: false } })

      expect(wrapper.vm.dayOptions.hoveringTooltip).to.equal(false)
      wrapper.unmount()
    })
  })

  describe('i18n', () => {
    it('renders the custom check-in/check-out placeholders', () => {
      const customI18n = { ...i18nDefaults, 'check-in': 'Arrival', 'check-out': 'Departure' }
      const wrapper = mount(Datepicker, { props: { modelValue: true, i18n: customI18n } })

      expect(wrapper.text()).to.include('Arrival')
      expect(wrapper.text()).to.include('Departure')
      wrapper.unmount()
    })
  })

  describe('lastDateAvailable', () => {
    it('prevents pagination once the last available month is reached', () => {
      const wrapper = mount(Datepicker, {
        props: { startDate: '2020-01-01', lastDateAvailable: new Date('2020-02-15') },
      })

      expect(wrapper.vm.isPreventedMaxMonth).to.equal(true)
      wrapper.unmount()
    })

    it('allows pagination when the last available date is far away', () => {
      const wrapper = mount(Datepicker, {
        props: { startDate: '2020-01-01', lastDateAvailable: new Date('2021-01-01') },
      })

      expect(wrapper.vm.isPreventedMaxMonth).to.equal(false)
      wrapper.unmount()
    })
  })

  describe('maxNights', () => {
    it('disables dates beyond maxNights after check-in', () => {
      const wrapper = mount(Datepicker, { props: { startDate: '2020-01-01', maxNights: 3 } })

      wrapper.vm.handleDayClick({}, new Date('2020-01-05'), '2020-01-05', false)

      expect(wrapper.vm.nextDisabledDate).to.eql(new Date('2020-01-09'))
      wrapper.unmount()
    })
  })

  describe('minNights', () => {
    it('is used as the minimum night count by default', () => {
      const wrapper = mount(Datepicker, { props: { minNights: 5 } })

      expect(wrapper.vm.minNightCount).to.equal(5)
      wrapper.unmount()
    })
  })

  describe('periodDates', () => {
    it('applies the nightly minimumDuration from a matching period on check-in', () => {
      const wrapper = mount(Datepicker, {
        props: {
          startDate: '2020-06-01',
          periodDates: [{ startAt: '2020-06-09', endAt: '2020-07-26', minimumDuration: 4, periodType: 'nightly' }],
        },
      })

      wrapper.vm.handleDayClick({}, new Date('2020-06-10'), '2020-06-10', false)

      expect(wrapper.vm.minNightCount).to.equal(4)
      wrapper.unmount()
    })

    it('multiplies minimumDuration by 7 for weekly periods', () => {
      const wrapper = mount(Datepicker, {
        props: {
          startDate: '2020-09-01',
          periodDates: [
            { startAt: '2020-09-30', endAt: '2020-11-30', minimumDuration: 2, periodType: 'weekly_by_sunday' },
          ],
        },
      })

      wrapper.vm.handleDayClick({}, new Date('2020-10-04'), '2020-10-04', false)

      expect(wrapper.vm.minNightCount).to.equal(14)
      wrapper.unmount()
    })
  })

  describe('positionRight', () => {
    it('positions the calendar on the right', () => {
      const wrapper = mount(Datepicker, { props: { modelValue: true, positionRight: true } })

      expect(wrapper.find('.vhd__datepicker').classes()).to.include('vhd__datepicker--right')
      wrapper.unmount()
    })
  })

  describe('showPrice / priceSymbol', () => {
    it('shows the price on days within a priced period', () => {
      const wrapper = mount(Datepicker, {
        props: {
          modelValue: true,
          startDate: '2020-09-01',
          alwaysVisible: true,
          showPrice: true,
          priceSymbol: '$',
          periodDates: [
            { startAt: '2020-09-01', endAt: '2020-09-30', minimumDuration: 1, periodType: 'nightly', price: 100 },
          ],
        },
      })

      expect(wrapper.find('.price').exists()).to.equal(true)
      expect(wrapper.find('.price-symbol').text()).to.equal('$')
      expect(wrapper.find('.price-number').text()).to.equal('100')
      wrapper.unmount()
    })
  })

  describe('priceDecimals', () => {
    it('divides a weekly price by 7 and formats it with the given number of decimals', () => {
      const wrapper = mount(Datepicker, {
        props: {
          modelValue: true,
          startDate: '2020-09-01',
          alwaysVisible: true,
          showPrice: true,
          priceDecimals: 2,
          periodDates: [
            {
              startAt: '2020-09-01',
              endAt: '2020-09-30',
              minimumDuration: 1,
              periodType: 'weekly_by_saturday',
              price: 700,
            },
          ],
        },
      })

      expect(wrapper.find('.price-number').text()).to.equal('100.00')
      wrapper.unmount()
    })

    it('defaults to 0 decimals when not set', () => {
      const wrapper = mount(Datepicker, {
        props: {
          modelValue: true,
          startDate: '2020-09-01',
          alwaysVisible: true,
          showPrice: true,
          periodDates: [
            {
              startAt: '2020-09-01',
              endAt: '2020-09-30',
              minimumDuration: 1,
              periodType: 'weekly_by_saturday',
              price: 700,
            },
          ],
        },
      })

      expect(wrapper.find('.price-number').text()).to.equal('100')
      wrapper.unmount()
    })
  })

  describe('showSingleMonth', () => {
    it('renders only one month when true', async () => {
      const wrapper = mount(Datepicker, {
        props: { modelValue: true, startDate: '2020-01-01', alwaysVisible: true, showSingleMonth: true },
      })

      await nextTick()

      expect(wrapper.findAll('.vhd__datepicker__month')).to.have.lengthOf(1)
      wrapper.unmount()
    })

    it('renders two months by default', async () => {
      const wrapper = mount(Datepicker, { props: { modelValue: true, startDate: '2020-01-01', alwaysVisible: true } })

      await nextTick()

      expect(wrapper.findAll('.vhd__datepicker__month')).to.have.lengthOf(2)
      wrapper.unmount()
    })
  })

  describe('showWeekNumbers', () => {
    it('shows the week numbers when true', () => {
      const wrapper = mount(Datepicker, {
        props: { modelValue: true, startDate: '2020-01-01', alwaysVisible: true, showWeekNumbers: true },
      })

      expect(wrapper.find('.vhd__datepicker__weeknumbers').exists()).to.equal(true)
      wrapper.unmount()
    })

    it('hides the week numbers by default', () => {
      const wrapper = mount(Datepicker, { props: { modelValue: true, startDate: '2020-01-01', alwaysVisible: true } })

      expect(wrapper.find('.vhd__datepicker__weeknumbers').exists()).to.equal(false)
      wrapper.unmount()
    })
  })

  describe('showYear / yearBeforeMonth', () => {
    it('includes the year in the month name when showYear is true (default)', () => {
      const wrapper = mount(Datepicker, { props: { modelValue: true, startDate: '2020-01-01', alwaysVisible: true } })

      expect(wrapper.find('.vhd__datepicker__month-name').text()).to.include('2020')
      wrapper.unmount()
    })

    it('omits the year from the month name when showYear is false', () => {
      const wrapper = mount(Datepicker, {
        props: { modelValue: true, startDate: '2020-01-01', alwaysVisible: true, showYear: false },
      })

      expect(wrapper.find('.vhd__datepicker__month-name').text()).to.not.include('2020')
      wrapper.unmount()
    })

    it('places the year before the month name when yearBeforeMonth is true', () => {
      const wrapper = mount(Datepicker, {
        props: { modelValue: true, startDate: '2020-01-01', alwaysVisible: true, yearBeforeMonth: true },
      })

      expect(wrapper.find('.vhd__datepicker__month-name').text()).to.match(/^2020/)
      wrapper.unmount()
    })
  })

  describe('singleDaySelection', () => {
    it('only renders a single check-in input', () => {
      const wrapper = mount(Datepicker, { props: { modelValue: true, singleDaySelection: true } })

      expect(wrapper.findAll('[data-qa="vhd__datepickerInput"]')).to.have.lengthOf(1)
      wrapper.unmount()
    })

    it('sets checkOut equal to checkIn when a day is clicked', () => {
      const wrapper = mount(Datepicker, { props: { startDate: '2020-01-01', singleDaySelection: true } })
      const date = new Date('2020-01-10')

      wrapper.vm.handleDayClick({}, date, '2020-01-10', false)

      expect(wrapper.vm.checkIn).to.equal(date)
      expect(wrapper.vm.checkOut).to.equal(date)
      wrapper.unmount()
    })
  })

  describe('tooltipMessage', () => {
    it('overrides the default hovering tooltip text', () => {
      const wrapper = mount(Datepicker, { props: { tooltipMessage: 'Custom Tooltip' } })

      expect(wrapper.vm.customTooltipMessage).to.equal('Custom Tooltip')
      wrapper.unmount()
    })
  })

  describe('modelValue', () => {
    it('does not render the wrapper when false', () => {
      const wrapper = mount(Datepicker, { props: { modelValue: false } })

      expect(wrapper.find('.vhd__datepicker__wrapper').exists()).to.equal(false)
      wrapper.unmount()
    })

    it('emits update:modelValue when the open state changes', () => {
      const wrapper = mount(Datepicker, { props: { modelValue: true } })

      wrapper.vm.isOpen = true

      expect(wrapper.emitted('update:modelValue')[0]).to.eql([true])
      wrapper.unmount()
    })
  })
})

describe('Datepicker Methods', () => {
  it('showDatepicker opens the calendar', () => {
    const wrapper = mount(Datepicker)

    wrapper.vm.showDatepicker()

    expect(wrapper.vm.isOpen).to.equal(true)
    wrapper.unmount()
  })

  it('hideDatepicker closes the calendar', () => {
    const wrapper = mount(Datepicker)

    wrapper.vm.isOpen = true
    wrapper.vm.hideDatepicker()

    expect(wrapper.vm.isOpen).to.equal(false)
    wrapper.unmount()
  })

  it('toggleDatepicker flips the open state', () => {
    const wrapper = mount(Datepicker)

    expect(wrapper.vm.isOpen).to.equal(false)
    wrapper.vm.toggleDatepicker()
    expect(wrapper.vm.isOpen).to.equal(true)
    wrapper.vm.toggleDatepicker()
    expect(wrapper.vm.isOpen).to.equal(false)
    wrapper.unmount()
  })
})

describe('Datepicker Events', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('emits check-in-changed when the check-in date is set', async () => {
    const wrapper = mount(Datepicker, { props: { startDate: '2020-01-01' } })

    wrapper.vm.checkIn = new Date('2020-01-05')
    await nextTick()

    expect(wrapper.emitted('check-in-changed')[0]).to.eql([new Date('2020-01-05')])
    wrapper.unmount()
  })

  it('emits check-out-changed when the check-out date is set', async () => {
    const wrapper = mount(Datepicker, { props: { startDate: '2020-01-01' } })

    wrapper.vm.checkOut = new Date('2020-01-10')
    await nextTick()

    expect(wrapper.emitted('check-out-changed')[0]).to.eql([new Date('2020-01-10')])
    wrapper.unmount()
  })

  it('emits day-clicked with the date, formatted date and next disabled date', () => {
    const wrapper = mount(Datepicker, { props: { startDate: '2020-01-01' } })
    const date = new Date('2020-01-05')

    wrapper.vm.handleDayClick({}, date, '2020-01-05', false)

    expect(wrapper.emitted('day-clicked')[0]).to.eql([date, '2020-01-05', Infinity])
    wrapper.unmount()
  })

  it('emits period-selected when the check-out day is clicked', () => {
    const wrapper = mount(Datepicker, { props: { startDate: '2020-01-01' } })
    const checkIn = new Date('2020-01-05')
    const checkOut = new Date('2020-01-10')
    const event = {}

    wrapper.vm.handleDayClick(event, checkIn, '2020-01-05', false)
    wrapper.vm.handleDayClick(event, checkOut, '2020-01-10', false)

    expect(wrapper.emitted('period-selected')[0]).to.eql([event, checkIn, checkOut])
    wrapper.unmount()
  })

  it('emits clear-selection when the selection is cleared', () => {
    const wrapper = mount(Datepicker, { props: { startDate: '2020-01-01' } })

    wrapper.vm.clearSelection()

    expect(wrapper.emitted('clear-selection')).to.have.lengthOf(1)
    wrapper.unmount()
  })

  it('emits handle-checkin-checkout-half-day on mount', () => {
    const wrapper = mount(Datepicker, {
      props: { startDate: '2020-01-01', disabledDates: ['2020-01-05', '2020-01-10'] },
    })

    expect(wrapper.emitted('handle-checkin-checkout-half-day')).to.not.equal(undefined)
    wrapper.unmount()
  })

  it('emits next-month-rendered when paginating past the pre-generated months', () => {
    // renderNextMonth is throttled at the component-options level, so its 350ms window is
    // shared across every mounted instance in this process. Jump the fake clock far past
    // "now" (rather than a small advance) so this is immune to whatever other test in this
    // file last called it in real time.
    const wrapper = mount(Datepicker, { props: { startDate: '2020-01-01', modelValue: true } })

    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + 60 * 60 * 1000)
    wrapper.vm.renderNextMonth()

    expect(wrapper.emitted('next-month-rendered')[0]).to.eql([new Date(2020, 2, 1)])
    wrapper.unmount()
  })
})
