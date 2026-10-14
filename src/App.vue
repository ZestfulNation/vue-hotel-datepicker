<template>
  <div class="demo">
    <header class="masthead">
      <div class="masthead__brand">
        <span class="masthead__plate" aria-hidden="true">5</span>
        <div>
          <h1>vue-hotel-datepicker</h1>
          <p>A date range picker for Vue 3 that counts nights, enforces stay rules and speaks six languages.</p>
        </div>
      </div>
      <div class="masthead__tools">
        <button class="install" type="button" @click="copy('npm install vue-hotel-datepicker', 'install')">
          <code>npm install vue-hotel-datepicker</code>
          <span>{{ copied === 'install' ? 'Copied' : 'Copy' }}</span>
        </button>
        <label class="lang">
          <span>Language</span>
          <select v-model="language">
            <option v-for="{ name, code } in sortedLanguages" :key="code" :value="code">{{ name }}</option>
          </select>
        </label>
        <a class="link" href="https://github.com/ZestfulNation/vue-hotel-datepicker">GitHub</a>
        <a class="link" href="https://www.npmjs.com/package/vue-hotel-datepicker">npm</a>
      </div>
    </header>

    <div class="layout">
      <nav class="index" :class="{ 'index--open': menuOpen }" aria-label="Examples">
        <button class="index__toggle" type="button" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
          <span>{{ current.title }}</span>
          <span aria-hidden="true">{{ menuOpen ? '–' : '+' }}</span>
        </button>
        <div class="index__list">
          <section v-for="group in groups" :key="group.name">
            <h2>{{ group.name }}</h2>
            <ul>
              <li v-for="s in group.items" :key="s.id">
                <button type="button" :class="{ active: s.id === activeId }" @click="select(s.id)">
                  {{ s.title }}
                </button>
              </li>
            </ul>
          </section>
        </div>
      </nav>

      <main class="stage">
        <div class="stage__head">
          <p class="eyebrow">{{ current.group }}</p>
          <h2>{{ current.title }}</h2>
          <p class="stage__blurb">{{ current.blurb }}</p>
        </div>

        <div v-if="current.id === 'sandbox'" class="sandbox">
          <fieldset v-for="box in sandboxGroups" :key="box.legend">
            <legend>{{ box.legend }}</legend>
            <label v-for="t in box.toggles" :key="t.key" class="toggle">
              <input type="checkbox" v-model="sandbox[t.key]" />
              <span>{{ t.label }}</span>
              <code>{{ t.key }}</code>
            </label>
            <label v-if="box.legend === 'Pricing & rules'" class="field">
              <span>Minimum nights</span>
              <input type="number" min="1" max="30" v-model.number="sandbox.minNights" />
            </label>
          </fieldset>
        </div>

        <div class="card">
          <div class="card__rail" aria-hidden="true">
            <span>Reservation</span>
          </div>
          <div class="card__body">
            <HotelDatePicker
              :key="pickerKey"
              v-bind="pickerProps"
              :modelValue="true"
              :i18n="i18n"
              @check-in-changed="onCheckIn"
              @check-out-changed="onCheckOut"
              @day-clicked="onDayClicked"
              @clear-selection="onClear"
              @period-selected="onPeriod"
            >
              <template v-if="current.id === 'sandbox' && sandbox.showContentSlot" #content>
                <div class="slot-demo">Content slot — render anything under the calendar.</div>
              </template>
            </HotelDatePicker>
          </div>
        </div>
      </main>

      <aside class="folio" aria-label="Code and events">
        <section>
          <div class="folio__title">
            <h3>Props</h3>
            <button type="button" @click="copy(snippet, 'snippet')">
              {{ copied === 'snippet' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <pre class="code"><code>{{ snippet }}</code></pre>
        </section>
        <section>
          <div class="folio__title">
            <h3>Stay</h3>
          </div>
          <dl class="stay">
            <div>
              <dt>Check-in</dt>
              <dd :class="{ empty: !checkIn }">{{ shown(checkIn) }}</dd>
            </div>
            <div>
              <dt>Check-out</dt>
              <dd :class="{ empty: !checkOut }">{{ shown(checkOut) }}</dd>
            </div>
            <div>
              <dt>Nights</dt>
              <dd :class="{ empty: nights === null }">{{ nights === null ? '—' : nights }}</dd>
            </div>
          </dl>
        </section>
        <section>
          <div class="folio__title">
            <h3>Events</h3>
            <button type="button" @click="log = []" :disabled="!log.length">Clear</button>
          </div>
          <ol class="log" v-if="log.length">
            <li v-for="e in log" :key="e.id">
              <time>{{ e.time }}</time>
              <code>{{ e.name }}</code>
              <span>{{ e.detail }}</span>
            </li>
          </ol>
          <p v-else class="log__empty">Pick a date. Each event the picker emits is listed here.</p>
        </section>
      </aside>
    </div>
  </div>
</template>

<script>
import './assets/scss/index.scss'
import HotelDatePicker from './DatePicker/HotelDatePicker.vue'
import pt from './assets/i18n/pt'
import fr from './assets/i18n/fr'
import en from './assets/i18n/en'
import es from './assets/i18n/es'
import es_419 from './assets/i18n/es-419'
import it from './assets/i18n/it'

const DAY = 24 * 60 * 60 * 1000
const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const startOfToday = () => {
  const d = new Date()

  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

const inDays = (n) => new Date(startOfToday().getTime() + n * DAY)
const inRange = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => iso(inDays(from + i)))
const onlySaturday = {
  sunday: true,
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
}
// Each scenario returns fresh props so relative dates never go stale.
const scenarios = [
  {
    id: 'sandbox',
    group: 'Start here',
    title: 'Sandbox',
    blurb: 'Switch props on and off and watch the calendar and the code on the right change together.',
  },
  {
    id: 'min-stay',
    group: 'Stay rules',
    title: 'Minimum stay of 3 nights',
    blurb: 'Ranges shorter than minNights are refused. Hover a day to see the night count.',
    props: () => ({ minNights: 3 }),
  },
  {
    id: 'max-stay',
    group: 'Stay rules',
    title: 'Maximum stay of 30 nights',
    blurb: 'Ranges longer than maxNights can’t be completed. selectForward is off so the end date may be picked first.',
    props: () => ({ maxNights: 30, selectForward: false }),
  },
  {
    id: 'saturday',
    group: 'Stay rules',
    title: 'Check-in on Saturdays only',
    blurb: 'Every other weekday is disabled. enableCheckout lets guests still leave on a disabled day.',
    props: () => ({ disabledWeekDays: onlySaturday, enableCheckout: true }),
  },
  {
    id: 'same-day',
    group: 'Stay rules',
    title: 'No same-day check-in and check-out',
    blurb: 'A booking has to span at least one night, so the check-in day can’t double as check-out.',
    props: () => ({ disableCheckoutOnCheckin: true, minNights: 1 }),
  },
  {
    id: 'single-day',
    group: 'Stay rules',
    title: 'Single-day selection',
    blurb: 'For day passes and appointments: one click selects one day.',
    props: () => ({ singleDaySelection: true }),
  },
  {
    id: 'blocked',
    group: 'Availability',
    title: 'Certain dates blocked',
    blurb: 'Pass disabledDates as YYYY-MM-DD strings. A range can’t cross a blocked day.',
    props: () => ({ disabledDates: inRange(4, 6).concat(inRange(15, 16)) }),
  },
  {
    id: 'half-day',
    group: 'Availability',
    title: 'Half days',
    blurb: 'Guests can check in on the afternoon a previous booking checks out. Blocked days are eight days out.',
    props: () => ({ disabledDates: inRange(8, 10).concat(inRange(14, 16)), halfDay: true }),
  },
  {
    id: 'checkout-on-blocked',
    group: 'Availability',
    title: 'Check out on the first blocked day',
    blurb: 'With disableCheckoutOnCheckin and a minimum stay, a range ends on the day before an existing booking.',
    props: () => ({
      disabledDates: inRange(6, 9).concat(inRange(20, 24)),
      disableCheckoutOnCheckin: true,
      minNights: 2,
    }),
  },
  {
    id: 'end-of-year',
    group: 'Calendar limits',
    title: 'Block everything after 31 December',
    blurb: 'endDate disables all days after it.',
    props: () => ({ endDate: new Date(new Date().getFullYear(), 11, 31) }),
  },
  {
    id: 'next-month',
    group: 'Calendar limits',
    title: 'Block everything after the 15th of next month',
    blurb: 'Same prop, a rolling window.',
    props: () => ({ endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15) }),
  },
  {
    id: 'default-range',
    group: 'Presets',
    title: 'Start with a date range',
    blurb: 'Seed startingDateValue and endingDateValue, for example from URL parameters.',
    props: () => ({ startingDateValue: inDays(0), endingDateValue: inDays(5) }),
  },
  {
    id: 'check-in-only',
    group: 'Presets',
    title: 'Start with a check-in only',
    blurb: 'Only startingDateValue is set. The next click chooses the check-out.',
    props: () => ({ startingDateValue: inDays(2) }),
  },
  {
    id: 'format',
    group: 'Display',
    title: 'Custom date format',
    blurb: 'format uses dayjs tokens. This one is MMMM D.',
    props: () => ({ format: 'MMMM D' }),
  },
  {
    id: 'tooltip',
    group: 'Display',
    title: 'Custom tooltip',
    blurb: 'tooltipMessage accepts HTML and replaces the default night count.',
    props: () => ({ tooltipMessage: '<strong>Enjoy</strong> your stay!' }),
  },
  {
    id: 'events',
    group: 'Events',
    title: 'Listening to changes',
    blurb: 'check-in-changed and check-out-changed fire with the new date. Watch the Events panel as you click.',
    props: () => ({}),
  },
]
const sandboxGroups = [
  {
    legend: 'Layout',
    toggles: [
      { key: 'gridStyle', label: 'Grid lines' },
      { key: 'showSingleMonth', label: 'Single month' },
      { key: 'showWeekNumbers', label: 'Week numbers' },
      { key: 'mondayFirst', label: 'Week starts Monday' },
      { key: 'positionRight', label: 'Open to the right' },
      { key: 'alwaysVisible', label: 'Always visible' },
    ],
  },
  {
    legend: 'Header',
    toggles: [
      { key: 'showYear', label: 'Show year' },
      { key: 'yearBeforeMonth', label: 'Year before month' },
      { key: 'showLastDateAvailable', label: 'Stop paging after two years' },
    ],
  },
  {
    legend: 'Pricing & rules',
    toggles: [
      { key: 'singleDaySelection', label: 'Single-day selection' },
      { key: 'showPeriodDates', label: 'Period dates (weekly stays)' },
      { key: 'showPrice', label: 'Show prices' },
      { key: 'showBookings', label: 'Show existing bookings' },
      { key: 'showContentSlot', label: 'Content slot' },
    ],
  },
]

export default {
  name: 'HotelDatePicker-Examples',
  components: { HotelDatePicker },
  data() {
    const languages = { pt, fr, en, es, es_419, it }
    const navLangs = (navigator.languages || []).map((lang) => lang.replace('-', '_'))
    const language = navLangs.find((l) => Object.keys(languages).includes(l)) || 'en'
    const hash = window.location.hash.slice(1)
    const activeId = scenarios.some((s) => s.id === hash) ? hash : 'sandbox'

    return {
      languages,
      language,
      scenarios,
      sandboxGroups,
      activeId,
      menuOpen: false,
      pickerKey: 0,
      checkIn: null,
      checkOut: null,
      log: [],
      logId: 0,
      copied: '',
      sandbox: {
        gridStyle: true,
        showSingleMonth: false,
        showWeekNumbers: false,
        mondayFirst: false,
        positionRight: false,
        alwaysVisible: true,
        showYear: true,
        yearBeforeMonth: false,
        showLastDateAvailable: false,
        singleDaySelection: false,
        showPeriodDates: false,
        showPrice: false,
        showBookings: false,
        showContentSlot: false,
        minNights: 1,
      },
    }
  },
  computed: {
    sortedLanguages() {
      return Object.entries(this.languages)
        .sort(([, a], [, b]) => a.name.localeCompare(b.name))
        .map(([code, { name }]) => ({ name, code }))
    },
    i18n() {
      return this.languages[this.language] || this.languages.en
    },
    groups() {
      const order = []

      this.scenarios.forEach((s) => {
        let g = order.find((o) => o.name === s.group)

        if (!g) order.push((g = { name: s.group, items: [] }))
        g.items.push(s)
      })

      return order
    },
    current() {
      return this.scenarios.find((s) => s.id === this.activeId)
    },
    pickerProps() {
      if (this.current.id !== 'sandbox') return { alwaysVisible: true, ...this.current.props() }
      const s = this.sandbox
      const props = {
        gridStyle: s.gridStyle,
        showSingleMonth: s.showSingleMonth,
        showWeekNumbers: s.showWeekNumbers,
        firstDayOfWeek: s.mondayFirst ? 1 : 0,
        positionRight: s.positionRight,
        alwaysVisible: s.alwaysVisible,
        showYear: s.showYear,
        yearBeforeMonth: s.yearBeforeMonth,
        singleDaySelection: s.singleDaySelection,
        minNights: Math.max(1, Number(s.minNights) || 1),
      }

      if (s.showLastDateAvailable) props.lastDateAvailable = inDays(365 * 2)
      if (s.showPeriodDates) props.periodDates = this.samplePeriods()

      if (s.showPrice) {
        props.showPrice = true
        props.priceSymbol = '$'
        if (!props.periodDates) props.periodDates = this.samplePeriods()
      }

      if (s.showBookings) props.bookings = this.sampleBookings()

      return props
    },
    snippet() {
      const defaults = { minNights: 1, firstDayOfWeek: 0, gridStyle: true, showYear: true }
      const attrs = Object.entries(this.pickerProps)
        .filter(([k, v]) => defaults[k] !== v && v !== false)
        .map(([k, v]) => this.attr(k, v))
      const lines = ['<HotelDatePicker', '  :modelValue="true"', ...attrs.map((a) => '  ' + a)]

      Object.entries(this.pickerProps).forEach(([k, v]) => {
        if (v === false && defaults[k] === true) lines.push(`  :${k}="false"`)
      })

      if (this.current.id === 'events') {
        lines.push('  @check-in-changed="checkIn = $event"', '  @check-out-changed="checkOut = $event"')
      }

      lines.push('/>')

      return lines.join('\n')
    },
    nights() {
      if (!this.checkIn || !this.checkOut) return null

      return Math.round((this.checkOut - this.checkIn) / DAY)
    },
  },
  watch: {
    activeId(id) {
      try {
        window.history.replaceState(null, '', `#${id}`)
      } catch (e) {
        /* history is optional */
      }
    },
  },
  methods: {
    samplePeriods() {
      const first = inDays(0)
      const sat = new Date(first.getTime() + ((6 - first.getDay() + 7) % 7) * DAY)

      return [
        { startAt: iso(inDays(-30)), endAt: iso(sat), minimumDuration: 2, periodType: 'nightly', price: 120 },
        {
          startAt: iso(sat),
          endAt: iso(new Date(sat.getTime() + 28 * DAY)),
          minimumDuration: 1,
          periodType: 'weekly_by_saturday',
          price: 790,
        },
        {
          startAt: iso(new Date(sat.getTime() + 28 * DAY)),
          endAt: iso(new Date(sat.getTime() + 200 * DAY)),
          minimumDuration: 3,
          periodType: 'nightly',
          price: 95,
        },
      ]
    },
    sampleBookings() {
      return [
        {
          event: true,
          checkInDate: iso(inDays(3)),
          checkOutDate: iso(inDays(6)),
          style: { backgroundColor: '#3b7a78' },
        },
        {
          event: false,
          checkInDate: iso(inDays(11)),
          checkOutDate: iso(inDays(14)),
          style: { backgroundColor: '#a87b2e' },
        },
      ]
    },
    attr(key, value) {
      if (value === true) return key

      return `:${key}="${this.literal(value)}"`
    },
    literal(v) {
      if (v instanceof Date) return `new Date('${iso(v)}')`
      if (typeof v === 'string') return `'${v}'`

      if (Array.isArray(v)) {
        if (v.every((x) => typeof x === 'string')) return `[${v.map((x) => `'${x}'`).join(', ')}]`

        return '[…]'
      }

      if (v && typeof v === 'object')
        return `{ ${Object.entries(v)
          .map(([k, x]) => `${k}: ${this.literal(x)}`)
          .join(', ')} }`

      return String(v)
    },
    select(id) {
      this.activeId = id
      this.checkIn = null
      this.checkOut = null
      this.log = []
      this.pickerKey += 1
      this.menuOpen = false
    },
    shown(d) {
      return d ? iso(d) : '—'
    },
    push(name, detail = '') {
      const t = new Date()
      const time = [t.getHours(), t.getMinutes(), t.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':')

      this.log = [{ id: ++this.logId, time, name, detail }, ...this.log].slice(0, 30)
    },
    onCheckIn(date) {
      this.checkIn = date
      this.push('check-in-changed', date ? iso(date) : 'null')
    },
    onCheckOut(date) {
      this.checkOut = date
      this.push('check-out-changed', date ? iso(date) : 'null')
    },
    onDayClicked(date, formatted) {
      this.push('day-clicked', formatted || (date ? iso(date) : ''))
    },
    onClear() {
      this.checkIn = null
      this.checkOut = null
      this.push('clear-selection')
    },
    onPeriod(event, checkIn, checkOut) {
      this.push('period-selected', `${iso(checkIn)} → ${iso(checkOut)}`)
    },
    async copy(text, which) {
      try {
        await navigator.clipboard.writeText(text)
        this.copied = which
        setTimeout(() => (this.copied = ''), 1400)
      } catch (e) {
        this.copied = ''
      }
    },
  },
}
</script>

<style lang="scss">
:root {
  --ink: #13292b;
  --ink-soft: #4a5f61;
  --linen: #edf0ee;
  --paper: #fbfcfb;
  --rule: #cfd7d4;
  --brass: #8f6620;
  --brass-bg: #f3e9d2;
  --mint: #00ca9d;
  --display: 'Big Shoulders Display', 'Arial Narrow', sans-serif;
  --body: 'Instrument Sans', system-ui, sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, monospace;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--linen);
  color: var(--ink);
  font-family: var(--body);
  font-size: 16px;
  line-height: 1.5;
}

.demo {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  button,
  select,
  input {
    font: inherit;
    color: inherit;
  }

  button:focus-visible,
  select:focus-visible,
  input:focus-visible,
  a:focus-visible {
    outline: 3px solid var(--brass);
    outline-offset: 2px;
  }
}

/* ---- masthead ---- */
.masthead {
  background: var(--ink);
  color: var(--linen);
  padding: 20px 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
  align-items: center;
  justify-content: space-between;

  &__brand {
    display: flex;
    gap: 16px;
    align-items: center;
    min-width: 0;

    h1 {
      font-family: var(--display);
      font-weight: 700;
      font-size: 2rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin: 0;
      line-height: 1;
    }

    p {
      margin: 6px 0 0;
      font-size: 0.9rem;
      color: #b6c4c2;
      max-width: 46ch;
    }
  }

  // Room-number plate: the major version, as a door sign.
  &__plate {
    flex: none;
    width: 52px;
    height: 64px;
    display: grid;
    place-items: center;
    font-family: var(--display);
    font-weight: 800;
    font-size: 2.6rem;
    color: var(--ink);
    background: linear-gradient(180deg, #d9b25f, #b98d3b);
    border-radius: 4px;
    box-shadow: inset 0 0 0 3px rgba(19, 41, 43, 0.25);
  }

  &__tools {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 16px;
    align-items: center;
  }

  .install {
    display: flex;
    gap: 14px;
    align-items: center;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    color: var(--linen);

    code {
      font-family: var(--mono);
      font-size: 0.82rem;
    }

    span {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #d9b25f;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.14);
    }
  }

  .lang {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    color: #b6c4c2;

    select {
      background: var(--ink);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      padding: 6px 8px;
      color: var(--linen);
    }
  }

  .link {
    color: var(--linen);
    font-size: 0.9rem;
    text-underline-offset: 3px;
  }
}

/* ---- layout ---- */
.layout {
  flex: 1;
  display: grid;
  grid-template-columns: 17rem minmax(0, 1fr) 21rem;
  gap: 0;
  max-width: 1500px;
  width: 100%;
  margin: 0 auto;
}

/* ---- index ---- */
.index {
  padding: 24px 16px 40px 24px;
  border-right: 1px solid var(--rule);

  &__toggle {
    display: none;
  }

  section + section {
    margin-top: 20px;
  }

  h2 {
    margin: 0 0 6px;
    font-family: var(--display);
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--brass);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li button {
    width: 100%;
    text-align: left;
    background: none;
    border: 0;
    border-left: 3px solid transparent;
    padding: 7px 10px;
    font-size: 0.92rem;
    line-height: 1.3;
    cursor: pointer;
    color: var(--ink-soft);

    &:hover {
      color: var(--ink);
      background: rgba(19, 41, 43, 0.05);
    }

    &.active {
      color: var(--ink);
      font-weight: 600;
      border-left-color: var(--brass);
      background: var(--brass-bg);
    }
  }
}

/* ---- stage ---- */
.stage {
  padding: 24px 32px 48px;
  min-width: 0;

  &__head {
    max-width: 62ch;

    h2 {
      margin: 0;
      font-family: var(--display);
      font-weight: 700;
      font-size: 2.6rem;
      line-height: 1.02;
      letter-spacing: 0.01em;
    }
  }

  &__blurb {
    margin: 10px 0 0;
    color: var(--ink-soft);
  }

  .eyebrow {
    margin: 0 0 4px;
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--brass);
    font-weight: 600;
  }
}

.sandbox {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 12px;
  margin-top: 20px;

  fieldset {
    margin: 0;
    padding: 10px 14px 12px;
    border: 1px solid var(--rule);
    border-radius: 4px;
    background: var(--paper);
  }

  legend {
    padding: 0 6px;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }

  .toggle {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 8px;
    align-items: baseline;
    padding: 4px 0;
    cursor: pointer;
    font-size: 0.92rem;

    input {
      accent-color: var(--ink);
      margin: 0;
    }

    code {
      grid-column: 2;
      font-family: var(--mono);
      font-size: 0.72rem;
      color: var(--ink-soft);
    }
  }

  .field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 8px;
    font-size: 0.92rem;

    input {
      width: 5rem;
      padding: 4px 8px;
      border: 1px solid var(--rule);
      border-radius: 4px;
      background: #fff;
    }
  }
}

// The picker lives on a card; the rail on its edge is the only ornament.
.card {
  margin-top: 24px;
  display: flex;
  max-width: 760px;
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 6px;
  box-shadow:
    0 1px 0 rgba(19, 41, 43, 0.04),
    0 18px 40px -24px rgba(19, 41, 43, 0.35);
  overflow: hidden;

  &__rail {
    flex: none;
    width: 34px;
    background: var(--ink);
    color: #d9b25f;
    display: grid;
    place-items: center;

    span {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-family: var(--display);
      font-weight: 600;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      font-size: 0.85rem;
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
    padding: 20px;
    min-height: 420px;
    overflow-x: auto;
  }

  .vhd__datepicker__wrapper {
    margin: 0 auto;
  }
}

.slot-demo {
  margin: 12px;
  padding: 12px 14px;
  background: var(--brass-bg);
  border-left: 4px solid var(--brass);
  color: var(--ink);
  font-size: 0.9rem;
  text-align: left;
}

/* ---- folio ---- */
.folio {
  padding: 24px 24px 40px 16px;
  border-left: 1px solid var(--rule);
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;

  &__title {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    border-bottom: 2px solid var(--ink);
    margin-bottom: 10px;

    h3 {
      margin: 0;
      font-family: var(--display);
      font-weight: 700;
      font-size: 1.15rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    button {
      background: none;
      border: 0;
      padding: 2px 0;
      font-size: 0.8rem;
      color: var(--brass);
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 3px;

      &:disabled {
        color: var(--rule);
        cursor: default;
        text-decoration: none;
      }
    }
  }

  .code {
    margin: 0;
    padding: 12px 14px;
    background: var(--ink);
    color: #dbe7e4;
    border-radius: 4px;
    font-family: var(--mono);
    font-size: 0.78rem;
    line-height: 1.6;
    overflow-x: auto;
    max-height: 22rem;
    text-align: left;
  }

  .stay {
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr 4rem;
    gap: 8px;

    dt {
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink-soft);
    }

    dd {
      margin: 0;
      font-family: var(--mono);
      font-size: 0.9rem;
      font-weight: 500;

      &.empty {
        color: var(--rule);
      }
    }
  }

  .log {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 16rem;
    overflow-y: auto;

    li {
      display: grid;
      grid-template-columns: auto 1fr;
      column-gap: 10px;
      padding: 6px 0;
      border-bottom: 1px dashed var(--rule);
      font-size: 0.8rem;
    }

    time {
      font-family: var(--mono);
      color: var(--ink-soft);
      grid-row: span 2;
    }

    code {
      font-family: var(--mono);
      font-weight: 600;
    }

    span {
      color: var(--ink-soft);
      font-family: var(--mono);
      font-size: 0.75rem;
      overflow-wrap: anywhere;
    }

    &__empty {
      margin: 0;
      font-size: 0.88rem;
      color: var(--ink-soft);
    }
  }

  .log__empty {
    margin: 0;
    font-size: 0.88rem;
    color: var(--ink-soft);
  }
}

/* ---- responsive ---- */
@media (max-width: 1180px) {
  .layout {
    grid-template-columns: 15rem minmax(0, 1fr);
  }

  .folio {
    grid-column: 1 / -1;
    border-left: 0;
    border-top: 1px solid var(--rule);
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    align-items: start;
  }
}

@media (max-width: 760px) {
  .masthead {
    padding: 16px;

    &__brand h1 {
      font-size: 1.5rem;
    }

    &__plate {
      width: 40px;
      height: 50px;
      font-size: 2rem;
    }
  }

  .layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .index {
    border-right: 0;
    border-bottom: 1px solid var(--rule);
    padding: 0;

    &__toggle {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 14px 16px;
      background: var(--paper);
      border: 0;
      font-weight: 600;
      cursor: pointer;
    }

    &__list {
      display: none;
      padding: 8px 16px 20px;
    }

    &--open &__list {
      display: block;
    }
  }

  .stage {
    padding: 20px 16px 32px;

    &__head h2 {
      font-size: 2rem;
    }
  }

  .card {
    &__rail {
      display: none;
    }

    &__body {
      padding: 8px;
    }
  }

  .folio {
    padding: 20px 16px;
  }
}

/* Make the picker fill the card instead of the library's 300px demo width */
.card .vhd__datepicker__wrapper {
  max-width: 100%;
}
</style>
