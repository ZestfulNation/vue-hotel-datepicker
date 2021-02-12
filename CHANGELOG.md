# Changelog

# v4.3:
- Improved price styling (fixed #264)
- Added price currency symbol string, for instance: '$', 'EUR'. The new prop is `priceSymbol`, default at empty string
# v4.2:
- Fixed #257: Disabled dates not updating when new dates are added
- New [CHANGELOG.md](CHANGELOG.md) file

# v4.1 - 2021-01-14
- correct configuration in i18n `fecha` package
- Italian added on demo (dev) page
- new prop `yearBeforeMonth`

# v4.0 - 2021-01-14

## Important Fixes!
* Now is working properly in mobile.

## Featured changes
* Language now is available in a folder with different translations available: es, en, pt, fr (ISO lang codes)
* New prop `disabledWeekDays`: An object with the following properties: `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, the value indicates if that day is disabled (true) or enabled (false).
* New event `next-month-rendered` (Beta 11)
* SCSS now in a separated file
* Dependencies updated.

## Documentation Improvements
* Props
* Events

## Featured changes
* **New Event** `next-month-rendered`, emitted every time the next month button is pressed and a new month is rendered.
* #201 UX improvements related to check-in selection.

## Deprecation
* Prop: `disabledDaysOfWeek`: use the new `disabledWeekDays` instead. `disabledWeekDays` and `disabledDaysOfWeek` both work but `disabledWeekDays` take precedence.
* Events: `bookingClicked`, `dayClicked`, `handleCheckIncheckOutHalfDay` and `periodSelected`,  now use kebab-case as recommended in Vue documentation (old names still works and will be removed in v5)

## Breaking changes
* `showYear` now is true by default
* `value`  now is `false` by default

## Other changes
* "npm" and "pnpm" lock files with version bump.
* PR #230: Use relative units instead of px
* PR #246: Dependencies fixes.
* PR #241: Add `price` argument to `periodDates` doc.
* PR #259: Dates become disabled when toggling month (`singleDaySelection`)
* Improvements
* value is Boolean as expected.
* Component renaming (src)
* fixed range highlight selection showing on "singleDaySelection"
* fixed `startingDateValue` cleared when open the datepicker.
* minor bug fixes
