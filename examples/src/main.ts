/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { createApp } from 'vue';
import App from './App.vue';
import VMap from './components/VMap.vue';

const app = createApp(App);
app.component('v-map', VMap);
app.mount('#app');
