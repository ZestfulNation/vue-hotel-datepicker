# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm serve          # dev server (App.vue demo), via Vite
pnpm build          # build library to dist/ (cjs, es, umd), via Vite lib mode
pnpm test:unit      # run all Vitest tests once
pnpm test:unit:watch # run Vitest in watch mode
pnpm lint           # ESLint (vue3-essential + prettier) over src and tests
```

Run a single test file (Vitest filters by filename substring, not `--testPathPattern`):
```bash
pnpm test:unit -- datepickerDay
```

Use **pnpm** (not npm/yarn) — a `pnpm-workspace.yaml` and `pnpm-lock.yaml` are present.

## Architecture

This is a **Vue 3** date range picker published as a library, built with **Vite** (`vite.config.js`, lib mode). It produces `dist/vueHotelDatepicker.common.js` (cjs), `.es.js`, and `.umd.js`. `src/index.js` is the library entry point and registers the component via a Vue plugin `install()`.

### Component tree

```
HotelDatePicker.vue       ← root, owns all state (checkIn, checkOut, months[], isOpen, …)
  DateInput.vue           ← check-in / check-out text inputs
  Month.vue               ← renders one calendar month, delegates all props downward
    WeekRow.vue           ← day-name header row
    Day.vue               ← single day cell; all CSS class logic lives here
      Price.vue           ← optional price display inside a day cell
      BookingBullet.vue   ← coloured dot overlay for booked ranges
```

### State flow

All state lives in `HotelDatePicker`. Props flow down through `Month` → `Day` unchanged (`Month` and `Day` templates use `v-bind="$props"` to pass everything through). Events bubble back up: `day-clicked` → `Month.handleDayClick` → `HotelDatePicker.handleDayClick`.

The picker uses the Vue 3 `v-model` convention: the prop is `modelValue` (not `value`) and it emits `update:modelValue`. `modelValue` controls whether the picker is rendered at all (`v-if="modelValue"` on the root). Visibility within the rendered picker is the separate `isOpen` computed (with get/set).

### Shared helpers

`src/helpers.js` exports a plain object of date utility functions (`addDays`, `getNextMonth`, `validateDateBetweenTwoDates`, `getIsoWeek`, etc.). `HotelDatePicker`, `Month`, and `Day` all mixin it via `methods: { ...Helpers }`.

### Styling

All CSS classes use the `vhd__` prefix. Styles live in `src/assets/scss/index.scss` (single file, SCSS variables/mixins in `_variables.scss` / `_mixins.scss`). Responsive breakpoints: phone < 480px, tablet 480–767px, desktop ≥ 768px. `isDesktop` in `HotelDatePicker` maps to the 768px threshold and is derived from a `screenSize` value (`smartphone`/`tablet`/`desktop`) tracked on window resize.

### i18n

Default English strings are in `public/i18n/en.js` and imported as the default for the `i18n` prop. Additional locale files (es, fr, it, pt) are in the same directory. The `fecha` library is used for date formatting and its global i18n is set in `configureI18n()` whenever the `i18n` prop changes.

### Period types

`periodDates` entries can be `nightly`, `weekly_by_saturday`, or `weekly_by_sunday`. Weekly periods enforce checkout only on that specific day. The `minimumDuration` for weekly periods is in **weeks** (multiplied by 7 internally), while for nightly it is in nights.

### CSS class naming on Day

`Day.vue` computes several class strings in parallel computed properties (`dayClass`, `disabledClass`, `checkinCheckoutClass`, `bookingClass`, `halfDayClass`) that are all applied simultaneously. When debugging visual states, check all five.

### Tests

Tests use `@vue/test-utils`' `shallowMount` with Chai's `expect` (not Vitest's built-in `expect`), running under `jsdom` (configured in the `test` block of `vite.config.js`). Test files live in `tests/unit/` and import components via the `@` alias (mapped to `src/` in `vite.config.js`).
