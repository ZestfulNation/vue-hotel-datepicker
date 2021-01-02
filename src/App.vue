<template>
  <div id="app">
    <h1 style="flex-grow: 0">Vue Hotel Datepicker v4</h1>
    <div style="flex-grow: 0; padding: 1em 0">
      Language Selection:
      <select v-model="language">
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="pt">Português</option>
        <option value="fr">Français</option>
      </select>
    </div>
    <div class="container">
      <div class="toggle-menu" @click="toggleMenu">
        <img src="@/assets/images/menu.svg" alt="..." />
      </div>
      <div :class="['menu', { hidden: !menu }]">
        <h3>Examples</h3>
        <ul>
          <li @click="selectBox(0)" :class="{ selected: boxShow == 0 }">Show list of static bookings</li>
          <li @click="selectBox(1)" :class="{ selected: boxShow == 1 }">Calendar in full view</li>
          <li @click="selectBox(2)" :class="{ selected: boxShow == 2 }">Show calendar on the right</li>
          <li @click="selectBox(3)" :class="{ selected: boxShow == 3 }">Hide grid style</li>
          <li @click="selectBox(4)" :class="{ selected: boxShow == 4 }">Display one month only</li>
          <li @click="selectBox(5)" :class="{ selected: boxShow == 5 }">Insert content with the content slot</li>
          <li @click="selectBox(6)" :class="{ selected: boxShow == 6 }">
            Last date available <strong>lastDateAvailable</strong> props
          </li>
          <li @click="selectBox(7)" :class="{ selected: boxShow == 7 }">
            Show prices with <strong>periodDates</strong>
          </li>
          <li @click="selectBox(8)" :class="{ selected: boxShow == 8 }">
            Blocked different day when clicked on with <strong>periodDates</strong>
          </li>
          <li @click="selectBox(9)" :class="{ selected: boxShow == 9 }">
            Half day, If you have check in at noon and checkout before noon
          </li>
          <li @click="selectBox(10)" :class="{ selected: boxShow == 10 }">
            Disable check-in and check-out on the same day
          </li>
          <li @click="selectBox(11)" :class="{ selected: boxShow == 11 }">Allow selection of single day</li>
          <li @click="selectBox(12)" :class="{ selected: boxShow == 12 }">
            Check in only on saturday and minimum stay of 10 nights
          </li>
          <li @click="selectBox(13)" :class="{ selected: boxShow == 13 }">
            Block all dates after December 31st of {{ new Date().getUTCFullYear() }}
          </li>
          <li @click="selectBox(14)" :class="{ selected: boxShow == 14 }">Block all dates after 15th of next month</li>
          <li @click="selectBox(15)" :class="{ selected: boxShow == 15 }">
            Block all date ranges of more than 30 days
          </li>
          <li @click="selectBox(16)" :class="{ selected: boxShow == 16 }">Minimum stay of 3 days</li>
          <li @click="selectBox(17)" :class="{ selected: boxShow == 17 }">Certain dates blocked</li>
          <li @click="selectBox(18)" :class="{ selected: boxShow == 18 }">Allow setting a default date range</li>
          <li @click="selectBox(19)" :class="{ selected: boxShow == 19 }">Checkin only on saturdays</li>
          <li @click="selectBox(20)" :class="{ selected: boxShow == 20 }">Custom tooltip text</li>
          <li @click="selectBox(21)" :class="{ selected: boxShow == 21 }">Hide year</li>
          <li @click="selectBox(22)" :class="{ selected: boxShow == 22 }">Custom date format (MMMM D)</li>
          <li @click="selectBox(23)" :class="{ selected: boxShow == 23 }">
            Change the first day of the week to Monday
          </li>
          <li @click="selectBox(24)" :class="{ selected: boxShow == 24 }">Set checkIn value</li>
          <li @click="selectBox(25)" :class="{ selected: boxShow == 25 }">Set checkOut value</li>
          <li @click="selectBox(26)" :class="{ selected: boxShow == 26 }">Event CheckIn</li>
        </ul>
      </div>
      <div v-show="!menu || currentWidth > 1184" class="box-container">
        <div v-if="boxShow == 0" class="box">
          <h3>Show list of static bookings</h3>
          <DatePicker :alwaysVisible="true" :bookings="bookings" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 1" class="box">
          <h3>Calendar in full view</h3>
          <DatePicker :alwaysVisible="true" :showYear="true" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 2" class="box">
          <h3>Show calendar on the right</h3>
          <DatePicker :positionRight="true" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 3" class="box">
          <h3>Hide grid style</h3>
          <DatePicker :gridStyle="false" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 4" class="box">
          <h3>Display one month only</h3>
          <DatePicker :showSingleMonth="true" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 5" class="box">
          <h3>Insert content with the content slot</h3>

          <DatePicker :i18n="i18n">
            <!-- Insert content here -->
            <div slot="content" style="background: #ff8000; color: white; padding: 1rem; font-size: 2rem">
              Content Slot with style
            </div>
          </DatePicker>
        </div>
        <div v-if="boxShow == 6" class="box">
          <h3>
            Last date available <strong>lastDateAvailable</strong> props <br />
            <small style="font-weight: normal">Stop pagination two years later</small>
          </h3>
          <DatePicker :lastDateAvailable="lastDateAvailable" :showYear="true" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 7" class="box">
          <h3>Show prices with <strong>periodDates</strong></h3>
          <DatePicker
            :showPrice="true"
            :minNights="minNights"
            :periodDates="periodDates"
            :i18n="i18n"
            @day-clicked="dayClicked"
          />
        </div>
        <div v-if="boxShow == 8" class="box">
          <h3>
            Blocked different day when clicked on with <strong>periodDates</strong>&nbsp;
            <span style="font-weight: 400">Emit day-clicked</span>
          </h3>
          <DatePicker
            :disabledDates="[
              '2021-10-15',
              '2021-10-16',
              '2021-10-17',
              '2021-10-18',
              '2021-10-19',
              '2021-10-20',
              '2021-10-21',
              '2021-10-01',
              '2021-10-02',
              '2021-10-03',
              '2021-10-04',
              '2021-10-05',
              '2021-10-06',
              '2021-10-07',
            ]"
            :disableCheckoutOnCheckin="true"
            :minNights="minNights"
            :i18n="i18n"
            @day-clicked="dayClicked"
          />
        </div>
        <div v-if="boxShow == 9" class="box">
          <h3>Half day, If you have check in at noon and checkout before noon</h3>
          <DatePicker
            :i18n="i18n"
            :disabledDates="[
              '2021-05-01',
              '2021-05-02',
              '2021-05-03',
              '2021-05-04',
              '2021-05-06',
              '2021-05-07',
              '2021-05-08',
            ]"
          />
        </div>
        <div v-if="boxShow == 10" class="box">
          <h3>Disable check-in and check-out on the same day</h3>
          <DatePicker :disableCheckoutOnCheckin="true" :minNights="1" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 11" class="box">
          <h3>Allow selection of single day</h3>
          <DatePicker :singleDaySelection="true" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 12" class="box">
          <h3>Check in only on saturday and minimum stay of 10 nights</h3>
          <DatePicker
            :disabledWeekDays="{
              sunday: true,
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: false,
            }"
            :enableCheckout="true"
          />
        </div>
        <div v-if="boxShow == 13" class="box">
          <h3>Block all dates after December 31st of the current year</h3>
          <DatePicker :endDate="new Date(new Date().getFullYear(), 11, 31)" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 14" class="box">
          <h3>Block all dates after 15th of next month</h3>
          <DatePicker :endDate="new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15)" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 15" class="box">
          <h3>Block all date ranges of more than 30 days</h3>
          <DatePicker :maxNights="30" :selectForward="false" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 16" class="box">
          <h3>Minimum stay of 3 days</h3>
          <DatePicker :minNights="3" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 17" class="box">
          <h3>Certain dates blocked</h3>
          <DatePicker :disabledDates="['2017-09-14', '2017-09-26']" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 18" class="box">
          <h3>Allow setting a default date range ( can be used to set a range from a url param )</h3>
          <DatePicker
            :startingDateValue="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())"
            :endingDateValue="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5)"
            :i18n="i18n"
          />
        </div>
        <div v-if="boxShow == 19" class="box">
          <h3>Checkin only on saturdays</h3>
          <DatePicker
            :disabledWeekDays="{
              sunday: true,
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: false,
            }"
            :enableCheckout="true"
            :i18n="i18n"
          />
        </div>
        <div v-if="boxShow == 20" class="box">
          <h3>Custom tooltip text</h3>
          <DatePicker tooltipMessage="<strong style='color: red'>Enjoy</strong> your stay!" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 21" class="box">
          <h3>Hide year</h3>
          <DatePicker :showYear="false" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 22" class="box">
          <h3>Custom date format (MMMM D)</h3>
          <DatePicker format="MMMM D" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 23" class="box">
          <h3>Change the first day of the week to Monday</h3>
          <DatePicker :firstDayOfWeek="1" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 24" class="box">
          <h3>Set checkIn value</h3>
          <DatePicker :firstDayOfWeek="1" :checkInValue="new Date()" :i18n="i18n" />
        </div>
        <div v-if="boxShow == 25" class="box">
          <h3>Set checkOut value</h3>
          <DatePicker
            :checkInValue="new Date()"
            :checkOutValue="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3)"
            :i18n="i18n"
          />
        </div>
        <div v-if="boxShow == 26" class="box">
          <h3>Event CheckIn / CheckOut</h3>
          <DatePicker :i18n="i18n" @check-in-changed="console.log($event)" @check-out-changed="console.log($event)" />
          <p>new Check In Date: {{ checkIn }}</p>
          <p>new Check Out Date : {{ checkOut }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './assets/scss/index.scss'
import DatePicker from './DatePicker/HotelDatePicker.vue'
import pt from './i18n/pt'
import fr from './i18n/fr'
import en from './i18n/en'
import es from './i18n/es'

export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      periodDates: [
        {
          startAt: '2021-07-01',
          endAt: '2021-08-01',
          minimumDuration: 4,
          periodType: 'nightly',
        },
        {
          startAt: '2021-08-01',
          endAt: '2021-09-05',
          minimumDuration: 2,
          periodType: 'weekly_by_saturday',
        },
        {
          startAt: '2021-09-05',
          endAt: '2021-10-04',
          minimumDuration: 4,
          periodType: 'nightly',
        },
        {
          startAt: '2021-10-04',
          endAt: '2021-11-29',
          minimumDuration: 1,
          periodType: 'weekly_by_sunday',
          price: 4000.0,
        },
      ],
      bookings: [
        {
          id: '1726359',
          checkInDate: '2021-08-22',
          checkOutDate: '2021-08-29',
          style: {
            backgroundColor: '#9DC1C9',
          },
        },
        {
          id: '1726360',
          checkInDate: '2021-08-15',
          checkOutDate: '2021-08-22',
          style: {
            backgroundColor: '#9DC1C9',
          },
        },
        {
          id: '1726358',
          checkInDate: '2021-08-01',
          checkOutDate: '2021-08-15',
          style: {
            backgroundColor: '#9DC1C9',
          },
        },
        {
          id: '1726357',
          checkInDate: '2021-09-01',
          checkOutDate: '2021-09-23',
          style: {
            backgroundColor: '#9DC1C9',
          },
        },
        {
          id: '1726356',
          checkInDate: '2021-06-01',
          checkOutDate: '2021-06-18',
          style: {
            backgroundColor: '#9DC1C9',
          },
        },
        {
          id: '181412',
          checkInDate: '2022-09-15',
          checkOutDate: '2022-10-15',
          style: {
            backgroundColor: '#9DC1C9',
          },
        },
        {
          id: '181491',
          checkInDate: '2022-07-01',
          checkOutDate: '2022-08-31',
          style: {
            backgroundColor: '#9DC1C9',
          },
        },
        {
          id: '178234',
          checkInDate: '2023-08-04',
          checkOutDate: '2023-08-25',
          style: {
            backgroundColor: '#9DC1C9',
          },
        },
        {
          id: '178235',
          checkInDate: '2023-07-01',
          checkOutDate: '2023-07-31',
          style: {
            backgroundColor: '#9DC1C9',
          },
        },
      ],
      checkIn: null,
      checkOut: null,
      minNights: 3,
      menu: false,
      currentWidth: window.innerWidth,
      boxShow: 0,
      language: 'en',
      languages: { pt, fr, en, es },
    }
  },
  computed: {
    dateFormat() {
      return 'DD/MM/YYYY'
    },
    lastDateAvailable() {
      return this.addYears(new Date(), 2)
    },
    i18n() {
      return this.languages[this.language] ? this.languages[this.language] : this.languages.en
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
  },
  methods: {
    newData() {
      return {}
    },
    selectBox(box) {
      this.boxShow = -1
      this.checkIn = null
      this.checkOut = null
      this.boxShow = box
      this.toggleMenu()
    },
    toggleMenu() {
      this.menu = !this.menu
    },
    onResize() {
      this.currentWidth = window.innerWidth
    },
    bookingClicked(event, date, currentBooking) {
      /* eslint-disable-next-line */
      console.log('bookingClicked', event, date, currentBooking)
    },
    periodSelected(event, checkIn, checkOut) {
      /* eslint-disable-next-line */
      console.log('periodSelected', event, checkIn, checkOut)
    },
    handleCheckIncheckOutHalfDay(checkIncheckOutHalfDay) {
      /* eslint-disable-next-line */
      console.log('handleCheckIncheckOutHalfDay', checkIncheckOutHalfDay)
    },
    addYears(dt, n) {
      return new Date(dt.setFullYear(dt.getFullYear() + n))
    },
    validateDateBetweenTwoDates(fromDate, toDate, givenDate) {
      const getvalidDate = (d) => {
        return new Date(d)
      }

      return getvalidDate(givenDate) <= getvalidDate(toDate) && getvalidDate(givenDate) >= getvalidDate(fromDate)
    },
    dayClicked(date, formatDate, nextDisabledDate) {
      /* eslint-disable-next-line */
      console.log(date, formatDate, nextDisabledDate)
    },
    checkInChanged(newDate) {
      this.checkIn = newDate
    },
    checkOutChanged(newDate) {
      this.checkOut = newDate
    },
  },
}
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
}
body {
  display: block;
  font-family: Roboto, 'Source Sans Pro', sans-serif;
  font-size: 16px;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
}
h1 {
  background-color: #28ca9c;
  color: white;
  padding: 1em 0;
  margin: 0;
}
#app {
  text-align: center;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
}
.container {
  position: relative;
  display: flex;
  flex-direction: row;
  overflow-y: hidden;
  /*
  @media (min-width: 1441px) {
    margin: 0 auto;
    max-width: 1180px;
    width: 1180px;
  }
  */

  .toggle-menu {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    flex: none;
    color: white;
    padding: 1em 0.5em 1em;
    img {
      width: 1.5em;
    }
  }
  @media (min-width: 1441px) {
    .toggle-menu {
      display: none;
    }
  }

  .menu {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    flex-grow: 1;
    max-width: 300px;
    text-align: left;
    max-height: 100%;
    overflow-y: hidden;
    @media (max-width: 1440px) {
      max-width: 100%;

      &.hidden {
        width: 0;
        max-width: 0;
        overflow: hidden;
        flex-shrink: 1;
      }
    }

    ul {
      padding: 0 0 2em 0;
      margin: 0 1em 0 0;
      font-size: 1.17rem;
      overflow: auto;
      @media (max-width: 1440px) {
        margin-left: calc(24px + 1em);
      }
      li {
        font-size: 1rem;
        padding: 0.25em 0.75em;
        margin: 0;
        text-align: left;
        cursor: pointer;
        list-style-type: none;
        border-bottom: 1px dashed rgba(128, 128, 128, 0.425);

        &:hover,
        &:active,
        &:focus {
          background-color: gray;
          color: white;
        }
        &.selected {
          background-color: #28ca9c;
          color: white;
          position: sticky;
          top: 0;
          bottom: -2em;
        }
      }
    }
  }

  .box-container {
    flex-grow: 1;
    max-width: 100%;
    @media (min-width: 1441px) {
      text-align: left;
    }
    .box {
      width: 100%;
    }
  }

  h3 {
    background-color: gray;
    color: white;
    padding: 1em 0 1em calc(1em + 24px);
    margin-top: 0;
    text-align: left;
  }
}
.vhd__datepicker__wrapper {
  max-width: 300px;
  &.vhd__datepicker__fullview {
    max-width: 90%;
  }
}
pre.code {
  background: black;
}
</style>
