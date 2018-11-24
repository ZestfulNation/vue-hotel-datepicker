[![Code Climate](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker/badges/gpa.svg)](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker/)
[![Issue Count](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker/badges/issue_count.svg)](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker)
[![dependencies Status](https://david-dm.org/krystalcampioni/vue-hotel-datepicker/status.svg)](https://david-dm.org/krystalcampioni/vue-hotel-datepicker) [![devDependencies Status](https://david-dm.org/krystalcampioni/vue-hotel-datepicker/dev-status.svg)](https://david-dm.org/krystalcampioni/vue-hotel-datepicker?type=dev)
[![npm](https://img.shields.io/npm/dt/vue-hotel-datepicker.svg)](vue-hotel-datepicker)
[![Build Status](https://travis-ci.org/krystalcampioni/vue-hotel-datepicker.svg?branch=master)](https://travis-ci.org/krystalcampioni/vue-hotel-datepicker)

# vue-hotel-datepicker
A responsive date range picker for Vue.js that displays the number of nights selected and allow several useful options like custom check-in/check-out rules, localisation support and more.


![demo gif](https://github.com/krystalcampioni/vue-hotel-datepicker/blob/master/demo.gif?raw=true)



## Demo
[https://krystalcampioni.github.io/vue-hotel-datepicker/](https://krystalcampioni.github.io/vue-hotel-datepicker/)

## Installation

#### NPM

Install the package:

```
npm install vue-hotel-datepicker --save
```

```javascript
import HotelDatePicker from 'vue-hotel-datepicker'

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

### allowedRanges
- Type: `Array`
- Default: `[]`

An array of numbers. Example: `[7,10,14]`.
After selecting the start date the calendar will be updated only allowing the checkout 7, 10 or 14 days after.

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

## singleDateSelection

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
}
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

### checkInChanged
Emitted every time a new check in date is selected with the new date as payload

### checkOutChanged
Emitted every time a new check out date is selected with the new date as payload

## Credits
This component was originally built as a Vue wrapper component for the [Hotel Datepicker](https://github.com/benitolopez/hotel-datepicker) by @benitolopez. Version 2.0.0 was completely rewritten with Vue, removing the original library, removing some features and introducing others.
