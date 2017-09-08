<template lang='pug'>
  #app(style='text-align: left; padding: 10vw')
    div(style='float: left; width: 100%;' )
      WIP(
        :disabledDates="[ '2017-09-17', '2017-10-05', '2017-10-07', '2017-10-11']"
        endDate="2018-12-31")
</template>

<script>
import DatePicker from 'components/HotelDatePicker.vue';
import WIP from 'components/WIP.vue';

export default {
    components: {
        DatePicker,
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
