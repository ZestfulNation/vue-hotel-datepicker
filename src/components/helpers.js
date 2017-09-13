module.exports = {
  countDays(start, end) {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(start);
    const secondDate = new Date(end);

    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
  },
  addDays(date, quantity) {
    let result = new Date(date);
    result.setDate(result.getDate() + quantity);
    return result;
  },
  getFirstSunday(date) {
    var firstDay =  this.getFirstDayOfMonth(date);
    return new Date(
      firstDay.setDate(
        firstDay.getDate()
        -firstDay.getDay()
      )
    );
  },
  getFirstDayOfMonth(date) {
    return new Date(
          date.getFullYear(),
          date.getMonth(), 1
        );
  },
  getNextMonth(date){
    let nextMonth;

    if (date.getMonth() == 11) {
      nextMonth = new Date(date.getFullYear() + 1, 0, 1);
    } else {
      nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }
    return nextMonth;
  },
//============== Handle mobile gestures ==============//
  swipeAfterScroll(direction){
    const swiperWrapper = document.getElementById('swiperWrapper');


        // If wrapper has vertical scroll
    if (swiperWrapper.scrollHeight > swiperWrapper.clientHeight) {
      if( swiperWrapper.scrollTop === (swiperWrapper.scrollHeight - swiperWrapper.offsetHeight) ) {
        this.renderNextMonth();
            // swiperWrapper.scrollTop = 0;
      }
      else if ( swiperWrapper.scrollTop === 0){
        this.renderPreviousMonth();
            // swiperWrapper.scrollTop = 0;
      }
      else { return; }
    }
    else if (direction == 'up'){
      this.renderNextMonth();
    }
    else if (direction == 'down') {
      this.renderPreviousMonth();
    }
  },

  handleTouchStart(evt) {
    this.xDown = evt.touches[0].clientX;
    this.yDown = evt.touches[0].clientY;
  },

  handleTouchMove(evt) {
    if ( !this.xDown || !this.yDown ) { return; }

    this.xUp = evt.touches[0].clientX;
    this.yUp = evt.touches[0].clientY;

    let xDiff = this.xDown - this.xUp;
    let yDiff = this.yDown - this.yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
      if ( xDiff > 0 ) {
            //   swipe right
      } else {
            //   swipe left
      }
    } else {
      if ( yDiff > 0 ) {
            //   swipe up
        this.swipeAfterScroll('up');
      } else {
            //   swipe down
        this.swipeAfterScroll('down');
      }
    }
    this.xDown = null;
    this.yDown = null;
  },
};
