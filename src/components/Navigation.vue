<template lang="pug">
nav.navigation
  ul.navigation__list
    li.navigation__item
      a(href='#about') About
    li.navigation__item
      a(href='#gettingStarted') Getting Started
    li.navigation__item
      a(href='#optionsProps') Options/Props
      ul.navigation__sublist
        li.navigation__item
          a(href='#format') format
        li.navigation__item
          a(href='#startDate') startDate
        li.navigation__item
          a(href='#endDate') endDate
        li.navigation__item
          a(href='#minNights') minNights
        li.navigation__item
          a(href='#maxNights') maxNights
        li.navigation__item
          a(href='#disabledDates') disabledDates
        li.navigation__item
          a(href='#disabledDaysOfWeek') disabledDaysOfWeek
        li.navigation__item
          a(href='#allowedRanges') allowedRanges
        li.navigation__item
          a(href='#enableCheckout') enableCheckout
        li.navigation__item
          a(href='#hoveringTooltip') hoveringTooltip
        li.navigation__item
          a(href='#i18n') i18n
    li.navigation__item
      a(href='#moreExamples') More examples
</template>

<script>
export default {
  name: 'Navigation',

  mounted(){
  }
}
</script>

<style lang="scss">
.navigation {
  &__list{
    color: #2db4e8;
  }

  &__list li:hover .navigation__sublist {
    display: block;
    max-height: 500px;
    overflow: auto;
  }

  &__sublist {
    overflow: hidden;
    max-height: 0;
    padding-left: 18px;
    -webkit-transition: all 0.5s ease-out;

    .navigation__item {
      padding: 10px 0 0;

      a { color: #2db4e8}
    }

  }

  &__item {
    padding: 10px;
  }
}
</style>
