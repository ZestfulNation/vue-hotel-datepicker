<template>
  <i class="parent-bullet">
    <i
      v-if="previousBooking && duplicateBookingDates.includes(formatDate)"
      :style="previousBooking.style"
      :class="[
        'bullet',
        {
          checkInCheckOut: duplicateBookingDates.includes(formatDate)
        }
      ]"
    />
    <i
      v-if="previousBooking && duplicateBookingDates.includes(formatDate)"
      class="pipe checkInCheckOut"
      :style="previousBooking.style"
    />
    <i
      v-if="
        currentBooking &&
          (currentBooking.checkInDate === formatDate ||
            currentBooking.checkOutDate === formatDate)
      "
      :style="currentBooking.style"
      :class="[
        'bullet',
        {
          checkIn: currentBooking.checkInDate === formatDate,
          checkOut: currentBooking.checkOutDate === formatDate
        }
      ]"
    />
    <i
      v-if="currentBooking"
      :class="[
        'pipe',
        {
          checkIn: currentBooking.checkInDate === formatDate,
          checkOut: currentBooking.checkOutDate === formatDate
        }
      ]"
      :style="currentBooking.style"
    />
  </i>
</template>

<script>
export default {
  name: "BookingBullet",
  props: {
    currentBooking: {
      type: Object,
      default: () => ({})
    },
    duplicateBookingDates: {
      type: Array,
      default: () => []
    },
    formatDate: {
      type: String,
      default: ""
    },
    previousBooking: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
