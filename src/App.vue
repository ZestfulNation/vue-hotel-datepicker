<template>
  <div id="app">
    <header>Vue Hotel Datepicker</header>
    <Examples></Examples>
  </div>
</template>

<script>
import Examples from './components/Examples'

export default {
  name: 'app',
  components: {
    Examples
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
</style>
