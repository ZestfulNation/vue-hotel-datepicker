<template lang='pug'>
  #app
    div
      DatePicker(
        :minNights='0'
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
