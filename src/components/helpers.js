export default {
  getNextDate(datesArray, referenceDate) {
    const now = new Date(referenceDate);
    let closest = Infinity;

    datesArray.forEach(d => {
      const date = new Date(d);

      if (date >= now && date < closest) {
        closest = d;
      }
    });

    if (closest === Infinity) {
      return null;
    }

    return closest;
  },
  nextDateByDayOfWeek(weekDay, referenceDate) {
    const newReferenceDate = new Date(referenceDate);
    let newWeekDay = weekDay.toLowerCase();
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];
    const referenceDateDay = newReferenceDate.getDay();

    for (let i = 7; i--; ) {
      if (newWeekDay === days[i]) {
        newWeekDay = i <= referenceDateDay ? i + 7 : i;
        break;
      }
    }

    const daysUntilNext = newWeekDay - referenceDateDay;

    return newReferenceDate.setDate(newReferenceDate.getDate() + daysUntilNext);
  },
  nextDateByDayOfWeekArray(daysArray, referenceDate) {
    const tempArray = [];

    for (let i = 0; i < daysArray.length; i++) {
      tempArray.push(
        new Date(this.nextDateByDayOfWeek(daysArray[i], referenceDate))
      );
    }

    return this.getNextDate(tempArray, referenceDate);
  },
  countDays(start, end) {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(start);
    const secondDate = new Date(end);

    return Math.round(
      Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
    );
  },
  addDays(date, quantity) {
    const result = new Date(date);

    result.setDate(result.getDate() + quantity);

    return result;
  },
  getFirstDay(date, firstDayOfWeek) {
    const firstDay = this.getFirstDayOfMonth(date);
    let offset = 0;

    if (firstDayOfWeek > 0) {
      offset = firstDay.getDay() === 0 ? -7 + firstDayOfWeek : firstDayOfWeek;
    }

    return new Date(
      firstDay.setDate(firstDay.getDate() - (firstDay.getDay() - offset))
    );
  },
  getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },
  getNextMonth(date) {
    let nextMonth;

    if (date.getMonth() === 11) {
      nextMonth = new Date(date.getFullYear() + 1, 0, 1);
    } else {
      nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }

    return nextMonth;
  },
  handleTouchStart(evt) {
    if (this.isOpen && !this.isPreventedMaxMonth) {
      this.xDown = evt.touches[0].clientX;
      this.yDown = evt.touches[0].clientY;
    }
  },
  handleTouchMove(evt) {
    if (!this.xDown || !this.yDown) {
      return;
    }

    this.xUp = evt.touches[0].clientX;
    this.yUp = evt.touches[0].clientY;
  },
  handleTouchEnd() {
    if (!this.xDown || !this.yDown) {
      return;
    }

    const xDiff = this.xDown - this.xUp;
    const yDiff = this.yDown - this.yUp;

    if (Math.abs(xDiff) < Math.abs(yDiff) && yDiff > 0) {
      this.renderNextMonth();
    } else {
      this.renderPreviousMonth();
    }

    this.xDown = null;
    this.yDown = null;
  },
  validateDateBetweenTwoDates(fromDate, toDate, givenDate) {
    const getvalidDate = d => {
      const formatDateAt00 = new Date(d).setHours(0, 0, 0, 0);

      return new Date(formatDateAt00);
    };

    return (
      getvalidDate(givenDate) <= getvalidDate(toDate) &&
      getvalidDate(givenDate) >= getvalidDate(fromDate)
    );
  },
  getMonthDiff(d1, d2) {
    const newD1 = new Date(d1);
    const newD2 = new Date(d2);
    const d1Y = newD1.getFullYear();
    const d2Y = newD2.getFullYear();
    const d1M = newD1.getMonth();
    const d2M = newD2.getMonth();

    return d2M + 12 * d2Y - (d1M + 12 * d1Y);
  },
  shortenString(arr, sLen) {
    const newArr = [];

    for (let i = 0, len = arr.length; i < len; i++) {
      newArr.push(arr[i].substr(0, sLen));
    }

    return newArr;
  }
};
