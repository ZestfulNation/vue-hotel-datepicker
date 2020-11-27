[![dependencies Status](https://david-dm.org/krystalcampioni/vue-hotel-datepicker/status.svg)](https://david-dm.org/krystalcampioni/vue-hotel-datepicker) [![devDependencies Status](https://david-dm.org/krystalcampioni/vue-hotel-datepicker/dev-status.svg)](https://david-dm.org/krystalcampioni/vue-hotel-datepicker?type=dev)
[![npm](https://img.shields.io/npm/dt/vue-hotel-datepicker.svg)](vue-hotel-datepicker)
[![Build Status](https://travis-ci.org/krystalcampioni/vue-hotel-datepicker.svg?branch=main)](https://travis-ci.org/krystalcampioni/vue-hotel-datepicker)

A responsive date range picker for Vue.js that displays the number of nights selected and allow several useful options like custom check-in/check-out rules, localisation support and more.


![demo gif](https://github.com/krystalcampioni/vue-hotel-datepicker/blob/main/demo.gif?raw=true)



## Demo
[https://krystalcampioni.github.io/vue-hotel-datepicker/](https://krystalcampioni.github.io/vue-hotel-datepicker/)

## Installation

#### NPM

```bash
npm install vue-hotel-datepicker
```

#### PNPM

```bash
pnpm install vue-hotel-datepicker
```

#### YARN

```bash
yarn add vue-hotel-datepicker
```


```javascript
import HotelDatePicker from 'vue-hotel-datepicker'
import 'vue-hotel-datepicker/dist/vueHotelDatepicker.css';

export default {
  components: {
    HotelDatePicker,
  },
}
```

```html
<HotelDatePicker />
```


## Props/Options

### lastDateAvailable
- Type: `Date`
- Default: `null`

Allows to stop calendar pagination after the month of that date

### halfDay

- Type: `Boolean`
- Default: `true`

Allows to have half a day, if you have check in at noon and checkout before noon

### format

- Type: `String`
- Default: `YYYY-MM-DD`

The date format string.

### startDate

- Type: `Date` or `String`
- Default: `new Date()`

The start view date. All the dates before this date will be disabled.

### startingDateValue

- Type: `Date`
- Default: `null`

The initial value of the start date.

### endDate

- Type: `Date` or `String` or `Boolean`
- Default: `false`

The end view date. All the dates after this date will be disabled.

### endingDateValue

- Type: `Date`
- Default: `null`

The initial value of the end date.

### firstDayOfWeek

- Type: `Number`
- Default: `0`

The first day of the week. Where Sun = 0, Mon = 1, ... Sat = 6.

You need to set the right order in `i18n.day-names` too.

### minNights

- Type: `Number`
- Default: `1`

Minimum nights required to select a range of dates.

### maxNights

- Type: `Number`
- Default: `0`

Maximum nights required to select a range of dates.

### disabledDates

- Type: `Array`
- Default: `[]`

An array of strings in this format: `YYYY-MM-DD`. All the dates passed to the list will be disabled.

### disabledDaysOfWeek

- Type: `Array`
- Default: `[]`

An array of strings in this format: `['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']`. All the days passed to the list will be disabled.

### enableCheckout

- Type: `Boolean`
- Default: `false`

If `true`, allows the checkout on a disabled date.


### hoveringTooltip

- Type: `Boolean` or `Function`
- Default: `true`

Shows a tooltip with the number of nights when hovering a date.

### tooltipMessage

- Type: `String`
- Default `null`

If provided, it will override the default tooltip "X nights" with the text provided. You can use HTML in the string.

## singleDaySelection

- Type `boolean`
- Default `false`

## monthFormat

- Type `String`
- Default `MMMM YYYY`

The month format string.

## closeDatepickerOnClickOutside
- Type: `boolean`
- Default: `true`

## displayClearButton
- Type: `boolean`
- Default: `true`

If set to true, displays a clear button on the right side of the input if there are dates set

## disableCheckoutOnCheckin
- Type: `boolean`
- Default: `false`

If set to true, disable checkout on the same date has checkin

### i18n

- Type: `Object`

Default:

```js
i18n: {
  "night": "Night",
  "nights": "Nights",
  "week": "week",
  "weeks": "weeks",
  "day-names": ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
  "check-in": "Check-in",
  "check-out": "Check-out",
  "month-names": [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
  ],
  "tooltip": {
      "halfDayCheckIn": "Available CheckIn",
      "halfDayCheckOut": "Available CheckOut",
      "saturdayToSaturday": "Only Saturday to Saturday",
      "sundayToSunday": "Only Sunday to Sunday",
      "minimumRequiredPeriod": "%{minNightInPeriod} %{night} minimum.",
  },
}
```

### periodDates
- Type: `Array`
- Default: `[]`

If you want to have specific startAt and endAt period with different duration or price or type of period-

Key                                  | Type       | Description
-------------------------------------|------------|-------------------------
  endAt                              | String     | YYYY-MM-DD
  startAt                            | String     | YYYY-MM-DD
  minimumDuration                    | Number     | Minimum stay (Type: weekly => per_week | Type: nightly => per night)
  periodType                         | String     | *nightly*, *weekly_by_saturday*, *weekly_by_sunday*
  price                              | Float      | Price displayed on each day for this period


Example:
```js
periodDates: [
  {
    startAt: "2020-06-09",
    endAt: "2020-07-26",
    minimumDuration: 4,
    periodType: "nightly"
  },
  {
    startAt: "2020-07-26",
    endAt: "2020-09-30",
    minimumDuration: 1,
    periodType: "weekly_by_saturday"
  },
  {
    startAt: "2020-09-30",
    endAt: "2020-11-30",
    minimumDuration: 2,
    periodType: "weekly_by_sunday",
    price: 4000.0
  }
],
```

#### `MinimumDuration` with a periodType `weekly-~` equals to a week

### showPrice

- Type: `Boolean`
- Default: `false`

If set to true, displays a price contains on your periodDates

### showSingleMonth

- Type: `Boolean`
- Default: `false`

If set to true, display one month only

### gridStyle

- Type: `Boolean`
- Default: `true`

**Show** or **hide** a grid around the days

### positionRight

- Type: `Boolean`
- Default: `false`

Display calendar on the **right** or the **left** of the input (left by default)

### alwaysVisible
- Type: `Boolean`
- Default: `false`

Display calendar in the page without an input

### bookings
- Type: `Array`
- Default: `[]`

If you want to show bookings

Key                                   | Type        | Description
--------------------------------------|-------------|-------------------------
  checkInDate                         | String      | YYYY-MM-DD
  checkOutDate                        | String      | YYYY-MM-DD
  style                               | Object      | Style, (see the example)

Example:
```js
bookings: [
  {
    event: true,
    checkInDate: "2020-08-26",
    checkOutDate: "2020-08-29",
    style: {
      backgroundColor: "#399694"
    }
  },
  {
    event: false,
    checkInDate: "2020-07-01",
    checkOutDate: "2020-07-08",
    style: {
      backgroundColor: "#9DC1C9"
    }
  }
],
```


## API
⚠️ In order to open/close the datepicker from an external element, such as a button make sure to set `closeDatepickerOnClickOutside` to false

### hideDatepicker()

Hide datepicker

### showDatepicker()

Show datepicker

### toggleDatepicker()

Toggle datepicker

## Events

### dayClicked
Emitted every time when day is clicked

Params:
name                                 | Description
-------------------------------------|-------------------------
  date                               | new Date()
  formatDate                         | YYYY-MM-DD
  nextDisabledDate                   | Date, Number, String

### checkInChanged
Emitted every time a new check in date is selected with the new date as payload

### checkOutChanged
Emitted every time a new check out date is selected with the new date as payload

### clearSelection
Emitted every time you clicked on clearDate button

### handleCheckIncheckOutHalfDay
Emitted on [beforeMount, clearSelection, checkOut]

Params:
name                                 | Description
-------------------------------------|-------------------------
  checkIncheckOutHalfDay             | Object of checkinCheckout date

### bookingClicked
Emitted every time a booking is clicked

Params:
name                | Type       | Description
--------------------|------------|------------
  event             | MouseEvent | Mouse javascript event
  date              | Date       | Clicked Date
  currentBooking    | Object     | Clicked Booking

Example of currentBooking:
```js
{
  checkInDate: "YYYY-MM-DD",
  checkOutDate: "YYYY-MM-DD",
  style: {
    backgroundColor: "#399694",
  }
}
```

### periodSelected
Emitted every time when a checkOut is clicked

Params:
name                | Type       | Description
--------------------|------------|------------
  event             | MouseEvent | Mouse javascript event
  checkIn           | Date       | checkIn
  checkIn           | Date       | checkOut



## Credits
This component was originally built as a Vue wrapper component for the [Hotel Datepicker](https://github.com/benitolopez/hotel-datepicker) by @benitolopez. Version 2.0.0 was completely rewritten with Vue, removing the original library, removing some features and introducing others.
