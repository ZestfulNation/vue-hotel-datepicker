<template lang="pug">
div(:id='valueName')
  h3(v-text='valueName')
  p(v-text='description')
  p
    b Type:
    | {{ type }}
    br
    b Default:
    | {{ defaultVal }}

  h4 Example:
</template>

<script>
export default {
  name: 'Info',

  props: {
    valueName: {
      type: String
    },
    description: {
      type: String
    },
    type: {
      type: String
    },
    defaultVal: {
      type: String
    },
  }
}
</script>

<style lang="scss" scoped>
h3 {
  margin-left: -40px;

  @media screen and (max-width: 48em) {
    margin-left: 0;
  }
}
</style>
