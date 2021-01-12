import { expect } from 'chai'
import DatepickerHelpers from '../../src/helpers'

describe('Datepicker Helpers', () => {
  describe('nextDateByDayOfWeek', () => {
    it('should return the next given day of the week when comparing a date to a date', () => {
      expect(new Date(DatepickerHelpers.nextDateByDayOfWeek('Saturday', '10-11-2017'))).to.eql(new Date('10-14-2017'))
    })
  })

  describe('nextDateByDayOfWeekArray', () => {
    it('should return the next date when comparing to an array days of the week', () => {
      expect(DatepickerHelpers.nextDateByDayOfWeekArray(['Saturday', 'Tuesday'], '11-08-2017')).to.eql(
        new Date('11-11-2017'),
      )
    })
  })

  describe('getNextDate', () => {
    it('should return the next day when comparing a date to a dates array', () => {
      expect(DatepickerHelpers.getNextDate(['10-10-2017', '10-15-2017', '10-20-2017'], '10-12-2017')).to.equal(
        '10-15-2017',
      )
    })
  })

  describe('countDays', () => {
    it('should correctly count the number of days between two given dates', () => {
      expect(DatepickerHelpers.countDays('10-10-2017', '10-15-2017')).to.equal(5)
    })
  })

  describe('addDays', () => {
    it('should return the correct date when given a date and the amount of days to add', () => {
      expect(DatepickerHelpers.addDays('10-10-2017', 5)).to.eql(new Date('10-15-2017'))
    })
  })

  describe('getFirstDaySunday', () => {
    it('should return the first sunday of a given month', () => {
      expect(DatepickerHelpers.getFirstDay(new Date('10-10-2017'), 0)).to.eql(new Date('10-01-2017'))
    })
  })

  describe('getFirstDayMonday', () => {
    it('should return the first monday of a given month', () => {
      expect(DatepickerHelpers.getFirstDay(new Date('10-10-2017'), 1)).to.eql(new Date('09-25-2017'))
    })
  })

  describe('getFirstDayOfMonth', () => {
    it('should return the first sunday of a given month', () => {
      expect(DatepickerHelpers.getFirstDayOfMonth(new Date('12-10-2017'))).to.eql(new Date('12-01-2017'))
    })
  })

  describe('getNextMonth', () => {
    it('should return the next month of a given date', () => {
      expect(DatepickerHelpers.getNextMonth(new Date('12-10-2017'))).to.eql(new Date('01-01-2018'))
    })
  })
})
