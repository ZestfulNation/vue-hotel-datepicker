/* eslint-disable vars-on-top */
import fecha from 'fecha'

const helpers = {
  getNextDate(datesArray, referenceDate) {
    const now = new Date(referenceDate)
    let closest = Infinity

    datesArray.forEach((d) => {
      const date = new Date(d)

      if (date >= now && date < closest) {
        closest = d
      }
    })

    if (closest === Infinity) {
      return null
    }

    return closest
  },
  nextDateByDayOfWeek(weekDay, referenceDate, i18n) {
    const newReferenceDate = new Date(referenceDate)
    let newWeekDay = weekDay.toLowerCase()
    const daysDefault = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const days = i18n ? i18n['day-names'] : daysDefault
    const referenceDateDay = newReferenceDate.getDay()

    for (let i = 7; ; i--) {
      if (newWeekDay === days[i]) {
        newWeekDay = i <= referenceDateDay ? i + 7 : i
        break
      }
    }

    const daysUntilNext = newWeekDay - referenceDateDay

    return newReferenceDate.setDate(newReferenceDate.getDate() + daysUntilNext)
  },
  nextDateByDayOfWeekArray(daysArray, referenceDate, i18n) {
    const tempArray = []

    for (let i = 0; i < daysArray.length; i++) {
      tempArray.push(new Date(this.nextDateByDayOfWeek(daysArray[i], referenceDate, i18n)))
    }

    return this.getNextDate(tempArray, referenceDate)
  },
  nextDateByDayOfWeekObject(days, referenceDate, i18n) {
    const daysArray = Object.entries(days)
      .map((e) => (e[1] ? e[0] : false))
      .filter((v) => v)

    return this.nextDateByDayOfWeekArray(daysArray, referenceDate, i18n)
  },
  countDays(start, end) {
    const oneDay = 24 * 60 * 60 * 1000
    const firstDate = new Date(start)
    const secondDate = new Date(end)

    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay))
  },
  addDays(date, quantity) {
    const result = new Date(date)

    result.setDate(result.getDate() + quantity)

    return result
  },
  getDayDiff(d1, d2) {
    const t2 = new Date(d2).getTime()
    const t1 = new Date(d1).getTime()

    return parseInt((t2 - t1) / (24 * 3600 * 1000), 10)
  },
  getFirstDay(date, firstDayOfWeek) {
    const firstDay = this.getFirstDayOfMonth(date)
    const day = firstDay.getDay()
    let offset = 0

    if (firstDayOfWeek > 0) {
      offset = !day ? -6 : firstDayOfWeek
    }

    return new Date(firstDay.setDate(firstDay.getDate() - (day - offset)))
  },
  getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
  },
  getNextMonth(date) {
    let nextMonth

    if (date.getMonth() === 11) {
      nextMonth = new Date(date.getFullYear() + 1, 0, 1)
    } else {
      nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    }

    return nextMonth
  },
  handleTouchStart(evt) {
    this.isTouchMove = false

    if (this.isOpen) {
      this.xDown = evt.touches[0].clientX
      this.yDown = evt.touches[0].clientY
    }
  },
  handleTouchMove(evt) {
    if (!this.xDown || !this.yDown) {
      this.isTouchMove = false

      return
    }

    this.isTouchMove = true
    this.xUp = evt.touches[0].clientX
    this.yUp = evt.touches[0].clientY
  },
  handleTouchEnd() {
    if (!this.isTouchMove) {
      return
    }

    if (!this.xDown || !this.yDown) {
      return
    }

    const xDiff = this.xDown - this.xUp
    const yDiff = this.yDown - this.yUp

    if (Math.abs(xDiff) < Math.abs(yDiff) && yDiff > 0 && !this.isPreventedMaxMonth) {
      this.renderNextMonth()
    } else {
      this.renderPreviousMonth()
    }

    this.xDown = null
    this.yDown = null
  },
  validateDateBetweenTwoDates(fromDate, toDate, givenDate) {
    const getvalidDate = (d) => {
      const formatDateAt00 = new Date(d).setHours(0, 0, 0, 0)

      return new Date(formatDateAt00)
    }

    return getvalidDate(givenDate) <= getvalidDate(toDate) && getvalidDate(givenDate) >= getvalidDate(fromDate)
  },
  validateDateBetweenDate(fromDate, givenDate) {
    const getvalidDate = (d) => {
      return new Date(d)
    }

    return getvalidDate(givenDate) <= getvalidDate(fromDate)
  },
  getMonthDiff(d1, d2) {
    const newD1 = new Date(d1)
    const newD2 = new Date(d2)
    const d1Y = newD1.getFullYear()
    const d2Y = newD2.getFullYear()
    const d1M = newD1.getMonth()
    const d2M = newD2.getMonth()

    return d2M + 12 * d2Y - (d1M + 12 * d1Y)
  },
  shortenString(arr, sLen) {
    const newArr = []

    for (let i = 0, len = arr.length; i < len; i++) {
      newArr.push(arr[i].substr(0, sLen))
    }

    return newArr
  },
  getDaysArray(start, end) {
    for (
      // eslint-disable-next-line no-var
      var arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt))
    }

    // eslint-disable-next-line block-scoped-var
    return arr
  },
  dateFormater(date, format) {
    const f = format || 'YYYY-MM-DD'

    if (date) {
      return fecha.format(date, f)
    }

    return ''
  },
  pluralize(countOfDays, periodType = 'night') {
    if (periodType === 'week') {
      return countOfDays > 7 ? this.i18n.weeks : this.i18n.week
    }

    return countOfDays !== 1 ? this.i18n.nights : this.i18n.night
  },
  isDateLessOrEquals(time1, time2) {
    return new Date(time1) < new Date(time2)
  },
  compareDay(day1, day2) {
    const date1 = fecha.format(new Date(day1), 'YYYYMMDD')
    const date2 = fecha.format(new Date(day2), 'YYYYMMDD')

    if (date1 > date2) {
      return 1
    }

    if (date1 === date2) {
      return 0
    }

    if (date1 < date2) {
      return -1
    }

    return null
  },
}

export default helpers
