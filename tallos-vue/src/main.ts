import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import * as VueRouter from "vue-router";

import Home from "./pages/Home.vue";
import ListUser from "./pages/ListUser.vue";
import EditUser from "./pages/EditUser.vue";
import EditUserPermissions from "./pages/EditUserPermissions.vue";
import { installDesignSystem } from "./design-system";
import { http } from "./services/HTTP";

const app = createApp(App);

const routes = [
  { path: "/", component: Home },
  { path: "/list/", component: ListUser },
  { path: "/edit/:username", component: EditUser },
  { path: "/edit/:username/permissions", component: EditUserPermissions },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

installDesignSystem(app);

app.use(router);

app.config.globalProperties.$http = http;

app.mount("#app");

if (!localStorage.getItem("token")) {
  router.push("/");
}