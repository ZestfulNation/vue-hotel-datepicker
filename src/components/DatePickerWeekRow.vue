<template>
  <div class="datepicker__week-row">
    <div
      class="datepicker__week-name"
      v-for="(dayName, datePickerWeekIndexMobile) in dayNames"
      :key="datepickerWeekKey + datePickerWeekIndexMobile"
    >
      {{ dayName }}
    </div>
  </div>
</template>

<script>
export default {
  name: "DatePickerWeekRow",
  props: {
    datepickerWeekKey: {
      type: Number,
      default: 0
    },
    dayNames: {
      type: Array,
      required: true
    }
  }
};
</script>
