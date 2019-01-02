<template>
  <div id="app" style="text-align: left; padding: 10vw">
    <div>

      <div class="box">
        <h3>Allow check-in and check-out on the same day</h3>
        <DatePicker
          :minNights="0"
        />
      </div>
      <div class="box">
        <h3>Allow selection of single day</h3>
        <DatePicker
          :singleDaySelection="true"
        />
      </div>
      <div class="box">
        <h3>Check in only on saturday and minimum stay of 10 nights</h3>
        <DatePicker
          :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
          :enableCheckout="true"
          :minNights="10"
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
          :startingDateValue="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())"
          :endingDateValue="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5)"
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
          tooltipMessage="<strong style='color: red'>Enjoy</strong> your stay!"
        />
      </div>

      <div class="box">
        <h3>Show year</h3>
        <DatePicker
          :showYear="true"
        />
      </div>

      <div class="box">
        <h3>Custom date format with i18n (e.g.: pt-PT)</h3>
        <DatePicker
          :minNights="0"
          :singleDateSelection="true"
          format="MMMM D"
          :i18n="ptPT"
        />
      </div>

        <div class="box">
        <h3>Change the first day of the week to Monday</h3>
        <DatePicker
            :i18n="{ night: 'Night',
                      nights: 'Nights',
                      'day-names': ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
                      'check-in': 'Check-in',
                      'check-out': 'Check-Out',
                      'month-names': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    }"
            :firstDayOfWeek="1"
        />
    </div>

    <div class="box">
        <h3>Set checkIn value</h3>
        <DatePicker
            :i18n="{ night: 'Night',
                      nights: 'Nights',
                      'day-names': ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
                      'check-in': 'Check-in',
                      'check-out': 'Check-Out',
                      'month-names': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    }"
            :firstDayOfWeek="1"
            :checkInValue="new Date()"
        />
    </div>

    <div class="box">
        <h3>Set checkOut value</h3>
        <DatePicker
            :i18n="{ night: 'Night',
                      nights: 'Nights',
                      'day-names': ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
                      'check-in': 'Check-in',
                      'check-out': 'Check-Out',
                      'month-names': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    }"
            :firstDayOfWeek="1"
            :checkInValue="new Date()"
            :checkOutValue="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3)"
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

    data() {
      return {
        ptPT: {
          night: 'Noite',
          nights: 'Noites',
          'day-names': ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
          'check-in': 'Chegada',
          'check-out': 'Partida',
          'month-names': ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        },
      };
    }
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
