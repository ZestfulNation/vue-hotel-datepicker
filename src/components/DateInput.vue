<template>
  <div
    :class="['datepicker__input', inputClass]"
    data-qa="datepickerInput"
    :tabindex="tabIndex"
  >
    {{ inputDate ? inputDate : i18n[inputDateType] }}
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    i18n: {
      type: Object,
      required: true
    },
    inputDate: {
      type: String,
      default: null
    },
    inputDateType: {
      type: String,
      default: "check-in"
    },
    singleDaySelection: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    inputClass() {
      return {
        "datepicker__input--is-active": this.isOpen && this.inputDate == null,
        "datepicker__input--single-date": this.singleDaySelection
      };
    },
    tabIndex() {
      return this.inputDateType === "check-in" ? 0 : -1;
    }
  }
};
</script>
