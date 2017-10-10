<template lang='pug'>
  #app
    div
      DatePicker(
        :enableCheckout='true'
        endDate="02-02-2018"
        :disabledDates="['2018-01-02','2018-01-05','2018-01-15','2018-01-22','2018-01-06']"
      )
</template>

<script>
import DatePicker from 'components/DatePicker.vue';

export default {
  components: {
    DatePicker
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
