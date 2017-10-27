<template>
  <div id="app" style="text-align: left; padding: 10vw">
    <div>
      <div class="box">
        <h3>Check in only on saturday and minimum stay of 10 nights</h3>
        <DatePicker
          minNights='0'
          />
      </div>

      <div class="box">
        <h3>Check in and check-out only on saturday and maximum stay of 30 nights</h3>
        <DatePicker
          :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
          :enableCheckout="true"
          :allowedRanges="[7,14,21,28]"
          :maxNights="30"
          />
      </div>

      <div class="box">
        <h3>Block all dates after December 31st of the current year</h3>
        <DatePicker
          :endDate="new Date(new Date().getFullYear(), 11, 31)"
        />
      </div>

      <div class="box">
        <h3>Block all dates after September 15th</h3>
        <DatePicker
          :endDate="new Date(new Date().getFullYear(), 8, 15)"
        />
      </div>

      <div class="box">
        <h3>Block all date ranges of more than 30 days</h3>
        <DatePicker
          :maxNights="30"
          :showBottomBar="false"
          :selectForward="false"
          />
      </div>

      <div class="box">
        <h3>Minimum stay of 3 days</h3>
        <DatePicker
          :minNights="3"
          :showBottomBar="true"
          />
      </div>


      <div class="box">
        <h3>Certain dates blocked</h3>
        <DatePicker
          :disabledDates="[
              '2017-09-14',
              '2017-09-26',
          ]"
          :showCloseButton="true"
          />
      </div>

      <div class="box">
        <h3>Allow setting a default date range ( can be used to set a range from a url param )</h3>
        <DatePicker
          :value="'2020-07-14 ► 2020-07-20'"
        />
      </div>

      <div class="box">
        <h3>Ranges of 7, 10 or 14 days and checkin only on saturdays</h3>
        <DatePicker
          :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
          :enableCheckout="true"
          :allowedRanges="[7,10,14]"
          :minNights="7"
          />
      </div>

      <div class="box">
        <h3>Custom tooltip text</h3>
        <DatePicker
          tooltipMessage="<strong>Enjoy</strong> your stay!"
          />
      </div>

    </div>
  </div>
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
