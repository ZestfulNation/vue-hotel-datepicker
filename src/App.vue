<template lang='pug'>
  #app(style='text-align: left; padding: 10vw')
    div
      .box
        WIP
      hr
      //- .box
      //-   DatePicker(
      //-     datepickerid='HDR',
      //-     :disableddaysofweek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']",
      //-     :enablecheckout='true',
      //-     :minnights='10',
      //-     :usedummyinputs='true'
      //-   )
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
