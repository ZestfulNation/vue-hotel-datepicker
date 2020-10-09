<template>
    <div id="app">
        <h1>Vue Hotel Datepicker v4</h1>
        <div>
            Language Selection:
            <select v-model="language">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="pt">Português</option>
                <option value="fr">Français</option>
            </select>
        </div>
        <div class="container">
            <div class="box">
                <h3>
                    Show list of static bookings
                </h3>
                <DatePicker
                    :alwaysVisible="true"
                    :bookings="bookings"
                    :i18n="i18n"
                />
            </div>
            <div class="box">
                <h3>
                    Calendar in full view
                </h3>
                <DatePicker
                    :alwaysVisible="true"
                    :showYear="true"
                    :i18n="i18n"
                />
            </div>
            <div class="box">
                <h3>
                    Show calendar on the right
                </h3>
                <DatePicker :positionRight="true" :i18n="i18n" />
            </div>
            <div class="box">
                <h3>
                    Hide grid style
                </h3>
                <DatePicker
                    :gridStyle="false"
                    :i18n="i18n"
                />
            </div>
            <div class="box">
                <h3>
                    Display one month only
                </h3>
                <DatePicker
                    :showSingleMonth="true"
                    :i18n="i18n"
                />
            </div>
            <div class="box">
                <h3>
                    Insert content with the content slot
                </h3>

                <DatePicker :i18n="i18n">
                    <!-- Insert content here -->
                    <div slot="content" style="background: #FF8000; color: white; padding: 1rem; font-size: 2rem;">
                        Content Slot with style
                    </div>
                </DatePicker>
            </div>
            <div class="box">
                <h3>
                    Last date available
                    <strong>lastDateAvailable</strong> props <br />
                    <small style="font-weight: normal">Stop pagination two years later</small>
                </h3>
                <DatePicker :lastDateAvailable="lastDateAvailable" :showYear="true" :i18n="i18n" />
            </div>
            <div class="box">
                <h3>Show prices with <strong>periodDates</strong></h3>
                <DatePicker
                    :showPrice="true"
                    :minNights="minNights"
                    :periodDates="periodDates"
                    :i18n="i18n"
                    @dayClicked="dayClicked"
                />
            </div>
            <div class="box">
                <h3>
                    Blocked different day when clicked on with
                    <strong>periodDates</strong>&nbsp;
                    <span style="font-weight: 400">Emit dayClicked</span>
                </h3>
                <DatePicker
                    :disabledDates="[
                        '2020-10-15',
                        '2020-10-16',
                        '2020-10-17',
                        '2020-10-18',
                        '2020-10-19',
                        '2020-10-20',
                        '2020-10-21',
                        '2020-10-01',
                        '2020-10-02',
                        '2020-10-03',
                        '2020-10-04',
                        '2020-10-05',
                        '2020-10-06',
                        '2020-10-07',
                    ]"
                    :disableCheckoutOnCheckin="true"
                    :minNights="minNights"
                    :i18n="i18n"
                    @dayClicked="dayClicked"
                />
            </div>
            <div class="box">
                <h3>Half day, If you have check in at noon and checkout before noon</h3>
                <DatePicker
                    :i18n="i18n"
                    :disabledDates="[
                        '2020-05-01',
                        '2020-05-02',
                        '2020-05-03',
                        '2020-05-04',
                        '2020-05-06',
                        '2020-05-07',
                        '2020-05-08',
                    ]"
                />
            </div>
            <div class="box">
                <h3>Disable check-in and check-out on the same day</h3>
                <DatePicker :disableCheckoutOnCheckin="true" :minNights="1" :i18n="i18n" />
            </div>
            <div class="box">
                <h3>Allow selection of single day</h3>
                <DatePicker :singleDaySelection="true" :i18n="i18n" />
            </div>
            <div class="box">
                <h3>Check in only on saturday and minimum stay of 10 nights</h3>
                <DatePicker
                    :disabledDaysOfWeek="['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']"
                    :enableCheckout="true"
                />
            </div>
            <div class="box">
                <h3>Block all dates after December 31st of the current year</h3>
                <DatePicker :endDate="new Date(new Date().getFullYear(), 11, 31)" :i18n="i18n" />
            </div>
            <div class="box">
                <h3>Block all dates after 15th of next month</h3>
                <DatePicker :endDate="new Date(new Date().getFullYear(), new Date().getMonth(), 15)" :i18n="i18n" />
            </div>
            <div class="box">
                <h3>Block all date ranges of more than 30 days</h3>
                <DatePicker :maxNights="30" :selectForward="false" :i18n="i18n" />
            </div>
            <div class="box">
                <h3>Minimum stay of 3 days</h3>
                <DatePicker :minNights="3" :i18n="i18n" />
            </div>
            <div class="box">
                <h3>Certain dates blocked</h3>
                <DatePicker :disabledDates="['2017-09-14', '2017-09-26']" :i18n="i18n" />
            </div>
            <div class="box">
                <h3>
                    Allow setting a default date range ( can be used to set a range from a url param )
                </h3>
                <DatePicker
                    :startingDateValue="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())"
                    :endingDateValue="
                        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5)
                    "
                    :i18n="i18n"
                />
            </div>
            <div class="box">
                <h3>Checkin only on saturdays</h3>
                <DatePicker
                    :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
                    :enableCheckout="true"
                    :i18n="i18n"
                />
            </div>
            <div class="box">
                <h3>Custom tooltip text</h3>
                <DatePicker tooltipMessage="<strong style='color: red'>Enjoy</strong> your stay!" :i18n="i18n" />
            </div>
            <div class="box">
                <h3>Hide year</h3>
                <DatePicker :showYear="false" :i18n="i18n" />
            </div>
            <div class="box">
                <h3>Custom date format (MMMM D)</h3>
                <DatePicker format="MMMM D" :i18n="i18n" />
            </div>
            <div class="box">
                <h3>Change the first day of the week to Monday</h3>
                <DatePicker :firstDayOfWeek="1" :i18n="i18n" />
            </div>
            <div class="box">
                <h3>Set checkIn value</h3>
                <DatePicker :firstDayOfWeek="1" :checkInValue="new Date()" :i18n="i18n" />
            </div>
            <div class="box">
                <h3>Set checkOut value</h3>
                <DatePicker
                    :checkInValue="new Date()"
                    :checkOutValue="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3)"
                    :i18n="i18n"
                />
            </div>
            <div class="box">
                <h3>Event CheckIn</h3>
                <DatePicker
                    :i18n="i18n"
                    @check-in-changed="checkInChanged($event)"
                    @check-out-changed="checkOutChanged($event)"
                />
                <p>new Check In Date: {{ newCheckInDate }}</p>
                <p>new Check Out Date : {{ newCheckOutDate }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import './assets/scss/index.scss'
import DatePicker from './components/DatePicker/index.vue'
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
            language: 'en',
            languages: { pt, fr, en, es },
            periodDates: [
                {
                    startAt: '2020-07-01',
                    endAt: '2020-08-01',
                    minimumDuration: 4,
                    periodType: 'nightly',
                },
                {
                    startAt: '2020-08-01',
                    endAt: '2020-09-05',
                    minimumDuration: 2,
                    periodType: 'weekly_by_saturday',
                },
                {
                    startAt: '2020-09-05',
                    endAt: '2020-10-04',
                    minimumDuration: 4,
                    periodType: 'nightly',
                },
                {
                    startAt: '2020-10-04',
                    endAt: '2020-11-29',
                    minimumDuration: 1,
                    periodType: 'weekly_by_sunday',
                    price: 4000.0,
                },
            ],
            bookings: [
                {
                    id: '1726359',
                    checkInDate: '2020-08-22',
                    checkOutDate: '2020-08-29',
                    style: {
                        backgroundColor: '#9DC1C9',
                    },
                },
                {
                    id: '1726360',
                    checkInDate: '2020-08-15',
                    checkOutDate: '2020-08-22',
                    style: {
                        backgroundColor: '#9DC1C9',
                    },
                },
                {
                    id: '1726358',
                    checkInDate: '2020-08-01',
                    checkOutDate: '2020-08-15',
                    style: {
                        backgroundColor: '#9DC1C9',
                    },
                },
                {
                    id: '1726357',
                    checkInDate: '2020-09-01',
                    checkOutDate: '2020-09-23',
                    style: {
                        backgroundColor: '#9DC1C9',
                    },
                },
                {
                    id: '1726356',
                    checkInDate: '2020-06-01',
                    checkOutDate: '2020-06-18',
                    style: {
                        backgroundColor: '#9DC1C9',
                    },
                },
                {
                    id: '181412',
                    checkInDate: '2019-09-15',
                    checkOutDate: '2019-10-15',
                    style: {
                        backgroundColor: '#9DC1C9',
                    },
                },
                {
                    id: '181491',
                    checkInDate: '2019-07-01',
                    checkOutDate: '2019-08-31',
                    style: {
                        backgroundColor: '#9DC1C9',
                    },
                },
                {
                    id: '178234',
                    checkInDate: '2018-08-04',
                    checkOutDate: '2018-08-25',
                    style: {
                        backgroundColor: '#9DC1C9',
                    },
                },
                {
                    id: '178235',
                    checkInDate: '2018-07-01',
                    checkOutDate: '2018-07-31',
                    style: {
                        backgroundColor: '#9DC1C9',
                    },
                },
            ],
            newCheckInDate: null,
            newCheckOutDate: null,
            minNights: 3,
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
    methods: {
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
            const getvalidDate = d => {
                return new Date(d)
            }

            return getvalidDate(givenDate) <= getvalidDate(toDate) && getvalidDate(givenDate) >= getvalidDate(fromDate)
        },
        dayClicked(date, formatDate, nextDisabledDate) {
            /* eslint-disable-next-line */
            console.log(date, formatDate, nextDisabledDate)
        },
        checkInChanged(newDate) {
            this.newCheckInDate = newDate
        },
        checkOutChanged(newDate) {
            this.newCheckOutDate = newDate
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
html,
body {
    font-family: Roboto, 'Source Sans Pro', sans-serif;
    padding-bottom: 4em;
}
#app {
    text-align: center;
}
.container {
    max-width: 1180px;
    margin: 0 auto;
    /* text-align: left; */
}
.box {
    width: 100%;
    & h3 {
        background-color: gray;
        color: white;
        padding: 1em 0;
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

h1 {
    background-color: #28ca9c;
    color: white;
    padding: 1em 0;
    margin-top: 0;
}
</style>
