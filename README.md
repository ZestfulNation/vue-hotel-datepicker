[![Code Climate](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker/badges/gpa.svg)](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker/)
[![Issue Count](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker/badges/issue_count.svg)](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker)
[![dependencies Status](https://david-dm.org/krystalcampioni/vue-hotel-datepicker/status.svg)](https://david-dm.org/krystalcampioni/vue-hotel-datepicker) [![devDependencies Status](https://david-dm.org/krystalcampioni/vue-hotel-datepicker/dev-status.svg)](https://david-dm.org/krystalcampioni/vue-hotel-datepicker?type=dev)
[![npm](https://img.shields.io/npm/dt/vue-hotel-datepicker.svg)](vue-hotel-datepicker)

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

### endDate

- Type: `Date` or `String` or `Boolean`
- Default: `false`

The end view date. All the dates after this date will be disabled.

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


### changeover

- Type: `String`
- Default: `null`

Flexible checkin and checkout setting, commonly used by cottage rental and hotel websites.
Different from disabled day, it's the rule property owner can specify if that day can checkin or checkout, rather than saying it's unavailable or not.
In this case, although one day may not allow checkin and checkout, it's not like disalbed day to block the following days.

Example: if startDate is `2017-11-01`, and changeover is `CXIOC`, you will see these days not selectable for checkin `2017-11-02, 2017-11-04`.
After select `2017-11-01` as checkin, these days will become not selectable for checkout `2017-11-02, 2017-11-03`, but it won't prevent you select any days after `2017-11-04`.
```
'C': allow checkin or checkout
'I': allow checkin only
'O': allow checkout only
'X': no checkin or checkout
```

## API

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
