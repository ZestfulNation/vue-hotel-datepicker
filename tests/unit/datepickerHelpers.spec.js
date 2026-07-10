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

  describe('getPreviousMonth', () => {
    it('should return the previous month of a given date', () => {
      expect(DatepickerHelpers.getPreviousMonth(new Date('05-10-2017'))).to.eql(new Date('04-01-2017'))
    })
    it('should roll back to December of the previous year when given January', () => {
      expect(DatepickerHelpers.getPreviousMonth(new Date('01-10-2017'))).to.eql(new Date('12-01-2016'))
    })
  })

  describe('getDayDiff', () => {
    it('should return a positive number of days when the second date is after the first', () => {
      expect(DatepickerHelpers.getDayDiff('10-10-2017', '10-15-2017')).to.equal(5)
    })
    it('should return a negative number of days when the second date is before the first', () => {
      expect(DatepickerHelpers.getDayDiff('10-15-2017', '10-10-2017')).to.equal(-5)
    })
  })

  describe('validateDateBetweenTwoDates', () => {
    it('should return true when the given date is within the range', () => {
      expect(DatepickerHelpers.validateDateBetweenTwoDates('10-10-2017', '10-20-2017', '10-15-2017')).to.equal(true)
    })
    it('should return false when the given date is outside the range', () => {
      expect(DatepickerHelpers.validateDateBetweenTwoDates('10-10-2017', '10-20-2017', '10-25-2017')).to.equal(false)
    })
    it('should be inclusive of the range boundaries', () => {
      expect(DatepickerHelpers.validateDateBetweenTwoDates('10-10-2017', '10-20-2017', '10-10-2017')).to.equal(true)
      expect(DatepickerHelpers.validateDateBetweenTwoDates('10-10-2017', '10-20-2017', '10-20-2017')).to.equal(true)
    })
  })

  describe('validateDateBetweenDate', () => {
    it('should return true when the given date is before or equal to the reference date', () => {
      expect(DatepickerHelpers.validateDateBetweenDate('10-20-2017', '10-15-2017')).to.equal(true)
    })
    it('should return false when the given date is after the reference date', () => {
      expect(DatepickerHelpers.validateDateBetweenDate('10-10-2017', '10-15-2017')).to.equal(false)
    })
  })

  describe('getMonthDiff', () => {
    it('should return the number of months between two dates in the same year', () => {
      expect(DatepickerHelpers.getMonthDiff(new Date('01-10-2017'), new Date('05-10-2017'))).to.equal(4)
    })
    it('should account for a year boundary', () => {
      expect(DatepickerHelpers.getMonthDiff(new Date('11-10-2017'), new Date('02-10-2018'))).to.equal(3)
    })
  })

  describe('shortenString', () => {
    it('should truncate every string in the array to the given length', () => {
      expect(DatepickerHelpers.shortenString(['January', 'February'], 3)).to.eql(['Jan', 'Feb'])
    })
  })

  describe('getDaysArray', () => {
    it('should return an array of every date between start and end, inclusive', () => {
      const result = DatepickerHelpers.getDaysArray(new Date('10-10-2017'), new Date('10-13-2017'))

      expect(result).to.eql([
        new Date('10-10-2017'),
        new Date('10-11-2017'),
        new Date('10-12-2017'),
        new Date('10-13-2017'),
      ])
    })
  })

  describe('dateFormater', () => {
    it('should format a date using the default YYYY-MM-DD format', () => {
      expect(DatepickerHelpers.dateFormater(new Date('10-10-2017'))).to.equal('2017-10-10')
    })
    it('should format a date using a custom format string', () => {
      expect(DatepickerHelpers.dateFormater(new Date('10-10-2017'), 'DD/MM/YYYY')).to.equal('10/10/2017')
    })
    it('should return an empty string when no date is given', () => {
      expect(DatepickerHelpers.dateFormater(null)).to.equal('')
    })
  })

  describe('pluralize', () => {
    const i18n = { night: 'Night', nights: 'Nights', week: 'Week', weeks: 'Weeks' }

    it('should return the singular night translation for a count of 1', () => {
      expect(DatepickerHelpers.pluralize.call({ i18n }, 1)).to.equal('Night')
    })
    it('should return the plural nights translation for a count other than 1', () => {
      expect(DatepickerHelpers.pluralize.call({ i18n }, 3)).to.equal('Nights')
      expect(DatepickerHelpers.pluralize.call({ i18n }, 0)).to.equal('Nights')
    })
    it('should return the singular week translation for a count of 7 or less', () => {
      expect(DatepickerHelpers.pluralize.call({ i18n }, 7, 'week')).to.equal('Week')
    })
    it('should return the plural weeks translation for a count greater than 7', () => {
      expect(DatepickerHelpers.pluralize.call({ i18n }, 14, 'week')).to.equal('Weeks')
    })
  })

  describe('isDateLessOrEquals', () => {
    it('should return true when the first date is before the second', () => {
      expect(DatepickerHelpers.isDateLessOrEquals(new Date('10-10-2017'), new Date('10-15-2017'))).to.equal(true)
    })
    it('should return false when the first date is after the second', () => {
      expect(DatepickerHelpers.isDateLessOrEquals(new Date('10-15-2017'), new Date('10-10-2017'))).to.equal(false)
    })
  })

  describe('nextDateByDayOfWeekObject', () => {
    it('should return the next date matching one of the enabled days in the object', () => {
      const days = { sunday: false, monday: false, tuesday: true, wednesday: false, saturday: true }

      expect(DatepickerHelpers.nextDateByDayOfWeekObject(days, '11-08-2017')).to.eql(new Date('11-11-2017'))
    })
  })

  describe('getIsoWeek', () => {
    it('should return the correct ISO week number for a given date', () => {
      expect(DatepickerHelpers.getIsoWeek(new Date('08-26-2020'))).to.equal(35)
    })
    it('should return the correct ISO week number for another date', () => {
      expect(DatepickerHelpers.getIsoWeek(new Date('10-10-2017'))).to.equal(41)
    })
  })
})
