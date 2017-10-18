<template lang="pug">
#app
    a(href="https://github.com/krystalcampioni/vue-hotel-datepicker", target="_blank")
      img(style="position: absolute; top: 0; right: 0; border: 0;", src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67", alt="Fork me on GitHub", data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png")
    header.header
      .grid
        h1 Vue Hotel Datepicker
    div
      .grid
        .grid__sidebar
          Navigation
        .grid__main
          .grid__full#about
            h2 About
            h3 A responsive date range picker for Vue.js that displays the number of nights selected and allow several useful options like custom check-in/check-out rules, localization support and more.
          .grid__full#gettingStarted
            h2 Getting Started
            h3 Install the package via NPM
            Snippet(sourcePath="./dist/snippet0.txt" lang='javascript')
            h3 Load in your project
            Snippet(sourcePath="./dist/snippet1.txt" lang='javascript')
            h3 Use the component
            Snippet(sourcePath="./dist/snippet2.txt" lang='html')
          .grid__full#optionsProps
            Options
          .grid__full#moreExamples
            h2 More Examples
            Examples
</template>

<script>
import { get } from 'axios';

import Examples from './components/Examples';
import Options from './components/Options';
import Snippet from './components/Snippet';
import Navigation from './components/Navigation';

export default {
  components: {
    Examples,
    Options,
    Snippet,
    Navigation
  },
};
</script>

<style lang="scss">
  .datepicker__month-name {
    width: 100%;
    float: left;
  }
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

  hr { border: 0.5px dashed #17bdbf; }

  h1, h2 { display: inline-block; }

  b {
    margin-right: 10px;
  }

  h2 {
    font-weight: bold;
    color: #387e90;
    margin-top: 40px;
  }

  h3 {
    font-weight: bold;
    color: #3cc5c7;
    padding-bottom: 10px;
    margin-bottom: 0;

    &::before {
      content: '';
      background: #397e90;
      width: 5px;
      height: 5px;
      display: inline-block;
      margin-right: 10px;
    }
  }

  h4 {
    font-weight: lighter;
    color: #817f81;
    font-size: 12px;
    font-style: italic;
    margin-bottom: 2px;
  }

  p {
    color: #72767d;
    font-size: 14px;
    line-height: 1.5;
    font-weight: lighter;
    white-space: pre;
  }

  a {
    color: #15bebf;
    text-decoration: none;
  }

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

    &__sidebar {
      @media screen and (min-width: 48em) {
        width: 250px;
        position: fixed;
        top: 120px;
        left: 0;
      }

      @media screen and (max-width: 48em) {
        float: left;
        width: 100%;
      }
    }

    &__main {
      float: right;
      width: calc(100% -  250px);

      @media screen and (max-width: 48em) {
        width: 100%;
      }
    }

    &__full {
      padding: 0 20px 20px;
      width: 100%;
      float: left;
    }

    &__third {
      width: calc(100%/3 - 40px);
      float: left;
      margin: 0 20px 20px;
    }

    &__half {
      width: 50%;
      padding: 0 20px 20px 0;
      float: left;

      // @media screen and (max-width: 48em) {
      //   width: calc(100% - 40px);
      //   margin: 0 20px 20px;
      // }
    }
  }
</style>
