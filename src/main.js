import Vue from 'vue';
import App from './App.vue';
import VueHighlightJS from 'vue-highlightjs';

Vue.use(VueHighlightJS);

new Vue({
    el: '#app',
    render: h => h(App)
});
