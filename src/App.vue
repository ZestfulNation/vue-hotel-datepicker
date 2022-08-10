<template>
  <div id="app" style="margin: 0 auto;">
    <h1>Vue Hotel datepicker@2</h1>

    <div class="box">
      <h3>
        New periods management
      </h3>
      <DatePicker
        ref="DatePicker"
        clickOutsideElementId="clickOutsideElement"
        :firstDayOfWeek="1"
        :disabledDates="['2022-06-01', '2022-06-02']"
        :showYear="true"
        :format="dateFormat"
        :lastDateAvailable="lastDateAvailable"
        :minNights="minNights"
        :i18n="frFR"
        :disableCheckoutOnCheckin="true"
        :periodDates="periodDates"
        @renderNextMonth="renderNextMonth"
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
      dynamicDisabledDates: ["2021-04-30", "2021-05-01", "2021-05-02"],
      ptPT: {
        night: "Noite",
        nights: "Noites",
        "day-names": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
        "check-in": "Partida",
        "check-out": "Chegada",
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
        ],
        tooltip: {
          halfDayCheckIn: "Reservas possíveis",
          halfDayCheckOut: "Reservas possíveis",
          saturdayToSaturday: "Sábado a Sábado<br/> apenas",
          sundayToSunday: "Domingo a domingo<br/> apenas",
          minimumRequiredPeriod: "%{minNightInPeriod} %{night} mínimo."
        },
        week: "semana",
        weeks: "semanas"
      },
      frFR: {
        "check-in": "Arrivée",
        "check-out": "Départ",
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
        night: "nuit",
        nights: "nuits",
        tooltip: {
          halfDayCheckIn: "Réservation possible",
          halfDayCheckOut: "Réservation possible",
          saturdayToSaturday: "Du samedi au samedi<br/> uniquement",
          sundayToSunday: "Du dimanche au dimanche<br/> uniquement",
          mondayToMonday: "Du lundi au lundi<br/> uniquement",
          minimumRequiredPeriod: "%{minNightInPeriod} %{night} minimum"
        },
        week: "semaine",
        weeks: "semaines"
      },
      periodDates: [
        {
          startAt: "2022-11-27",
          endAt: "2022-12-11",
          minimumDuration: 1,
          periodType: "weekly_by_sunday"
        },
        {
          startAt: "2022-12-15",
          endAt: "2023-01-01",
          minimumDuration: 3,
          periodType: "weekly_by_sunday"
        }
      ],
      bookings: [
        {
          id: "1726359",
          checkInDate: "2021-08-22",
          checkOutDate: "2021-08-29",
          style: {
            backgroundColor: "#9DC1C9"
          }
        },
        {
          id: "1726360",
          checkInDate: "2021-08-15",
          checkOutDate: "2021-08-22",
          style: {
            backgroundColor: "#9DC1C9"
          }
        },
        {
          id: "1726358",
          checkInDate: "2021-08-01",
          checkOutDate: "2021-08-15",
          style: {
            backgroundColor: "#9DC1C9"
          }
        },
        {
          id: "1726357",
          checkInDate: "2021-09-01",
          checkOutDate: "2021-09-23",
          style: {
            backgroundColor: "#9DC1C9"
          }
        },
        {
          id: "1726356",
          checkInDate: "2021-06-01",
          checkOutDate: "2021-06-18",
          style: {
            backgroundColor: "#9DC1C9"
          }
        },
        {
          id: "181412",
          checkInDate: "2019-09-15",
          checkOutDate: "2019-10-15",
          style: {
            backgroundColor: "#9DC1C9"
          }
        },
        {
          id: "181491",
          checkInDate: "2019-07-01",
          checkOutDate: "2019-08-31",
          style: {
            backgroundColor: "#9DC1C9"
          }
        },
        {
          id: "178234",
          checkInDate: "2018-08-04",
          checkOutDate: "2018-08-25",
          style: {
            backgroundColor: "#9DC1C9"
          }
        },
        {
          id: "178235",
          checkInDate: "2018-07-01",
          checkOutDate: "2018-07-31",
          style: {
            backgroundColor: "#9DC1C9"
          }
        }
      ],
      newCheckInDate: null,
      newCheckOutDate: null,
      minNights: 3
    };
  },
  computed: {
    dateFormat() {
      return "DD/MM/YYYY";
    },
    lastDateAvailable() {
      return this.addYears(new Date(), 2);
    }
  },
  methods: {
    renderNextMonth() {
      this.dynamicDisabledDates.push(
        "2021-05-11",
        "2021-05-12",
        "2021-05-13",
        "2021-05-14",
        "2021-05-15",
        "2021-05-16",
        "2021-05-17",
        "2021-05-18"
      );
    },
    toggleDatePickerOutside() {
      this.$refs.DatePicker.showDatepicker();
    },
    bookingClicked(event, date, currentBooking) {
      console.log("bookingClicked", event, date, currentBooking);
    },
    periodSelected(event, checkIn, checkOut) {
      console.log("periodSelected", event, checkIn, checkOut);
    },
    handleCheckIncheckOutHalfDay(checkIncheckOutHalfDay) {
      console.log("handleCheckIncheckOutHalfDay", checkIncheckOutHalfDay);
    },
    addYears(dt, n) {
      return new Date(dt.setFullYear(dt.getFullYear() + n));
    },
    validateDateBetweenTwoDates(fromDate, toDate, givenDate) {
      const getvalidDate = d => {
        return new Date(d);
      };

      return (
        getvalidDate(givenDate) <= getvalidDate(toDate) &&
        getvalidDate(givenDate) >= getvalidDate(fromDate)
      );
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
.datepicker__fullview .datepicker {
  z-index: 1;
}
</style>
