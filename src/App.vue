<template>
    <div id="app" style="margin: 0 auto;">
        <h1>Vue Hotel datepicker@2</h1>
        <div>
            <div class="box">
                <h3>
                    Show list of static bookings
                </h3>
                <DatePicker
                    :alwaysVisible="true"
                    :bookings="bookings"
                    :disableCheckoutOnCheckin="true"
                    :firstDayOfWeek="1"
                    :format="dateFormat"
                    :hoveringTooltip="false"
                    :i18n="en"
                    :lastDateAvailable="lastDateAvailable"
                    :minNights="1"
                    :showYear="true"
                    @bookingClicked="bookingClicked"
                    @periodSelected="periodSelected"
                    @handleCheckIncheckOutHalfDay="handleCheckIncheckOutHalfDay"
                />
            </div>
            <div class="box">
                <h3>
                    Calendar in full view
                </h3>
                <DatePicker
                    :disabledDates="[
                        '2020-07-15',
                        '2020-07-16',
                        '2020-07-17',
                        '2020-07-18',
                        '2020-07-19',
                        '2020-07-20',
                        '2020-07-21',
                        '2020-08-01',
                        '2020-08-02',
                        '2020-08-03',
                        '2020-08-04',
                        '2020-08-11',
                        '2020-08-12',
                        '2020-08-13',
                        '2020-08-14',
                        '2020-08-15',
                        '2020-08-16',
                        '2020-08-17',
                        '2020-08-18',
                    ]"
                    :alwaysVisible="true"
                    :format="dateFormat"
                    :lastDateAvailable="lastDateAvailable"
                    :minNights="minNights"
                    :i18n="en"
                    :showYear="true"
                    :firstDayOfWeek="1"
                    :disableCheckoutOnCheckin="true"
                    @handleCheckIncheckOutHalfDay="handleCheckIncheckOutHalfDay"
                />
            </div>
            <div class="box">
                <h3>
                    Show calendar on the right
                </h3>
                <DatePicker
                    :disabledDates="[
                        '2020-07-15',
                        '2020-07-16',
                        '2020-07-17',
                        '2020-07-18',
                        '2020-07-19',
                        '2020-08-15',
                        '2020-08-16',
                        '2020-08-17',
                        '2020-08-18',
                        '2020-08-19',
                        '2020-08-20',
                        '2020-08-21',
                        '2020-08-22',
                    ]"
                    :format="dateFormat"
                    :lastDateAvailable="lastDateAvailable"
                    :minNights="minNights"
                    :i18n="en"
                    :positionRight="true"
                    :showYear="true"
                    :firstDayOfWeek="1"
                    :disableCheckoutOnCheckin="true"
                    :periodDates="periodDates"
                    @handleCheckIncheckOutHalfDay="handleCheckIncheckOutHalfDay"
                />
            </div>
            <div class="box">
                <h3>
                    Hide grid style
                </h3>
                <DatePicker
                    :disabledDates="[
                        '2020-06-15',
                        '2020-06-16',
                        '2020-06-17',
                        '2020-06-18',
                        '2020-06-19',
                        '2020-06-20',
                        '2020-06-21',
                        '2020-07-01',
                        '2020-07-02',
                        '2020-07-03',
                        '2020-07-04',
                        '2020-07-11',
                        '2020-07-12',
                        '2020-07-13',
                        '2020-07-14',
                        '2020-07-15',
                        '2020-07-16',
                        '2020-07-17',
                        '2020-07-18',
                    ]"
                    :format="dateFormat"
                    :lastDateAvailable="lastDateAvailable"
                    :minNights="minNights"
                    :i18n="en"
                    :gridStyle="false"
                    :showYear="true"
                    :firstDayOfWeek="1"
                    :disableCheckoutOnCheckin="true"
                    :periodDates="periodDates"
                    @handleCheckIncheckOutHalfDay="handleCheckIncheckOutHalfDay"
                />
            </div>
            <div class="box">
                <h3>
                    Display one month only
                </h3>
                <DatePicker
                    :disabledDates="[
                        '2020-06-15',
                        '2020-06-16',
                        '2020-06-17',
                        '2020-06-18',
                        '2020-06-19',
                        '2020-06-20',
                        '2020-06-21',
                        '2020-07-01',
                        '2020-07-02',
                        '2020-07-03',
                        '2020-07-04',
                        '2020-07-11',
                        '2020-07-12',
                        '2020-07-13',
                        '2020-07-14',
                        '2020-07-15',
                        '2020-07-16',
                        '2020-07-17',
                        '2020-07-18',
                    ]"
                    :format="dateFormat"
                    :showSingleMonth="true"
                    :lastDateAvailable="lastDateAvailable"
                    :minNights="minNights"
                    :i18n="en"
                    :showYear="true"
                    :firstDayOfWeek="1"
                    :disableCheckoutOnCheckin="true"
                    :periodDates="periodDates"
                    @handleCheckIncheckOutHalfDay="handleCheckIncheckOutHalfDay"
                />
            </div>
            <div class="box">
                <h3>
                    Insert content with the content slot
                </h3>
                <DatePicker :lastDateAvailable="lastDateAvailable" show-year>
                    <!-- Insert content here -->
                    <div slot="content">
                        Hello
                    </div>
                </DatePicker>
            </div>
            <div class="box">
                <h3>
                    Last date available
                    <strong>lastDateAvailable</strong> props <br />
                </h3>
                <p>Stop pagination two years later</p>
                <DatePicker :lastDateAvailable="lastDateAvailable" />
            </div>
            <div class="box">
                <h3>Show prices with <strong>periodDates</strong></h3>
                <DatePicker
                    :showPrice="true"
                    :minNights="minNights"
                    :periodDates="periodDates"
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
                    @dayClicked="dayClicked"
                />
            </div>
            <div class="box">
                <h3>Half day, If you have check in at noon and checkout before noon</h3>
                <DatePicker
                    :minNights="0"
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
                <DatePicker :disableCheckoutOnCheckin="true" :minNights="0" />
            </div>
            <div class="box">
                <h3>Allow selection of single day</h3>
                <DatePicker :singleDaySelection="true" />
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
                <DatePicker :endDate="new Date(new Date().getFullYear(), 11, 31)" />
            </div>

            <div class="box">
                <h3>Block all dates after September 15th</h3>
                <DatePicker :endDate="new Date(new Date().getFullYear(), 8, 15)" />
            </div>

            <div class="box">
                <h3>Block all date ranges of more than 30 days</h3>
                <DatePicker :maxNights="30" :showBottomBar="false" :selectForward="false" />
            </div>

            <div class="box">
                <h3>Minimum stay of 3 days</h3>
                <DatePicker :minNights="3" :showBottomBar="true" />
            </div>

            <div class="box">
                <h3>Certain dates blocked</h3>
                <DatePicker :disabledDates="['2017-09-14', '2017-09-26']" :showCloseButton="true" />
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
                />
            </div>

            <div class="box">
                <h3>Checkin only on saturdays</h3>
                <DatePicker
                    :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
                    :enableCheckout="true"
                    :minNights="7"
                />
            </div>

            <div class="box">
                <h3>Custom tooltip text</h3>
                <DatePicker tooltipMessage="<strong style='color: red'>Enjoy</strong> your stay!" />
            </div>

            <div class="box">
                <h3>Show year</h3>
                <DatePicker :showYear="true" />
            </div>

            <div class="box">
                <h3>Custom date format with i18n (e.g.: pt-PT)</h3>
                <DatePicker :minNights="0" :singleDateSelection="true" format="MMMM D" :i18n="ptPT" />
            </div>

            <div class="box">
                <h3>Change the first day of the week to Monday</h3>
                <DatePicker
                    :i18n="{
                        night: 'Night',
                        nights: 'Nights',
                        'day-names': ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
                        'check-in': 'Check-in',
                        'check-out': 'Check-Out',
                        'month-names': [
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December',
                        ],
                    }"
                    :firstDayOfWeek="1"
                />
            </div>

            <div class="box">
                <h3>Set checkIn value</h3>
                <DatePicker
                    :i18n="{
                        night: 'Night',
                        nights: 'Nights',
                        'day-names': ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
                        'check-in': 'Check-in',
                        'check-out': 'Check-Out',
                        'month-names': [
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December',
                        ],
                    }"
                    :firstDayOfWeek="1"
                    :checkInValue="new Date()"
                />
            </div>

            <div class="box">
                <h3>Set checkOut value</h3>
                <DatePicker
                    :i18n="{
                        night: 'Night',
                        nights: 'Nights',
                        'day-names': ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
                        'check-in': 'Check-in',
                        'check-out': 'Check-Out',
                        'month-names': [
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December',
                        ],
                    }"
                    :firstDayOfWeek="1"
                    :checkInValue="new Date()"
                    :checkOutValue="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3)"
                />
            </div>

            <div class="box">
                <h3>Event CheckIn</h3>
                <DatePicker
                    :i18n="{
                        night: 'Night',
                        nights: 'Nights',
                        'day-names': ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
                        'check-in': 'Check-in',
                        'check-out': 'Check-Out',
                        'month-names': [
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December',
                        ],
                    }"
                    @check-in-changed="checkInChanged($event)"
                    @check-out-changed="checkOutChanged($event)"
                />

                new Check In Date : {{ newCheckInDate }} <br />
                new Check Out Date : {{ newCheckOutDate }}
            </div>
        </div>
    </div>
</template>

<script>
import DatePicker from './components/DatePicker/index.vue'

export default {
    components: {
        DatePicker,
    },
    data() {
        return {
            ptPT: {
                night: 'Noite',
                nights: 'Noites',
                'day-names': ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
                'check-in': 'Chegada',
                'check-out': 'Partida',
                'month-names': [
                    'Janeiro',
                    'Fevereiro',
                    'Março',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho',
                    'Agosto',
                    'Setembro',
                    'Outubro',
                    'Novembro',
                    'Dezembro',
                ],
                tooltip: {
                    halfDayCheckIn: 'Reservas possíveis',
                    halfDayCheckOut: 'Reservas possíveis',
                    saturdayToSaturday: 'Sábado a Sábado<br/> apenas',
                    sundayToSunday: 'Domingo a domingo<br/> apenas',
                    minimumRequiredPeriod: '%{minNightInPeriod} %{night} mínimo.',
                },
                week: 'semana',
                weeks: 'semanas',
            },
            frFR: {
                'check-in': 'Départ',
                'check-out': 'Arrivée',
                'day-names': ['lu', 'ma', 'me', 'je', 've', 'sa', 'di'],
                'month-names': [
                    'Janvier',
                    'Février',
                    'Mars',
                    'Avril',
                    'Mai',
                    'Juin',
                    'Juillet',
                    'Août',
                    'Septembre',
                    'Octobre',
                    'Novembre',
                    'Décembre',
                ],
                night: 'nuit',
                nights: 'nuits',
                tooltip: {
                    halfDayCheckIn: 'Réservation possible',
                    halfDayCheckOut: 'Réservation possible',
                    saturdayToSaturday: 'Du samedi au samedi<br/> uniquement',
                    sundayToSunday: 'Du dimanche au dimanche<br/> uniquement',
                    minimumRequiredPeriod: '%{minNightInPeriod} %{night} minimum',
                },
                week: 'semaine',
                weeks: 'semaines',
            },
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

<style>
body,
html {
    font-family: 'Source Sans Pro', sans-serif;
}

.box {
    width: 100%;
}
</style>
