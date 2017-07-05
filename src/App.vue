<template>
  <div id="app">
    <a href="https://github.com/krystalcampioni/vue-hotel-datepicker" target="_blank">
      <img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png">
    </a>
    <header class="header">
      <div class="grid">
        <h1>Vue Hotel Datepicker</h1>
      </div>
    </header>
    <div>
    <div class="grid">
      <div class="grid__full">
        <h2>A Vue datepicker component based on the
          <a href="https://github.com/benitolopez/hotel-datepicker">Hotel Datepicker</a> by @benitolopez
        </h2>


      </div>

      <div class="grid__half">
        <h3>Install the package via NPM</h3>
        <pre v-highlightjs>
          <code class="javascript">
            {{ this.snippet0 }}
        </code>
        </pre>

        <h3>Load in your project</h3>
        <pre v-highlightjs>
          <code class="javascript">
            {{ this.snippet1 }}
        </code>
      </pre>
      <h3>Use the component</h3>
      <pre v-highlightjs>
        <code class="javascript">
          {{ this.snippet2 }}
      </code>
    </pre>

      </div>
      <div class="grid__half">
        <Examples />
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import HotelDatePicker from 'vue-hotel-datepicker';

import Examples from './components/Examples'

export default {
    components: {
        HotelDatePicker,
        Examples
    },
    data() {
        return {
          snippet0: 'npm install vue-hotel-datepicker',
          snippet1:
    `
    import HotelDatePicker from 'vue-hotel-datepicker'

    export default {
      components: {
        HotelDatePicker,
      },
    }`,

  snippet2: `
  <HotelDatePicker DatePickerID="01"/>`
        }
    }

};
</script>

<style lang="scss">

  *,
  *:after,
  *:before {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }

  h1, h2 { display: inline-block; }

  h2 {
    font-weight: lighter;
    color: #387e90;
    margin-top: 40px;
  }

  h3 {
    font-weight: lighter;
    color: #316e7e;
    border-top: 1px dashed #15bebf;
    padding-top: 30px;
    margin-bottom: 0;
  }

  a { color: #15bebf; }

  pre {
    margin: 0;
    padding: 0;
  }

  .header {
    background: linear-gradient(141deg, #0fb8ad 0%, #1fc8db 51%, #2cb5e8 75%);
    color: #fff;
    padding: 20px;
    width: 100%;
    float: left;
  }

  .vnis {
    width: 200px;
    margin: 30px 0;
  }

  .grid {
    width: 90vw;
    max-width: 1200px;
    margin: 0 auto;

    &__full {
      margin: 0 20px 20px;
      width: 100%;
      float: left;
    }

    &__half {
      width: calc(50% - 40px);
      margin: 0 20px 20px ;
      float: left;

      @media screen and (max-width: 48em) {
        width: calc(100% - 40px);
        margin: 0 20px 20px;
      }
    }
  }

</style>
