<template>
    <i class="parent-bullet">
        <i
            v-if="previousBooking && duplicateBookingDates.includes(formatDate)"
            class="bullet"
            :style="previousBooking.style"
            :class="[
                {
                    checkInCheckOut: duplicateBookingDates.includes(formatDate),
                },
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
                    (currentBooking.checkInDate === formatDate || currentBooking.checkOutDate === formatDate)
            "
            class="bullet"
            :style="currentBooking.style"
            :class="[
                {
                    checkIn: currentBooking.checkInDate === formatDate,
                    checkOut: currentBooking.checkOutDate === formatDate,
                },
            ]"
        />
        <i
            v-if="currentBooking"
            class="pipe"
            :class="[
                {
                    checkIn: currentBooking.checkInDate === formatDate,
                    checkOut: currentBooking.checkOutDate === formatDate,
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
