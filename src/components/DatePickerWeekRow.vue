<template>
  <div class="datepicker__week-row">
    <div
      class="datepicker__week-name"
      v-for="(dayName, datePickerWeekIndexMobile) in dayNames"
      :key="datePickerWeekIndexMobile"
    >
      {{ dayName }}
    </div>
  </div>
</template>

<script>
export default {
  name: "DatePickerWeekRow",
  props: {
    dayNames: {
      type: Array,
      required: true
    }
  }
};
</script>
