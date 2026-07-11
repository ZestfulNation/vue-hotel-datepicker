# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`vue-hotel-datepicker` is a Vue 2 date-range picker component library (npm package), originally a Vue wrapper for the vanilla-JS "Hotel Datepicker". It's published to npm and also has a demo app (`src/App.vue` + `src/main.js`) served locally and deployed to GitHub Pages.

Package manager is **pnpm** (see `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc`). Use `pnpm`, not `npm`/`yarn`, for installs.

## Commands

- `pnpm serve` — run the demo app locally (vue-cli-service serve) to manually exercise the datepicker.
- `pnpm build` (alias `build-package`) — builds the distributable library into `dist/` via `vue-cli-service build --target lib --name vueHotelDatepicker ./src/index.js`. This is what gets published to npm (`main` in package.json points at `dist/vueHotelDatepicker.common.js`).
- `pnpm test:unit` — runs the Jest unit test suite (`vue-cli-service test:unit`), tests live in `tests/unit/*.spec.js`.
  - Run a single test file: `pnpm test:unit tests/unit/datepicker.spec.js`
- `pnpm lint` — ESLint (`vue-cli-service lint`), config extends `@vue/airbnb` + `@vue/prettier` + `plugin:vue/essential`. Prettier formatting is enforced through eslint-plugin-prettier (see `.prettierrc.json`: no semicolons, single quotes, 2-space indent, `printWidth` 120).

There is no separate `format` script — formatting is enforced via `pnpm lint`.

## Architecture

### Entry points
- `src/index.js` — library entry point exported to consumers: default-exports `HotelDatePicker.vue` and named-exports the compiled `css`.
- `src/main.js` / `src/App.vue` — demo app entry point only, not shipped in the package.

### Component tree
```
HotelDatePicker.vue      (src/DatePicker/HotelDatePicker.vue) — all state & business logic
├── DateInput.vue         — the check-in/check-out text inputs shown above the calendar
└── Month.vue              — renders one calendar month grid
    ├── WeekRow.vue         — weekday header row
    └── Day.vue             — a single day cell
        ├── Price.vue        — optional per-day price display
        └── BookingBullet.vue — booking indicator/marker on a day
```

`HotelDatePicker.vue` is the single stateful component (~1300 lines). Almost everything — check-in/check-out selection, month pagination, disabled dates, bookings, `periodDates` pricing rules, half-day logic, tooltips, mobile touch/swipe handling, and desktop vs. mobile rendering — lives in its `data`/`computed`/`watch`/`methods`. Child components (`Month`, `Day`, `WeekRow`) are largely presentational and receive most of their data via `v-bind="$props"` / `options` pass-through from the parent rather than owning their own state. When changing calendar behavior, `HotelDatePicker.vue` is almost always the file to edit; `Day.vue` is where individual day styling/click rules live.

### Date helpers
`src/helpers.js` exports a plain object of pure(ish) functions (date arithmetic, month diff, ISO week numbers, day-of-week lookups, half-day/period comparisons, touch-swipe handling) that is spread into the `methods` of both `HotelDatePicker.vue` and `Month.vue` via `...Helpers`. Because these are mixed into `methods`, several rely on `this` (e.g. `pluralize` reads `this.i18n`) — they are not standalone utilities despite the module structure. Date formatting/parsing throughout the codebase uses the `fecha` library, not `Date` methods or `moment`.

### Key domain concepts
- **`periodDates`** — optional pricing/duration rules keyed by date ranges (`nightly`, `weekly_by_saturday`, `weekly_by_sunday`), each with a `minimumDuration` and optional `price`. Drives `minNightCount`/`dynamicNightCounts` and the tooltip text shown while hovering.
- **`bookings`** — pre-existing reservations rendered on the calendar (via `BookingBullet.vue`) and used to compute half-day check-in/check-out availability (`checkIncheckOutHalfDay`, built in `createHalfDayDates`).
- **half-day logic** — when `halfDay` is true, the day a booking/disabled-range starts or ends is only half-blocked (e.g. checkout-only in the morning, check-in-only in the afternoon); this is computed once in `createHalfDayDates` and consumed by `Day.vue` for styling/tooltips.
- Mobile vs. desktop is a **runtime-detected** state (`screenSize`, computed from `window.innerWidth`, updated on resize), not a CSS-only breakpoint — it changes which DOM branch renders (e.g. swipeable single-column list vs. two-month grid) and enables/disables touch listeners in `mounted()`/`destroyed()`.

### i18n
Translation objects live in `public/i18n/{en,es,fr,it,pt}.js` (used by the demo app) and a default set is baked into the component (`i18nDefaults` imported from `public/i18n/en` in `HotelDatePicker.vue`). Consumers override via the `i18n` prop; `configureI18n()` also feeds day/month names into `fecha`'s global i18n config, so `fecha.format` calls stay in sync with the `i18n` prop.

### Styling
SCSS lives in `src/assets/scss/` (`_variables.scss`, `_mixins.scss`, compiled via `index.scss`), exported from `src/index.js` as `css` and shipped separately as `dist/vueHotelDatepicker.css` — consumers must import it explicitly (it's not auto-injected).

## Notes
- This is a Vue **2** project (`vue-template-compiler`, Options API only, no Composition API/`setup()`).
- Some emitted events have deprecated camelCase duplicates kept for backwards compatibility (e.g. `bookingClicked` alongside `booking-clicked`, `periodSelected` alongside `period-selected`) — don't remove these without a major version bump.
- `disabledDaysOfWeek` (array of day names) is deprecated in favor of `disabledWeekDays` (object); both are still supported and merged into `disabledWeekDaysObject`.
