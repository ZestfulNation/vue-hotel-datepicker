<template lang="html">
  <nav class="navigation">
    <ul class="navigation__list">
      <li class="navigation__item"><a href="#about">About</a></li>
      <li class="navigation__item"><a href="#gettingStarted">Getting Started</a></li>
      <li class="navigation__item"><a href="#optionsProps">Options/Props</a></li>
      <li class="navigation__item"><a href="#moreExamples">More examples</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navigation'
}
</script>

<style lang="scss">
.navigation {
  &__list{  color: #2db4e8; }

  &__item {
    padding: 10px;
  }
}
</style>
