<template>
  <div>
    <div class="datepicker__wrapper">
      <input
        class="datepicker__input"
        :value="value"
        :id="DatePickerID"
        :placeholder="placeholder"
        type="text"
        v-on:change="updateValues"
        readonly/>
    </div>
  </div>
</template>

<script>
import HotelDatepicker from '../vendor/hotel-datepicker.js';

const defaulti18n = {
    selected: 'Your stay:',
    night: 'Night',
    nights: 'Nights',
    button: 'Close',
    'check-in': 'Check-in',
    'check-out': 'Check-Out',
    'day-names': ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
    'month-names': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    'error-more': 'Date range should not be more than 1 night',
    'error-more-plural': 'Date range should not be more than %d nights',
    'error-less': 'Date range should not be less than 1 night',
    'error-less-plural': 'Date range should not be less than %d nights',
    'info-more': 'Please select a date range longer than 1 night',
    'info-more-plural': 'Please select a date range longer than %d nights',
    'info-range': 'Please select a date range between %d and %d nights',
    'info-default': 'Please select a date range'
};


export default {
    name: 'DatePicker',

    props: {
        value: {
          type: String
        },
        useDummyInputs: {
          default: true,
          type: Boolean
        },
        placeholder: {
          default: 'Check-in ► Check-out',
          type: String
        },
        DatePickerID: {
          default: '1',
          type: String
        },
        format: {
            default: 'YYYY-MM-DD',
            type: String
        },
        infoFormat: {
          default: 'YYYY-MM-DD',
          type: String
        },
        separator: {
          default: ' ► ',
          type: String
        },
        startOfWeek: {
          default: 'monday',
          type: String
        },
        startDate: {
          default: function() {
            return new Date()
          },
          type: [ Date, String ]
        },
        endDate: {
          type: [ Date, String, Boolean ]
        },
        minNights: {
          default: 1,
          type: Number
        },
        maxNights: {
          default: 0,
          type: Number
        },
        selectForward: {
          default: true,
          type: Boolean,
        },
        disabledDates: {
          default: function(){ return [] },
          type: Array
        },
        disabledDaysOfWeek: {
          default: function(){ return [] },
          type: Array
        },
        allowedRanges: {
          default: function(){ return [] },
          type: Array
        },
        enableCheckout: {
          default: false,
          type: Boolean
        },
        container: {
          default: '',
          type: String
        },
        animationSpeed: {
          default: '.2s',
          type: String
        },
        hoveringTooltip: {
          default: true,
          type: [Boolean, Function]
        },
        showCloseButton: {
          default: false,
          type: Boolean
        },
        autoClose: {
          default: true,
          type: Boolean
        },
        i18n: {
          default: () => defaulti18n,
          type: Object
        }

    },

    data: function () {
        return {
            date: '',
        };
    },

    watch: {
        date: function(val, oldVal){
          this.$emit('dateChanged', val, oldVal );
        }
    },

		mounted: function() {
			window.hdpkr = new HotelDatepicker(document.getElementById(this.DatePickerID), {
          DatePickerID: this.DatePickerID,
          useDummyInputs: this.useDummyInputs,
          format: this.format,
          infoFormat: this.infoFormat,
          separator: this.separator,
          startOfWeek: this.startOfWeek,
          startDate: this.startDate,
          endDate: this.endDate,
          minNights: this.minNights,
          maxNights: this.maxNights,
          selectForward: this.selectForward,
          disabledDates: this.disabledDates,
          disabledDaysOfWeek: this.disabledDaysOfWeek,
          allowedRanges: this.allowedRanges,
          enableCheckout: this.enableCheckout,
          container: this.container,
          animationSpeed: this.animationSpeed,
          hoveringTooltip: this.hoveringTooltip,
          showCloseButton: this.showCloseButton,
          autoClose: this.autoClose,
          i18n: this.i18n,
      });

      this.updateValues()
		},

    methods: {
      updateValues() {
        console.log(hdpkr)
        var currentDate = document.getElementById(this.DatePickerID).value;
        this.date = currentDate;
      }
    }
};
</script>
