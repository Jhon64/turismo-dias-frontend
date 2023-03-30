import { createApp } from "vue";
import { createPinia } from "pinia";

import { Quasar } from "quasar";
import quasarLang from "quasar/lang/es";

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/mdi-v6/mdi-v6.css";
import "@quasar/extras/themify/themify.css";
import "quasar/src/css/index.sass";

import App from "./App.vue";
import router from "./router";

import "element-plus/dist/index.css";
import "./assets/libs/fontawesome/css/all.css";
import "./assets/scss/app.scss";
import "jquery/dist/jquery";
import "./assets/js/gentelella";
import "./assets/js/routerLink"
import "./assets/libs/yeti-bootstrap-css/bootstrap.min.css";
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

// * TOASTR
import "toastr/build/toastr.css";
import Maska from 'maska'
// *TOASTR
import PrimeVue from 'primevue/config';
const app = createApp(App);


app.use(Quasar, {
  plugins: {}, // todo import Quasar plugins and add here
  lang: quasarLang,
});
app.use(Maska);
app.use(VCalendar);
app.use(PrimeVue);
app.use(createPinia());
app.use(router);

app.mount("#app");
