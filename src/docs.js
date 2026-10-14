// Content for the Docs tab of the demo page. Mirrors the README.
// `example` links a prop to the demo scenario that shows it.

export const install = 'npm install vue-hotel-datepicker'

export const usage = `import HotelDatePicker from 'vue-hotel-datepicker'
import 'vue-hotel-datepicker/dist/vueHotelDatepicker.css'

export default {
  components: { HotelDatePicker },
}`

export const usageTemplate = '<HotelDatePicker :modelValue="true" />'

export const props = [
  {
    name: 'modelValue',
    type: 'Boolean',
    default: 'false',
    desc: 'The v-model prop. Controls the visibility of the date picker. Breaking change since v4, where it was `value`.',
  },
  {
    name: 'alwaysVisible',
    type: 'Boolean',
    default: 'false',
    desc: 'Shows the calendar in the page without needing to click the input.',
  },
  {
    name: 'bookings',
    type: 'Array',
    default: '[]',
    desc: 'Existing bookings to draw on the calendar. See Bookings below.',
  },
  {
    name: 'closeDatepickerOnClickOutside',
    type: 'Boolean',
    default: 'true',
    desc: 'Closes the date picker when the user clicks outside it. Set to `false` to control it with the methods below.',
  },
  {
    name: 'disableCheckoutOnCheckin',
    type: 'Boolean',
    default: 'false',
    desc: 'Disables check-out on the same day as check-in.',
    example: 'same-day',
  },
  {
    name: 'disabledDates',
    type: 'Array',
    default: '[]',
    desc: 'Strings in `YYYY-MM-DD` format. Every date in the list is disabled.',
    example: 'blocked',
  },
  {
    name: 'disabledDaysOfWeek',
    type: 'Array',
    default: '[]',
    desc: 'Day names to disable, such as `Monday`. Depends on the translated names.',
    deprecated: 'disabledWeekDays',
  },
  {
    name: 'disabledWeekDays',
    type: 'Object',
    default: '{}',
    desc: 'Keys `sunday` to `saturday`. A value of `true` disables that weekday; `false` enables it.',
    example: 'saturday',
  },
  {
    name: 'displayClearButton',
    type: 'Boolean',
    default: 'true',
    desc: 'Shows a clear button at the right of the input once dates are set.',
  },
  {
    name: 'enableCheckout',
    type: 'Boolean',
    default: 'false',
    desc: 'Allows check-out on a disabled date.',
    example: 'saturday',
  },
  {
    name: 'endDate',
    type: 'Date | String | Number',
    default: 'Infinity',
    desc: 'The last selectable date. Everything after it is disabled.',
    example: 'end-of-year',
  },
  {
    name: 'endingDateValue',
    type: 'Date',
    default: 'null',
    desc: 'The initial check-out date.',
    example: 'default-range',
  },
  {
    name: 'firstDayOfWeek',
    type: 'Number',
    default: '0',
    desc: 'Sunday is 0, Monday is 1, up to Saturday as 6. Set the matching order in `i18n.day-names` too.',
  },
  {
    name: 'format',
    type: 'String',
    default: "'YYYY-MM-DD'",
    desc: 'The date format, using dayjs tokens.',
    example: 'format',
  },
  { name: 'gridStyle', type: 'Boolean', default: 'true', desc: 'When `false`, hides the grid lines around days.' },
  {
    name: 'halfDay',
    type: 'Boolean',
    default: 'true',
    desc: 'Allows check-in at noon on the day a previous booking checks out before noon.',
    example: 'half-day',
  },
  {
    name: 'hoveringTooltip',
    type: 'Boolean | Function',
    default: 'true',
    desc: 'Shows a tooltip with the number of nights while hovering a date.',
  },
  { name: 'i18n', type: 'Object', default: 'English', desc: 'Translations for the picker. See Translations below.' },
  {
    name: 'lastDateAvailable',
    type: 'Number | Date',
    default: 'Infinity',
    desc: 'Stops calendar pagination after the month of this date.',
  },
  {
    name: 'maxNights',
    type: 'Number',
    default: 'null',
    desc: 'The longest selectable stay. `0` or `null` means no limit.',
    example: 'max-stay',
  },
  {
    name: 'minNights',
    type: 'Number',
    default: '1',
    desc: 'The shortest selectable stay.',
    example: 'min-stay',
  },
  {
    name: 'periodDates',
    type: 'Array',
    default: '[]',
    desc: 'Periods with their own minimum stay, type or price. See Period dates below.',
  },
  {
    name: 'positionRight',
    type: 'Boolean',
    default: 'false',
    desc: 'Opens the calendar to the right of the input.',
  },
  {
    name: 'priceDecimals',
    type: 'Number',
    default: '0',
    desc: 'Decimals shown in prices for weekly periods.',
  },
  {
    name: 'priceSymbol',
    type: 'String',
    default: "''",
    desc: 'Symbol placed before the price when `showPrice` is on and a period has a `price`.',
  },
  {
    name: 'showPrice',
    type: 'Boolean',
    default: 'false',
    desc: 'Displays the `price` of each period from `periodDates`.',
  },
  { name: 'showSingleMonth', type: 'Boolean', default: 'false', desc: 'Displays one month instead of two.' },
  { name: 'showWeekNumbers', type: 'Boolean', default: 'false', desc: 'Displays ISO week numbers.' },
  { name: 'showYear', type: 'Boolean', default: 'true', desc: 'Shows the year next to the month name.' },
  {
    name: 'singleDaySelection',
    type: 'Boolean',
    default: 'false',
    desc: 'Selects one day instead of a range.',
    example: 'single-day',
  },
  {
    name: 'startDate',
    type: 'Date | String',
    default: 'new Date()',
    desc: 'The first selectable date. Everything before it is disabled.',
  },
  {
    name: 'startingDateValue',
    type: 'Date',
    default: 'null',
    desc: 'The initial check-in date.',
    example: 'check-in-only',
  },
  {
    name: 'tooltipMessage',
    type: 'String',
    default: 'null',
    desc: 'Replaces the default “X nights” tooltip. Accepts HTML.',
    example: 'tooltip',
  },
  {
    name: 'yearBeforeMonth',
    type: 'Boolean',
    default: 'false',
    desc: 'Puts the year before the month. Only applies when `showYear` is `true`.',
  },
]

export const periodKeys = [
  { key: 'startAt', type: 'String', desc: '`YYYY-MM-DD`.' },
  { key: 'endAt', type: 'String', desc: '`YYYY-MM-DD`.' },
  {
    key: 'minimumDuration',
    type: 'Number',
    desc: 'Minimum stay. Counted in nights for `nightly` and in weeks for the weekly types.',
  },
  { key: 'periodType', type: 'String', desc: '`nightly`, `weekly_by_saturday` or `weekly_by_sunday`.' },
  { key: 'price', type: 'Number', desc: 'Price shown on each day of the period.' },
]

export const periodExample = `periodDates: [
  {
    startAt: '2020-06-09',
    endAt: '2020-07-26',
    minimumDuration: 4,
    periodType: 'nightly',
  },
  {
    startAt: '2020-07-26',
    endAt: '2020-09-30',
    minimumDuration: 1,
    periodType: 'weekly_by_saturday',
  },
  {
    startAt: '2020-09-30',
    endAt: '2020-11-30',
    minimumDuration: 2,
    periodType: 'weekly_by_sunday',
    price: 4000.0,
  },
]`

export const bookingKeys = [
  { key: 'checkInDate', type: 'String', desc: '`YYYY-MM-DD`.' },
  { key: 'checkOutDate', type: 'String', desc: '`YYYY-MM-DD`.' },
  { key: 'style', type: 'Object', desc: 'Inline style for the booking marker, such as `backgroundColor`.' },
]

export const bookingsExample = `bookings: [
  {
    event: true,
    checkInDate: '2020-08-26',
    checkOutDate: '2020-08-29',
    style: { backgroundColor: '#399694' },
  },
  {
    event: false,
    checkInDate: '2020-07-01',
    checkOutDate: '2020-07-08',
    style: { backgroundColor: '#9DC1C9' },
  },
]`

export const events = [
  {
    name: 'booking-clicked',
    params: 'MouseEvent, Date, Object',
    desc: 'A booking was clicked. Receives the mouse event, the clicked date and the booking.',
  },
  { name: 'check-in-changed', params: 'Date', desc: 'A new check-in date was selected.' },
  { name: 'check-out-changed', params: 'Date', desc: 'A new check-out date was selected.' },
  { name: 'clear-selection', params: '', desc: 'The clear button was clicked.' },
  {
    name: 'day-clicked',
    params: 'Date, String, Date | Number | String',
    desc: 'A day was clicked. Receives the date, its formatted string and the next disabled date.',
  },
  {
    name: 'handle-checkin-checkout-half-day',
    params: 'Object',
    desc: 'Emitted before mount, on clear and on check-out. Receives an object with the check-in and check-out dates.',
  },
  { name: 'next-month-rendered', params: '', desc: 'The next month was rendered.' },
  {
    name: 'period-selected',
    params: 'Event, Date, Date',
    desc: 'A check-out was clicked. Receives the mouse event, the check-in and the check-out.',
  },
]

export const methods = [
  { name: 'showDatepicker', desc: 'Shows the datepicker.' },
  { name: 'hideDatepicker', desc: 'Hides the datepicker.' },
  { name: 'toggleDatepicker', desc: 'Shows the datepicker if hidden, hides it if shown.' },
]

export const methodsNote =
  'To open or close the picker from your own button, set `closeDatepickerOnClickOutside` to `false` and call these methods through a template ref.'

export const i18nExample = `i18n: {
  night: 'Night',
  nights: 'Nights',
  week: 'week',
  weeks: 'weeks',
  'day-names': ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
  'check-in': 'Check-in',
  'check-out': 'Check-out',
  'month-names': [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
  tooltip: {
    halfDayCheckIn: 'Available CheckIn',
    halfDayCheckOut: 'Available CheckOut',
    saturdayToSaturday: 'Only Saturday to Saturday',
    sundayToSunday: 'Only Sunday to Sunday',
    minimumRequiredPeriod: '%{minNightInPeriod} %{night} minimum.',
  },
}`

export const sections = [
  { id: 'install', title: 'Install' },
  { id: 'props', title: 'Props' },
  { id: 'period-dates', title: 'Period dates' },
  { id: 'bookings', title: 'Bookings' },
  { id: 'events', title: 'Events' },
  { id: 'methods', title: 'Methods' },
  { id: 'translations', title: 'Translations' },
]
