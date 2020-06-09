<template>
  <div id="app" style="margin: 0 auto;">
    <h1>Vue Hotel datepicker@2</h1>
    <div class="box">
      <h3>
        Periods
        <strong>periodDates</strong> props
      </h3>
      <DatePicker
        :disabledDates="[
          '2020-08-15',
          '2020-08-16',
          '2020-08-17',
          '2020-08-18',
          '2020-08-19',
          '2020-08-20',
          '2020-08-21',
          '2020-08-01',
          '2020-08-02',
          '2020-08-03',
          '2020-08-04',
          '2020-08-05',
          '2020-08-06',
          '2020-08-07'
        ]"
        :lastDateAvailable="lastDateAvailable"
        :minNights="minNights"
        :i18n="frFR"
        :firstDayOfWeek="1"
        :disableCheckoutOnCheckin="true"
        :halfDay="true"
        :periodDates="periodDates"
      />
    </div>
  </div>
</template>

<script>
import DatePicker from "./components/DatePicker/index.vue";

export default {
  components: {
    DatePicker
  },
  data() {
    return {
      ptPT: {
        night: "Noite",
        nights: "Noites",
        "day-names": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
        "check-in": "Chegada",
        "check-out": "Partida",
        "month-names": [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro"
        ]
      },
      frFR: {
        "check-in": "Départ",
        "check-out": "Arrivée",
        "day-names": ["lu", "ma", "me", "je", "ve", "sa", "di"],
        "month-names": [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre"
        ],
        night: "Nuit",
        nights: "Nuits"
      },
      periodDates: [
        {
          startAt: "2020-07-11",
          endAt: "2020-07-18",
          minimumDuration: 1,
          periodType: "weekly_by_saturday",
          price: 1000.0
        },
        {
          startAt: "2020-07-18",
          endAt: "2020-07-26",
          minimumDuration: 4,
          periodType: "nightly",
          price: 500.0
        },
        {
          startAt: "2020-08-09",
          endAt: "2020-08-23",
          minimumDuration: 2,
          periodType: "weekly_by_sunday",
          price: 4000.0
        }
      ],
      newCheckInDate: null,
      newCheckOutDate: null,
      minNights: 3
    };
  },
  computed: {
    lastDateAvailable() {
      return this.addYears(new Date(), 2);
    }
  },
  methods: {
    addYears(dt, n) {
      return new Date(dt.setFullYear(dt.getFullYear() + n));
    },
    dayClicked(date, formatDate, nextDisabledDate) {
      console.log(date, formatDate, nextDisabledDate);
    },
    checkInChanged(newDate) {
      this.newCheckInDate = newDate;
    },
    checkOutChanged(newDate) {
      this.newCheckOutDate = newDate;
    }
  }
};
</script>

<style>
body,
html {
  font-family: "Source Sans Pro", sans-serif;
}

.box {
  width: 100%;
}
</style>
