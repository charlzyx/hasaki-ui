// import css style
import "./assets/index.css";
import "hover.css/css/hover.css";

import App from "./App.vue";
import OfficeUIFabricVue from "office-ui-fabric-vue";
import Vue from "vue";
import router from "./router";
import store from "./store";
import axios from "axios";

axios.defaults.baseURL = "./";

Vue.use(OfficeUIFabricVue as any);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
