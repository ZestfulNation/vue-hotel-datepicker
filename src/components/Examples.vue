<template>
  <!-- <div class="examples">
    <div class="box">
      <h3>Examples</h3>
      <h4>Check in only on saturday and minimum stay of 10 days</h4>
      <DatePicker
        DatePickerID="01"
        :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
        :enableCheckout="true"
        :minNights="10"
        />
    </div>

    <div class="box">
      <h4>Check in and check-out only on saturday and minimum stay of 10 days</h4>
      <DatePicker
        DatePickerID="02"
        :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
        :enableCheckout="false"
        :minNights="10"
        />
    </div>

    <div class="box">
      <h4>Block all dates after December 31st of the current year</h4>
      <DatePicker
        DatePickerID="DatePickerID0"
        :endDate="new Date(new Date().getFullYear(), 11, 31)"
      />
    </div>

    <div class="box">
      <h4>Block all dates after September 15th</h4>
      <DatePicker
        DatePickerID="DatePickerID1"
        :endDate="new Date(new Date().getFullYear(), 8, 15)"
      />
    </div>

    <div class="box">
      <h4>Block all date ranges of more than 30 days</h4>
      <DatePicker
        DatePickerID="DatePickerID2"
        :maxNights="30"
        :showBottomBar="false"
        />
    </div>

    <div class="box">
      <h4>Minimum stay of 3 days</h4>
      <DatePicker
        DatePickerID="DatePickerID3"
        :minNights="3"
        :showBottomBar="true"
        />
    </div>


    <div class="box">
      <h4>Certain dates blocked</h4>
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
      <h4>Allow setting a default date range ( can be used to set a range from a url param )</h4>
      <DatePicker
        DatePickerID="DatePickerID6"
        :endDate="new Date(new Date().getFullYear(), 8, 15)"
        :value="'2017-07-14 ► 2017-07-20'"
      />
    </div>

    <div class="box">
      <h4>Ranges of 7, 10 or 14 days and checkin only on saturdays</h4>
      <DatePicker
        DatePickerID="DatePickerID7"
        :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
        :enableCheckout="true"
        :allowedRanges="[7,10,14]"
        :minNights="7"
        />
    </div>
  </div> -->
</template>

<script>

export default {
  name: 'Examples',
}
</script>

<style scoped>
h4 {
  color: #5d524b;
  font-weight: lighter;
  font-size: 14px;
}

.box {
  margin-bottom: 30px;
  padding-bottom: 30px;
}
</style>
