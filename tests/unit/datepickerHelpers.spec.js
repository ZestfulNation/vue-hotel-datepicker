import { shallow } from 'vue-test-utils';
import { expect } from 'chai';

import DatepickerHelpers from '@/components/helpers';

describe('Datepicker Helpers', () => {

  describe('countDays', () => {
    it('should correctly count the number of days between two given dates', () => {
      expect(
        DatepickerHelpers.countDays('10-10-2017', '10-15-2017')
      ).to.equal(5);
    });
  });

  describe('addDays', () => {
    it('should return the correct date when given a date and the amount of days to add', () => {
      expect(
        DatepickerHelpers.addDays('10-10-2017', 5)
      ).to.eql(new Date('10-15-2017'));
    });
  });

  describe('getFirstSunday', () => {
    it('should return the first sunday of a given month', () => {
      expect(
        DatepickerHelpers.getFirstSunday(new Date('10-10-2017'))
      ).to.eql(new Date('10-01-2017'));
    });
  });

  describe('getFirstDayOfMonth', () => {
    it('should return the first sunday of a given month', () => {
      expect(
        DatepickerHelpers.getFirstDayOfMonth(new Date('12-10-2017'))
      ).to.eql(new Date('12-01-2017'));
    });
  });

  describe('getNextMonth', () => {
    it('should return the next month of a given date', () => {
      expect(
        DatepickerHelpers.getNextMonth(new Date('12-10-2017'))
      ).to.eql(new Date('01-01-2018'));
    });
  });

  describe('isDateLessOrEquals', () => {
    it('should return a boolean when comparing two dates', () => {
      expect(
        DatepickerHelpers.isDateLessOrEquals(new Date('12-10-2017'), new Date('10-10-2017'))
      ).to.equal(false);
      expect(
        DatepickerHelpers.isDateLessOrEquals(new Date('12-10-2017'), new Date('12-15-2017'))
      ).to.equal(true);
    });
  });

});
