<template>
  <div class="vhd__datepicker__week-row vhd__hide-up-to-tablet">
    <div v-for="(name, ix) in dayNames" :key="`${weekKey}-${ix}`" class="vhd__datepicker__week-name">
      {{ name }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeekRow',
  props: {
    i18n: {
      type: Object,
      required: true,
    },
    weekKey: {
      type: Number,
      required: true,
    },
    firstDayOfWeek: {
      type: Number,
      required: true,
    },
  },
  computed: {
    dayNames() {
      return [
        ...this.i18n['day-names'].slice(this.firstDayOfWeek),
        ...this.i18n['day-names'].slice(0, this.firstDayOfWeek),
      ].slice(0, 7)
    },
  },
}
</script>
