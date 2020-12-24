import { shallowMount } from '@vue/test-utils'
import { expect } from 'chai'

import Day from '@/DatePicker/components/Day.vue'

describe('Datepicker Day', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Day, {
      propsData: {
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
          value: undefined,
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
