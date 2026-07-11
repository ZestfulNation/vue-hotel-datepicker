# Changelog

# v5.0.0:
- **fix**: `priceDecimals` prop and related pricing display.
- **feat**: updated package exports and improved component registration (Vue plugin `install()`)
- **fix**: CommonJS build output renamed to `.cjs` extension
- **feat**: SCSS preprocessor options added to Vite configuration
- **refactor**: `DatePicker` component structure and props
- Accessibility: added `aria-label`s to next/previous month buttons
- Expanded unit test coverage

# v4.6.0 - 2022-12-29:
- Added `showWeekNumbers` prop to display ISO week numbers
- Dependency and packaging updates

# v4.5.1 - 2021-12-28:
- Bugfixes from merged PRs, including correct function called on date formatting (#502)

# v4.5 - 2021-09-09:
- Fix: don't create an extra month in `generateInitialMonths` when `showSingleMonth` is set
- Linting and version bump

# v4.4.3 - 2021-08-09:
- Fix: max nights not showing (#296)
- New `previous-month-rendered` event, emitted on every previous-month click
- New `check-in-selected` event
- Fix: `generateInitialMonths` creates only one month when `showSingleMonth` is set
- Fix: next month not rendering when the end date falls on that month in single month view

# v4.4.2 - 2021-07-16:
- Price can now be a string or a float
- New `priceDecimals` prop
- i18n assets added to `public`

# v4.4.1 - 2021-07-16:
- Price can now be a string or a float
- New `priceDecimals` prop

# v4.3.1 - 2021-06-25:
- Dependency security bumps (lodash, postcss, browserslist, ws, and others)
- Fix: mobile datepicker error (#269)

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
