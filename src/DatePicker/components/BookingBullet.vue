<template>
  <i class="vhd__parent-bullet">
    <i
      v-if="previousBooking && duplicateBookingDates.includes(formatDate)"
      class="vhd__bullet"
      :style="previousBooking.style"
      :class="[
        {
          vhd__checkInCheckOut: duplicateBookingDates.includes(formatDate),
        },
      ]"
    />
    <i
      v-if="previousBooking && duplicateBookingDates.includes(formatDate)"
      class="vhd__pipe vhd__checkInCheckOut"
      :style="previousBooking.style"
    />
    <i
      v-if="currentBooking && (currentBooking.checkInDate === formatDate || currentBooking.checkOutDate === formatDate)"
      class="vhd__bullet"
      :style="currentBooking.style"
      :class="[
        {
          vhd__checkIn: currentBooking.checkInDate === formatDate,
          vhd__checkOut: currentBooking.checkOutDate === formatDate,
        },
      ]"
    />
    <i
      v-if="currentBooking"
      class="vhd__pipe"
      :class="[
        {
          vhd__checkIn: currentBooking.checkInDate === formatDate,
          vhd__checkOut: currentBooking.checkOutDate === formatDate,
        },
      ]"
      :style="currentBooking.style"
    />
  </i>
</template>

<script>
export default {
  name: 'BookingBullet',
  props: {
    currentBooking: {
      type: Object,
      default: () => ({}),
    },
    duplicateBookingDates: {
      type: Array,
      default: () => [],
    },
    formatDate: {
      type: String,
      default: '',
    },
    previousBooking: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
