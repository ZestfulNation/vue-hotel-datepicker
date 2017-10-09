<template lang='pug'>
  #app
    div
      //- WIP(
      //-   :disabledDates="['2017-09-17', '2017-10-05', '2017-10-07', '2017-10-11']"
      //-   :disabledDaysOfWeek='["Monday", "Tuesday"]'
      //-   endDate="2017-12-31")
      WIP(:disabledDaysOfWeek='["Monday", "Tuesday"]')
</template>

<script>
// import DatePicker from 'components/HotelDatePicker.vue';
import WIP from 'components/WIP.vue';

export default {
  components: {
    // DatePicker,
    WIP
  },
};

</script>

<style>
body,
html {
  font-family: 'Source Sans Pro', sans-serif;
}

.box {
  width: 100%;
}
</style>
