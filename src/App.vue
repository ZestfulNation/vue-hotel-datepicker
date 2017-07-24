<template>
  <div id="app" style="text-align: left; padding: 10vw">
    <div>
      <div class="box">
        <h3>Check in only on saturday and minimum stay of 10 days</h3>
        <DatePicker
          DatePickerID="01"
          :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
          :enableCheckout="true"
          :minNights="10"
          :useDummyInputs="false"
          />
      </div>

      <div class="box">
        <h3>Check in and check-out only on saturday and minimum stay of 10 days</h3>
        <DatePicker
          DatePickerID="02"
          :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
          :enableCheckout="false"
          :minNights="10"
          />
      </div>

      <div class="box">
        <h3>Block all dates after December 31st of the current year</h3>
        <DatePicker
          DatePickerID="DatePickerID0"
          :endDate="new Date(new Date().getFullYear(), 11, 31)"
        />
      </div>

      <div class="box">
        <h3>Block all dates after September 15th</h3>
        <DatePicker
          DatePickerID="DatePickerID1"
          :endDate="new Date(new Date().getFullYear(), 8, 15)"
        />
      </div>

      <div class="box">
        <h3>Block all date ranges of more than 30 days</h3>
        <DatePicker
          DatePickerID="DatePickerID2"
          :maxNights="30"
          :showBottomBar="false"
          :selectForward="false"
          />
      </div>

      <div class="box">
        <h3>Minimum stay of 3 days</h3>
        <DatePicker
          DatePickerID="DatePickerID3"
          :minNights="3"
          :showBottomBar="true"
          />
      </div>


      <div class="box">
        <h3>Certain dates blocked</h3>
        <DatePicker
          DatePickerID="DatePickerID5"
          :disabledDates="[
              '2017-07-14',
              '2017-07-26',
          ]"
          :showCloseButton="true"
          />
      </div>

      <div class="box">
        <h3>Allow setting a default date range ( can be used to set a range from a url param )</h3>
        <DatePicker
          DatePickerID="DatePickerID6"
          :endDate="new Date(new Date().getFullYear(), 8, 15)"
          :value="'2017-07-14 ► 2017-07-20'"
        />
      </div>

      <div class="box">
        <h3>Ranges of 7, 10 or 14 days and checkin only on saturdays</h3>
        <DatePicker
          DatePickerID="DatePickerID7"
          :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
          :enableCheckout="true"
          :allowedRanges="[7,10,14]"
          :minNights="7"
          />
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from 'components/HotelDatePicker.vue';

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
  width: 360px;
}
</style>
