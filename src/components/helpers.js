export default {
  getNextDate(datesArray, referenceDate) {
    var now = new Date(referenceDate);
    var closest = Infinity;

    datesArray.forEach(function (d) {
      var date = new Date(d);
      if (date >= now && date < closest) {
        closest = d;
      }
    });

    if (closest === Infinity) {
      return null;
    } else {
      return closest;
    }
  },
  nextDateByDayOfWeek(weekDay, referenceDate) {
    referenceDate = new Date(referenceDate);
    weekDay = weekDay.toLowerCase();
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let referenceDateDay = referenceDate.getDay();

    for (var i = 7; i--;) {
      if (weekDay === days[i]) {
        weekDay = (i <= referenceDateDay) ? (i + 7) : i;
        break;
      }
    }

    let daysUntilNext = weekDay - referenceDateDay;

    return referenceDate.setDate(referenceDate.getDate() + daysUntilNext);
  },
  nextDateByDayOfWeekArray(daysArray, referenceDate) {
    let tempArray = [];
    for (var i = 0; i < daysArray.length; i++) {
      tempArray.push(new Date(this.nextDateByDayOfWeek(daysArray[i], referenceDate)));
    }
    return this.getNextDate(tempArray, referenceDate);
  },
  isDateLessOrEquals(time1, time2) {
    return new Date(time1) <= new Date(time2);
  },
  countDays(start, end) {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(start);
    const secondDate = new Date(end);

    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
  },
  addDays(date, quantity) {
    let result = new Date(date);
    result.setDate(result.getDate() + quantity);
    return result;
  },
  getFirstSunday(date) {
    var firstDay = this.getFirstDayOfMonth(date);
    return new Date(
      firstDay.setDate(
        firstDay.getDate()
        - firstDay.getDay()
      )
    );
  },
  getFirstMonday(date) {
    var firstDay = this.getFirstDayOfMonth(date);
    return new Date(
      firstDay.setDate(
        firstDay.getDate()
        - firstDay.getDay()
        + 1
      )
    );
  },
  getFirstDayOfMonth(date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(), 1
    );
  },
  getNextMonth(date) {
    let nextMonth;

    if (date.getMonth() == 11) {
      nextMonth = new Date(date.getFullYear() + 1, 0, 1);
    } else {
      nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }
    return nextMonth;
  },

  scrollMonthDown(){
    const swiperWrapper = document.getElementById('swiperWrapper');
    swiperWrapper.scrollTop = swiperWrapper.scrollHeight;
  },

  handleScroll() {
    if (this.screenSize !== 'desktop' && this.isOpen) {
      const swiperWrapper = document.getElementById('swiperWrapper');
      if(swiperWrapper.scrollTop > swiperWrapper.scrollHeight*0.55){
        this.showMoreButton = true;
      }
      else this.showMoreButton = false;
    }
  },

  shortenString(arr, sLen) {
    let newArr = [];
    for (let i = 0, len = arr.length; i < len; i++) {
      newArr.push(arr[i].substr(0, sLen));
    }
    return newArr;
  },
};
