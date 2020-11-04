import VueRouter, { RouteConfig } from "vue-router";

import Home from "../views/Home.vue";
import Vue from "vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/settings",
    name: "Settings",
    component: () =>
      import(/* webpackChunkName: "settings" */ "../views/Settings.vue")
  }
];

const router = new VueRouter({
  base: "/__hasaki__/",
  routes
});

export default router;
