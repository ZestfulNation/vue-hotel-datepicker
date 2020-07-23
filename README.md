[![Code Climate](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker/badges/gpa.svg)](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker/)
[![Issue Count](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker/badges/issue_count.svg)](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker)
[![dependencies Status](https://david-dm.org/krystalcampioni/vue-hotel-datepicker/status.svg)](https://david-dm.org/krystalcampioni/vue-hotel-datepicker) [![devDependencies Status](https://david-dm.org/krystalcampioni/vue-hotel-datepicker/dev-status.svg)](https://david-dm.org/krystalcampioni/vue-hotel-datepicker?type=dev)
[![npm](https://img.shields.io/npm/dt/vue-hotel-datepicker.svg)](vue-hotel-datepicker)
[![Build Status](https://travis-ci.org/krystalcampioni/vue-hotel-datepicker.svg?branch=master)](https://travis-ci.org/krystalcampioni/vue-hotel-datepicker)

# Release 0.9.2
https://github.com/joffreyBerrier/vue-hotel-datepicker/releases/tag/0.5.7

# vue-hotel-datepicker@2

👊👊👊An easier Calendar in Vue.js 👊👊👊

------------

## What I did:
https://github.com/joffreyBerrier/vue-hotel-datepicker/projects/1?fullscreen=true

------------

* forked https://github.com/krystalcampioni/vue-hotel-datepicker
* Use vue-cli
* Remove the pug html, use html
* Remove some useless dependencies
* Rewrite code
  * Add eslint airbnb + prettier
  * Remove useless condition like empty if or else
  * Add return for all computed
  * Add a bind key on `v-for`
  * Rewrite jest test
  * Remove v-html / v-text use `{{ }}`
* Add emit when clearSelection
* Remove querySelector, use refs
* Fix bug: impossible to open the calendar when clearselection is triggered
* Allow to have half a day, in order to enable checkIn on a checkOut day
* Refacto the paginate infinite scroll on mobile
* Prevent checkOut on the same day as checkIn
* Add periodDates array for specific periods with different minimumStay / Price or periodType
* Show price of your Object periodDates
* Review style
* Add a `--hovering` class
* When there are checkIn and checkOut => Click on new date makes a new checkIn and clears checkOut
* If there is a periodDates, automatically update minNights
* Create a *not allowed* status which is different from the *disabled* status
  * NotAllowed inside a weekly period
  * NotAllowed inside a nightly period right before a weekly period (to respect min nights)
* Remove useless props on the DateInput component
* Change `<span>` to `<button>` on pagination and put a `disabled` attribute when activeMonthIndex equal to 0
* Fix disable calcul of minNightsCount when checkout
* Add the lastDateAvailable
* Create a content slot
* Mobile:
  * CheckIn - CheckOut scroll to current month
* If CheckIn, click on CheckIn clearSelection
* Review the style of the modal cross
* Rewrite the ReRender function
* Rewrite the clickOnDay function
* Rewrite the clickOutside function
* Create a dynamic array for disabled dates of the nextPeriod
* Sort in ascending order periodDates (startAt)
* Add handleCheckIncheckOutHalfDay to get a checkIncheckOutHalfDay
* Rethink UI/UX of the calendar thank's to *Elsa Morand*
  - Cancel prefill disabled days
  - Review the tooltip on mobile
  -- Remove the tooltip on mobile, show the content text at the top of the calendar to display several types of messages according to your needs.
  - Review the tooltip on desktop
  -- How the tooltip appears
  - Add some i18n translations
  ```
  tooltip: {
    halfDayCheckIn: "Available CheckIn",
    halfDayCheckOut: "Available CheckOut",
    saturdayToSaturday: "Only Saturday to Saturday",
    sundayToSunday: "Only Sunday to Sunday",
    minimumRequiredPeriod: "A minimum of <br/> %{minNightInPeriod} %{night} is required."
  },
  ```
* Add `showSingleMonth` which allows to show 1 month
* Trigger `window.resize` on desktop, mobile, tablet
* Add `event clicked Esc` for `clearSelection`
* Add `invalid` class on checkIn date
* Breakings changes: removed `allowedRanges`, use `periods` if you want to have a range of disableDates
* Refactoring *tooltip*, show on *hover* / show on *click*
* Review the tooltips when there is periods array #50
* Display the calendar in full size without input #61
* Add a range of bookings #65

------------

## What I will improve

------------

project: https://github.com/joffreyBerrier/vue-hotel-datepicker/projects/1?fullscreen=true

------------

A responsive date range picker for Vue.js that displays the number of nights selected and allow several useful options like custom check-in/check-out rules, localisation support and more.


![demo gif](https://github.com/krystalcampioni/vue-hotel-datepicker/blob/master/demo.gif?raw=true)



## Demo
[https://krystalcampioni.github.io/vue-hotel-datepicker/](https://krystalcampioni.github.io/vue-hotel-datepicker/)

## Installation

#### NPM

Install the package:

```
npm install vue-hotel-datepicker2 --save
```

```javascript
import HotelDatePicker from 'vue-hotel-datepicker2'
import 'vue-hotel-datepicker2/dist/vueHotelDatepicker2.css';

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

## showYear

- Type `boolean`
- Default `false`

Shows the year next to the month

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
  night: 'Night',
  nights: 'Nights',
  'day-names': ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
  'check-in': 'Check-in',
  'check-out': 'Check-Out',
  'month-names': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  tooltip: {
    halfDayCheckIn: "Available CheckIn",
    halfDayCheckOut: "Available CheckOut",
    saturdayToSaturday: "Only Saturday to Saturday",
    sundayToSunday: "Only Sunday to Sunday",
    minimumRequiredPeriod: "A minimum of <br/> %{minNightInPeriod} %{night} is required."
  },
  week: "week",
  weeks: "weeks",
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
  triggerEvent                        | Boolean     | If you want to trigger a click
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
--------------------|-------------------------
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
    triggerEvent: true
  }
}
```

### periodSelected
Emitted every time when a checkOut is clicked

name                | Type       | Description
--------------------|-------------------------
  event             | MouseEvent | Mouse javascript event
  checkIn           | Date       | checkIn
  checkIn           | Date       | checkOut



## Credits
This component was originally built as a Vue wrapper component for the [Hotel Datepicker](https://github.com/benitolopez/hotel-datepicker) by @benitolopez. Version 2.0.0 was completely rewritten with Vue, removing the original library, removing some features and introducing others.
