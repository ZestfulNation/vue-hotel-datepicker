import Vue from 'vue';
import App from './App.vue';
import { directive as onClickOutside } from 'vue-on-click-outside';

Vue.directive('on-click-outside', onClickOutside);

new Vue({
    el: '#app',
    render: h => h(App)
});
