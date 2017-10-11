import { shallow } from 'vue-test-utils';
import { expect } from 'chai';

import Day from '@/components/Day';

describe('Datepicker Day', () => {
  let wrapper;

  before( () => {
    wrapper = shallow(Day, {
      propsData: {
        allowedCheckoutDays: [],
        activeMonthIndex: 0,
        belongsToThisMonth: true,
        checkIn: null,
        checkOut: null,
        date: '2017-09-30T22:00:00.000Z',
        dayNumber:'1',
        hoveringDate:null,
        hoveringTooltip:true,
        mounseOverFunction:undefined,
        nextDisabledDate:null,
        options: {
          allowedRanges: [],
          disabledDates: [],
          disabledDaysOfWeek: [],
          endDate:'2017-12-30T23:00:00.000Z',
          format:'YYYY-MM-DD',
          hoveringTooltip:true,
          maxNights:null,
          minNights:3,
          startDate:'2017-10-05T15:16:50.281Z',
          value:undefined
        }
      }
    });
  });

  describe('compareDay', () => {
    it('should return return -1 if the first day is before the second day', () => {
      expect(
        wrapper.vm.compareDay('10-10-2017','10-12-2017')
      ).to.equal(-1);
    });
    it('should return return 1 if the first day is after the second day', () => {
      expect(
        wrapper.vm.compareDay('10-12-2017','10-10-2017')
      ).to.equal(1);
    });
    it('should return return 0 if the days are the same', () => {
      expect(
        wrapper.vm.compareDay('10-12-2017','10-12-2017')
      ).to.equal(0);
    });
  });

});
