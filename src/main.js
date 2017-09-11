import Vue from 'vue';
import App from './App.vue';
import { directive as onClickOutside } from 'vue-on-click-outside';
import VueTouch from 'vue-touch';
import screenSizeChecker from './screenSizeChecker';

Vue.directive('on-click-outside', onClickOutside);
Vue.use(VueTouch, {name: 'v-touch'});
Vue.use(screenSizeChecker);

new Vue({
    el: '#app',
    render: h => h(App)
});
