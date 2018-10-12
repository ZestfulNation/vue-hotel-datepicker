<template>
  <div id="app">
    <div>
      <div class="box">
        <h3>Choose single date</h3>
        <DatePicker
          :singleDaySelection="true"
        />
      </div>

      <div class="box">
         <!-- need fix -->
        <h3>Allow check-in and check-out on the same day</h3>
        <DatePicker
          :minNights="0"
        />
      </div>

      <div class="box">
         <!-- need fix -->
        <h3>Check in only on saturday and minimum stay of 10 nights</h3>
        <DatePicker
          :disabledDaysOfWeek="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"
          :enableCheckout="true"
          :minNights="10"
        />
      </div>

      <div class="box">
         <!-- need fix -->
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
        <h3>Block all dates after November 15th</h3>
        <DatePicker
          :endDate="new Date(new Date().getFullYear(), 10, 15)"
        />
      </div>

      <div class="box">
         <!-- need fix -->
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
              new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
              new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7),
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
        <!-- need fix -->
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
        <h3>Hide year</h3>
        <DatePicker
          :showYear="false"
        />
      </div>

      <div class="box">
        <h3>Custom date format with i18n (e.g.: ru)</h3>
        <DatePicker
          :minNights="0"
          :singleDateSelection="true"
          format="D MMM"
          :i18n="ru"
        />
      </div>

      <div class="box">
        <h3>Show specific header on desktop</h3>
        <DatePicker
          :desktopHeader="true"
        />
      </div>
     <!-- <DatePicker
  :i18n="ru"
  format="D MMM"
  :desktopHeader="true"
  /> -->
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
        ru: {
          night: 'Сутки',
          nights: 'Суток',
          'day-names': ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
          'check-in': 'Заезд',
          'check-out': 'Отъезд',
          'choose-dates': 'Выберите даты',
          'choose-dates-extended': 'Дата заезда - отъезда',
          'clear-dates': 'Сбросить даты',
          'datepicker-tooltip': 'Введите даты поездки, чтобы увидеть цены',
          'dates': 'Даты',
          'enter-dates-later': 'Введу даты позже',
          'month-names': ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          'show-more': 'Показать еще',
          'total-nights': 'Выбрано суток: '
        },
      };
    }
  };

</script>