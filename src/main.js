import Vue from 'vue';
import App from './App.vue';
import { directive as onClickOutside } from 'vue-on-click-outside';
import VueTouch from 'vue-touch';

Vue.directive('on-click-outside', onClickOutside);
Vue.use(VueTouch, {name: 'v-touch'});

new Vue({
    el: '#app',
    render: h => h(App)
});
