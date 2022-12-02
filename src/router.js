import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path) {
  return () => import(`./components/${path}.vue`);
}

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "admin",
      component: importComponent("DashboardLayout"),
      children: [
        //Dashboard
        {
          path: "/",
          name: "Root",
          component: importComponent("DashboardIndex"),
        },

        //To Do List
        {
          path: "/gd",
          name: "Guided",
          component: importComponent("TodoList/ListItem"),
        },

        //Tugas
        {
          path: "/tgs",
          name: "Tgs",
          component: importComponent("TodoList/TugasList"),
        },

        // PWA
        {
          path: "/makanan",
          name: "Makanan",
          component: importComponent("pwa_0588/MakananList"),
        },

        // PWA Tugas Buah
        {
          path: "/buah",
          name: "Buah",
          component: importComponent("pwa_0588/Buah"),
        },
      ],
    },
  ],
});

export default router;
