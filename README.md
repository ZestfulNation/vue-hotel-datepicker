# vue-hotel-datepicker
A responsive date range picker for Vue.js that displays the number of nights selected and allow several useful options like custom check-in/check-out rules, localization support and more.


![demo gif](https://github.com/krystalcampioni/vue-hotel-datepicker/blob/master/demo_gif.gif?raw=true)


## Demo
[https://krystalcampioni.github.io/vue-hotel-datepicker/](https://krystalcampioni.github.io/vue-hotel-datepicker/)

## Installation

#### NPM

Install the package:

```
npm install vue-hotel-datepicker
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
<HotelDatePicker DatePickerID="01"/>
```


## Props/Options

### useDummyInputs
- Type: `Boolean`
- Default: `true`
This option hides the input and displays divs that act as dummy input fields. This allows us have an "active" state in the input that changes the placeholder text colour indicating which date is being selected.

### placeholder
- Type: `String`
- Default: `Check-in ► Check-out`
The input placeholder text (only used if dummy inputs are turned off)

### value
- Type: `String`
- Default: `' '`
The default value of the input

### format

- Type: `String`
- Default: `YYYY-MM-DD`

The date format string.

### infoFormat

- Type: `String`
- Default: `YYYY-MM-DD`

The date format string in the info box. If not set, it uses the `format` option.

### separator

- Type: `String`
- Default: ` ► `

The separator string used between date strings.

### startOfWeek

- Type: `String`
- Default: `sunday`

Default start week: `sunday` or `monday`.

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

### selectForward

- Type: `Boolean`
- Default: `false`

If `true`, the selection of the second date must be after the first date. If `false`, you can select a range of dates in both directions.

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

If `true`, allows the checkout on a disabled date. But with a criteria. Let's say we have these disabled dates: `03 April 2020` and `04 April 2020`. With this option enabled, an user can still select the first date (`03 April 2020`) for the checkout. But not `04 April 2020`.

### animationSpeed

- Type: `String`
- Default: `.5s`

The duration (in seconds) of the animation (open/close datepicker).

### hoveringTooltip

- Type: `Boolean` or `Function`
- Default: `true`

Shows a tooltip when hovering a date. It can be a custom function:

```js
hoveringTooltip: function(nights, startTime, hoverTime) {
    return nights;
}
```

### showBottomBar

- Type: `Boolean`
- Default: `true`

Show/hide the toolbar.

### showCloseButton
- Type: `Boolean`
- Default: `false`

Show/hide the close button.

### autoClose

- Type: `Boolean`
- Default: `true`

Close the datepicker after the selection of the second date.

### i18n

- Type: `Object`

Default:

```js
i18n: {
    selected: 'Your stay:',
    night: 'Night',
    nights: 'Nights',
    button: 'Close',
    'check-in': 'Check-In',
    'check-out': 'Check-Out',
    'day-names': ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
    'month-names': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    'error-more': 'Date range should not be more than 1 night',
    'error-more-plural': 'Date range should not be more than %d nights',
    'error-less': 'Date range should not be less than 1 night',
    'error-less-plural': 'Date range should not be less than %d nights',
    'info-more': 'Please select a date range longer than 1 night',
    'info-more-plural': 'Please select a date range longer than %d nights',
    'info-range': 'Please select a date range between %d and %d nights',
    'info-default': 'Please select a date range'
}
```

## Events

### dateChanged
Emited everytime a new date is selected, passing the new date and the previously selected date

## Contributing
Just submit a pull request explaining what you changed :)

## Credits
This componend was originally built as a Vue wrapper component for the [Hotel Datepicker](https://github.com/benitolopez/hotel-datepicker) by @benitolopez. It diverted from the original implementation though, implementing extra features (e.g. allowedRanges and dummyInputs) and removing others (e.g. topbar)
