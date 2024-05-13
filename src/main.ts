import { createApp } from 'vue';
import axios from 'axios';
import PrimeVue from 'primevue/config';
import App from './App.vue';

import router from './routes';

import 'primevue/resources/themes/aura-dark-purple/theme.css';
import 'primeicons/primeicons.css';
import './style.scss';

axios.defaults.headers.common['Client-ID'] = 'znofr1uhmvzkox39rihc8eq647ijue';

if (localStorage.getItem('lf_token')) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('lf_token')}`;
}

const app = createApp(App);

app.use(PrimeVue);
app.use(router);

app.mount('#app');
